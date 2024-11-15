const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionReqModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
const userRouter = express.Router();

const SHOW_USER_DATA = ["firstName", "lastName", "age", "gender"]

// connections requests recieved to loggedInUser  API (receiver end)
userRouter.get("/user/requests/received", userAuth, async (req, res)=>{
    try{
        const loggedInUser = req.user._id;

        const connectionRequests = await ConnectionReqModel.find({
            toUserId : loggedInUser,
            status : "interested"
        }).populate("fromUserId", SHOW_USER_DATA)

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
}).populate("fromUserId", SHOW_USER_DATA)
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

// feed API
userRouter.get("/user/feed", userAuth, async (req,res)=>{
    try{
        const {_id : loggedInUserId} = req.user;

        const allConnections = await ConnectionReqModel.find({
            $or : [
                { fromUserId : loggedInUserId}, { toUserId : loggedInUserId}
            ]
        }).select("fromUserId toUserId")
        /* .populate("fromUserId" , "firstName")
        .populate("toUserId" , "firstName") */

        const hideUsersFromFeed = new Set();

        allConnections.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })

      

        const userFeed =await UserModel.find({
            _id : {$nin : Array.from(hideUsersFromFeed) }
        }).select(SHOW_USER_DATA)

        res.json({
            message : `Successfully fetched the feed `,
            feed : userFeed
        })


    }
    catch(error){
        res.status(400).json({
            message : `Error : ${error.message}`
        })
    }
    
})
module.exports = {userRouter};