const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionReqModel = require("../models/connectionRequest");
const userRouter = express.Router();

// connections requests recieved to loggedInUser  API (receiver end)
userRouter.get("/user/requests/received", userAuth, async (req, res)=>{
    try{
        const loggedInUser = req.user._id;

        const connectionRequests = await ConnectionReqModel.find({
            toUserId : loggedInUser,
            status : "interested"
        }).populate("fromUserId", "firstName lastName age gender")

        if(!connectionRequests){
            throw new Error(`No Connections Found`)
        }

        res.json({
            message: `Data Fetched Successfully`,
            data : connectionRequests
        })
    }
    catch(error){
        res.status(400).json({
            message: `Error : ${error.message}`
        })
    }
})

// user connections API
userRouter.get("/user/connections", userAuth, async (req, res)=>{
const { _id : loggedInUserId} = req.user;

const connectionRequests = await ConnectionReqModel.find({
    $or:[{toUserId: loggedInUserId},
    {fromUserId: loggedInUserId}],
    status : "accepted"
}).populate("fromUserId", ["firstName", "lastName"])
.populate("toUserId", "firstName lastName");

const data = connectionRequests.map(row=>{
    if(row.fromUserId._id.toString()===loggedInUserId.toString()){
        return row.toUserId;
    } 
    return row.fromUserId;
} 
       
)

    res.json({
        message : `Your Connections`,
        data : data
    
    })
})

module.exports = {userRouter};