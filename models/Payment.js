const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  nominal: { type: Number, required: true },
  tanggalBayar: { type: Date, required: true },
  metode: { type: String, required: true },
  urlBukti: { type: String },
  dicatatOleh: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);