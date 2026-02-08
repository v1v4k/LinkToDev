const express = require("express");
const authRouter = express.Router();
const {signUp , login, logout,  } = require("../controllers/authController");

// signup API
authRouter.post("/signup", signUp);

// login API
authRouter.post("/login", login);

// logout API
authRouter.post("/logout", logout);

module.exports = authRouter;
