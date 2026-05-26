const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const logger = require("../utils/logger");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Please Login" });
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    const { id } = decodedToken;

    const user = await UserModel.findById(id);

    if (!user) {
      logger.warn(`Auth Alert: Token valid but User ID ${id} not found in DB.`);
      throw new Error("User Not Found");
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error(`Authentication failed: ${error.message}`);
    res.status(401).json({ Error: error.message });
  }
};

module.exports = {
  userAuth,
};
