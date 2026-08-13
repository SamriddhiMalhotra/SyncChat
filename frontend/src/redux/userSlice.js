import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
  name:"user",
  initialState:{
    userData:null,
    otherUsersData:null,
    selectedUserData:null,
    socket:null,
    onlineUsers:null,
    searchData:null
  },
  reducers:{
    setUserData:(state,action)=>{
    state.userData=action.payload
  },
    setOtherUsersData:(state,action)=>{
    state.otherUsersData=action.payload
  },
    setselectedUserData:(state,action)=>{
    state.selectedUserData=action.payload
  },
  setSocket:(state,action)=>{
    state.socket=action.payload
  },
  setOnlineUsers:(state,action)=>{
    state.onlineUsers=action.payload
  },
 setSearchData:(state,action)=>{
    state.searchData=action.payload
  }
  }
})

export const {setUserData, setOtherUsersData, setselectedUserData, setSocket,setOnlineUsers, setSearchData}=userSlice.actions
export default userSlice.reducer

//data we send get into payload.