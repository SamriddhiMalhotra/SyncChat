import jwt from "jsonwebtoken"

const isAuth=async (req,res,next)=>{
  try {
    let token=req.cookies.token
    if(!token){
      return res.status(401).json({message:"Unauthorized. Token not found."})
    }
    //taking userid through jwt.it will return object in which we will get user id.
    const verifyToken=jwt.verify(token, process.env.JWT_SECRET)
    //console.log(verifyToken)
    req.userId=verifyToken.userId
    next()
  } catch (error) {
    return res.status(500).json({message:`isauth error ${error}`})
  }
}

export default isAuth

// By creating the isAuth middleware once, you centralize the authentication logic. Any route that needs a logged-in user simply uses the middleware, making your code cleaner, easier to maintain, and less error-prone.

// So, the purpose of the login route is:

// Verify the user's credentials.
// Generate a signed JWT containing the user's identity.
// Send that JWT to the browser (commonly as an HTTP-only cookie).
// Allow the browser to automatically send that token with future requests, so your authentication middleware can verify the user without asking them to log in again every time.