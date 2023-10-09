import "../styles/document.css"
import {FileDoneOutlined,DeleteOutlined} from '@ant-design/icons'
import { Button, message, Popconfirm } from 'antd';


export const MyDocument = props =>{
    const confirm = (e) => {
        console.log(e);
        props.deleteDoc(props.id)
      };
      const cancel = (e) => {
        console.log(e);
        message.error('Click on No');
      };
    return(
        <div className="document-container">
            <div className="document-info">
                <div className="document-logo"><FileDoneOutlined /></div>
                <div className="document-name">{props.name}</div>
            </div>
            <div className="document-del">
                <Popconfirm
                    title="Delete document"
                    description="Are you sure?"
                    onConfirm={confirm}
                    onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="text">
                        <DeleteOutlined />
                    </Button>
                </Popconfirm>
            </div>
        </div>
    )
}

