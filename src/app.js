require('dotenv').config();

const express = require("express")
const connectDB =  require("./config/database");
const UserModel = require('./models/user');

const app = express();
const port = 4444;

app.use(express.json());


// api to get sample user 
app.get("/user", async (req, res)=>{
    try{
        const user = await UserModel.find(req.body)
        if(user.length===0){
            res.status(404).send("USER NOT FOUND")
        }
        else{
            res.send(user)
        }
    }
    catch(err){
        res.status(400).send(`there is some issue while fetching the user + ${err.message}`)

    }
})

// api to get user by emailId
app.get("/userByEmail", async(req, res)=>{
    const userEmail = req.body.emailId ;
    try{

        const user = await UserModel.findOne({emailId : userEmail});
        if(user){
            res.send(user)
        }
        else{
            res.status(404).send("USER NOT FOUND")
        }
        

    }
    catch(error){
        res.status(400).send(`there is some issue while fetching the user + ${error.message}`)

    }
})

// feed api to get all users data
app.get("/feed", async (req, res)=>{
    try{
        const users = await UserModel.find(req.body);
        if(users.length===0){
            res.status(404).send("USER NOT FOUND")
        }
        else{
            res.send(users)
        }
    }
    catch(err){
        res.status(400).send(`there is some issue while fetching the user + ${err.message}`)
    }
    
})

//user by id
app.get("/userById", async(req, res)=>{
    const userId = req.body.userId;
    try{

        const user = await UserModel.findById(userId).exec();
        if(!user){
            res.status(404).send("USER NOT FOUND");
        }
        else{
            res.send(user)
        }

    }
    catch(error){
        res.status(400).send(`there is some issue while fetching the user + ${err.message}`)

    }
})

// api to delete a user by id
app.delete("/user", async (req, res)=>{
    const userId = req.body.userId;
    try{
        const user = await UserModel.findByIdAndDelete(userId);
        if(!user){
            res.status(404).send("ERROR NOT FOUND");

        }
        else{
            res.send(user)
        }
    }
    catch(error){
        res.status(400).send(error.message)
    }
})

// patch api to update a user
app.patch("/user", async(req, res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try{
        const user = await UserModel.findOneAndUpdate({_id: userId}, data,
            {returnDocument: 'after',
                runValidators : true
                
            });
        if(!user){
            res.status(404).send("ERROR NOT FOUND");

        }
        else{
            res.send(user)
        }
        
    }
    catch(error){
        res.status(400).send(error.message)
    }
})

// signup api
app.post("/signup", async (req, res)=>{
    const user = new UserModel(req.body);
    try{
        // throw new Error("Just Practice"); 
        await user.save();
        res.send("Signed Up Successfully");
      
    }
    catch(err){
        res.status(400).send(`there is some issue while saving the user + ${err.message}`)
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