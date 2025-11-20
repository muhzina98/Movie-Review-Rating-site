const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const User = require("../models/userModel");

const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create Stripe customer if not exists
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    // Build final URLs
    const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");

    const successUrl = `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${frontendUrl}/payment-failed`;

    console.log("Creating Stripe session", { successUrl, cancelUrl });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Prime Membership - Annual" },
            unit_amount: 100000,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: user.stripeCustomerId,
      metadata: {
        userId: user._id.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("createCheckoutSession error:", err);
    res.status(500).json({ message: err.message || "Failed to create checkout session" });
  }
};

const verifyCheckoutSession = async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    if (!sessionId) return res.status(400).json({ message: "No session_id provided" });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const userId = session.metadata?.userId;
    if (!userId) {
      return res.status(400).json({ message: "Invalid metadata" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isPrime = true;
    user.primeActivatedAt = new Date();
    user.subscriptionId = session.id;
    user.subscriptionStatus = "active";

    await user.save();

    res.json({ message: "Prime Activated", user });
  } catch (err) {
    console.error("verifyCheckoutSession error:", err);
    res.status(500).json({ message: "Failed to verify session" });
  }
};

module.exports = {
  createCheckoutSession,
  verifyCheckoutSession,
};
