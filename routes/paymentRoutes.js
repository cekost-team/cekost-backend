const express = require('express');
const router = express.Router();
const { getAllPayments } = require('../controllers/paymentController');

// GET /api/payments
router.get('/', getAllPayments);

module.exports = router;    