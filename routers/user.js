const express=require("express")
const {userGet,changePassword,deleteUser}=require("../controller/userController")
const {getAccessRoute} =require("../middlewares/authing/Auth")
const {checkParams}=require("../middlewares/checkParams/checkParams")
const router=express.Router()


router.get("/:userid",userGet)

router.put("/:userid/changePassword",getAccessRoute,checkParams,changePassword)

router.put("/:userid/deleteUser",getAccessRoute,checkParams,deleteUser)



module.exports=router

