import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { serverUrl } from "../main"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setUserData } from "../redux/userSlice"
import { FiEye, FiEyeOff } from "react-icons/fi"

function SignUp() {
  let navigate = useNavigate()
  let dispatch = useDispatch()

  let [showPassword, setShowPassword] = useState(false)

  let [userName, setUserName] = useState("")
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let [loading, setloading] = useState(false)
  let [err, seterr] = useState("")

  // const handleSignUp = async (e) => {
  //   e.preventDefault()
  //   setloading(true)

  //   try {
  //     let result = await axios.post(
  //       `${serverUrl}/api/auth/signup`,
  //       {
  //         userName,
  //         email,
  //         password
  //       },
  //       { withCredentials: true }
  //     )

  //     dispatch(setUserData(result.data))
  //     //navigate("/profile")

  //     setUserName("")
  //     setEmail("")
  //     setPassword("")
  //     setloading(false)
  //     seterr("")
  //   } catch (error) {
  //     console.log(error)
  //     setloading(false)
  //     seterr(error?.response?.data?.message || "Something went wrong")
  //   }
  // }

  const handleVerification=async (e) =>{
    e.preventDefault()
    setloading(true)

    try {
      const result= await axios.post(`${serverUrl}/api/auth/sendotp`,
        { userName,
          email,
          password},{withCredentials:true}
        )
     
      //dispatch(setUserData(result.data))
      //navigate("/profile")
      navigate("/otp-verification",{
        state:{
          userName:userName,
        }
      });     
      // setUserName("")
      // setEmail("")
      // setPassword("")
      setloading(false)
      seterr("")
      console.log(result)
    } catch (error) {
      console.log(error)
      setloading(false)
      seterr(error?.response?.data?.message || "Something went wrong")
    }
  }

  //   const handleSendOtp=async (e)=>{
  //   e.preventDefault()
  //   setloading(true)
  //    try {
  //     const result= await axios.post(`${serverUrl}/api/auth/sendOtp`,{email},{withCredentials:true})
  //     console.log(result.data)
  //     navigate("/otp-verification")
  //     setUserName("")
  //     setEmail("")
  //     setPassword("")
  //     setloading(false)
  //     seterr("")
  //    } catch (error) {
  //     setloading(false)
  //     seterr(error?.response?.data?.message || "Something went wrong")
  //    }
  // }

  return (
    <div className="w-full min-h-screen bg-[#f7f8f7] flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-lg shadow-gray-200 px-8 py-9">

        {/* Brand and Heading */}
        <div className="flex flex-col items-center mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to{" "}
            <span className="text-[#12824d]">
              SyncChat
            </span>
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            Create your account to start chatting
          </p>

        </div>

        {/* Signup Form */}
        <form
          className="w-full flex flex-col gap-5"
          onSubmit={handleVerification}
        >

          {/* Username */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>

            <input
              type="text"
              placeholder="Enter your username"
              className="w-full h-[50px] outline-none border border-gray-300 px-4 rounded-lg text-[16px] text-gray-700 placeholder:text-gray-400 transition-all duration-200 focus:border-[#12824d] focus:ring-2 focus:ring-[#12824d]/10"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full h-[50px] outline-none border border-gray-300 px-4 rounded-lg text-[16px] text-gray-700 placeholder:text-gray-400 transition-all duration-200 focus:border-[#12824d] focus:ring-2 focus:ring-[#12824d]/10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <div className="w-full h-[50px] border border-gray-300 rounded-lg relative overflow-hidden transition-all duration-200 focus-within:border-[#12824d] focus-within:ring-2 focus-within:ring-[#12824d]/10">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="w-full h-full outline-none px-4 pr-12 bg-white text-[16px] text-gray-700 placeholder:text-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-[#12824d] transition-colors duration-200"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>

            </div>
          </div>

          {/* Error Message
              Fixed height prevents the form from shifting
              when an error appears */}
          <div className="h-[22px]">
            {err && (
              <p className="text-sm text-red-500">
                * {err}
              </p>
            )}
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full h-[50px] bg-[#12824d] text-white rounded-lg text-[17px] font-semibold transition-all duration-200 hover:bg-[#0e6f41] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

        </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-1">
            Already have an account?{" "}
            <span
              className="text-[#12824d] font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>

      </div>

    </div>
  )
}

export default SignUp