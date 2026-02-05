const USER_NAME_DB = process.env.MONGODB_USERNAME;

const PASSWORD_DB = process.env.MONGODB_PWD;
const BASE_URL = "http://localhost:4444";

const MEMBERSHIP_PLANS = {
  silver: process.env.STRIPE_PRICE_SILVER,
  gold: process.env.STRIPE_PRICE_GOLD,
};

module.exports = { USER_NAME_DB, PASSWORD_DB, BASE_URL, MEMBERSHIP_PLANS };
