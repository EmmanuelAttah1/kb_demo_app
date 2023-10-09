import { ChatMessage } from "../components/message"
import { useEffect,useState,useRef } from "react"
import { useParams } from "react-router-dom"

export const QueryTab=props=>{

    const {chats,sendMsg,setMessage,message,chatLoading,setActive,selectedObject} = props

    const id = useParams().id

    const messagContainerRef = useRef()

    // console.log(props);

    useEffect(()=>{
        console.log("bam ",id);
        props.setActiveTab(1)
        // props.setQueryId(id)
        props.getChatMessages(id)

        // console.log(props);
    },[props.reloadProp])

    // useEffect(()=>{
    //     if(selectedObject.id !== null){
    //         console.log("changing id");
    //         setActive({section:"chat",id:id})
    //     }
    // },[selectedObject])

    const scrollToBottom=()=>{
        console.log("we are here");
        messagContainerRef.current.scrollTo({
            top: messagContainerRef.current.scrollHeight,
            behavior: 'smooth'
      });
    }

    useEffect(()=>{
        if(props.scrollBottom){
            scrollToBottom()
            props.setScrollBottom(false)
        }
    },[props.scrollBottom])



    return(
        <>
            <div id="message-container" ref={messagContainerRef}>
                {chats.map((e,index)=>(
                    <ChatMessage is_user={e.mine} text={e.text} key={"chat_"+index}/>
                ))}
                {chatLoading&&<ChatMessage is_user={false} loading={true} />}
            </div>

            <div id="chat-box-container">
                <textarea placeholder="Ask a question" value={message} onInput={(e)=>{
                    setMessage(e.target.value)
                }}/>
                <div id="submit-btn" onClick={()=>{
                    sendMsg()
                }}>Submit</div>
            </div>
        </>
    )
}