import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import genToken from "../config/token.js"
import otpVerification from "../models/OtpVerification.model.js"
import { sendOtpMail } from "../config/mail.js"
import dotenv from "dotenv";

dotenv.config();

//SIGNUP
export const signUp = async (req, res) => {

  try {
    const { userName, email, password } = req.body

    //check if user already exists
    const checkUserByUserName = await User.findOne({ userName })
    if (checkUserByUserName) {
      return res.status(400).json({ message: "UserName already exists" })
    }
    const checkUserByEmail = await User.findOne({ email })
    if (checkUserByEmail) {
      return res.status(400).json({ message: "Email already exists" })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" })
    }

    //hasshing password
    const hashedPassword = await bcrypt.hash(password, 10)
    // creating user
    const user = await User.create({
      userName, email, password: hashedPassword
    })
    console.log(user)

    // token generation
    const token = await genToken(user._id)

    //storing token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true
    })

    return res.status(201).json(user)

  } catch (error) {
    return res.status(500).json({ message: `signup error ${error}` });
  }
}

//LOGIN
export const login = async (req, res) => {

  try {
    const { userName, password } = req.body

    //check if user exists
    const user = await User.findOne({ userName })
    if (!user) {
      return res.status(400).json({ message: "user does not exist" })
    }
    //hasshing password
    const matchPassword = await bcrypt.compare(password, user.password)
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid password" })
    }

    // token generation
    const token = await genToken(user._id)

    //storing token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true
    })

    return res.status(200).json(user)

  } catch (error) {
    return res.status(500).json({ message: `login error ${error}` });
  }
}

//LOGOUT
export const logout = async (req, res) => {
  try {
    res.clearCookie("token")
    return res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    return res.status(500).json({ message: `logout error ${error}` });
  }
}

//OTP-SENDING 
export const sendOtp = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    // BASIC VALIDATION 
    if (!userName || !email || !password) {
      return res.status(400).json({ message: "Username, email and password are required." });
    }
    //PASSWORD LENGTH
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }
    //CHECKING USERNAME EXIST IN MAIN DB
    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(400).json({ message: "Username is already in use." })
    }
    //CHECKING HOW MANY USERS WITH THIS EMAIL IN MAIN DB-MAX 3 USERNAMES PER EMAIL ALLOWED
    const existingUsersWithEmail = await User.countDocuments({ email });
    if (existingUsersWithEmail >= 3) {
      return res.status(400).json({ message: "This email already has the maximum of 3 usernames." });
    }

    //CHECKING THIS USERNAME+EMAIL COMBINATION ALREADY IN TEMPORARY SCHEMA WITH PENDING OTP VERIFICATION
    const existingTempUser = await otpVerification.findOne({ email, userName });

    //IF THERE IS A EXISTING COMBINATION THEN GENERATING OTP FOR IT.
    if (existingTempUser) {
      // Generate a new OTP 
      const otp = Math.floor(1000 + Math.random() * 9000).toString();

      //hasshing password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Update temporary user data

      existingTempUser.password = hashedPassword;
      existingTempUser.resetOtp = otp; existingTempUser.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
      // Extend temporary signup by another 30 minutes
      existingTempUser.tempExpiresAt = new Date(
        Date.now() + 30 * 60 * 1000
      );

      await existingTempUser.save();

      //sending new otp
      await sendOtpMail(email, otp)
      return res.status(200).json({ message: "otp sent successfully."})
    }
    //CHECKING HOW MANY PENDING USERS ARE THERE FOR THIS EMAIL.
    const tempUsersWithEmail = await otpVerification.countDocuments({ email });
    if (tempUsersWithEmail >= 3) {
      return res.status(400).json({ message: "This email already has 3 pending usernames. Please verify one of them first." });
    }
    //generating otp
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    //password hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    //creating NEW temporary user
    const result=await otpVerification.create({
      userName, email,
      password: hashedPassword,
      resetOtp: otp,
      otpExpires: new Date(Date.now() + 5 * 60 * 1000),
      tempExpiresAt: new Date(
        Date.now() + 30 * 60 * 1000
      ),
    });
    //Send OTP to user's email
    await sendOtpMail(email, otp);
    return res.status(200).json({ message: "OTP sent successfully.",result});
  } catch (error) {
    return res.status(500).json(`send otp error-${error}`)
    console.log(error)
  }
}

//OTP-VERIFICATION
export const verifyOtp = async (req, res) => {
  try {
    const { userName, otp } = req.body
    const user = await otpVerification.findOne({ userName })
    if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "invalid/expired otp" })
    }
  
    const permanentUser=await User.create({userName,
      email:user.email,
      password:user.password
    })
     // token generation
    const token = await genToken(permanentUser._id)

    //storing token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true
    })
    //deleting temporary document from OtpVerificationModel
    await otpVerification.deleteOne({ _id: user._id });
    return res.status(200).json({ message: "otp verified successfully." })
  } catch (error) {
    return res.status(500).json(`verify otp error-${error}`)
  }
}
