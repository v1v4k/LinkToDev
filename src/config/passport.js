const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const { handleOAuthLogin } = require("../services/oauthService");
const logger = require("../utils/logger");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        logger.info("[OAuth] GitHub authentication started", {
          providerId: profile.id,
        });

        const user = await handleOAuthLogin({
          profile,
          provider: "github",
        });

        logger.info("[OAuth] GitHub authentication success", {
          userId: user._id,
        });

        return done(null, user);
      } catch (err) {
        logger.error("[OAuth] GitHub authentication failed", {
          error: err.message,
          providerId: profile?.id,
        });

        return done(err, false);
      }
    }
  )
);

module.exports = passport;