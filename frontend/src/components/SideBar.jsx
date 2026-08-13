import { useDispatch, useSelector } from "react-redux"
import dp from "../assets/dp.jpg"
import { FaSearch } from "react-icons/fa"
import { ImCross } from "react-icons/im"
import { BiLogOutCircle } from "react-icons/bi"
import { useEffect, useState } from "react"
import axios from "axios"
import { serverUrl } from "../main"
import { useNavigate } from "react-router-dom"
import {
  setOtherUsersData,
  setselectedUserData,
  setUserData,
  setSearchData
} from "../redux/userSlice"

function SideBar() {
  let {
    userData,
    otherUsersData,
    selectedUserData,
    onlineUsers,
    searchData
  } = useSelector(state => state.user)

  let [search, setSearch] = useState(false)
  let [input, setInput] = useState("")

  let dispatch = useDispatch()
  let navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true
      })

      dispatch(setUserData(null))
      dispatch(setOtherUsersData(null))
      navigate("/login")
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = async () => {
    try {
      let result = await axios.get(
        `${serverUrl}/api/user/search?query=${input}`,
        {
          withCredentials: true
        }
      )

      dispatch(setSearchData(result.data))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (input) {
      handleSearch()
    }
  }, [input])

  return (
    <div
      className={`lg:w-[30%] relative lg:block w-full h-full bg-[#f5f7f6] overflow-hidden ${
        !selectedUserData ? "block" : "hidden"
      }`}
    >

      {/* DISPLAYING SEARCHED USERS */}
      {input.length > 0 && (
        <div className="flex absolute bg-white top-[315px] w-full h-[365px] overflow-y-auto flex-col gap-[10px] z-[150] items-center pt-[20px] shadow-lg">

          {searchData?.map((user) => (
            <div
              className="w-[95%] h-[70px] flex items-center gap-[20px] px-[10px] hover:bg-[#e8f5ef] border-b border-gray-200 cursor-pointer transition-colors duration-200"
              key={user._id}
              onClick={() => {
                dispatch(setselectedUserData(user))
                setInput("")
                setSearch(false)
              }}
            >

              {/* PROFILE IMAGE */}
              <div className="relative rounded-full bg-white flex justify-center items-center">
                <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center">
                  <img
                    src={user.image || dp}
                    className="w-full h-full object-cover scale-[1.0]"
                    alt="profile"
                  />
                </div>

                {/* ONLINE STATUS */}
                {onlineUsers?.includes(user._id) && (
                  <span className="w-[12px] h-[12px] rounded-full absolute bg-[#12824d] bottom-[5px] right-[-1px] border-2 border-white shadow-sm"></span>
                )}
              </div>

              <h1 className="text-gray-800 font-semibold text-[18px]">
                {user.name || user.userName}
              </h1>

            </div>
          ))}
        </div>
      )}

      {/* UPPER GREEN PART */}
      <div className="w-full h-[300px] bg-[#12824d] rounded-b-[30%] shadow-gray-300 shadow-lg flex flex-col justify-center px-[20px]">

        {/* APP NAME */}
        <h1 className="text-white font-bold text-[25px] tracking-wide">
          SyncChat
        </h1>

        <div className="w-full flex justify-between items-center">

          {/* GREETING */}
          <h1 className="text-white font-semibold text-[25px]">
            Hii, {userData?.name || "User"}
          </h1>

          {/* PROFILE IMAGE */}
          <div
            className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-700 shadow-lg cursor-pointer bg-white border-2 border-white "
            onClick={() => navigate("/profile")}
          >
            <img
              src={userData?.image || dp}
              className="w-full h-full object-cover"
              alt="profile"
            />
          </div>

        </div>

        {/* SEARCH AND ONLINE USERS */}
        <div className="w-full flex items-center gap-[20px] overflow-x-auto overflow-y-hidden py-[18px]">

          {/* SEARCH BUTTON */}
          {!search && (
            <div
              className="w-[60px] h-[60px] shrink-0 mt-[10px] rounded-full overflow-hidden flex justify-center items-center bg-white shadow-lg cursor-pointer text-[#12824d] hover:bg-[#e8f5ef] transition-colors duration-200"
              onClick={() => setSearch(true)}
            >
              <FaSearch className="w-[25px] h-[25px]" />
            </div>
          )}

          {/* SEARCH INPUT */}
          {search && (
            <form
              className="w-full shrink-0 h-[60px] bg-white shadow-lg flex items-center gap-[10px] mt-[10px] px-[20px] rounded-full overflow-hidden"
              onSubmit={(e) => e.preventDefault()}
            >
              <FaSearch className="w-[25px] h-[25px] text-[#12824d]" />

              <input
                type="text"
                placeholder="Search users..."
                className="w-full h-full p-[10px] text-[17px] outline-none border-0 text-gray-700 placeholder-gray-400"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                autoFocus
              />

              <ImCross
                className="w-[18px] h-[18px] text-gray-500 cursor-pointer hover:text-[#12824d] transition-colors duration-200"
                onClick={() => {
                  setSearch(false)
                  setInput("")
                }}
              />
            </form>
          )}

         {/* ONLINE USERS */}
{!search &&
  otherUsersData?.map(
    (user) =>
      onlineUsers?.includes(user._id) && (
        <div
          className="relative shrink-0 w-[60px] h-[60px] rounded-full shadow-gray-700 bg-white shadow-lg flex justify-center cursor-pointer mt-[10px]"
          onClick={() => dispatch(setselectedUserData(user))}
          key={user._id}
        >
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center">
            <img
              src={user.image || dp}
              className="w-full h-full object-cover"
              alt="profile"
            />
          </div>

          {/* ONLINE DOT */}
          <span className="w-[12px] h-[12px] rounded-full absolute bg-[#12824d] bottom-[5px] right-[-1px] border-2 border-white shadow-sm"></span>
        </div>
      )
  )}
        </div>
      </div>

      {/* LOWER PART OF SIDEBAR */}
      <div className="w-full h-[50%] flex flex-col gap-[20px] items-center mt-[15px] overflow-y-auto">

        {otherUsersData?.map((user) => (
          <div
            className={`w-[95%] h-[60px] shrink-0 flex items-center gap-[20px] shadow-gray-300 bg-white shadow-md rounded-full cursor-pointer transition-colors duration-200 ${
              selectedUserData?._id === user._id
                ? "bg-[#e8f5ef] border-2 border-[#12824d]"
                : "hover:bg-[#eef7f2]"
            }`}
            key={user._id}
            onClick={() => dispatch(setselectedUserData(user))}
          >

            {/* PROFILE IMAGE */}
            <div className="relative rounded-full bg-white flex justify-center">

              <div className="w-[55px] h-[55px] rounded-full overflow-hidden flex justify-center items-center border-2 border-white">
                <img
                  src={user.image || dp}
                  className="w-full h-full object-cover"
                  alt="profile"
                />
              </div>

              {/* ONLINE DOT */}
              {onlineUsers?.includes(user._id) && (
                <span className="w-[12px] h-[12px] rounded-full absolute bg-[#12824d] bottom-[5px] right-[-1px] border-2 border-white shadow-sm"></span>
              )}

            </div>

            {/* USER NAME */}
            <h1 className="text-gray-800 font-semibold text-[18px]">
              {user.name || user.userName}
            </h1>

          </div>
        ))}
      </div>

   {/* LOGOUT */}
<div
  className="group absolute bottom-0 left-0 w-full h-[50px]
             bg-[#12824d] text-white
             flex justify-center items-center
             cursor-pointer overflow-hidden
             shadow-lg shadow-gray-300
             hover:bg-red-600
             transition-colors duration-300 ease-in-out"
  onClick={handleLogout}
>
  <BiLogOutCircle
    className="w-[28px] h-[28px] flex-shrink-0"
  />

  <span
    className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap
               group-hover:max-w-[100px]
               group-hover:opacity-100
               group-hover:ml-3
               transition-all duration-300"
  >
    Logout
  </span>
</div>

    </div>

  )
}

export default SideBar