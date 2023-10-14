import "../styles/report.css"
import { useState, useEffect, useRef } from "react"

import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header'; 
import List from '@editorjs/list'; 
import Image from '@editorjs/image'

import {getEditorData} from "../test_data/editor_blocks.js"

import { manageServerCall, address, protocol } from "../Api/serverCall";

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

    const [editorData, setEditorData] = useState({time: 1695898792823,blocks:[]})

    const editorCreatedRef = useRef(false);

    // Create a ref to store the EditorJS instance
    const editorRef = useRef();

    const params = useParams()

    const id = parseInt(params.id)

    // Use a useEffect to initialize or update the editor
    useEffect(() => {
        const my_image = require('@editorjs/simple-image');

        if (!editorCreatedRef.current) {
            // Create the EditorJS instance
            const editor = new EditorJS({
                placeholder: 'Let`s write an awesome story!',
                onReady: () => {
                    //console.log('Editor.js is ready to work!');
                },
                onChange: (api, event) => {
                    editor.save().then((outputData) => {
                        const form = new FormData()
                        form.append("report", JSON.stringify(outputData.blocks))
                        form.append("id",id)
                        manageServerCall("POST","doc/update-report/",form,true)
                    }).catch((error) => {
                        //console.log('Saving failed: ', error)
                    });
                },
                data: editorData, // Use the current value of editorData
                tools: {
                    header: Header,
                    image: my_image,
                    image: {
                        class: Image,
                        config: {
                          endpoints: {
                            byFile: `${protocol}://${address}/doc/upload/`, // Your backend file uploader endpoint
                          }
                        }
                      },
                    list: List
                },
            });

            // Store the EditorJS instance in the ref
            editorRef.current = editor;

            // Set a flag indicating that the editor is created
            editorCreatedRef.current = true;
        } else {
            // If the editor is already created, update its data
            editorRef.current.isReady
                .then(() => {
                    editorRef.current.render({ blocks: editorData.blocks });
                })
                .catch((error) => {
                    console.error('Error updating editor data:', error);
                });
        }
    }, [editorData]);
    

    useEffect(()=>{

        props.setActiveTab(null)
        setLoading(true)
        manageServerCall("GET",`chat/get-report/${params.id}`)
        .then(res=>{
            if(res.data === null){
                //navigate to 404 page
                props.navigate("/error/404")
            }else{
                setReportTitle(res.data.name)
                setLoading(false)
                setEditorData({time:7566575757,blocks:JSON.parse(res.data.report)})
            }
        })
    },[props.reloadProp,params.id])

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