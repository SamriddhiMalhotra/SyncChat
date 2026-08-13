import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import useCurrentUser from "./customHooks/useGetCurrentUser";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import useOtherUsers from "./customHooks/useGetOtherUsers";
import { useEffect } from "react";
import {io} from "socket.io-client"
import { serverUrl } from "./main";
import { setOnlineUsers, setSocket } from "./redux/userSlice";
import OtpVerification from "./pages/OtpVerification";


function App() {
  useCurrentUser()
  useOtherUsers()
  let {userData, socket}=useSelector(state=>state.user)
  let dispatch=useDispatch()

  //socket.io getting connected to backend
  useEffect(()=>{
    if(userData){
      const socketio=io(`${serverUrl}`,{
    query:{
      userId:userData?._id
    }
   }) 

   dispatch(setSocket(socketio))

   const handleOnlineUsers = (users) => {
    dispatch(setOnlineUsers(users));
  };

  socketio.on("getOnlineUsers", handleOnlineUsers);
  

   return ()=>{
    socketio.off("getOnlineUsers", handleOnlineUsers);
    socketio.close()
    dispatch(setSocket(null))
   }
  }
}
,[userData, dispatch])

   

  return (
    <Routes>
      <Route path="/login" element={!userData?<Login />:<Navigate to="/"/>} />
      <Route path="/signup" element={userData?<Navigate to="/profile"/>:<SignUp/>} />
      <Route path="/" element={userData ?<Home />:<Navigate to="/login"/>} />
      <Route path="/profile" element={userData?<Profile/>:<Navigate to="/signup"/>} />
      <Route path="/otp-verification" element={userData?<Navigate to="/profile"/>:<OtpVerification/>} />
    </Routes>
  );
}

export default App;