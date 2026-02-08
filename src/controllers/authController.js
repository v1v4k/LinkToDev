const UserModel = require("../models/user");
const { validateSignUpData } = require("../helper/validation");
const bcrypt = require("bcrypt");
const logger = require("../utils/logger");
// const { run } = require("../utils/sesSendEmail");

const signUp = async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);
    const { password, ...otherData } = req.body;

    // password encryption using bcrypt

    const passwordHash = await bcrypt.hash(password, 10);

    // instance of the user model
    const user = new UserModel({ ...otherData, password: passwordHash });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    logger.info(
      `New User Registered: ${savedUser.emailId} (ID: ${savedUser._id})`,
    );

    // sending email to user thru ses
    // const emailRes = await run(
    //   `Signup Successfull`,
    //   `<div>
    //           <h2>Welcome to LinkToDev</h2>
    //           <p>
    //             A platform that LINKS developers worldwide to collaborate,
    //             innovate, and grow together.
    //           </p>
    //       </div>`
    // );

    //sending cookie to user
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.json({ message: "Signed Up Successfully", data: savedUser });
  } catch (err) {
    logger.error(`Signup Failed: ${err.message}`);
    res.status(400).send(`ERROR : ${err.message}`);
  }
};

const login = async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const user = await UserModel.findOne({ emailId });

    if (!user) {
      logger.warn(`Login Failed: Email not found - ${emailId}`);
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // generating token
      const token = await user.getJWT();

      // sending email to user thru ses
      // const emailRes = await run(
      //   "Login Successfull",
      //   `<h1>Welcome to LinkToDev</h1>`
      // );

      logger.info(`User Logged In: ${user._id}`);

      //sending cookie to user
      res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

      res.send({
        ...user.toObject(), // Convert user object to plain JS object
        mfaVerified: !user.isMfaEnable, // If MFA is not enabled, consider it verified
      });
    } else {
      logger.warn(`Login Failed: Invalid password for user ${user._id}`);
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    if (error.message === "Invalid Credentials") {
    } else {
      logger.error(`Login System Error: ${error.message}`);
    }
    res.status(400).send(`ERROR : ${error.message}`);
  }
};

const logout = async (req, res) => {
  logger.info("Logout endpoint accessed");
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("Logout Successful");
};

module.exports = { signUp, login, logout };
