const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Secreto para el token (guárdalo bien)
const SECRET = 'tu_secreto_super_seguro';

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
