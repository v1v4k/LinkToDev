const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionReqModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
const { run } = require("../utils/sesSendEmail");

// sendConnectionRequest API
requestRouter.post(
  "/sendConnectionRequest/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const fromUserId = user._id;
      const { toUserId, status } = req.params;

      const statusAllowed = ["interested", "ignored"];

      const isStatusAllowed = statusAllowed.includes(status);

      if (!isStatusAllowed) {
        throw new Error(`Invalid connection status type : ${status}`);
      }

      const toUser = await UserModel.findById(toUserId);

      if (!toUser) {
        throw new Error(` Sending request to the user that doesn't exist`);
      }

      const connectionExists = await ConnectionReqModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (connectionExists) {
        throw new Error(`Connection already exists`);
      }

      const ConnectionRequest = new ConnectionReqModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await ConnectionRequest.save();

      const sendEmail = await run(
        `New Connection Request`,
        `<P>${req.user.firstName} sent you connection request</p>`
      );

      res.json({
        message: `${req.user.firstName} to ${toUser.firstName} : ${status}`,
      });
    } catch (error) {
      res.status(400).send(`Error : ${error.message}`);
    }
  }
);

//reviewConnectionRequest API

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: `Invalid Connection Status type ${status}` });
      }

      const connectionRequest = await ConnectionReqModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: `connection request not found` });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();

      const sendEmail = await run(
        `Connection Request Status`,
        `Your connection request ${status} by ${loggedInUser.firstName}`
      );
      res.json({ message: ` connection request ${status}` });
    } catch (error) {
      res.status(400).json({ message: `Error : ${error.message}` });
    }
  }
);

module.exports = requestRouter;
