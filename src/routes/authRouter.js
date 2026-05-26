const express = require("express");
const authRouter = express.Router();
const { signUp, login, logout, handleGithubCallback } = require("../controllers/authController");
const passport = require("passport");

// signup API
authRouter.post("/signup", signUp);

// login API
authRouter.post("/login", login);

// logout API
authRouter.post("/logout", logout);

authRouter.get(
  "/auth/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  }),
);

authRouter.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=github_failed`,
  }),
  handleGithubCallback
);

module.exports = authRouter;
