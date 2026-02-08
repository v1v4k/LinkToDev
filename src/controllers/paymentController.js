const Payment = require("../models/payment");
const { MEMBERSHIP_PLANS } = require("../utils/constants");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const logger = require("../utils/logger");

const createCheckoutSession = async (req, res) => {
  try {
    const { membershipType } = req.body;
    const user = req.user;

    logger.info(
      `Initiating checkout for user: ${user._id} | Plan: ${membershipType}`,
    );

    const priceId = MEMBERSHIP_PLANS[membershipType];
    if (!priceId) {
      logger.warn(
        `Invalid membership attempt by user: ${user._id} | Type: ${membershipType}`,
      );
      return res.status(400).json({ error: "Invalid membership type" });
    }

    const stripePrice = await stripe.prices.retrieve(priceId);

    if (!user.stripeCustomerId) {
      logger.info(`Creating new Stripe customer for user: ${user._id}`);
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.firstName + " " + user.lastName,
        metadata: { userId: user._id.toString() },
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.BASE_URL_UI}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL_UI}/payment/cancel`,
      metadata: {
        userId: user._id.toString(),
        membershipType: membershipType,
      },
    });

    logger.info(`Stripe session created: ${session.id} for user: ${user._id}`);

    const payment = new Payment({
      userId: user._id,
      stripePaymentId: session.id,
      stripeCustomerId: user.stripeCustomerId,
      amount: stripePrice.unit_amount,
      currency: stripePrice.currency,
      status: "pending",
      membershipType: membershipType,
    });

    await payment.save();
    logger.info(`Payment record saved to DB: ${payment._id}`);

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    logger.error("Error creating session:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

module.exports = { createCheckoutSession };
