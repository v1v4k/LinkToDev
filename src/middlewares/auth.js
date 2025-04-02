const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

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
      throw new Error("User Not Found");
    }

    if (user.isMfaEnable && !decodedToken.mfaVerified && (req.path !== "/mfa/setup" && req.path !=="/mfa/verify")) {
      return res.status(403).json({message : "MFA verification required"});
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({"Error" : error.message});
  }
};

module.exports = {
  userAuth
};
