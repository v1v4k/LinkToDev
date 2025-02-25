const express = require("express");
const mfaAuthRouter = express.Router();
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

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

      const token = speakeasy.totp({
        secret: secretKey.base32,
        encoding: "base32",
      });

      //console.log(token)

      QRCode.toDataURL(secretKey.otpauth_url, (err, imageUrl) => {
        if (err)
          return res.status(500).json({ message: "Error generating QR code" });
       
        res.json({ secret: secretKey.base32, qrCode: imageUrl, token: token });
      });
    } else {
      res.send("please enable mfa");
    }
  } catch (error) {
    res.status(400).json({
      ERROR: `${error}`,
    });
  }
});

mfaAuthRouter.post("/mfa/verify", userAuth, (req, res) => {
  try {
    const { token } = req.body;

    const loggedInUser = req.user;

    const mfaSecretKey = loggedInUser.mfaSecretKey;

    //console.log("secret", mfaSecretKey);

    //console.log("token", token);

    const isTokenVerified = speakeasy.totp.verify({
      secret: mfaSecretKey,
      encoding: "base32",
      token: token,
      window: 6,
    });
    //console.log(isTokenVerified);

    if (isTokenVerified) {
      res.send("mfa Authentication Successfull");
    } else {
      throw new Error("MFA authentication failed");
    }
  } catch (error) {
    res.status(400).json({
      ERROR: `${error}`,
    });
  }
});

mfaAuthRouter.post("/mfa/enable/:value", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { value } = req.params;
    //console.log(value);
    loggedInUser.isMfaEnable = value;
    await loggedInUser.save();
    if (value === "true") {
      res.send("mfa successfully enabled");
      //console.log("Enabled");
    } else {
      res.send("mfa successfully disabled");
      //console.log("Disabled");
    }
  } catch (error) {
    res.status(400).json({
      ERROR: `${error}`,
    });
  }
});

module.exports = mfaAuthRouter;
