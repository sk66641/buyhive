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

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/e-commerce');
    console.log("Connected to database");
}

server.get('/', (req, res) => {
    res.send({ status: "success" });
})

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