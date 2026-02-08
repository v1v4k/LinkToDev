const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/user");
const Payment = require("../models/payment");
const logger = require("../utils/logger");
const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    logger.error(`Webhook Signature Verification Failed: ${err.message}`);
    return res
      .status(400)
      .json({ message: `Webhook Signature Verification Failed` });
  }
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { userId, membershipType } = session.metadata || {};

        if (!userId || !membershipType) {
          logger.error(
            `Webhook Error: Missing metadata in session ${session.id}`,
          );
          break;
        }

        const payment = await Payment.findOneAndUpdate(
          { stripePaymentId: session.id },
          { status: "succeeded", receiptUrl: session.receipt_url },
        );

        if (!payment) {
          logger.warn(`Payment record not found for session: ${session.id}`);
        }

        const user = await User.findById(userId);
        if (user) {
          user.isPremium = true;
          user.membershipType = membershipType;
          user.stripeCustomerId = session.customer;
          await user.save();
          logger.info(
            `SUCCESS: User ${userId} upgraded to ${membershipType} (Session: ${session.id})`,
          );
        } else {
          logger.error(
            `Webhook Error: User ${userId} not found during upgrade.`,
          );
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        const user = await User.findOne({ stripeCustomerId: customerId });
        if (user) {
          user.isPremium = false;
          user.membershipType = null;
          await user.save();
          logger.warn(
            `PAYMENT FAILED: User ${user._id} downgraded due to invoice failure.`,
          );
        } else {
          logger.warn(
            `Webhook: Received payment_failed for unknown customer ${customerId}`,
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const user = await User.findOne({ stripeCustomerId: customerId });
        if (user) {
          user.isPremium = false;
          user.membershipType = null;
          await user.save();
          logger.info(`SUBSCRIPTION CANCELLED: User ${user._id} downgraded.`);
        } else {
          logger.warn(
            `Webhook: Received subscription_deleted for unknown customer ${customerId}`,
          );
        }
        break;
      }
      default:
      // We ignore other events
      //logger.info(`Unhandled event type ${event.type}`);
    }
  } catch (err) {
    logger.error(`Webhook processing logic error: ${err.message}`);
    return res.status(200).json({ received: true });
  }
  res.status(200).json({ received: true });
};

module.exports = { handleWebhook };
