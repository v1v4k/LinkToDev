require('dotenv').config();

const express = require("express")
const connectDB =  require("./config/database");
const UserModel = require('./models/user');

const app = express();
const port = 4444;

app.post("/signup", async (req, res)=>{
    const user = new UserModel({
        firstName : "Hari",
        lastName : "Patlolla",
        gender : "Male",
        age : 23
    })
    try{
        throw new Error("Just Practice"); 
        await user.save();
        res.send("Signed Up Successfully");
      
    }
    catch(err){
        console.error("there is some issue while saving the user");
        res.status(400).send("there is some issue while saving the user")
    }

    
})

connectDB()
.then(()=>{
    console.log("Database connection successfully established");
    app.listen(port,()=>{
        console.log("server is up and running at port 4444")
    })
})
.catch((err)=>{
    console.error(`Database cannot be connected+${err}`)
})