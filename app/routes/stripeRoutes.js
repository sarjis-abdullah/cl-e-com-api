const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.get("/create-payment-intent", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
          // tax_behavior: 'exclusive',
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
          maximum: 10,
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Air conditioner',
          },
          unit_amount: 200000,
          // tax_behavior: 'exclusive',
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
          maximum: 20,
        },
        quantity: 2,
      },
    ],
    // automatic_tax: {
    //   enabled: true,
    // },
    mode: 'payment',
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  });

  res.json({
    url: session,
  });
});

module.exports = router;