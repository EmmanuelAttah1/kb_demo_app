import { ReportInfo } from "../components/report_topics";
import "../styles/reportTab.css"
import { Input, Checkbox, Button } from 'antd';
import { useState, useEffect } from "react";
import { manageServerCall } from "../Api/serverCall";

const {TextArea} = Input

const form_template = {
    title:"",
    details:"",
    use_image:false
}

export const ReportTab=props=>{

    useEffect(()=>{
        props.setActiveTab(2)
    },[])

    const [loading,setLoading] = useState(false)
    const [reportData,setReportData] = useState(form_template)

    const updateReportData=(key,value)=>{
        const myData = {...reportData}
        myData[key] = value
        setReportData(myData)
    }

    const draft_report=()=>{
        const form = new FormData()
        form.append("title",reportData.title)
        form.append("details",reportData.details)

        setLoading(true)

        manageServerCall("POST","chat/draft-report/",form)
        .then(res=>{
            console.log(res);
            setLoading(false)
            props.navigate(`/report/${res.data.id}`)
        })
    }

    return (
        <>
        <div id="report-tab-container">
            <div id="report-tab-container-inner">
                {
                    <>
                        <div className="custom-input">
                            <div className="input-label">Report name*</div>
                            <Input disabled={loading} placeholder="Enter report name" value={reportData['title']} onInput={(e)=>{
                                updateReportData("title",e.target.value)
                            }}/>
                        </div>
                        <div className="custom-input">
                            <div className="input-label">Report Details*</div>
                            <div className="input-caption">What is the report about.</div>
                            <TextArea disabled={loading} rows={4} placeholder="Report information" value={reportData['details']} onInput={(e)=>{
                                updateReportData("details",e.target.value)
                            }}/>
                        </div>
                        {/* <ReportInfo/> */}
                        {/* <div>
                            <Checkbox disabled={loading} onChange={null}>Include images in report</Checkbox>
                        </div> */}
                        <div id="submit-report-btn-container">
                            <div id="submit-report-btn">
                                <Button loading={loading} type="primary" block onClick={draft_report}>
                                    {loading?"Drafting report... please wait":"Draft report"}
                                </Button>
                            </div>
                        </div>
                    </>
                }
            </div>
        </div>
        </>
    )
}