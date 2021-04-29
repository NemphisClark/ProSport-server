const express = require('express');

const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require('../../middlewares/auth');

const { orders, orderStatus } = require('../../controllers/admin');

// routes
router.get('/orders', authCheck, adminCheck, orders);
router.put('/order-status', authCheck, adminCheck, orderStatus);

module.exports = router;
