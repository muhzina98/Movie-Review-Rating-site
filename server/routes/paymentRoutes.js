const express = require('express');
const authUser = require('../middlewares/authUser');
const { createCheckoutSession, verifyCheckoutSession } = require('../controllers/paymentController');

const paymentRouter = express.Router();

paymentRouter.post("/create-checkout-session", authUser, createCheckoutSession);
paymentRouter.get("/verify-session", authUser, verifyCheckoutSession);

module.exports = paymentRouter;
