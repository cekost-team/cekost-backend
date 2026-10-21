const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ success: true, message: 'Get all tenants (Belum diisi)' });
});

module.exports = router;