const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {
  getProfile,
  updateProfile,
  updatePassword,
} = require("../controllers/profileController");

// profile API
profileRouter.get("/profile", userAuth, getProfile);

// profile edit API
profileRouter.patch("/profile/edit", userAuth, updateProfile);

// password API
profileRouter.patch("/profile/password", userAuth, updatePassword);

module.exports = profileRouter;
