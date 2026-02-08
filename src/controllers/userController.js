const ConnectionReqModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
const logger = require("../utils/logger");
const SHOW_USER_DATA = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "photoUrl",
  "about",
  "skills",
];
const getRequests = async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    const connectionRequests = await ConnectionReqModel.find({
      toUserId: loggedInUser,
      status: "interested",
    }).populate("fromUserId", SHOW_USER_DATA);

    logger.info(
      `Fetched ${connectionRequests.length} connection requests for user: ${loggedInUser}`,
    );

    res.status(200).json({
      message: `Data Fetched Successfully`,
      data: connectionRequests,
    });
  } catch (err) {
    logger.error(`Error fetching requests: ${err.message}`);
    res.status(400).json({
      message: err.message,
    });
  }
};

const getConnections = async (req, res) => {
  try {
    const { _id: loggedInUserId } = req.user;

    const connectionRequests = await ConnectionReqModel.find({
      $or: [{ toUserId: loggedInUserId }, { fromUserId: loggedInUserId }],
      status: "accepted",
    })
      .populate("fromUserId", SHOW_USER_DATA)
      .populate("toUserId", SHOW_USER_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUserId.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    logger.info(
      `Fetched ${data.length} connections for user: ${loggedInUserId}`,
    );

    res.status(200).json({
      message: `Connections fected successfully`,
      data: data,
    });
  } catch (err) {
    logger.error(`Error fetching connections: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
};

const getFeed = async (req, res) => {
  try {
    const { _id: loggedInUserId } = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const allConnections = await ConnectionReqModel.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    }).select("fromUserId toUserId");
    /* .populate("fromUserId" , "firstName")
        .populate("toUserId" , "firstName") */

    const hideUsersFromFeed = new Set();
    hideUsersFromFeed.add(loggedInUserId.toString());

    allConnections.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const userFeed = await UserModel.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .select(SHOW_USER_DATA)
      .skip(skip)
      .limit(limit);

    logger.info(
      `Feed fetched for user ${loggedInUserId}: ${userFeed.length} items`,
    );

    res.status(200).json({
      message: `Feed fetched successfully `,
      data: userFeed,
    });
  } catch (err) {
    logger.error(`Feed error: ${err.message}`);
    res.status(400).json({
      message: err.message,
    });
  }
};

const getSearch = async (req, res) => {
  try {
    const { _id: loggedInUser } = req.user;
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(200).json({
        message: `No query provided`,
        data: [],
      });
    }

    const users = await UserModel.find({
      firstName: { $regex: query, $options: "i" },
      _id: { $ne: loggedInUser },
    })
      .select(SHOW_USER_DATA)
      .limit(10);

    logger.info(
      `Search performed by ${loggedInUser}: "${query}" -> ${users.length} results`,
    );

    res.status(200).json({
      message: `Users fetched successfully`,
      data: users,
    });
  } catch (err) {
    logger.error(`Search Error: ${err.message}`);
    res.status(400).json({
      message: err.message,
    });
  }
};
module.exports = { getRequests, getConnections, getFeed, getSearch };
