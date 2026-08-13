import { useDispatch, useSelector } from "react-redux"
import dp from "../assets/dp.jpg"
import { IoCameraOutline, IoArrowBackSharp } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import { useRef, useState } from "react"
import axios from "axios"
import { serverUrl } from "../main"
import { setUserData } from "../redux/userSlice"

function Profile() {
  let { userData } = useSelector((state) => state.user)

  let navigate = useNavigate()
  let dispatch = useDispatch()

  let [saving, setSaving] = useState(false)
  let [name, setName] = useState(userData?.name || "")
  let [frontendImage, setFrontendImage] = useState(userData?.image || dp)
  let [backendImage, setBackendImage] = useState(null)

  let image = useRef()

  const handleImage = (e) => {
    const file = e.target.files[0]

    if (!file) return

    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const handleProfile = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      let formData = new FormData()

      formData.append("name", name)

      if (backendImage) {
        formData.append("image", backendImage)
      }

      const result = await axios.put(
        `${serverUrl}/api/user/profile`,
        formData,
        { withCredentials: true }
      )

      setSaving(false)

      dispatch(setUserData(result.data))
      navigate("/")
    } catch (error) {
      console.log(error)
      setSaving(false)
    }
  }

  return (
    <div className="w-full h-screen bg-[#f7f8f7] flex items-center justify-center px-4 py-4 overflow-hidden">

      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="fixed top-5 left-5 w-11 h-11 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-[#12824d] hover:shadow-lg transition-all duration-200 z-10"
        aria-label="Go back to home"
      >
        <IoArrowBackSharp className="w-6 h-6" />
      </button>


      {/* Profile Card */}
      <div className="w-full max-w-[500px] max-h-[calc(100vh-32px)] bg-white rounded-2xl shadow-lg shadow-gray-200 px-6 sm:px-8 py-6 sm:py-8 overflow-hidden">

        {/* Heading */}
        <div className="text-center mb-5">

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Your Profile
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Update your profile information and picture
          </p>

        </div>


        {/* Profile Image Upload */}
        <div className="flex flex-col items-center mb-5">

          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            ref={image}
            hidden
            onChange={handleImage}
          />

            {/* Image Container */}
  <div
    className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-full p-1 bg-white border-4 border-[#12824d] shadow-md cursor-pointer group"
    onClick={() => image.current.click()}
  >

    {/* Profile Image */}
    <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
      <img
        src={frontendImage}
        alt="Profile"
        className="w-full h-full object-cover scale-140"
      />
    </div>

    {/* Hover Overlay */}
    <div className="absolute inset-1 rounded-full bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">

      <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium transition-opacity duration-200">
        Change photo
      </span>

    </div>

    {/* Camera Button */}
    <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#12824d] border-4 border-white flex items-center justify-center shadow-md group-hover:bg-[#0e6f41] transition-colors duration-200">

      <IoCameraOutline className="w-5 h-5 text-white" />

    </div>

  </div>

  <p className="text-xs text-gray-500 mt-2">
    Click your photo to change it
  </p>

</div>


        {/* Profile Form */}
        <form
          className="w-full flex flex-col gap-4"
          onSubmit={handleProfile}
        >

          {/* Name */}
          <div className="w-full">

            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              className="w-full h-[46px] outline-none border border-gray-300 px-4 rounded-lg text-[16px] text-gray-700 placeholder:text-gray-400 transition-all duration-200 focus:border-[#12824d] focus:ring-2 focus:ring-[#12824d]/10"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

          </div>


          {/* Username */}
          <div className="w-full">

            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Username
            </label>

            <input
              type="text"
              readOnly
              className="w-full h-[46px] outline-none border border-gray-200 px-4 rounded-lg text-[16px] text-gray-500 bg-gray-50 cursor-default"
              value={userData?.userName || ""}
            />

          </div>


          {/* Email */}
          <div className="w-full">

            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>

            <input
              type="text"
              readOnly
              className="w-full h-[46px] outline-none border border-gray-200 px-4 rounded-lg text-[16px] text-gray-500 bg-gray-50 cursor-default"
              value={userData?.email || ""}
            />

          </div>


          {/* Save Button */}
          <button
            type="submit"
            className="w-full h-[48px] bg-[#12824d] text-white rounded-lg text-[16px] font-semibold mt-1 transition-all duration-200 hover:bg-[#0e6f41] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>

        </form>

      </div>

    </div>
  )
}

export default Profile