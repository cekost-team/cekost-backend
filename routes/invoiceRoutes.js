const express = require('express');
const router = express.Router();
const { createPayment } = require('../controllers/paymentController');

// POST /api/invoices/:id/payments
router.post('/:id/payments', createPayment);

module.exports = router;