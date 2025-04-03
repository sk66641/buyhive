const express = require('express');
const server = express();
const cors = require('cors')
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const port = 3000;

server.use(cors({
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true, // Allow cookies and credentials
}));

const endpointSecret = 'whsec_Obs7UDOoXtoqmQP3zCk8lIugYncogb0E';


server.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
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
      console.log(`PaymentIntent for ${{paymentIntent}} was successful!`);
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
// This is your test secret API key.
const stripe = require("stripe")('sk_test_51R9S2SLLmRJN1CvucORG6pfISj5JCg7VswKrQ4kuPPlBoRA1JN4qMUuje47OkVYiV7QGKlo4oClK618xouY5X8R500gXSQ1YFg');



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

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId
    }
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
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