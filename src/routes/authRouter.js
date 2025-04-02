const express = require("express");
const authRouter = express.Router();
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../helper/validation");
const { run } = require("../utils/sesSendEmail");

// signup API
authRouter.post("/signup", async (req, res) => {
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

    // sending email to user thru ses
     const emailRes = await run(`Signup Successfull`, `<div>
              <h2>Welcome to LinkToDev</h2>
              <p>
                A platform that LINKS developers worldwide to collaborate,
                innovate, and grow together.
              </p>
          </div>`);

    //sending cookie to user
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.json({ message: "Signed Up Successfully", data: savedUser });
  } catch (err) {
    res.status(400).send(`ERROR : ${err.message}`);
  }
});

// login API
authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const user = await UserModel.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // generating token
      const token = await user.getJWT();

      // sending email to user thru ses
      const emailRes = await run("Login Successfull", `<h1>Welcome to LinkToDev</h1>`);
      

      //sending cookie to user
      res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
      res.send({
        ...user.toObject(),  // Convert user object to plain JS object
        mfaVerified: !user.isMfaEnable, // If MFA is not enabled, consider it verified
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send(`ERROR : ${error.message}`);
  }
});

// logout API
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("Logout Successful");
});

module.exports = authRouter;
