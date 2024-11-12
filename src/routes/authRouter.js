const express = require('express');
const authRouter = express.Router();
const UserModel = require('../models/user');
const bcrypt = require("bcrypt");
const { validateSignUpData } = require('../helper/validation');

// signup API
authRouter.post("/signup", async (req, res)=>{

    const {password, ...otherData } = req.body;

    try{
        // validation of data
        validateSignUpData(req);

        // password encryption using bcrypt

        const passwordHash = await bcrypt.hash(password, 10);
        
        // instance of the user model
        const user = new UserModel({...otherData, password : passwordHash});

        await user.save();
        res.send("Signed Up Successfully");
      
    }
    catch(err){
        res.status(400).send(`ERROR : ${err.message}`)
    }

    
})

// login API
authRouter.post("/login", async (req, res)=>{
    const {emailId, password } = req.body;

    try{
        const user = await UserModel.findOne({emailId});

        if(!user){
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){


            // generating token
            const token = await user.getJWT();

            //sending cookie to user
            res.cookie("token", token, {maxAge : 60 * 60 * 1000 })
            res.send("login successfull")
        }
        else{
            throw new Error("Invalid Credentials");  
        }
    }
    catch(error){
        res.status(400).send(`ERROR : ${error.message}`);
    }

    
})

module.exports = authRouter ;