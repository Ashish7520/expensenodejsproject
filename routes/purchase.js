const express = require('express');
const router = express.Router();
const userAuthentication = require('../middleware/auth')
const Razorpay = require('razorpay');
const Order = require('../model/order')

const { createPremiumMembershipOrder, updateTransactionStatus } = require('../controller/purchase');

router.get('/premiummembership', userAuthentication, createPremiumMembershipOrder);
router.post('/updatetransactionstatus', userAuthentication, updateTransactionStatus);

module.exports = router