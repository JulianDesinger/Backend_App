// Importamos el módulo jsonwebtoken para manejar los tokens JWT
const jwt = require('jsonwebtoken');
// Importamos express-rate-limit para controlar la cantidad de solicitudes
const rateLimit = require('express-rate-limit');

// Configuración del limitador de solicitudes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Ventana de tiempo de 15 minutos en milisegundos
    max: 100 // Máximo de 100 solicitudes por IP en cada ventana de tiempo
});

// Middleware para verificar la autenticación mediante JWT
const authenticateToken = (req, res, next) => {
    // Obtenemos el header de autorización
    const authHeader = req.headers['authorization'];
    // Extraemos el token del header (formato: 'Bearer TOKEN')
    const token = authHeader && authHeader.split(' ')[1];

    // Si no hay token, devolvemos error 401 (No autorizado)
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    // Verificamos la validez del token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // Si hay error en la verificación, devolvemos error 403 (Prohibido)
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        // Si el token es válido, guardamos la información del usuario en la request
        req.user = user;
        // Continuamos con la siguiente función middleware
        next();
    });
};

// Middleware para verificar los roles del usuario
const checkRole = (roles) => {
    return (req, res, next) => {
        // Verificamos si existe un usuario autenticado
        if (!req.user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        // Verificamos si el rol del usuario está incluido en los roles permitidos
        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
        }
        // Si el rol es válido, continuamos con la siguiente función middleware
        next();
    };
};

// Exportamos los middlewares para su uso en otras partes de la aplicación
module.exports = { limiter, authenticateToken, checkRole };