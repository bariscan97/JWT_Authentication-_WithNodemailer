const mongoose=require("mongoose")

const Connect=()=>{
    mongoose.set('strictQuery', true)
    
    mongoose.connect(process.env.MONGO_URI,
        {
            
            
            useUnifiedTopology: true,
            useNewUrlParser: true,
            autoIndex: true, 
            
        })
    .then(()=>{
        console.log("Connection Successful")
    }).catch((err)=>console.log(err))
    
}

module.exports=Connect