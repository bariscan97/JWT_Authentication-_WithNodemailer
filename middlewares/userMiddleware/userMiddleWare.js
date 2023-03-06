const CustomError = require("../../helpers/CustomError/CustomError")


const userCheckParams=async(req,res,next)=>{
    
    if (req.params.userid === req.user.name){
        return next()
    
    
    }else{
        return next(new CustomError("you need to login",404))
    }
}

module.exports={
    userCheckParams
}