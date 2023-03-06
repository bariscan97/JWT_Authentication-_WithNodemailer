const User=require("../models/User")
const CustomError=require("../helpers/CustomError/CustomError")
const bcrypt=require("bcrypt")
const {SendJwt} = require("../helpers/Auths/SendJwt")
const sendEmail= require("../helpers/libraries/SendEmail")
const jwt_decode = require("jwt-decode")
const jwt = require("jsonwebtoken")



const registerSendEmail= async(req,res,next)=>{
    try{
        if (req.body.password.length>5){
            const user = await User.findOne({email:req.body.email,name:req.body.name})
            if (user){
                return next(new CustomError("this user already exists",404))
            }
            
            const salt = bcrypt.genSaltSync(10)
            const hashedPassword = await bcrypt.hash(req.body.password,salt) 
            const {JWT_SECRET_KEY,JWT_EXPIRE} = process.env
            const payload ={
                    name:req.body.name,
                    email : req.body.email,
                    password:hashedPassword,
                    date:Date.now()+parseInt(process.env.VERIFY_PASSWORD_EXPIRE)
                }
            const token = jwt.sign(payload,JWT_SECRET_KEY,{
            expiresIn :JWT_EXPIRE
            })
            const resetEmail=req.body.email
            const resetPasswordUrl = `http://localhost:${process.env.PORT}/api/auth/registerVerify?token=${token}`;
            const emailTemplate=`
                    <h3>Reset Your Password</h3>
                    <p>This <a href='${resetPasswordUrl}' target='_blank'>link</a>will expire in 1 hour</p>
            `
            try {
                await sendEmail({
                    from: process.env.SMTP_USER,
                    to: resetEmail,
                    subject: 'register check with email',
                    html: emailTemplate
                });
                return res.status(200)
                .json({
                    success: true,
                    message: 'Send token your Email'
                });
        } 
        catch (err) {
            console.log(err)
            return next(new CustomError('Email could not be sent',500));
        }
             
        

     }else{
         next(new CustomError("pleas check your password length",400))
      }
          
      
  }catch(err){
      return next(err)
     
  } 
}
const registerVerify=async(req,res,next)=>{
    try{
        const {token}=req.query
        if (!token){
            return next(new CustomError("Please check your token"))
        }
        const decoded=jwt_decode(token)
        const date=decoded.date
        if (parseInt(new Date())>parseInt(date)){
            return next(new CustomError("The token has expired",404))
        }
        const user = await User.create({
            name:decoded.name,
            email:decoded.email,
            password:decoded.password
            
        })
        await user.save()
        return res.status(200).json({
            success:true,
            verify:true
        })
        
    }catch(err){
        return next(new CustomError("Verify False",400))
    }
}

const login = async (req,res,next)=>{
    try{
        const user = await User.findOne({email:req.body.email,name:req.body.name})
        if (!user){
            return next(new CustomError("Not found this user",404))
        }
        const validated = await bcrypt.compare(req.body.password,user.password)
        if (!validated){
            
            return res
            .status(200)
            .cookie("access","",{
                httpOnly:true,
                expires: new Date(Date.now()),
                secure: process.env.NODE_ENV === "development" ? false : true
            })
            .json({
                success:false,
                message:"wrong password"
            })
            
        }
        
        return SendJwt(user,req,res)
       
    }catch(err){
        
        return next(new CustomError("there is something wrong ",400))
    }
}
const logout=(req,res,next)=>{
    res
    .status(200)
    .cookie("access","logout",{
        httpOnly:true,
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === "development" ? false : true
    })
    .json({
        success:true,
        logout:true
    })
}








module.exports={
    
    login,
    logout,
    registerSendEmail,
    registerVerify,
    
}

