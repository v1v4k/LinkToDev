const express = require("express");
const mfaAuthRouter = express.Router();
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");

const { userAuth } = require("../middlewares/auth");

mfaAuthRouter.get("/mfa/setup", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const { isMfaEnable } = loggedInUser;

    if (isMfaEnable) {
      const secretKey = speakeasy.generateSecret({ length: 20 });

      //console.log(secretKey.base32);

      loggedInUser.mfaSecretKey = secretKey.base32;

      await loggedInUser.save();

      const code = speakeasy.totp({
        secret: secretKey.base32,
        encoding: "base32",
      });

      //console.log(token)

      QRCode.toDataURL(secretKey.otpauth_url, (err, imageUrl) => {
        if (err){
          return res.status(500).json({ message: "Error generating QR code" });
        }
        res.json({
          message: "MFA setup successful",
          qrCode: imageUrl,
          code: code,
        });
          
      });

     
    } else {
      res.send("please enable mfa");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while setting up MFA. Please try again.",
    });
  }
});

mfaAuthRouter.post("/mfa/verify", userAuth, async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res
        .status(400)
        .json({ message: "Code is required for MFA verification" });
    }

    const loggedInUser = req.user;

    if (!loggedInUser.mfaSecretKey) {
      return res
        .status(400)
        .json({ message: "MFA is not enabled for this account" });
    }

    const mfaSecretKey = loggedInUser.mfaSecretKey;

    //console.log("secret", mfaSecretKey);

    //console.log("token", token);

    const isTokenVerified = speakeasy.totp.verify({
      secret: mfaSecretKey,
      encoding: "base32",
      token: code,
      window: 6,
    });
    //console.log(isTokenVerified);

    if (isTokenVerified) {
      const newToken = await jwt.sign(
        {
          id: loggedInUser._id,
          mfaVerified: true // Now they’ve completed MFA
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h'
        }
      );
      
      res.cookie("token", newToken, { httpOnly: true, secure: true, sameSite: "Strict" });
      res.status(200).json({ message: "MFA authentication successful" });

    } else {
      res.status(401).json({ message: "Invalid MFA token. Please try again." });
    }
  } catch (error) {
    console.error(error); // Log for internal tracking
    res.status(500).json({
      message:
        "An error occurred during MFA verification. Please try again later.",
    });
  }
});

mfaAuthRouter.post("/mfa/enable/:value", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { value } = req.params;

    if (value !== "true" && value !== "false") {
      return res.status(400).json({
        message:
          "Invalid value provided. Use 'true' to enable MFA or 'false' to disable it.",
      });
    }

    loggedInUser.isMfaEnable = value === "true";

    await loggedInUser.save();

    const newToken = await jwt.sign(
      { id: loggedInUser._id, mfaVerified: loggedInUser.isMfaEnable ? false : true }, // If MFA is enabled, mfaVerified will be false initially
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: true, // only use secure in production
      sameSite: "Strict",
    });

    if (value === "true") {
      res.status(200).json({ message: "MFA successfully enabled" });
      //console.log("Enabled");
    } else {
      res.status(200).json({ message: "MFA successfully disabled" });
      //console.log("Disabled");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "An error occurred while updating MFA settings. Please try again later.",
    });
  }
});

module.exports = mfaAuthRouter;