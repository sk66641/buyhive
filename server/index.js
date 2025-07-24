const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Route Imports
const productsRoutes = require('./routes/Products');
const brandsRoutes = require('./routes/Brands');
const categoriesRoutes = require('./routes/Categories');
const userRoutes = require('./routes/User');
const authRoutes = require('./routes/Auth');
const cartRoutes = require('./routes/Cart');
const orderRoutes = require('./routes/Order');
const addressRoutes = require('./routes/Address');

// Middleware and Model Imports
const { authMiddleware } = require('./Middleware/authMiddleware');
const { Order } = require('./model/Order');
const { Cart } = require('./model/Cart');


dotenv.config();

const server = express();
const port = 3000;
// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Core Middleware
server.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
server.use(morgan('dev')); // Logging middleware
server.use(cookieParser());

// Stripe Webhook Endpoint
// This route must be placed before `express.json()` to receive the raw body for signature verification.
server.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  let event = request.body;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.id} was successful!`);
      await Order.findByIdAndUpdate(paymentIntent.metadata.orderId, { paymentStatus: 'received', status: 'placed' });

      // Clear the cart after successful payment
      try {
        const userId = paymentIntent.metadata.userId;
        if (userId) {
          console.log("Clearing cart for user:", userId);
          const result = await Cart.deleteMany({ user: new mongoose.Types.ObjectId(userId) });
          console.log(`Deleted ${result.deletedCount} cart items.`);
        } else {
          console.log("No userId in metadata, cannot clear cart.");
        }
      } catch (err) {
        console.error("Error deleting cart items:", err);
      }

      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.status(200).send();
});

// JSON Parser Middleware for all other API routes
server.use(express.json());


// Database Connection
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`${process.env.MONGO_DB}`);
  console.log("Connected to database");
}

// API Routes
server.get('/', (req, res) => {
  res.json({ status: "buyhive server is running" });
});

server.post("/create-payment-intent", authMiddleware, async (req, res) => {
  const { totalAmount, orderId } = req.body;
  const userId = req.user.id; // Get user from authenticated session

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Use Math.round for precision
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { orderId, userId }, // Add userId to metadata
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ message: "Error creating payment intent" });
  }
});

server.use('/products', productsRoutes.router);
server.use('/brands', authMiddleware, brandsRoutes.router);
server.use('/categories', authMiddleware, categoriesRoutes.router);
server.use('/users', authMiddleware, userRoutes.router);
server.use('/auth', authRoutes.router);
server.use('/cart', authMiddleware, cartRoutes.router);
server.use('/orders', authMiddleware, orderRoutes.router);
server.use('/addresses', authMiddleware, addressRoutes.router);


server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});