const express = require("express")

const app = express();

const {adminAuth, userAuth} = require("./middlewares/auth")


//middleware for admin authorization
app.use("/admin", adminAuth)

app.get("/admin/getData", (req, res)=>{
    console.log("Access to data");
    res.send("All data successfully")
})

app.post("/admin/deleteUser", (req, res)=>{
    console.log("user is deleted");
    res.send("Deleted a user")
})

//no authorization for login api it should be open
app.post("/user/login",(req,res)=>{
    res.send("User logged in successfully");
})

//middleware for user authorization
app.use("/user", userAuth)

app.get("/user", (req, res)=>{
    res.send("user data sent successfully")
})

const port = 4444;

app.listen(port,()=>{
    console.log("server is up and running at port 4444")
}
)