const express = require('express');
const router = express.Router();
const { authenticateToken, checkRole } = require('../middleware/security');
const { obtenerMenus, obtenerMenuPorId, crearMenu, actualizarMenu, eliminarMenu } = require('../controllers/menuController');

/**
 * @swagger
 * tags:
 *   name: Menú
 *   description: API para gestión de menús
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Menu:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del menú
 *           example: 1
 *         menu:
 *           type: string
 *           description: Nombre del menú
 *           example: "Combo Clásico"
 *         hamburguesa:
 *           type: string
 *           description: Nombre de la hamburguesa incluida
 *           example: "Cheeseburger"
 *         bebida:
 *           type: string
 *           description: Nombre de la bebida incluida
 *           example: "Coca-Cola"
 *         precio_total:
 *           type: number
 *           format: float
 *           description: Precio total del menú
 *           example: 7.49
 *     MenuInput:
 *       type: object
 *       required:
 *         - nombre
 *         - precio_total
 *         - burger_id
 *         - bebida_id
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del menú
 *           example: "Combo Clásico"
 *         precio_total:
 *           type: number
 *           format: float
 *           description: Precio total del menú
 *           example: 7.49
 *         burger_id:
 *           type: integer
 *           description: ID de la hamburguesa
 *           example: 1
 *         bebida_id:
 *           type: integer
 *           description: ID de la bebida
 *           example: 1
 */

/**
 * @swagger
 * /api/menu:
 *   get:
 *     summary: Obtiene todos los menús
 *     tags: [Menú]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de menús obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos
 *   post:
 *     summary: Crea un nuevo menú
 *     tags: [Menú]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuInput'
 *     responses:
 *       201:
 *         description: Menú creado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos
 * 
 * /api/menu/{id}:
 *   get:
 *     summary: Obtiene un menú específico
 *     tags: [Menú]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del menú
 *     responses:
 *       200:
 *         description: Menú obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos
 *       404:
 *         description: Menú no encontrado
 *   put:
 *     summary: Actualiza un menú existente
 *     tags: [Menú]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del menú
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuInput'
 *     responses:
 *       200:
 *         description: Menú actualizado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos
 *       404:
 *         description: Menú no encontrado
 *   delete:
 *     summary: Elimina un menú
 *     tags: [Menú]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del menú
 *     responses:
 *       200:
 *         description: Menú eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos
 *       404:
 *         description: Menú no encontrado
 */

/**
 * Ruta para obtener todos los menús.
 * Accesible para admin (1) y cliente (2).
 */
router.get('/', authenticateToken, checkRole([1, 2]), async (req, res) => {
    try {
        const menus = await obtenerMenus();
        res.json(menus);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Ruta para crear un nuevo menú.
 * Solo accesible para admin (1).
 */
router.post('/', authenticateToken, checkRole([1]), async (req, res) => {
    try {
        const { nombre, precio_total, burger_id, bebida_id } = req.body;
        const menuId = await crearMenu(nombre, precio_total, burger_id, bebida_id);
        res.status(201).json({ message: 'Menú creado exitosamente', menuId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Ruta para obtener un menú específico por ID.
 * Accesible para admin (1) y cliente (2).
 */
router.get('/:id', authenticateToken, checkRole([1, 2]), async (req, res) => {
    try {
        const menu = await obtenerMenuPorId(req.params.id);
        if (!menu) {
            return res.status(404).json({ error: 'Menú no encontrado' });
        }
        res.json(menu);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Ruta para actualizar un menú existente.
 * Solo accesible para admin (1).
 */
router.put('/:id', authenticateToken, checkRole([1]), async (req, res) => {
    try {
        const { nombre, precio_total, burger_id, bebida_id } = req.body;
        const menu = await obtenerMenuPorId(req.params.id);
        if (!menu) {
            return res.status(404).json({ error: 'Menú no encontrado' });
        }
        await actualizarMenu(req.params.id, nombre, precio_total, burger_id, bebida_id);
        res.json({ message: 'Menú actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Ruta para eliminar un menú.
 * Solo accesible para admin (1).
 */
router.delete('/:id', authenticateToken, checkRole([1]), async (req, res) => {
    try {
        const menu = await obtenerMenuPorId(req.params.id);
        if (!menu) {
            return res.status(404).json({ error: 'Menú no encontrado' });
        }
        await eliminarMenu(req.params.id);
        res.json({ message: 'Menú eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 