const express= require("express")
const auth=require("./auth")

const user=require("./user")

const router= express.Router()

router.use("/api/auth",auth)

router.use("/api/profile",user)


module.exports=router