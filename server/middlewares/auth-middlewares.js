const jwt=require('jsonwebtoken')
const User=require('../models/user-model')

const authmiddleware= async(req,res,next)=>{
    const token=req.header("Authorization")
    if(!token){
        return res.status(401).json({msg:"Unauthorized HTTP.Token Not Provided"})
    }
    const jwtToken=token.replace("Bearer","").trim()
    // console.log(jwtToken)
    try {
        const isVerified=jwt.verify(jwtToken,process.env.SECRET_KEY)
        // console.log(isVerified)
        const userdata= await User.findOne({email:isVerified.email}).select({password:0});
        // console.log(userdata)
        req.user=userdata
        req.token=token;
        req.userid=userdata._id;
    } catch (error) {
        return res.status(401).json({msg:"Unauthorized User,Invalid Token"})
    }
    next()
}

module.exports=authmiddleware