import { useState } from "react"
import axios from "axios"
import { serverUrl } from "../main.jsx"
import { IoIosArrowRoundBack } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom";
import { setUserData } from "../redux/userSlice.js"
import { useDispatch } from "react-redux"

function OtpVerification() {
  const [otp, setOtp] = useState("")
  let [loading, setloading] = useState(false)
  let [err, seterr] = useState("")
  const navigate = useNavigate()
  const location = useLocation();
  let dispatch = useDispatch()

  const handleVerifyOtp = async () => {
    setloading(true)
    const userName = location.state?.userName;
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { userName,otp },
        { withCredentials: true }
      )
      dispatch(setUserData(result.data))
      navigate("./profile")
      setloading(false)
      seterr("")
      console.log(result)
    } catch (error) {
      setloading(false)
      console.error("Status:", error.response?.status);
      console.error("Backend response:", error.response?.data);
      console.error("Full error:", error);
      seterr(error?.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <div className="flex w-full min-h-screen items-center justify-center p-4 bg-[#f5f7f6]">

      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">

          <div
            className="w-[42px] h-[42px] rounded-full flex items-center justify-center cursor-pointer
            bg-[#e8f5ef] transition-colors duration-200 active:scale-95"
            onClick={() => navigate("/signup")}
          >
            <IoIosArrowRoundBack
              size={36}
              className="text-[#12824d]"
            />
          </div>

          <h1 className="text-2xl font-bold text-[#12824d]">
            Enter OTP
          </h1>

        </div>

        {/* OTP FORM */}
        <div>

          <div className="mb-6">

            <label
              htmlFor="otp"
              className="block text-gray-700 font-medium mb-2"
            >
              OTP
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              placeholder="Enter OTP"
              className="w-full h-[50px] outline-none border border-gray-300 px-4 rounded-lg text-[16px] text-gray-700 placeholder:text-gray-400 transition-all duration-200 focus:border-[#12824d] focus:ring-2 focus:ring-[#12824d]/10"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              required
            />

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

          <button
            className="w-full h-[50px] font-semibold text-[17px] rounded-lg transition duration-200 bg-[#12824d] text-white hover:bg-[#0e6f41] cursor-pointer shadow-gray-300 shadow-md"
            disabled={loading}
            onClick={handleVerifyOtp}
          >
            {loading ? "Creating account..." : "Verify OTP"}           
          </button>

        </div>

      </div>

    </div>
  )
}

export default OtpVerification