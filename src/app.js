const express = require("express")

const app = express();

const {adminAuth, userAuth} = require("./middlewares/auth")


//middleware for admin authorization
app.use("/admin", adminAuth)

app.get("/admin/getData", (req, res)=>{

//error handling using try catch
     try{
        throw new Error("Just Practice"); 
        console.log("Access to data");
        res.send("All data sent successfully")
        
    }
     catch(err){
        console.log(err);
        res.status(500).send(`${err}-Something went wrong contact vivek for support`)
    } 
   
})

// wildcard error handling (new way but follow try catch)

/* app.use("/",(err, req, res, next)=>{
    if(err){
        //loggging error
        res.status(500).send("Something went wrong @vivek");
    }
}) */


const port = 4444;

app.listen(port,()=>{
    console.log("server is up and running at port 4444")
}
)