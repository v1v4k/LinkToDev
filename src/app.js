require('dotenv').config();
const express = require("express")
const connectDB =  require("./config/database");
const app = express();
const port = 4444;
const cookieParser = require("cookie-parser");
const authRouter  = require('./routes/authRouter');
const  profileRouter  = require('./routes/profileRouter');
const  requestRouter  = require('./routes/requestRouter');

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);


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