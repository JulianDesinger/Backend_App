const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Importa la conexión

// Ruta para obtener todas las hamburguesas
router.get('/burgers', (req, res) => {
    db.query('SELECT * FROM burgers', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

module.exports = router;
