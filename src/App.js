import './App.css';
import { useEffect, useState } from 'react';

import { EyeInvisibleOutlined, EyeTwoTone,LoadingOutlined } from '@ant-design/icons';
import { Spin, message,Button, Modal, Input } from 'antd';
import Navbar from './components/navbar';
import Footer from './components/footer';
import { ChatBot } from './components/chatbot';

import { SideBar } from './components/sideBar';
import { MainSection } from './components/mainSection';
import { MyReport } from './components/report_template';

import { useNavigate} from 'react-router-dom';

import { manageServerCall } from './Api/serverCall';
import { setCookie,getCookie } from './Api/cookieHelper';

const antIcon = <LoadingOutlined style={{ fontSize: 24, color:'white' }} spin />;

const default_sidebar_size = "250px"

const login_data_template = {
  username:"",
  password:""
}

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [loginInfo,setLoginInfo] = useState(login_data_template)
  const [modalOpen,setModalIsOpen] = useState(false)

  const [loginLoading, setLoginLoading] = useState(false)
  const [showLoginError,setShowLoginError] = useState(false)

  const updateLoginForm=(key,value)=>{
    const data = {...loginInfo}
    data[key] = value
    setLoginInfo(data)
  }

  const login=()=>{
    console.log(loginInfo);
    setLoginLoading(true)
    setShowLoginError(false)
    const form = new FormData()
    form.append("username",loginInfo['username'])
    form.append("password",loginInfo['password'])

    manageServerCall("POST","doc/login/",form,false)
    .then(res=>{
      console.log(res);
      setLoginLoading(false)
      if(res['token'] !== undefined || null){
        console.log("we got our token");
        setCookie("token",res.token,1)
        setIsAuthenticated(true)
        setModalIsOpen(false)
        window.location.reload()
      }else{
        setShowLoginError(true)
      }
      
    })
  }

  const navigate = useNavigate()
  const [firstChat, setFirstChat] = useState(null)
  const [sideBarSize, setSideBarSize] = useState(default_sidebar_size) // 0 means sidebar is on screen
  
  const [activeTab,setActiveTab] = useState(1)
  const [mobileView, setMobileView] = useState(false)

  const [showMobileSidebarBtn, setSidebarMobileBtn] = useState(false)

  const [chats, setChat] = useState([])

  const [sourceOpened, setSourceOpened] = useState(true)

  const [selectedObject,setSelectedObject] = useState({
    section:'chat',
    id:null
  })

  const [queryId, setQueryId] = useState(null)

  const getChatMessages=(id)=>{
    console.log("here");
    setQueryId(id)
    manageServerCall('GET',`chat/messages/${id}`)
    .then(res=>{
      console.log(res);
        AddChatToState(res)
    })
  }

  const checkForUserToken=()=>{
    const token = getCookie("token")
    if(token.length === 0){
      setTimeout(()=>{
        setModalIsOpen(true)
      },1000)
    }else{
      setIsAuthenticated(true)
    }
  }

  useEffect(()=>{
    checkForUserToken()
    const md = window.matchMedia("(max-width: 1300px)")
    const x = window.matchMedia("(max-width: 900px)")

    if(md.matches){
      setSidebarMobileBtn(true)
      toggleSideBar()
    }

    if(x.matches){
      toggleSideBar()
      setSourceOpened(false)
      setMobileView(true)
    }
  },[])

  const AddChatToState=data=>{
    console.log("insode here");
      const all_msg = [{
        id:1,
        text:"Hello, how can I help you?",
        mine:false
    }]
      for (let msg = 0; msg < data.data.length; msg++) {
          const element = data.data[msg];
          all_msg.push({
              id:element.id,
              text:element.message,
              mine:element.user_message
          })
      }
      setChat(all_msg)
  }

  const toggleSideBar=()=>{

    let size = "0px"
    if (sideBarSize === "0px") {
      size = default_sidebar_size
    }
    setSideBarSize(size)

    if(mobileView && sourceOpened){
      setSourceOpened(false)
    }
  }

  const toggleSrcTab=()=>{

    setSourceOpened(!sourceOpened)
    if(mobileView && sideBarSize === default_sidebar_size){
      setSideBarSize("0px")
    }
}

  return (
    <>
    <div id="main-container">
      <SideBar 
        navigate={navigate} 
        size={sideBarSize} 
        AddChatToState={AddChatToState}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showMobileSidebarBtn={showMobileSidebarBtn}
        toggleSideBar={toggleSideBar} 
        selectedObject={selectedObject}
        setSelectedObject={setSelectedObject}
        getChatMessages={getChatMessages}
        firstChat={firstChat}
        setFirstChat={setFirstChat}
        reloadProp = {modalOpen}
      />

      <MainSection 
        navigate={navigate} 
        chats={chats} 
        setChat={setChat} 
        toggleSideBar={toggleSideBar} 
        opened={sideBarSize===default_sidebar_size}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileView={mobileView}
        sourceOpened={sourceOpened} 
        setSourceOpened={setSourceOpened}
        toggleSrcTab={toggleSrcTab}
        showMobileSidebarBtn={showMobileSidebarBtn}
        selectedObject={selectedObject}
        setSelectedObject={setSelectedObject}
        getChatMessages={getChatMessages}
        queryId={queryId}
        setQueryId={setQueryId}
        firstChat={firstChat}
        reloadProp = {modalOpen}
      />

    <Modal title="Sign in" open={modalOpen} footer={[
      <Button key="submit" type="primary" block loading={loginLoading} onClick={login}>
          Login
      </Button>
      ]}
      >
      <div id="login-container">
        {showLoginError&&<div id="login-error">Invalid Username or Password</div>}
        <div className='login-div'>
          <div>Username</div>
          <Input placeholder="Enter Username"  value={loginInfo['username']} onInput={e=>{
            
            updateLoginForm("username",e.target.value)
          }}/>
        </div>

        <div className='login-div'>
          <div>Password</div>
          <Input placeholder="Enter Password" type='password' value={loginInfo['password']} onInput={e=>{
            
            updateLoginForm("password",e.target.value)
          }}/>
        </div>
  
      </div>
    </Modal>
    </div>
  </>
  );
}

export default App;
