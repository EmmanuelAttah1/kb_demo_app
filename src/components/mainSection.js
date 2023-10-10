import "../styles/mainSection.css"
import { MiniNav } from "./miniNav"
import {DoubleLeftOutlined,MenuOutlined,DoubleRightOutlined,CloseOutlined} from '@ant-design/icons'
import { Button, Empty } from "antd"
import { useState, useRef, useEffect } from "react"
import { MyDocument } from "./document"
import { ChatMessage } from "./message"
import { QueryTab } from "../tabs/query"
import { ReportTab } from "../tabs/report"

import { Route, Routes } from 'react-router-dom';
import { MyReport } from "./report_template"
import { MobileNav } from "./mobile_nav"
import { ImageTab } from "../tabs/image"

import { useResolvedPath } from "react-router-dom"

import { manageServerCall } from "../Api/serverCall"


const size = "24px"
const addr = "http://127.0.0.1:8000/"

export const MainSection = props =>{

    const [scrollBottom, setScrollBottom] = useState(false)
    const {
        queryId,
        setQueryId,
        navigate, 
        activeTab, 
        setActiveTab,
        sourceOpened, 
        toggleSrcTab,
        selectedObject,
        setSelectedObject,
        reloadProp
    } = props
    
    const [chatLoading,setChatLoading] = useState(false)
    const [allDocs,setDocs] = useState([1])
    const [addFormLoading,setAddFormLoading] = useState(false)

    const [reportData, setReportData] = useState(null)

    const [message,setMessage] = useState("")
    const {chats,setChat} = props
    let prevMsg = null


    const addMsg=(message,mine=true,save=false)=>{
        return new Promise((resolve,reject)=>{
            const all_chat = [...chats]

            const msg_data = {
                id:all_chat.length+1,
                text:message,
                mine:mine
            }
            if(save){
                prevMsg = msg_data
            }else{
                if(prevMsg !== null){
                    all_chat.push(prevMsg)
                    prevMsg = null
                    msg_data.id = msg_data.id + 1
                }
            }

            all_chat.push(msg_data)
            resolve(all_chat)
        })
        
    }

    const chatSocket = new WebSocket(
        'wss://'
        + 'api.getknowledgebase.com'
    );

    // + '/ws/chat/'
    
    chatSocket.onmessage = function(e) {
        setChatLoading(false)
        const data = JSON.parse(e.data);
        addMsg(data.message,false,false)
        .then(res=>{
            setChat(res)
            setScrollBottom(true)
        })
    };
    
    chatSocket.onclose = function(e) {
        // setChatLoading(false)
        console.error('Chat socket closed unexpectedly');
    };

    const sendMsg=()=>{
        if(message.length > 0){
            setChatLoading(true)
            addMsg(message,true,true)
            .then(res=>{
                setChat(res)
                setMessage("")
                setScrollBottom(true)
                chatSocket.send(JSON.stringify({
                    'id':queryId,
                    'message': message
                }))                
            })
        }
    }

    const myFile = useRef()

    useEffect(()=>{
        manageServerCall("GET","doc/new/")
        .then(res=>{
            setDocs(res.data);
        })
    },[props.reloadProp])

    const selectFile=()=>{
        myFile.current.click()
    }

    const uploadDoc=(file)=>{
        const form = new FormData()
        form.append("file",file)
        form.append("name",file.name)
        setAddFormLoading(true)

        manageServerCall("POST","doc/new/",form)
        .then(res=>{
            const data = [...allDocs]
            data.push(res.data)
            setDocs(data)
            setAddFormLoading(false)
        })
    }

    const deleteDoc=(id)=>{
        const form = new FormData()
        form.append("id",id)

        manageServerCall("POST","doc/delete/",form)
        .then(res=>{
            let data = [...allDocs]
            data = data.filter(e=>{
                return e.id !== id
            })
            setDocs(data)
        })
    }

    const change_page=(id)=>{
        if(id === 1){
            console.log(props.firstChat);
            if (props.firstChat){
                navigate(`/${props.firstChat}`)
            }
        }else if(id === 2){
            navigate("/report")
        }else if(id === 3){
            navigate("/image")
        }
        setActiveTab(id)
    }

    return (
        <div id="my-main">
            <input style={{display:"none"}} type="file" ref={myFile} onInput={(e)=>{uploadDoc(e.target.files[0])}}/>
            {!props.mobileView&&<div id="menu-toggle" onClick={props.toggleSideBar} style={{left:props.opened?'-20px':'20px'}}>
                {props.opened?
                    <DoubleLeftOutlined  style={{fontSize:size}}/>
                :
                    <MenuOutlined  style={{fontSize:size}}/>
                }
            </div>}
            <div id="main-app">
                {props.mobileView&&<MobileNav 
                    navigate={navigate} 
                    toggleSideBar={props.toggleSideBar} 
                    toggleSrcTab={toggleSrcTab} 
                />}
                {!props.mobileView&&activeTab&&<MiniNav active={activeTab} changeTab={change_page}/>}

                <Routes>
                    <Route exact path="/:id" element={<QueryTab 
                            setActiveTab={setActiveTab}
                            message={message} 
                            chats={chats} 
                            setMessage={setMessage} 
                            sendMsg={sendMsg}
                            navigate={navigate}
                            chatLoading={chatLoading}
                            setQueryId={setQueryId}
                            queryId={queryId}
                            getChatMessages={props.getChatMessages}
                            selectedObject={selectedObject}
                            setActive={setSelectedObject}
                            reloadProp = {reloadProp}
                            scrollBottom={scrollBottom}
                            setScrollBottom={setScrollBottom}
                        />}
                    />
                    <Route exact path="/report" element={
                        <ReportTab 
                            setActiveTab={setActiveTab} 
                            navigate={navigate} 
                            setReportData={setReportData}
                            reloadProp = {reloadProp}
                         />}/>

                    <Route exact path="/report/:id" element={
                        <MyReport 
                            reportData={reportData} 
                            setReportData={setReportData} 
                            setActiveTab={setActiveTab}
                            setSelectedObject={setSelectedObject}
                            selectedObject={selectedObject}
                            reloadProp = {reloadProp}
                        />}/>
                    <Route exact path="/image" element={<ImageTab setActiveTab={setActiveTab} reloadProp = {reloadProp}/>}/>
                    <Route path="*" element={<h1>Page Not Found</h1>}/>
                </Routes>

                {!props.mobileView&&<div id="toggle-source-tab">
                    <div id="toogle-src-btn" onClick={toggleSrcTab}>
                        {
                            sourceOpened?
                                <DoubleRightOutlined  style={{fontSize:size}}/>
                            :
                                <DoubleLeftOutlined  style={{fontSize:size}}/>
                        }
                    </div>
                    
                </div>}

            </div>

            

            <div id="sources" style={{
                display:sourceOpened?'flex':"none",
                width:"500px"
            }}>
                <div id="sources-head">
                    <div id="sources-head-inner">
                        {props.showMobileSidebarBtn&&<div id="source-close" onClick={toggleSrcTab}><CloseOutlined /></div>}
                        <div>Sources</div>
                    </div>
                    <div>Polling : not set </div>
                </div>
                <div id="sources-content">
                    {allDocs.length===0?
                        <div id="source-empty">
                            <Empty
                                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                imageStyle={{
                                height: 60,
                                }}
                                description={
                                <span>
                                    No document loaded
                                </span>
                                }
                            >
                                <Button type="primary" loading={addFormLoading} onClick={selectFile}>Add Now</Button>
                            </Empty>
                        </div>
                        :
                        <div id="all-docs">
                            {
                                allDocs.map((e,index)=>(
                                    <MyDocument name={e.name} key={"doc_"+index} id={e.id} deleteDoc={deleteDoc}/>
                                ))
                            }
                        </div>
                    }
                </div>
                {allDocs.length>0&&<div id="add-document">
                    <Button
                     type="primary" 
                     size="large" 
                     loading={addFormLoading}
                     disabled={false} 
                     block 
                     onClick={selectFile}>
                        Add document
                    </Button>
                </div>}
            </div>
        </div>
    )
}
