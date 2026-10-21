const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    namaLengkap: { type: String, required: true },
    nomorIdentitas: { type: String },
    telepon: { type: String, required: true }, // Disimpan format internasional untuk WhatsApp
    kontakDarurat: { type: String },
    tanggalMasuk: { type: Date, required: true },
    tanggalKeluar: { type: Date },
    tanggalJatuhTempo: { type: Number, min: 1, max: 28, required: true }, // Tanggal 1-28
    deposit: { type: Number, default: 0 },
    status: { 
        type: String, 
        enum: ['aktif', 'pindah'], 
        default: 'aktif' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Tenant', tenantSchema);