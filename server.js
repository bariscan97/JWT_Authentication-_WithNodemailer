const express=require("express")
const server=express()
const path = require("path")
const dotenv=require("dotenv")
const cors=require("cors")
const cookieParser = require('cookie-parser')
const Connect = require("./helpers/database/Database")
const routers=require("./routers/index")
const {CustomErrorHandler} = require("./middlewares/Errors/CustomErrorHandler")

dotenv.config({
    path : "./config/env/config.env"
});
Connect()
server.use(cookieParser())
server.use(express.json())
server.use(cors())
server.use("/",routers)
server.use(CustomErrorHandler)










server.listen(process.env.PORT,()=>{
    console.log(`server ayakta ==> ${process.env.PORT}`)
})