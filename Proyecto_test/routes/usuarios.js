const express = require('express');
const router = express.Router();
const { registrarUsuario, obtenerUsuarios } = require('../controllers/usuariosController');

// POST - Registrar un usuario
router.post('/', async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        const result = await registrarUsuario(nombre, email, password, rol);
        res.status(201).json({ message: 'Usuario registrado', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const usuarios = await obtenerUsuarios();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
