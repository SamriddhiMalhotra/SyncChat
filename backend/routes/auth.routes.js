import express from "express"
import { login, logout, sendOtp, signUp, verifyOtp } from "../controllers/auth.controllers.js"

const authRouter=express.Router()

authRouter.post("/signup",signUp)
authRouter.post("/login",login)
authRouter.get("/logout",logout)
authRouter.post('/sendotp',sendOtp)
authRouter.post('/verify-otp',verifyOtp)

export default authRouter