const express = require('express');
const router = express.Router();
const { updateOverdueInvoices, generateMonthlyInvoices } = require('../controllers/jobController');

// Dipanggil oleh cron-job eksternal
router.post('/check-overdue', updateOverdueInvoices);
router.post('/generate-monthly', generateMonthlyInvoices);

module.exports = router;