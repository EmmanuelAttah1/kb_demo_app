import "../styles/reportTab.css"
import { Input,Button } from 'antd';
import {EditOutlined, DeleteOutlined} from "@ant-design/icons"
import {useState} from "react"

export const ReportInfo=props=>{
    const [topics,setTopics] = useState([])
    const [newTopic, setNewTopic] = useState(null)
    const [edit,setEdit] = useState(null)


    const editTopic=(id)=>{
        const all_topics = [...topics]

        const current = all_topics.find(e=>{
            return e.id === id
        })
        setEdit(id)
        setNewTopic(current.name)
    }

    const addTopic=()=>{
        const all_topics = [...topics]
        const id = edit
        if(id !== null){
            const current = all_topics.find(e=>{
                return e.id === id
            })
            const index = all_topics.indexOf(current)
            all_topics[index].name = newTopic

            setEdit(null)
            setTopics(all_topics)
            setNewTopic(null)

        }else{
            if(newTopic !== null && newTopic.length !== 0){
                all_topics.push({
                    name:newTopic,
                    id:all_topics.length+1
                })
                setNewTopic(null)
                setTopics(all_topics)
            }
        }
        
    }

    const removeTopic = id=>{
        let all_topics = [...topics]
        all_topics = all_topics.filter(e=>{
            return e.id !== id
        })
        setTopics(all_topics)
    }

    return(
        <div className="custom-input">
            <div className="input-label">What information, should be included in report?</div>
            <div className="input-caption">What questions should the report answer, be as specific as possible.</div>
            
            <div id="report-info-container">
                <div id="report-info-content">
                    {
                        topics.length>0?
                            topics.map(topic=>(
                                <div key={"topic_"+topic.id} className="report-topic-container">
                                    <div className="report-topic">{topic.name}</div>
                                    <div className="report-topic-btns">
                                        <div className="report-topic-btn" onClick={()=>{
                                            editTopic(topic.id)
                                        }}>
                                            <EditOutlined />
                                        </div>
                                        <div className="report-topic-btn" onClick={()=>{
                                            removeTopic(topic.id)
                                        }}>
                                            <DeleteOutlined />
                                        </div>
                                    </div>
                                </div>
                            ))
                        :
                            <div id="no-topic">You've not added any info</div>
                    }
                </div>
                <div id="report-info-bottom">
                    <div id="report-info-input">
                        <Input placeholder="Enter info...." value={newTopic} onInput={e=>{
                            setNewTopic(e.target.value)
                        }}/>
                    </div>
                    <div id="add-btn">
                        <Button 
                            type="default"
                            size="medium"
                            onClick={addTopic}>
                                <span style={{fontSize:"12px"}}>{edit?"Edit":"Add"}</span>
                        </Button>
                    </div>
                </div>

            </div>
            
        </div>
    )
}