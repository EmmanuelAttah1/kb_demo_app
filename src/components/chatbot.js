import "../chatbot.css"
import { useState, useEffect } from "react"
import { MyDocs } from "./docs"


const Chat=props=>{
    return(
        <div className="chat">
            <div className="chat-inner" style={{justifySelf:props.mine?"end":"start"}}>
                {props.text}
            </div>
        </div>
    )
}

const addr = "http://127.0.0.1:8000"


export const ChatBot=props=>{
    const [message,setMessage] = useState("")
    let prevMsg = null
    const [chats, setChat] = useState([
        {
            id:1,
            text:"Hello, how can I help you?",
            mine:false
        }
    ])

    useEffect(()=>{
        fetch(`${addr}/chat/messages`)
        .then(res=>{
            return res.json()
        })
        .then(res=>{
            const all_msg = [...chats]
            for (let msg = 0; msg < res.data.length; msg++) {
                const element = res.data[msg];
                all_msg.push({
                    id:element.id,
                    text:element.message,
                    mine:element.user_message
                })
            }
            setChat(all_msg)
        })
        
    },[])

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
        'ws://'
        + 'localhost:8000'
        + '/ws/chat/'
    );
    
    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        addMsg(data.message,false,false)
        .then(res=>{
            setChat(res)
        })
    };
    
    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };

    const sendMsg=()=>{
            if(message.length > 0){
            addMsg(message,true,true)
            .then(res=>{
                setChat(res)
                setMessage("")
                chatSocket.send(JSON.stringify({
                    'message': message
                }))
                // setTimeout(()=>{
                //     chatSocket.send(JSON.stringify({
                //         'message': message
                //     }))
                // },5000)
                
            })
        }
    }

    return(
        <div id="chatbot-container">
            <div id="chat-interface">
                <div id="messages">
                    {chats.map((e,index)=>(
                    <Chat mine={e.mine} text={e.text} key={"chat_"+index}/>
                ))}
                </div>
                <div id="chat-box">
                    <textarea placeholder="Send message" value={message} onInput={(e)=>{
                        setMessage(e.target.value)
                    }}/>
                    <div id="submit-btn" onClick={sendMsg}>Submit</div>
                </div>
            </div>
            <MyDocs/>
        </div>
    )
}