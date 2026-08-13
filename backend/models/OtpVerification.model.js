import mongoose from "mongoose"

const otpVerificationSchema=new mongoose.Schema({
  userName:{
    type:String,
    required:true,
    unique:true,
    trim:true
  },
  email:{
     type:String,
    required:true,
    trim: true,
    lowercase: true
  },
  password:{
     type:String,
     required:true
  },
  resetOtp:{
    type:String
  },
  otpExpires:{
    type:Date
  },
  tempExpiresAt:{
    type:Date,
    required:true,
    index:{
      expiresAfterSeconds:0,
    }
  }
},{timestamps:true})

const otpVerification=mongoose.model("otpVerification",otpVerificationSchema)

export default otpVerification