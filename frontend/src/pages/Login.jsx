import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { serverUrl } from "../main"
import { useDispatch } from "react-redux"
import { setUserData, setselectedUserData } from "../redux/userSlice"
import { FiEye, FiEyeOff } from "react-icons/fi"

function Login() {
  let navigate = useNavigate()
  let dispatch = useDispatch()

  let [showPassword, setShowPassword] = useState(false)
  let [userName, setUserName] = useState("")
  let [password, setPassword] = useState("")
  let [loading, setloading] = useState(false)
  let [err, seterr] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setloading(true)

    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          userName,
          password
        },
        { withCredentials: true }
      )

      dispatch(setUserData(result.data))
      dispatch(setselectedUserData(null))

      navigate("/")

      setUserName("")
      setPassword("")
      setloading(false)
      seterr("")
    } catch (error) {
      console.log(error)
      setloading(false)
      seterr(error?.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#f7f8f7] flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-lg shadow-gray-200 px-8 py-9">

        {/* Brand and Heading */}
        <div className="flex flex-col items-center mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back to{" "}
            <span className="text-[#12824d]">
              SyncChat
            </span>
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            Login to continue chatting
          </p>

        </div>

        {/* Login Form */}
        <form
          className="w-full flex flex-col gap-5"
          onSubmit={handleLogin}
        >

          {/* Email */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User-Name
            </label>

            <input
              type="text"
              placeholder="Enter your user-name"
              className="w-full h-[50px] outline-none border border-gray-300 px-4 rounded-lg text-[16px] text-gray-700 placeholder:text-gray-400 transition-all duration-200 focus:border-[#12824d] focus:ring-2 focus:ring-[#12824d]/10"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
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
                placeholder="Enter your password"
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

          {/* Login Button */}
          <button
            type="submit"
            className="w-full h-[50px] bg-[#12824d] text-white rounded-lg text-[17px] font-semibold transition-all duration-200 hover:bg-[#0e6f41] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

         {/* Signup Link */}
          <p className="text-center text-sm text-gray-600 mt-1">
            Don't have an account?{" "}
            <span
              className="text-[#12824d] font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>

      </div>

    </div>
  )
}

export default Login