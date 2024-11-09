require('dotenv').config();

const express = require("express")
const connectDB =  require("./config/database");
const UserModel = require('./models/user');
const { validateSignUpData } = require('./helper/validation');
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser")
const jwtToken = require("jsonwebtoken");
const { userAuth } = require('./middlewares/auth');

const app = express();
const port = 4444;

app.use(express.json());
app.use(cookieParser());



// signup API
app.post("/signup", async (req, res)=>{

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
app.post("/login", async (req, res)=>{
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

// profile API
app.get("/profile",userAuth, async (req, res)=>{
    try{
            const user = req.user;
            res.send(user);
    }
    catch(error){
        res.status(400).send(`Error: ${error.message}`)
    }   

})

// sendConnectionRequest API

app.post("/sendConnectionRequest",userAuth, async(req, res)=>{
    try{
        const user = req.user;
        res.send(`${user.firstName} sent the connection request`);

    }
    catch(error){
        res.status(400).send(`Error : ${error.message}`)
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