const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nomorKamar: { type: String, required: true },
    tipe: { type: String, required: true },
    harga: { type: Number, required: true },
    fasilitas: [String],
    status: { 
        type: String, 
        enum: ['tersedia', 'terisi', 'perbaikan'], 
        default: 'tersedia' 
    },
    catatan: { type: String }
}, { timestamps: true });

// Aturan bisnis: Nomor kamar harus unik dalam satu kos
roomSchema.index({ ownerId: 1, nomorKamar: 1 }, { unique: true });

module.exports = mongoose.model('Room', roomSchema);