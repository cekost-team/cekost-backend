const express = require('express');
const cors = require('cors');

const app = express();

// Middleware Global
app.use(cors());
app.use(express.json());

// Routes Bagian Kamu (Zidan)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/tenants', require('./routes/tenantRoutes'));

// Routes Bagian Riki
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));

// Root endpoint test
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API CeKost Aktif' });
});

module.exports = app;