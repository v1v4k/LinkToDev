const express = require("express");
const paymentRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

const { createCheckoutSession } = require("../controllers/paymentController");


paymentRouter.post("/payment/create-checkout-session", userAuth, createCheckoutSession );

module.exports = paymentRouter;