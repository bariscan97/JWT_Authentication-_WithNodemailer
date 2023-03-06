const CustomError = require("../../helpers/CustomError/CustomError")

const checkParams=async(req,res,next)=>{
    
    if (req.params.userid === req.user.name) return  next()
        
    return next(new CustomError("you need to login",404))
    
}

module.exports={
    checkParams
}