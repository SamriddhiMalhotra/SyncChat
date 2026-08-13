import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../main"
import { useDispatch, useSelector } from "react-redux"
import { setMessages } from "../redux/messageSlice"

const useMessages=()=>{
  let dispatch=useDispatch()
  let {userData,selectedUserData}=useSelector(state=>state.user)

  useEffect(()=>{ 
    const fetchMessages=async ()=>{
      try {
        if (!selectedUserData?._id) return;
        
        let result=await axios.get(`${serverUrl}/api/message/get/${selectedUserData._id}`,
          {withCredentials:true}
        )
      dispatch(setMessages(result.data))
      } catch (error) {
        console.log(error)
      }
    }
    fetchMessages()
  },[selectedUserData,userData])
}

export default useMessages