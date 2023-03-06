const User=require("../models/User")
const CustomError=require("../helpers/CustomError/CustomError")
const bcrypt=require("bcrypt")
const sendEmail= require("../helpers/libraries/SendEmail")



const userGet=async(req,res,next)=>{
    try{
       const user=await User.findOne({email:req.user.email,name:req.user.name})
       if (user){
            
            res
            .status(200)
            .json({
                success:true,
                data:{
                    email:user.email,
                    name:user.name
                 }
           })
     
      }else{
            return next(new CustomError("User not found",404))
       }
    }catch(err){
        return next(new CustomError("you need to login",404))
    }


}


const changePassword= async(req,res,next)=>{
    try{    
        const user=await User.findOne({email:req.user.email})
        
        const resetPasswordToken =await user.usetResetPassword()
        
        await user.save()
        
        const resetPasswordUrl = `http://localhost:${process.env.PORT}/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

        const emailTemplate = `
            <h3>Reset Your Password</h3>
            <p>This <a href='${resetPasswordUrl}' target='_blank'>link</a>will expire in 1 hour</p>
        `
    
        try {
            await sendEmail({
                from: process.env.SMTP_USER,
                to: req.user.email,
                subject: 'Change Your Password',
                html: emailTemplate
            });
            return res.status(200)
            .json({
                success: true,
                message: 'Token sent to your email'
            });
        } 
        catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            
            await user.save();
            
            return next(new CustomError('Email could not be sent',500));
        }
    
    
        
    }catch(err){
        console.log(err)
        return next(new CustomError("there is something wrong",400))
    }
}
const forgotPassword = async(req,res,next)=>{
    try{    
       
        const user=await User.findOne({email:req.body.email})
        const resetEmail=req.body.email
        if (!user){
            return next(new CustomError("User not found",400))
        }
        const resetPasswordToken =await user.usetResetPassword()
        console.log(resetPasswordToken)
        await user.save()
        const resetPasswordUrl = `http://localhost:${process.env.PORT}/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

        const emailTemplate = `
            <h3>Reset Your Password</h3>
            <p>This <a href='${resetPasswordUrl}' target='_blank'>link</a>will expire in 1 hour</p>
       `
    
        try {
            await sendEmail({
                from: process.env.SMTP_USER,
                to: resetEmail,
                subject: 'Reset Your Password',
                html: emailTemplate
            });
            return res.status(200)
            .json({
                success: true,
                message: 'Token sent to your email'
            });
        } 
        catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            
            await user.save();
            
            return next(new CustomError('Email could not be sent',500));
        }
    
    
        
    }catch(err){
        console.log(err)
        return next(new CustomError("there is something wrong",400))
    }
}

const resetPassword = async (req, res, next) => {
    try{
        const { resetPasswordToken } = req.query;
        const { password } = req.body;
    
        if (!resetPasswordToken) {
            return next (new CustomError('Please provide a valid token', 400));
        }
        let user = await User.findOne({
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpire: {$gt: Date.now()} 
        });
    
        if (!user) {
            return next(new CustomError('Invalid token or session expired',404));
        }
       
        if (password.length>5){
            const validated = await  bcrypt.compare(password,user.password)
            if (validated){
                return next(new CustomError("another password please"))
            }
            const salt = bcrypt.genSaltSync(10)
            const hashedPassword = await bcrypt.hash(password,salt) 
            user.password = hashedPassword;
            user.resetPasswordToken = undefined;    
            user.resetPasswordExpire = undefined;   
        
            await user.save();
        
            return res
            .status(200) 
            .cookie("access","logout",{
                httpOnly:true,
                expires: new Date(Date.now()),
                secure: process.env.NODE_ENV === "development" ? false : true
            })
            .json({
                success: true,
                message: 'Reset password process succesful'
            })

        }else{
            return next(new CustomError("your password must be longer than 6",400))
        }
        
    }catch(err){
        console.log(err)
        return next(new CustomError("there is something wrong",400))
    }
    

}
const deleteUser=async(req,res,next)=>{
    try{
        const user=await User.findOneAndDelete({email:req.user.email,name:req.user.name})
        res
        .status(200)
        .cookie("access","logout",{
            httpOnly:true,
            expires: new Date(Date.now()),
            secure: process.env.NODE_ENV === "development" ? false : true
        })
        .json({
            userDelete:true,
            data:user
        })
    }catch(err){
        return next(new CustomError("there is something wrong",400))
    }
}

module.exports={
    userGet,
    forgotPassword,
    changePassword,
    resetPassword,
    deleteUser

}