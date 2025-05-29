const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Secreto para el token (guárdalo bien)
const SECRET = 'tu_secreto_super_seguro';

/**
 * Registra un nuevo usuario en el sistema
 * @param {Object} req - Objeto request de Express
 * @param {Object} req.body - Cuerpo de la petición
 * @param {string} req.body.nombre - Nombre completo del usuario
 * @param {string} req.body.email - Email único del usuario
 * @param {string} req.body.contraseña - Contraseña del usuario
 * @param {number} req.body.rol - Rol del usuario (1 = admin, 2 = cliente)
 * @param {Object} res - Objeto response de Express
 * @returns {Object} Respuesta con mensaje de éxito y datos del usuario
 */
exports.registrar = async (req, res) => {
    const { nombre, email, contraseña, rol } = req.body;
    try {
        // Encriptar contraseña
        const hash = await bcrypt.hash(contraseña, 10);

        const [result] = await db.query(`
            INSERT INTO usuarios (nombre, email, contraseña, rol_id)
            VALUES (?, ?, ?, ?)
        `, [nombre, email, hash, rol]);

        // Determinar el nombre del rol
        let nombreRol = '';
        if (rol == 1) nombreRol = 'admin';
        else if (rol == 2) nombreRol = 'cliente';
        else nombreRol = `rol ${rol}`;

        res.status(201).json({ message: `Usuario registrado como ${nombreRol}`, id: result.insertId, rol: nombreRol });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Autentica un usuario y genera un token JWT
 * @param {Object} req - Objeto request de Express
 * @param {Object} req.body - Cuerpo de la petición
 * @param {string} req.body.email - Email del usuario
 * @param {string} req.body.contraseña - Contraseña del usuario
 * @param {Object} res - Objeto response de Express
 * @returns {Object} Respuesta con token JWT y datos del usuario
 * @throws {Error} 404 si el usuario no existe
 * @throws {Error} 401 si la contraseña es incorrecta
 */
exports.login = async (req, res) => {
    const { email, contraseña } = req.body;
    try {
        const [usuarios] = await db.query(`SELECT * FROM usuarios WHERE email = ?`, [email]);

        if (usuarios.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const usuario = usuarios[0];

        // Validar contraseña
        const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!esValida) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Crear token
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol_id },
            SECRET,
            { expiresIn: '2h' }
        );

        // Determinar el nombre del rol
        let nombreRol = '';
        if (usuario.rol_id == 1) nombreRol = 'admin';
        else if (usuario.rol_id == 2) nombreRol = 'cliente';
        else nombreRol = `rol ${usuario.rol_id}`;

        res.json({ message: 'Login exitoso', token, rol: nombreRol });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
