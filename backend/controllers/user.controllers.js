import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../models/user.model.js"
import Conversation from "../models/conversation.model.js";

export const getCurrentUser=async (req,res)=>{
try {
  let userId=req.userId
  if (!userId) {
     return res.status(401).json({ message: "User is not authenticated", });
     }
  let user= await User.findById(userId).select("-password")
  if(!user){
    return res.status(400).json({message:"user not found"})
  }

  return res.status(200).json(user)
} catch (error) {
   console.error("Current user error:", error);
   return res.status(500).json({message:`current user error ${error.message}`})
   
}
}

// So that if (!user) is simply a safety check. Even if the JWT is valid and contains a userId, there's no guarantee that the corresponding user document still exists in the database.

 export const editProfile=async (req,res)=>{
  try {
    let {name}=req.body
    let image;
    if(req.file){
       image=await uploadOnCloudinary(req.file.path)
    }
    let user=await User.findByIdAndUpdate(req.userId,{
      name,
      image
    },{new:true})

    if(!user){
      return res.status(400).json({message:"user not found"})
    }

    return res.status(200).json(user)
   
  } catch (error) {
    return res.status(500).json({message:`profile error ${error}` })
  }
 }

export const getOtherUsers = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.userId
    });

    const userIds = conversations.flatMap((conversation) =>
      conversation.participants.filter(
        (id) => id.toString() !== req.userId.toString()
      )
    );

    const users = await User.find({
      _id: { $in: userIds }
    }).select("-password");

    return res.status(200).json(users);

  } catch (error) {
    return res.status(500).json({
      message: `Get other users error: ${error}`
    });
  }
};

 export const search=async (req,res)=>{
  try {
    let {query}=req.query
    if(!query){
      return res.status(400).json({message:"query is required"})
    }
    let users=await User.find({
      $or:[
        {name:{$regex:query,$options:"i"}},
        {userName:{$regex:query,$options:"i"}}
      ]
    })
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({message:`search users error: ${error}` })
  }
 }