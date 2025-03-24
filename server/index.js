const express = require('express');
const server = express();
const port = 3333;

const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/e-commerce');
    console.log("Connected to database");
}

server.get('/', (req, res) => {
    res.send({ status: "success" });
})

server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
})