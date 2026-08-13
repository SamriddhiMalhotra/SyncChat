import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../main"
import { useDispatch, useSelector } from "react-redux"
import { setOtherUsersData } from "../redux/userSlice"

const useGetOtherUsers=()=>{
  let dispatch=useDispatch()
  let {userData, selectedUserData}=useSelector(state=>state.user)

  useEffect(()=>{ 
    if (!userData) return;
    const fetchOtherUsers=async ()=>{
      try {
        let result=await axios.get(`${serverUrl}/api/user/others`,
          {withCredentials:true}
        )
        dispatch(setOtherUsersData(result.data))
      } catch (error) {
        console.log(error)
      }
    };

    if (selectedUserData === null) {
    fetchOtherUsers();
    } 
  }, [userData, selectedUserData, dispatch])
}

export default useGetOtherUsers

// Fetches and updates the sidebar users with whom the logged-in user has existing conversations
// whenever the user returns to the sidebar (selectedUserData becomes null)