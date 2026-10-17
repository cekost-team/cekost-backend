const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  periode: { type: String, required: true }, // Format: YYYY-MM
  nominal: { type: Number, required: true },
  jatuhTempo: { type: Date, required: true },
  jumlahTerbayar: { type: Number, default: 0 },
  status: { type: String, enum: ['belum bayar', 'sebagian', 'lunas', 'telat'], default: 'belum bayar' }
}, { timestamps: true });

// Mencegah tagihan ganda per penghuni di bulan yang sama
invoiceSchema.index({ tenantId: 1, periode: 1 }, { unique: true });

module.exports = mongoose.model('Invoice', invoiceSchema);