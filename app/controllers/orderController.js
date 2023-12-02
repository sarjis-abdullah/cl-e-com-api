const mongoose = require("mongoose");
const Model = require("../models/orderModel");
const dotenv = require("dotenv");
const nodemailer = require('nodemailer');

const { needToInclude, sortAndPagination, getMetaInfo, useNodeMailer } = require("../utils");
const {
  orderResourceCollection,
  orderResource,
} = require("../resources/orderResources");
const Product = require("../models/productModel");
const Stock = require("../models/stockModel");
const { productResource } = require("../resources/newProductResources");
const { stockResourceCollection } = require("../resources/stockResources");
const User = require("../models/userModel");

dotenv.config();
const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:3000/";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const CURRENCY = "usd";

function getShippingOptions(body) {
  const hasShippingCost = body?.shippingCost ? true : false
  const shippingCost = hasShippingCost ? body.shippingCost * 100 : 0
  return [
    {
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: {
          amount: shippingCost,
          currency: CURRENCY,
        },
        display_name: hasShippingCost ? "Delivery cost" : "Free shipping",
        delivery_estimate: {
          minimum: {
            unit: "business_day",
            value: 1,
          },
          maximum: {
            unit: "business_day",
            value: 3,
          },
        },
      },
    },
  ];
}

exports.getAll = async (req, res) => {
  try {
    const pipeline = [];

    if (req.query?.orderBy) {
      const q = {
        $match: {
          orderBy: new mongoose.Types.ObjectId(req.query.orderBy),
        },
      };
      pipeline.push(q);
    }
    if (req.query?.orderStatus) {
      const q = {
        $match: {
          orderStatus: req.query.orderStatus,
        },
      };
      pipeline.push(q);
    }else{
      const q = {
        $match: {
          orderStatus: { $ne: 'cancelled' },
        },
      };
      pipeline.push(q);
    }
    if (req.query?.orderId) {
      const q = {
        $match: {
          _id: new mongoose.Types.ObjectId(req.query.orderId),
        },
      };
      pipeline.push(q);
    }

    if (needToInclude(req.query, "o.orderBy")) {
      pipeline.push({
        $lookup: {
          from: "users",
          localField: "orderBy",
          foreignField: "_id",
          as: "orderBy",
        },
      });
    }
    if (needToInclude(req.query, "o.updatedBy")) {
      pipeline.push({
        $lookup: {
          from: "users",
          localField: "updatedBy",
          foreignField: "_id",
          as: "updatedBy",
        },
      });
    }
    if (needToInclude(req.query, "o.products")) {
      pipeline.push({
        $lookup: {
          from: "products", // The name of the Category collection
          localField: "products", // The field in Product that links to Category
          foreignField: "_id", // The field in Category to match with
          as: "products", // The name of the new field to store the category data
        },
      });
    }

    const { sorting, container } = sortAndPagination(req.query);
    pipeline.push(sorting, container);

    const [result] = await Model.aggregate(pipeline);

    const additionalData = getMetaInfo(result, req.query);

    const resources = orderResourceCollection(
      result.items,
      additionalData,
      req.query
    );
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function getStripeSession(lineItems){

}

function sendMail(order, customer){
  console.log(customer);
  const mailOptions = {
    from: customer.email,
    to: 'admin@gmail.com', // Recipient's email
    subject: 'New Order Received',
    html: `
      <p>Hello,</p>
      <p>A new order has been received. Here are the details:</p>
      <ul>
        <li>Order ID: ${order._id}</li>
        <li>Customer Name: ${customer.name}</li>
        <li>Order Total: ৳${order.totalCost/100}</li>
        <li>Shipping Address: ${order.shippingAddress}</li>
        ${order.orderDescription ? `<li>Description: ${order.orderDescription}</li>` : ""}
      </ul>
      <p>Thank you!</p>
    `,
  };

  try {
    useNodeMailer.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email: ' + error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch (error) {
    throw new Error(error)
  }
}

exports.create = async (req, res) => {
  try {
    const request = JSON.parse(JSON.stringify(req.body));
    const promise = await request.products.map(async (item) => {
      let product = {};
      let stQuery = Stock.find({ productId: item.id });
      stQuery = stQuery.populate("productId");
      const stocks = await stQuery.exec();
      const availableQuantity = stocks.reduce((accumulator, currentItem) => {
        product = {
          name: currentItem.productId.name,
          unitAmount: currentItem.sellingPrice,
        };
        return accumulator + currentItem.quantity;
      }, 0);
      

      console.log(availableQuantity, "availableQuantity");
      let orderQty = item.quantity
      if (orderQty <= availableQuantity) {
        for (let index = 0; index < stocks.length; index++) {
          const stock = JSON.parse(JSON.stringify(stocks[index]));
          let qty = 0
          const remainingQty = stock.quantity - orderQty
          if (remainingQty >= 0) {
            qty = remainingQty
            await Stock.findByIdAndUpdate(stock._id, {quantity: qty}, {
              new: true,
              runValidators: true,
            });
            break
          }else{
            qty = 0
            orderQty = orderQty - stock.quantity
            await Stock.findByIdAndUpdate(stock._id, {quantity: qty}, {
              new: true,
              runValidators: true,
            });
            continue
          }
        }
        return {
          price_data: {
            currency: CURRENCY,
            product_data: {
              name: product.name,
            },
            unit_amount: product.unitAmount * 100,
          },
          adjustable_quantity: {
            enabled: false,
          },
          quantity: item.quantity,
        };
      }else{
        throw new Error("Stock not available")
      }

      return null;
    });

    const lineItems = await Promise.all(promise)
    request.subtotal = lineItems.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.quantity * currentItem.price_data.unit_amount;
    }, 0);
    request.totalCost = request.subtotal
    if (request.tax) {
      request.totalCost += request.tax
    }
    if (request.shippingCost) {
      request.shippingCost = parseFloat(request.shippingCost) * 100
      request.totalCost += request.shippingCost
      console.log(request.totalCost, 'request.totalCost');
    }
    console.log(request.totalCost, 'request.totalCost', typeof request.totalCost);

    request.products = request.products.map(item=> item.id)
    const item = new Model(request);
    const savedItem = await item.save();
    
    // const session = await getStripeSession(lineItems)
    if (request.paymentMethod == "cash") {
      const customer = await User.findById(savedItem.orderBy)
      sendMail(savedItem, customer)
      res.json(orderResource(savedItem))
      return
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_options: getShippingOptions(req.body),
      line_items: lineItems,
      mode: "payment",
      success_url: `${CLIENT_URL}success?orderId=${savedItem._id}`,
      cancel_url: `${CLIENT_URL}cancel?orderId=${savedItem._id}`,
    });

    res.json(session)
    //res.redirect(session)
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    let modelQuery = Model.findById(req.params.id);
    if (needToInclude(req.query, "c.createdBy")) {
      modelQuery = modelQuery.populate("createdBy");
    }
    if (needToInclude(req.query, "c.updatedBy")) {
      modelQuery = modelQuery.populate("updatedBy");
    }

    const item = await modelQuery.exec();
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(orderResource(item, req.query));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(orderResource(item));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
