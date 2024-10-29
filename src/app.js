const express = require("express")

const app = express();

    // This will only handle GET call to /user
app.get("/user",(req,res)=>{
    res.send({name:"Vivek"})
})
 

app.post("/user",(req,res)=>{
    //logic for saving data to DB
    res.send("Data Successfully Saved")
})

app.delete("/user",(req,res)=>{
    //logic to delete data
    res.send("Data deleted successfully")
})


//this will match all the HTTP method API calls to /test
app.use("/test",(req,res)=>{
    res.send("Testinngggggggg the server")
})

app.listen(4444,()=>{
    console.log("server is up and running at port 4444")
})