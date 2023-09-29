const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:8000/'
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const shippingData = shipping_address_collection = {
  allowed_countries: ['US', 'CA']
},
shipping_options = [
  {
    shipping_rate_data: {
      type: 'fixed_amount',
      fixed_amount: {
        amount: 0,
        currency: 'usd',
      },
      display_name: 'Free shipping',
      delivery_estimate: {
        minimum: {
          unit: 'business_day',
          value: 5,
        },
        maximum: {
          unit: 'business_day',
          value: 7,
        },
      },
    },
  },
  {
    shipping_rate_data: {
      type: 'fixed_amount',
      fixed_amount: {
        amount: 1500,
        currency: 'usd',
      },
      display_name: 'Next day air',
      delivery_estimate: {
        minimum: {
          unit: 'business_day',
          value: 1,
        },
        maximum: {
          unit: 'business_day',
          value: 1,
        },
      },
    },
  },
]
const invoice_creation = {
  enabled: true,
  invoice_data: {
    description: 'Invoice for Product X',
    metadata: {
      order: 'order-xyz',
    },
    account_tax_ids: [123456789],
    custom_fields: [
      {
        name: 'Purchase Order',
        value: 'PO-XYZ',
      },
    ],
    rendering_options: {
      amount_tax_display: 'include_inclusive_tax',
    },
    footer: 'B2B Inc.',
  },
}
const CURRENCY = "usd"

router.get("/create-payment-intent", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    shipping_address_collection: {
      allowed_countries: ["BD"],
    },
    shipping_options,
    line_items: [
      {
        price_data: {
          currency: CURRENCY,
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
          currency: CURRENCY,
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
    phone_number_collection: {
      enabled: true,
    },
    mode: 'payment',
    success_url: `${CLIENT_URL}success`,
    cancel_url: `${CLIENT_URL}cancel`,
  });

  res.json({
    session,
  });
});

module.exports = router;