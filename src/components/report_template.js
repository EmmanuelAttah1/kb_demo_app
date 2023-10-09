import "../styles/report.css"
import { useState, useEffect, useRef } from "react"

import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header'; 
import List from '@editorjs/list'; 
import Image from '@editorjs/image'

import {getEditorData} from "../test_data/editor_blocks.js"

import { manageServerCall } from "../Api/serverCall";

import { json, useParams } from "react-router-dom";

import { Skeleton,Popover } from 'antd';


const content = (
    <div id="export-report-options">
      <div>PDF : coming soon</div>
      <div>Word : coming soon </div>
    </div>
  );



export const MyReport = props =>{

    const [loading,setLoading] = useState(false)

    const [reportTitle, setReportTitle] = useState("")

    const [editorData, setEditorData] = useState(
        {
            time: 1695629975765,
            blocks: getEditorData()
        }
    )

    const editorCreatedRef = useRef(false);
    const params = useParams()

    const id = parseInt(params.id)

    console.log(params," ",id + 30);

    useEffect(()=>{
        console.log("mounting");
        props.setSelectedObject({section:"report",id:id})
    },[])
    

    useEffect(()=>{
        console.log(params.id);

        props.setActiveTab(null)
        setLoading(true)
        manageServerCall("GET",`chat/get-report/${params.id}`)
        .then(res=>{
            if (!editorCreatedRef.current) {
                setReportTitle(res.data.name)
                console.log("creating editor");
                setLoading(false)
                const editor = new EditorJS({
                    placeholder: 'Let`s write an awesome story!',
                    onReady: () => {
                        console.log('Editor.js is ready to work!')
                    },
                    data: {time: 1695898792823,blocks:JSON.parse(res.data.report)},
                    tools: { 
                        header: {
                          class: Header, 
                          inlineToolbar: ['link'] 
                        }, 
                        image: {
                            class: Image, 
                            inlineToolbar: ['link'] 
                          }, 
                        list: { 
                          class: List, 
                          inlineToolbar: true 
                        } 
                      },  
                });
    
                editorCreatedRef.current = true;
                console.log(props.selectedObject);
            }
        })
    },[props.reloadProp])

    return(
        <div id="editor-container">
            <div id="report-head">
                <div id="report-head-name">{reportTitle}</div>
                <Popover content={content} title="Export report" trigger="click">
                    <div id="report-head-btn">Export</div>
                </Popover>
            </div>
            <div id="report-body">
                <div id="editorjs"/>
            </div>

            {loading&&<div id="report-loading">
                <Skeleton active />
                <br/>
                <Skeleton active />
                <br/>
                <Skeleton active />
            </div>}
            
        </div>
    )
}