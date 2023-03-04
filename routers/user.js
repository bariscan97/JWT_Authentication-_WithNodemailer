const express=require("express")
const {userGet,changePassword,deleteUser}=require("../controller/userController")
const {getAccessRoute} =require("../middlewares/authing/Auth")

const router=express.Router()


router.get("/:userid",getAccessRoute,userGet)

router.put("/:userid/changePassword",getAccessRoute,changePassword)

router.put("/:userid/deleteUser",getAccessRoute,deleteUser)



module.exports=router

