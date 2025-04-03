const express = require('express');
const server = express();
const cors = require('cors')
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const port = 3000;



const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;


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
      console.log(event.data)
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.id} was successful!`);
      await Order.findByIdAndUpdate(paymentIntent.metadata.orderId, { paymentStatus: 'received' });
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
  response.send();
});

server.use(cors({
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true, // Allow cookies and credentials
}));

server.use(cookieParser())
// server.use(express.raw({ type: 'application/json' }))
server.use(express.json());
dotenv.config();

const mongoose = require('mongoose');
const { createProduct } = require('./controller/Product')
const productsRoutes = require('./routes/Products')
const brandsRoutes = require('./routes/Brands')
const categoriesRoutes = require('./routes/Categories')
const userRoutes = require('./routes/User')
const authRoutes = require('./routes/Auth')
const cartRoutes = require('./routes/Cart')
const orderRoutes = require('./routes/Order');
const { Order } = require('./model/Order');
// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);



main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`${process.env.MONGO_DB}`);
  console.log("Connected to database");
}

server.get('/', (req, res) => {
  res.send({ status: "success" });
})



//

// Replace this endpoint secret with your endpoint's unique secret
// If you are testing with the CLI, find the secret by running 'stripe listen'
// If you are using an endpoint defined with the API or dashboard, look in your webhook settings
// at https://dashboard.stripe.com/webhooks

//

// payment
// app.use(express.static("public"));
// app.use(express.json());



server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount, orderId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { orderId },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



server.use('/products', productsRoutes.router);
server.use('/brands', brandsRoutes.router);
server.use('/categories', categoriesRoutes.router);
server.use('/users', userRoutes.router);
server.use('/auth', authRoutes.router);
server.use('/cart', cartRoutes.router);
server.use('/orders', orderRoutes.router);

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
})