// controllers/paymentController.js
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const User = require("../models/userModel");

const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // create stripe customer if not exists
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        name: user.name,
        email: user.email,
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    const frontendUrl = process.env.FRONTEND_URL.replace(/\/$/, "");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer: user.stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Prime Membership - Annual" },
            unit_amount: 100000,
          },
          quantity: 1,
        }
      ],
      success_url: `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/payment-cancelled`,
      metadata: { userId: user._id.toString() }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.log("Checkout Error:", err);
    res.status(500).json({ message: "Payment session failed" });
  }
};


const verifyCheckoutSession = async (req, res) => {
  try {
    const sessionId = req.query.session_id;

    if (!sessionId) {
      return res.status(400).json({ message: "Missing session_id" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const userId = session.metadata.userId;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // update user to prime
    user.isPrime = true;
    user.primeActivatedAt = new Date();
    user.subscriptionStatus = "active";
    user.subscriptionId = session.id;

    await user.save();

    res.json({ message: "Prime Activated", user });

  } catch (err) {
    console.log("Verify Error:", err);
    res.status(500).json({ message: "Verification error" });
  }
};

module.exports = {
  createCheckoutSession,
  verifyCheckoutSession,
};
