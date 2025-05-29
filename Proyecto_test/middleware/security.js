const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT token de autenticación
 */

/**
 * Middleware de rate limiting para prevenir ataques de fuerza bruta
 * Limita las solicitudes a 100 por ventana de 15 minutos
 */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de 100 solicitudes por ventana
});

/**
 * Middleware de autenticación JWT
 * Verifica la presencia y validez del token en el header Authorization
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 * @returns {Object} Error 401 si no hay token, 403 si el token es inválido
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, 'tu_secreto_super_seguro', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

/**
 * Middleware de validación de roles
 * Verifica que el usuario tenga el rol requerido para acceder a la ruta
 * @param {Array} roles - Array de roles permitidos (1 = admin, 2 = cliente)
 * @returns {Function} Middleware de Express
 */
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        // Permitir coincidencia si el rol es string o número
        if (!roles.includes(req.user.rol) && !roles.includes(Number(req.user.rol))) {
            console.log('Rol recibido en token:', req.user.rol, 'Roles permitidos:', roles);
            return res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
        }
        next();
    };
};

module.exports = { limiter, authenticateToken, checkRole };