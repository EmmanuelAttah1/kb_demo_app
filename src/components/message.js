import "../styles/chat_message.css"
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';


const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );  

export const ChatMessage = props =>{
    return (
        <div className="chat-message-container" style={{backgroundColor:props.is_user?"":"#f0f0f0"}}>
            <div className="chat-message-inner">
                {!props.loading&&<div className="chat-message-sender">{props.is_user?"You":"Kb."}<span className="seperator">:</span></div>}
                {!props.loading?
                    <div className="chat-message-content">{props.text}</div>
                :
                <div className="chat-message-content center-message">
                    <div>Processing query <span style={{marginLeft:'10px'}}><Spin indicator={antIcon} /></span></div>
                    <div>Please wait</div>
                </div>
                }
            </div>
        </div>
    )
}