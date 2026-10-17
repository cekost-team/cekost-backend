const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
  jenis: { type: String, enum: ['otomatis', 'manual'], required: true },
  waktuKirim: { type: Date, required: true },
  statusKirim: { type: String, enum: ['pending', 'berhasil', 'gagal'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);