const  mongoose = require("mongoose")
const { Schema } = mongoose
const  crypto=require("crypto")
const uniqueValidator = require('mongoose-unique-validator');



const UserSchema = new Schema({
    name:{
        type:String,
        require:true,
        unique:true,
        minlength:6

    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email address.',
          ],
    },
    password:{
        type:String,
        require:true,
        minlength:6
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpire:{
        type:Date
    },
   
});

UserSchema.methods.usetResetPassword= function(){
    const {RESET_PASSWORD_EXPIRE}=process.env
    
    const randomHexString=crypto.randomBytes(15).toString("hex")
    
    const randomHexToken=crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex")
    this.resetPasswordToken=randomHexToken
    this.resetPasswordExpire=Date.now()+parseInt(RESET_PASSWORD_EXPIRE)
    console.log(randomHexToken)
    return randomHexToken
}

UserSchema.plugin(uniqueValidator);



module.exports=mongoose.model("User",UserSchema)

