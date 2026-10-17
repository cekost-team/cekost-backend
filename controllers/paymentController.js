const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');

// Fungsi mencatat pembayaran
const createPayment = async (req, res) => {
  try {
    const { nominal, tanggalBayar, metode, urlBukti } = req.body;
    const invoiceId = req.params.id;

    // 1. Cari tagihan berdasarkan ID
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Tagihan tidak ditemukan' });
    }

    // 2. Validasi aturan bisnis: Pembayaran tidak boleh melebihi sisa tagihan
    const sisaTagihan = invoice.nominal - invoice.jumlahTerbayar;
    if (nominal > sisaTagihan) {
      return res.status(400).json({ 
        success: false, 
        message: `Nominal pembayaran melebihi sisa tagihan. Sisa tagihan saat ini: Rp${sisaTagihan}` 
      });
    }

    // 3. Buat record Pembayaran baru
    const newPayment = new Payment({
      invoiceId: invoice._id,
      tenantId: invoice.tenantId,
      nominal,
      tanggalBayar: new Date(tanggalBayar),
      metode,
      urlBukti: urlBukti || null,
      // Asumsi: Zidan (Backend 1) akan membuat middleware Auth yang menyisipkan req.user. 
      // Untuk sementara jika auth belum siap, Anda bisa ubah req.user.id menjadi string ID admin statis.
      dicatatOleh: req.user ? req.user.id : "60d0fe4f5311236168a109ca" 
    });

    // 4. Update data Tagihan (Invoice)
    invoice.jumlahTerbayar += nominal;

    // Tentukan status baru berdasarkan aturan bisnis
    if (invoice.jumlahTerbayar >= invoice.nominal) {
      invoice.status = 'lunas';
    } else {
      // Jika belum lunas, cek apakah sudah lewat jatuh tempo
      const hariIni = new Date();
      if (hariIni > invoice.jatuhTempo) {
        invoice.status = 'telat';
      } else {
        invoice.status = 'sebagian';
      }
    }

    // 5. Simpan keduanya ke Database secara bersamaan
    await Promise.all([
      newPayment.save(),
      invoice.save()
    ]);

    res.status(201).json({
      success: true,
      message: 'Pembayaran berhasil dicatat',
      data: {
        pembayaran: newPayment,
        statusTagihanSekarang: invoice.status,
        sisaTagihan: invoice.nominal - invoice.jumlahTerbayar
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server', error: error.message });
  }
};

// Fungsi mengambil seluruh riwayat pembayaran
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('tenantId', 'namaLengkap').sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: 'Berhasil mengambil riwayat pembayaran', data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server', error: error.message });
  }
};

module.exports = { createPayment, getAllPayments };