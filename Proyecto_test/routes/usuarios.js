const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authenticateToken, checkRole } = require('../middleware/security');
const { registrarUsuario, obtenerUsuarios } = require('../controllers/usuariosController');

// Validaciones
const userValidations = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('nombre').trim().not().isEmpty()
];

router.post('/', userValidations, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { nombre, email, password, rol } = req.body;
        const result = await registrarUsuario(nombre, email, password, rol);
        res.status(201).json({ message: 'Usuario registrado', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Proteger ruta con autenticación y rol
router.get('/', authenticateToken, checkRole(['admin']), async (req, res) => {
    try {
        const usuarios = await obtenerUsuarios();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               rol:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 */
