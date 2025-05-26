const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Oracle123',//esta es mi contraseña
    database: 'burger_shop',
    charset: 'utf8mb4', // evita errores de codificación
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
