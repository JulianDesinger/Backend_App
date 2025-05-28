const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Deividlopez-2006',
    database: 'burger_shop',
    charset: 'utf8mb4', // evita errores de codificación
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Función para probar la conexión
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión exitosa a la base de datos');
        connection.release();
        return true;
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error.message);
        return false;
    }
}

// Probar la conexión al iniciar
testConnection();

module.exports = pool;
