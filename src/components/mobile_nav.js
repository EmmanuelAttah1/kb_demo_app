import "../styles/mobile_nav.css"
import {MenuOutlined} from '@ant-design/icons'

export const MobileNav=(props)=>{
    return(
        <div id="m-nav-container">
            <div id="nav-left">
                <div id="nav-menu" onClick={props.toggleSideBar}>
                    <MenuOutlined  style={{fontSize:"20px",color:"#ffffff"}}/>
                </div>
                <div id="title">KB.</div>
            </div>
            <div id="nav-right">
                <div className="nav-right-child" onClick={()=>{
                    props.navigate("/image")
                }}>
                    Images
                </div>
                <div className="nav-right-child" onClick={props.toggleSrcTab}>
                    Source
                </div>
            </div>
        </div>
    )
}