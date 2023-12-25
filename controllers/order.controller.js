import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import { StatusCodes } from "http-status-codes";
import stripe, { Stripe } from "stripe";

export const getOrders = async (req, res) => {
  const orders = await Order.find({
    ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
    isCompleted: true,
  });
  res.status(StatusCodes.OK).send(orders);
};

export const confirm = async (req, res) => {
  const orders = await Order.findOneAndUpdate(
    {
      payment_intent: req.body.payment_intent,
    },
    {
      $set: {
        isCompleted: true,
      },
    }
  );
  res.status(StatusCodes.OK).send("Order has been confirmed!");
};

export const intent = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE);

  const gig = await Gig.findById(req.params.id);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: gig.price * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const newOrder = new Order({
    gigId: gig._id,
    img: gig.cover,
    title: gig.title,
    buyerId: req.userId,
    sellerId: gig.userId,
    price: gig.price,
    payment_intent: paymentIntent.id,
  });

  await newOrder.save();

  res.status(StatusCodes.OK).send({
    clientSecret: paymentIntent.client_secret,
  });
};
