const express = require('express');
const server = express();
const cors = require('cors')
const port = 3000;

const mongoose = require('mongoose');
const { createProduct } = require('./controller/Product')
const productsRoutes = require('./routes/Products')
const brandsRoutes = require('./routes/Brands')
const categoriesRoutes = require('./routes/Categories')

server.use(cors());
server.use(express.json());

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

server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
})