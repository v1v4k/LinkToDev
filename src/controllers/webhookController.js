const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/user");
const Payment = require("../models/payment");
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
    console.error(`Webhook Signature Error: ${err.message}`);
    return res.status(400).send(`Webhook Signature Verification Failed`);
  }
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { userId, membershipType } = session.metadata;

        await Payment.findOneAndUpdate(
          { stripePaymentId: session.id },
          { status: "succeeded", receiptUrl: session.receipt_url },
        );

        const user = await User.findById(userId);
        console.log(user)
        if (user) {
          user.isPremium = true;
          user.membershipType = membershipType;
          user.stripeCustomerId = session.customer;
          await user.save();
        }
        console.log(`SUCCESS: User ${userId} upgraded to ${membershipType}`);
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
          console.log(`CANCELLATION: User ${user._id} downgraded.`);
        }
        break;
      }
      default:
        // We ignore other events
        //console.log(`Unhandled event type ${event.type}`);
    }
  } catch (err) {
    console.error("Webhook processing error:", err);
  }
  res.json({ received: true });
};

module.exports={handleWebhook}