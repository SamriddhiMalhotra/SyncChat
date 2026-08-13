import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
dotenv.config()
import dns from "dns"
import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/message.routes.js"
import { app, httpserver } from "./socket/socket.js"

dns.setServers(["1.1.1.1","8.8.8.8"])

const port=process.env.PORT || 5000

app.use(cors({
  origin:"https://syncchat-frontend-vggb.onrender.com",
  credentials:true
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/message",messageRouter)

httpserver.listen(port,()=>{
  connectDb()
  console.log(`server is started at ${port}`)
})
