const express = require("express")

const app = express();



app.use("/test",(req,res)=>{
    res.send("This is from the test")
})

app.use("/hello",(req,res)=>{
    res.send("This is from Helloooo")
})

app.use("/",(req,res)=>{
    res.send("This is Vivek")
})

app.listen(4444,()=>{
    console.log("server is up and running at port 4444")
})