const express=require("express")
const {login,logout,registerSendEmail,registerVerify}=require("../controller/authController")
const {forgotPassword,resetPassword}=require("../controller/userController")
const {getAccessRoute} =require("../middlewares/Auth/Auth")

const router=express.Router()


router.post("/registerSendEmail",registerSendEmail)
router.get("/registerVerify",registerVerify)
router.post("/logout",getAccessRoute,logout)
router.post("/login",login)
router.post("/forgot",forgotPassword)
router.put('/resetpassword', resetPassword);

module.exports=router

