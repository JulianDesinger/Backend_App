const db = require('../config/database');

async function crearUsuario(nombre, email, contraseña, rol_id) {
    const [result] = await db.query(
        'INSERT INTO usuarios (nombre, email, contraseña, rol_id) VALUES (?, ?, ?, ?)',
        [nombre, email, contraseña, rol_id]
    );
    return result.insertId;
}

async function buscarPorEmail(email) {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0];
}

module.exports = { crearUsuario, buscarPorEmail };
