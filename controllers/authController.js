const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Fungsi helper untuk generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '7d', // Token berlaku 7 hari
    });
};

// @desc    Register user baru (Pemilik / Penghuni)
// @route   POST /api/auth/register
const register = async (req, res) => {
    try {
        const { nama, email, password, telepon, role } = req.body;

        // Cek apakah email sudah terdaftar
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Email sudah terdaftar!' });
        }

        // Hash password (F-02)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Buat user baru
        const user = await User.create({
            nama,
            email,
            password: hashedPassword,
            telepon,
            role: role || 'pemilik' // Default owner jika tidak diisi
        });

        if (user) {
            res.status(201).json({
                success: true,
                message: 'Registrasi berhasil',
                data: {
                    _id: user._id,
                    nama: user.nama,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id, user.role)
                }
            });
        } else {
            res.status(400).json({ success: false, message: 'Data user tidak valid' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Cari user berdasarkan email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Email atau password salah' });
        }

        // Cek kecocokan password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Email atau password salah' });
        }

        res.json({
            success: true,
            message: 'Login berhasil',
            data: {
                _id: user._id,
                nama: user.nama,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user profile (Me)
// @route   GET /api/auth/me
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { register, login, getMe };