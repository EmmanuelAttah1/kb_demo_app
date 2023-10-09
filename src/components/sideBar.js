import "../styles/sidebar.css"
import {MoreOutlined,CloseOutlined,DeleteOutlined,EditOutlined} from "@ant-design/icons"

import { useState,useEffect } from "react"

import {manageServerCall} from "../Api/serverCall"

import { useResolvedPath,useParams } from "react-router-dom"

import { Button, Input, Modal, Popconfirm,Popover} from 'antd';

import { setCookie } from "../Api/cookieHelper"


export const SideBar=props=>{

    const path = useResolvedPath()
    const {selectedObject,setSelectedObject,getChatMessages,navigate, activeTab, setActiveTab,setFirstChat} = props
    const [chats,setChats] = useState([])
    const [reports,setReports] = useState([])

    const logout=()=>{
        setCookie("token","",0)
        window.location.reload()
    }

    const [showRenameModal,setShowRenameModal]=useState(false)

    const [chatToRename,setChatToRename] = useState({
        name:"Test Chat1",
        id:null,
        type:"chat"
    })

    const renameChatOrReport=(name,id,type="chat")=>{
        setChatToRename({
            name:name,
            id:id,
            type:type
        })

        setShowRenameModal(true)
    }

    const setNewName=()=>{
        const form = new FormData()
        form.append("type",chatToRename.type)
        form.append("id",chatToRename.id)
        form.append("name",chatToRename.name)

        let data
        if(chatToRename.type === "chat"){
            data = [...chats]
        }else{
            data = [...reports]
        }

        const current = data.find(e=>{
            return e.id === chatToRename.id
        })

        const index = data.indexOf(current)

        if(chatToRename.type === "chat"){
            current.chat_name = chatToRename.name
            data[index] = current

            setChats(data)
        }else{
            current.name = chatToRename.name
            data[index] = current
            setReports(reports)
        }

        setShowRenameModal(false)

        manageServerCall("POST","chat/rename/",form)
        .then(res=>{
            console.log(res);
        })
    }

    const deleteChatOrReport=(id,type="chat")=>{
        const form = new FormData()
        form.append("type",type)
        form.append("id",id)

        let data
        if(type === "chat"){
            data = [...chats]
        }else{
            data = [...reports]
        }

        data = data.filter(e=>{
            return e.id !== id
        })

        if(type === "chat"){
            setChats(data)
        }else{
            setReports(reports)
        }

        manageServerCall("POST","chat/delete/",form)
        .then(res=>{
            console.log(res);
        })
    }

    const pageJustLoaded=()=>{
        const section = localStorage.getItem('section')
        const id = parseInt(localStorage.getItem('id'))

        if(section !== undefined && id !== undefined){
            saveAndSetPageInfo(section,id)
        }
    }


    useEffect(()=>{
        pageJustLoaded()
        manageServerCall("GET","chat/chats")
        .then(res=>{
            const data = res.data;
            if(data.length > 0){
                setChats(data);
                console.log(data);
                console.log(selectedObject);

                const first_id = data[0]['id']

                setFirstChat(first_id)

                //work here
                if(path.pathname === "/"){
                    saveAndSetPageInfo("chat",first_id)
                    navigate(`/${first_id}`)
                }
            
    
                // if(selectedObject.id === null){
                //     const first_id = data[0]['id']
                //     selectChat(first_id)
                // }
            }
        })

        manageServerCall("GET","chat/get-reports")
        .then(res=>{
            const data = res.data;
            
            if(data.length > 0){
                setReports(data);
            }
        })
    },[props.reloadProp])

    const newChat=()=>{
        manageServerCall("POST","chat/new/")
        .then(res=>{
            console.log(res);
            if(res.created){
                const all_chat = [...chats]
                let new_chat = [{chat_name:"New chat",id:res.id}]
                new_chat = new_chat.concat(all_chat)
                
                setChats(new_chat)
            }
            selectChat(res.id)
        })
    }

    const selectChat=id=>{
        saveAndSetPageInfo("chat",id)

        getChatMessages(id)

        if(props.showMobileSidebarBtn){
            props.toggleSideBar()
        }

        if(activeTab !== 1){
            setActiveTab(1)
        }

        navigate(`/${id}`)
        
    }

    const open_report = id =>{
        saveAndSetPageInfo("report",id)
        if(props.showMobileSidebarBtn){
            props.toggleSideBar()
        }
        navigate(`/report/${id}`)
    }

    const saveAndSetPageInfo=(section,id)=>{
        setSelectedObject({section:section,id:id})
        localStorage.setItem('section',section)
        localStorage.setItem('id',id)
    }

    return(
        <div id="sidebar-container" style={{
            width:props.size,
            visibility:props.size==="0px"?"hidden":"visible"
            }}>
            <div id="my-sidebar-head">
                <div id="our-logo">Kb.</div>
                {props.showMobileSidebarBtn&&<div id="mobile-close" onClick={props.toggleSideBar}><CloseOutlined /></div>}
            </div>
            <div id="sidebar-content">
                <div className="sidebar-content-group">
                    <div className="sidebar-content-header">
                        <div className="sidebar-content-header-name">Chats</div>
                        <div className="sidebar-content-header-action" onClick={newChat}>+ New chat</div>
                    </div>
                    <div className="sidebar-content-list">
                        {
                            chats.map(e=>(
                                <div  
                                    className={(selectedObject.section === "chat") && (e.id === selectedObject.id)?
                                    "sidebar-list-item sidebar-list-item-active":"sidebar-list-item"} key={"query_list_"+e.id}>
                                    <div onClick={()=>{selectChat(e.id)}} className="side-bar-text-container">{e.chat_name}</div>
                                    {(selectedObject.section === "chat") && (e.id === selectedObject.id)&&<div className="sidebar-btn-container">
                                        <div className="sidebar-btn" onClick={()=>{
                                            renameChatOrReport(e.chat_name,e.id)
                                        }}>
                                            <EditOutlined style={{color:"#ffffff"}}/>
                                        </div>
                                        <div className="sidebar-btn">
                                            <Popconfirm
                                                title="Delete Chat"
                                                description="Are you sure?"
                                                onConfirm={()=>{
                                                    deleteChatOrReport(e.id)
                                                }}
                                                onCancel={null}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button type="text">
                                                    <DeleteOutlined style={{color:"#ffffff"}}/>
                                                </Button>
                                            </Popconfirm>
                                        </div>
                                    </div>}
                                </div>
                            ))
                        }
                    </div>
                    <div className="sidebar-see-all">See all chats</div>
                </div>


                <div className="sidebar-content-group">
                    <div className="sidebar-content-header">
                        <div className="sidebar-content-header-name">Reports</div>
                        <div className="sidebar-content-header-action" onClick={()=>{
                            if(props.showMobileSidebarBtn){
                                props.toggleSideBar()
                            }
                            navigate("/report")
                        }}>+ New Report</div>
                    </div>
                    <div className="sidebar-content-list">
                        {
                            reports.map(e=>(
                                <div className={(selectedObject.section === "report") && (e.id === selectedObject.id)?
                                "sidebar-list-item sidebar-list-item-active":"sidebar-list-item"} key={"report_list_"+e.id}>
                                    <div onClick={()=>{open_report(e.id)}} className="side-bar-text-container">{e.name}</div>
                                    {(selectedObject.section === "report") && (e.id === selectedObject.id)&&<div className="sidebar-btn-container">
                                        <div className="sidebar-btn" onClick={()=>{
                                            renameChatOrReport(e.name,e.id,"report")
                                        }}>
                                            <EditOutlined style={{color:"#ffffff"}}/>
                                        </div>
                                        <div className="sidebar-btn">
                                            <Popconfirm
                                                title="Delete Report"
                                                description="Are you sure?"
                                                onConfirm={()=>{
                                                    deleteChatOrReport(e.id,"report")
                                                }}
                                                onCancel={null}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button type="text">
                                                    <DeleteOutlined style={{color:"#ffffff"}}/>
                                                </Button>
                                            </Popconfirm>
                                        </div>
                                    </div>}
                                </div>
                            ))
                        }
                    </div>
                    <div className="sidebar-see-all">See all reports</div>
                </div>


            </div>
            
            <Popover placement="rightTop" title={"KB demo"} content={
                <div id="logout-btn" onClick={logout}>Logout</div>
            } trigger="click">
                <div id="sidebar-profile">
                    <div id="sidebar-name">KnowledgeBase Demo</div>
                    <div id="sidebar-more"><MoreOutlined /></div>
                </div>
            </Popover>

            <Modal title="Rename chat" open={showRenameModal} onOk={setNewName} onCancel={()=>{setShowRenameModal(false)}} okText={"Rename"}>
                <Input value={chatToRename.name} onChange={e=>{
                    console.log(e.target.value);
                    setChatToRename({
                        id:chatToRename.id,
                        name:e.target.value,
                        type:chatToRename.type
                    })
                }}/>
            </Modal>
            
        </div>
    )
}
