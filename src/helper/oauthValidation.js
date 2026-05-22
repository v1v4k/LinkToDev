const Joi = require("joi");

// For user creation
const oauthUserSchema = Joi.object({
  provider: Joi.string().valid("github", "google").required(),
  providerId: Joi.string().required(),
  emailId: Joi.string().email().allow(null),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  photoUrl: Joi.string().uri().allow(null),
});

// For provider mapping
const authProviderSchema = Joi.object({
  provider: Joi.string().valid("github", "google").required(),
  providerId: Joi.string().required(),
  userId: Joi.string().required(),
});

const validateOAuthUser = (data) =>
  oauthUserSchema.validate(data, { abortEarly: false });

const validateAuthProvider = (data) =>
  authProviderSchema.validate(data);

module.exports = {
  validateOAuthUser,
  validateAuthProvider,
};