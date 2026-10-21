const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware untuk melindungi endpoint (wajib bawa token)
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Ambil token dari header (Format: Bearer <token>)
            token = req.headers.authorization.split(' ')[1];

            // Verifikasi token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Simpan data user ke req.user (tanpa password)
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Tidak diizinkan, token gagal atau kedaluwarsa' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Tidak diizinkan, tidak ada token' });
    }
};

// Middleware untuk membatasi hak akses berdasarkan role (F-03)
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `Role '${req.user.role}' tidak memiliki hak akses untuk halaman ini` 
            });
        }
        next();
    };
};

module.exports = { protect, authorize };