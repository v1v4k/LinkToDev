const express = require("express")

const app = express();

app.get("/user",(req,res,next)=>{
    console.log("Handling route 1");
    //res.send("Route Handler 1")
    next();
    console.log("Handling route 1");
})

app.get("/user",(req, res, next)=>{
    console.log("Handling route 2");
   // res.send("Route Handler 2 ")
    next();
    
})

app.get("/user", (req, res, next)=>{
    console.log("Handling route 3");
    res.send("Route Handler 3 ")
    next();
    console.log("Handling route 3");
    
})


const port = 4444;

app.listen(port,()=>{
    console.log("server is up and running at port 4444")
})