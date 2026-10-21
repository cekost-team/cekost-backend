const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ success: true, message: 'Get all rooms (Belum diisi)' });
});

module.exports = router;