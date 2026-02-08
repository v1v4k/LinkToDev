const ConnectionReqModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
const logger = require("../utils/logger");
//const { run } = require("../utils/sesSendEmail");

const sendConnectionRequest = async (req, res) => {
  try {
    const user = req.user;
    const fromUserId = user._id;
    const { toUserId, status } = req.params;

    const allowedStatus = ["interested", "ignored"];

    const isStatusAllowed = allowedStatus.includes(status);

    if (!isStatusAllowed) {
      return res.status(400).json({
        message: `Invalid status type: ${status}`,
      });
    }

    if (fromUserId.toString() === toUserId) {
      return res.status(400).json({
        message: "You cannot send a connection request to yourself",
      });
    }

    const toUser = await UserModel.findById(toUserId);

    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const connectionExists = await ConnectionReqModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (connectionExists) {
      return res.status(400).json({
        message: "Connection Request already exists",
      });
    }

    const ConnectionRequest = new ConnectionReqModel({
      fromUserId,
      toUserId,
      status,
    });

    const data = await ConnectionRequest.save();
    logger.info(
      `Connection Request: ${req.user.firstName} -> ${toUser.firstName} (${status})`,
    );

    // const sendEmail = await run(
    //   `New Connection Request`,
    //   `<P>${req.user.firstName} sent you connection request</p>`
    // );

    res.status(200).json({
      message: "Connection request sent successfully",
      data: {
        status: status,
        toUser: toUser.firstName,
      },
    });
  } catch (err) {
    logger.error(`Send Request Error: ${err.message}`);
    res.status(400).json({message:err.message});
  }
};

const reviewConnectionRequest = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json({ message: `Invalid  status type: ${status}` });
    }

    const connectionRequest = await ConnectionReqModel.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: `connection request not found` });
    }
    connectionRequest.status = status;
    const data = await connectionRequest.save();
    logger.info(
      `Request Review: ${loggedInUser._id} ${status} request ${requestId}`,
    );

    // const sendEmail = await run(
    //   `Connection Request Status`,
    //   `Your connection request ${status} by ${loggedInUser.firstName}`
    // );
    res
      .status(200)
      .json({ message: ` connection request ${status}`, data: data });
  } catch (err) {
    logger.error(`Review request error: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
};

module.exports = { sendConnectionRequest, reviewConnectionRequest };
