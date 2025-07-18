const express = require('express');
const { fetchAddressByUser, updateAddress, addAddress, deleteAddress } = require('../controller/Address');
const router = express.Router();

router.post('/add', addAddress).get('/', fetchAddressByUser).patch('/update', updateAddress).delete('/:id', deleteAddress);

exports.router = router; 