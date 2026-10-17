const Invoice = require('../models/Invoice');
// Pastikan Zidan menamai model penghuninya 'Tenant' dan kamar 'Room'
const Tenant = require('../models/Tenant'); 
const Room = require('../models/Room');

// Fungsi mengecek Authorization Header untuk keamanan Job
const isJobAuthorized = (req) => {
  const secret = req.headers['x-cron-secret'];
  // Disimpan di file .env nantinya (misal: CRON_SECRET=rahasia123)
  return secret === (process.env.CRON_SECRET || 'rahasia123'); 
};

// 1. Job untuk update status tagihan telat (Dijalankan setiap hari jam 00:01)
const updateOverdueInvoices = async (req, res) => {
  if (!isJobAuthorized(req)) return res.status(403).json({ success: false, message: 'Akses ditolak' });

  try {
    const hariIni = new Date();
    
    // Cari semua tagihan yang belum lunas, dan tanggalnya sudah lewat jatuh tempo
    const result = await Invoice.updateMany(
      { 
        status: { $in: ['belum bayar', 'sebagian'] }, 
        jatuhTempo: { $lt: hariIni } 
      },
      { $set: { status: 'telat' } }
    );

    res.status(200).json({ 
      success: true, 
      message: `Berhasil mengecek jatuh tempo. ${result.modifiedCount} tagihan diubah menjadi telat.` 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Job untuk menerbitkan tagihan bulanan (Dijalankan setiap tanggal 1)
const generateMonthlyInvoices = async (req, res) => {
  if (!isJobAuthorized(req)) return res.status(403).json({ success: false, message: 'Akses ditolak' });

  try {
    const hariIni = new Date();
    const tahun = hariIni.getFullYear();
    const bulan = String(hariIni.getMonth() + 1).padStart(2, '0');
    const periodeSekarang = `${tahun}-${bulan}`; // format: "2026-10"

    // Cari semua penghuni aktif
    const activeTenants = await Tenant.find({ status: 'aktif' }).populate('roomId');
    let tagihanDibuat = 0;
    let tagihanDilewati = 0;

    for (let tenant of activeTenants) {
      // Aturan Bisnis: Hindari tagihan ganda
      const existingInvoice = await Invoice.findOne({ tenantId: tenant._id, periode: periodeSekarang });
      
      if (!existingInvoice && tenant.roomId) {
        // Hitung jatuh tempo berdasarkan tanggalJatuhTempo penghuni
        const tanggalJatuhTempo = tenant.tanggalJatuhTempo || 10; // Default tgl 10 jika kosong
        const jatuhTempo = new Date(tahun, hariIni.getMonth(), tanggalJatuhTempo);

        await Invoice.create({
          tenantId: tenant._id,
          roomId: tenant.roomId._id,
          periode: periodeSekarang,
          nominal: tenant.roomId.harga, // Nominal mengikuti harga kamar saat tagihan dibuat
          jatuhTempo: jatuhTempo,
          jumlahTerbayar: 0,
          status: 'belum bayar'
        });
        tagihanDibuat++;
      } else {
        tagihanDilewati++;
      }
    }

    res.status(200).json({ 
      success: true, 
      message: `Pembuatan tagihan selesai. ${tagihanDibuat} dibuat, ${tagihanDilewati} dilewati (sudah ada).` 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { updateOverdueInvoices, generateMonthlyInvoices };