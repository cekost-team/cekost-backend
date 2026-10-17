const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  kategori: { type: String, required: true }, 
  nominal: { type: Number, required: true },
  tanggal: { type: Date, required: true },
  deskripsi: { type: String, required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' } // Sifatnya opsional jadi tidak pakai required: true
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);