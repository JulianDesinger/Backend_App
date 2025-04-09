const db = require('../config/database');
const bcrypt = require('bcrypt');

async function registrarUsuario(nombre, email, password, rolNombre = 'cliente') {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [roles] = await db.query('SELECT id FROM roles WHERE nombre = ?', [rolNombre]);
    if (roles.length === 0) throw new Error('Rol no encontrado');

    const rolId = roles[0].id;

    const [result] = await db.query(
        'INSERT INTO usuarios (nombre, email, contraseña, rol_id) VALUES (?, ?, ?, ?)',
        [nombre, email, hashedPassword, rolId]
    );

    return result;
}

async function obtenerUsuarios() {
    const [usuarios] = await db.query(`
        SELECT u.id, u.nombre, u.email, r.nombre AS rol
        FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
    `);
    return usuarios;
}

module.exports = {
    registrarUsuario,
    obtenerUsuarios
};
