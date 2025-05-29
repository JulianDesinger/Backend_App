const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Importa la conexión
const { authenticateToken, checkRole } = require('../middleware/security');

/**
 * @swagger
 * tags:
 *   name: Hamburguesas
 *   description: API para gestión de hamburguesas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Burger:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la hamburguesa
 *           example: 1
 *         nombre:
 *           type: string
 *           description: Nombre de la hamburguesa
 *           example: "Cheeseburger"
 *         descripcion:
 *           type: string
 *           description: Descripción detallada de la hamburguesa
 *           example: "Hamburguesa con queso cheddar, lechuga, tomate y salsa especial"
 *         precio:
 *           type: number
 *           format: float
 *           description: Precio de la hamburguesa
 *           example: 5.99
 *         imagen:
 *           type: string
 *           description: URL de la imagen de la hamburguesa
 *           example: "https://ejemplo.com/cheeseburger.jpg"
 */

/**
 * @swagger
 * /api/burgers:
 *   get:
 *     summary: Obtiene todas las hamburguesas
 *     tags: [Hamburguesas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de hamburguesas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Burger'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * Ruta para obtener todas las hamburguesas
 * Accesible para admin (1) y cliente (2)
 * @route GET /api/burgers
 * @access Privado - Requiere autenticación
 */
router.get('/', authenticateToken, checkRole([1, 2]), async (req, res) => {
    try {
        const [burgers] = await db.query('SELECT * FROM burgers');
        res.json(burgers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
