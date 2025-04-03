const express = require('express');
const server = express();
const cors = require('cors')
const cookieParser = require('cookie-parser');

const port = 3000;

server.use(cors({
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true, // Allow cookies and credentials
}));
server.use(cookieParser())

server.use(express.json());

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
  await mongoose.connect('mongodb://127.0.0.1:27017/e-commerce');
  console.log("Connected to database");
}

server.get('/', (req, res) => {
  res.send({ status: "success" });
})


// payment
// app.use(express.static("public"));
// app.use(express.json());



server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
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