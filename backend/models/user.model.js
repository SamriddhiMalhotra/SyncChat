import mongoose from "mongoose"

const userSchema=new mongoose.Schema({
  name:{
    type:String
  },
  userName:{
    type:String,
    required:true,
    unique:true,
    trim: true
  },
  email:{
     type:String,
    required:true,
    trim: true,
    lowercase:true
  },
  password:{
     type:String,
     required:true
  },
  image:{
    type:String,
    default:""
  }
},{timestamps:true})

const User=mongoose.model("User",userSchema)

export default User