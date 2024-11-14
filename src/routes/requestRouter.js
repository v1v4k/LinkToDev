const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionReqModel = require('../models/connectionRequest');
const UserModel = require('../models/user');

// sendConnectionRequest API
requestRouter.post("/sendConnectionRequest/:status/:toUserId",userAuth, async(req, res)=>{
    try{

        const user = req.user;
        const fromUserId = user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const statusAllowed = ["interested","ignored"];

        const isStatusAllowed = statusAllowed.includes(status);

        if(!isStatusAllowed){
            throw new Error(`Invalid connection status type : ${status}`);
        }

        const toUser = await UserModel.findById(toUserId);

        if(!toUser){
            throw new Error(` Sending request to the user that doesn't exist`);
        }


        const connectionExists = await ConnectionReqModel.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId : toUserId, toUserId : fromUserId}
            ]
        })

        if(connectionExists){
            throw new Error(`Connection already exists`);
        }


        const ConnectionRequest = new ConnectionReqModel({fromUserId, toUserId, status});

        const data = await ConnectionRequest.save();
        

        res.json({
            message : `${req.user.firstName} to ${toUser.firstName} : ${status}`
        })
    }
    catch(error){
        res.status(400).send(`Error : ${error.message}`)
    }
    
})

module.exports =  requestRouter ;