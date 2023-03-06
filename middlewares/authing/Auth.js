const CustomError = require("../../helpers/CustomError/CustomError")
const jwt_decode = require("jwt-decode")
const getAccessRoute=(req,res,next)=>{
   
           
        if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
            
            
            const access = req.headers.authorization.split(" ")[1]
           
            if (!(access == "null" || access =="logout")){
                
                const decoded =jwt_decode(access);
                
                req.user={
                    name:decoded.name,
                    email:decoded.email
                }
                
                next();
                
                

            }else{
                
                next( new CustomError("you are not logged in",404))
            }
        }else{
        
            
            next(new CustomError("you need to login",404))
        }

   

    
    
   
   
}



module.exports={
    getAccessRoute
}