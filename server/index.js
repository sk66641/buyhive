const express = require("express");
const server = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // ✅ Moved Stripe initialization up

const port = 3000;

// Middleware
server.use(cors({ origin: true, credentials: true }));
server.use(cookieParser());
server.use(express.json()); // ✅ Apply express.json() AFTER webhook

// Database Connection
async function main() {
  await mongoose.connect(process.env.MONGO_DB);
  console.log("Connected to database");
}
main().catch((err) => console.log(err));

// ✅ Webhook Route - Must use `express.raw()`
server.post(
  "/webhook",
  express.raw({ type: "application/json" }), // ✅ Apply express.raw() only here
  (request, response) => {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const signature = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, signature, endpointSecret);
    } catch (err) {
      console.error("⚠️  Webhook signature verification failed.", err.message);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle events
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(`✅ PaymentIntent for ${paymentIntent.id} was successful!`);
        break;
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }

    response.status(200).send();
  }
);

// ✅ Express.json() applied AFTER Webhook
server.use(express.json());

// Payment Intent API
server.post("/create-payment-intent", async (req, res) => {
  try {
    const { totalAmount, orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { orderId },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Routes
const productsRoutes = require("./routes/Products");
const brandsRoutes = require("./routes/Brands");
const categoriesRoutes = require("./routes/Categories");
const userRoutes = require("./routes/User");
const authRoutes = require("./routes/Auth");
const cartRoutes = require("./routes/Cart");
const orderRoutes = require("./routes/Order");

server.use("/products", productsRoutes.router);
server.use("/brands", brandsRoutes.router);
server.use("/categories", categoriesRoutes.router);
server.use("/users", userRoutes.router);
server.use("/auth", authRoutes.router);
server.use("/cart", cartRoutes.router);
server.use("/orders", orderRoutes.router);

server.get("/", (req, res) => {
  res.send({ status: "success" });
});

server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
