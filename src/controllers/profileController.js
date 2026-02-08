const {
  validateEditProfileData,
  validatePasswordStrong,
} = require("../helper/validation");
const bcrypt = require("bcrypt");
const logger = require("../utils/logger");

const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (err) {
    logger.error(`Profile fetch error: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error(`Invalid edit request`);
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    logger.info(`Profile updated for user: ${loggedInUser._id}`);

    res.status(200).json({
      message: `${loggedInUser.firstName}, Your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    logger.error(`Profile edit failed: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const user = req.user;

    const { password: oldPasswordByUser, newPassword: newPasswordByUser } =
      req.body;

    const isOldPasswordValid = await user.validatePassword(oldPasswordByUser);
    if (!isOldPasswordValid) {
      logger.warn(
        `Password Change Failed: Invalid credentials for user ${user._id}`,
      );
      throw new Error("Invalid current password");
    }
    validatePasswordStrong(newPasswordByUser);

    const passwordHash = await bcrypt.hash(newPasswordByUser, 10);

    user.password = passwordHash;

    await user.save();
    logger.info(`SECURITY: Password changed successfully for user ${user._id}`);

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (err) {
    logger.error(`Password update error: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
};
module.exports = { getProfile, updateProfile, updatePassword };
