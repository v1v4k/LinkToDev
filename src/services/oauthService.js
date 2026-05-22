const User = require("../models/user");
const { AuthProvider } = require("../models/authProvider");
const {
  validateOAuthUser,
  validateAuthProvider,
} = require("../helper/oauthValidation");
const logger = require("../utils/logger");

const extractProfile = (profile) => {
  const emails = profile.emails || [];
  const bestEmail = emails.find(e => e.primary && e.verified) || emails[0];

  const emailId = bestEmail?.value || null;

  const nameParts = (profile.displayName || profile.username || "User").split(" ");

  return {
    emailId,
    firstName: nameParts[0] || "Dev",
    lastName: nameParts.slice(1).join(" ") || "User",
    photoUrl: profile.photos?.[0]?.value || null,
  };
};

const handleOAuthLogin = async ({ profile, provider }) => {
  const providerId = profile.id;

  logger.info("[OAuthService] Processing OAuth login", {
    provider,
    providerId,
  });

  // 1. Check provider mapping
  const existingProvider = await AuthProvider.findOne({
    provider,
    providerId,
  });

  if (existingProvider) {
    logger.info("[OAuthService] Existing provider found", {
      providerId,
    });

    const user = await User.findById(existingProvider.userId);
    if (!user) {
      logger.error("[OAuthService] User not found for provider", {
        providerId,
      });
      throw new Error("User not found");
    }

    return user;
  }

  // 2. Extract data
  const { emailId, firstName, lastName, photoUrl } = extractProfile(profile);

  // 3. Validate user data
  const { error } = validateOAuthUser({
    provider,
    providerId,
    emailId,
    firstName,
    lastName,
    photoUrl,
  });

  if (error) {
    logger.warn("[OAuthService] Validation failed", {
      errors: error.details.map(e => e.message),
    });
    throw new Error("OAuth validation failed");
  }

  // 4. Try linking existing user
  let user = null;
  if (emailId) {
    user = await User.findOne({ emailId });
  }

  // 5. Create new user
  if (!user) {
    logger.info("[OAuthService] Creating new OAuth user");

    user = await User.create({
      firstName,
      lastName,
      emailId,
      photoUrl,
    });
  }

  // 6. Validate provider mapping
  const { error: providerError } = validateAuthProvider({
    provider,
    providerId,
    userId: user._id.toString(),
  });

  if (providerError) {
    logger.error("[OAuthService] Provider validation failed");
    throw new Error("Provider validation failed");
  }

  // 7. Save provider mapping
  try {
    await AuthProvider.create({
      userId: user._id,
      provider,
      providerId,
    });

    logger.info("[OAuthService] Provider mapping created", {
      userId: user._id,
    });
  } catch (err) {
    if (err.code === 11000) {
      logger.warn("[OAuthService] Duplicate provider mapping ignored", {
        providerId,
      });
    } else {
      throw err;
    }
  }

  return user;
};

module.exports = {
  handleOAuthLogin,
};