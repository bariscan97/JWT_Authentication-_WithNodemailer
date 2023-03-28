const express=require("express")
const {userGet,changePassword,deleteUser}=require("../controller/userController")
const {getAccessRoute} =require("../middlewares/authing/Auth")
const router=express.Router()




router.get("/",getAccessRoute,userGet)

router.put("/changePassword",getAccessRoute,changePassword)

router.put("/deleteUser",getAccessRoute,deleteUser)



module.exports=router

