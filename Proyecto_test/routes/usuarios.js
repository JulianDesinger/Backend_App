const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authenticateToken, checkRole } = require('../middleware/security');
const { registrarUsuario, obtenerUsuarios } = require('../controllers/usuariosController');
const db = require('../config/database');

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
        
        // Verificar email duplicado
        const [existingUsers] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'email ya existe' });
        }

        const result = await registrarUsuario(nombre, email, password, rol);
        res.status(201).json({ message: 'Usuario registrado', userId: result.insertId });
    } catch (error) {
        if (error.message === 'Rol inválido') {
            return res.status(400).json({ error: error.message });
        }
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

// Actualizar usuario - Removemos checkRole para permitir la actualización
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email } = req.body;
        
        // Verificar si el usuario existe
        const [existingUser] = await db.query('SELECT id FROM usuarios WHERE id = ?', [id]);
        if (existingUser.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        // Verificar que el usuario autenticado sea el mismo que se está actualizando o sea admin
        if (req.user.rol !== 1 && req.user.id !== parseInt(id)) {
            return res.status(403).json({ error: 'No autorizado para actualizar este usuario' });
        }
        
        const [result] = await db.query(
            'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?',
            [nombre, email, id]
        );
        
        res.json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar usuario - Removemos checkRole para permitir la eliminación
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar si el usuario existe
        const [existingUser] = await db.query('SELECT id FROM usuarios WHERE id = ?', [id]);
        if (existingUser.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        // Verificar que el usuario autenticado sea el mismo que se está eliminando o sea admin
        if (req.user.rol !== 1 && req.user.id !== parseInt(id)) {
            return res.status(403).json({ error: 'No autorizado para eliminar este usuario' });
        }
        
        const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
        
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: API para gestión de usuarios - Sistema de autenticación y autorización
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nombre
 *         - email
 *         - password
 *         - rol
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del usuario (auto-generado)
 *           example: 1
 *         nombre:
 *           type: string
 *           description: Nombre completo del usuario
 *           example: "Juan Pérez"
 *         email:
 *           type: string
 *           format: email
 *           description: Email único del usuario (usado para login)
 *           example: "juan@example.com"
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario (mínimo 8 caracteres)
 *           example: "contraseña123"
 *         rol:
 *           type: integer
 *           enum: [1, 2]
 *           description: Rol del usuario (1 = admin, 2 = usuario normal)
 *           example: 2
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensaje de error
 */

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
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario registrado"
 *                 userId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 * 
 *   get:
 *     summary: Obtiene lista de usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado - Token no proporcionado
 *       403:
 *         description: Prohibido - No tiene permisos de administrador
 * 
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
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
 *                 format: email
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No tiene permisos
 *       404:
 *         description: Usuario no encontrado
 * 
 *   delete:
 *     summary: Elimina un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No tiene permisos
 *       404:
 *         description: Usuario no encontrado
 */
