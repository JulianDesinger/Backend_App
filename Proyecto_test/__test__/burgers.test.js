const request = require('supertest');
const app = require('../app');
const mysql = require('mysql2/promise');

let connection;

beforeAll(async () => {
  connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root', // Ajusta según tu configuración
    password: '', // Ajusta según tu configuración
    database: 'burger_shop'
  });
});

afterAll(async () => {
  await connection.end(); // Cierra la conexión a MySQL
});

test('GET /api/burgers should return a burger', async () => {
  const [rows] = await connection.query('SELECT * FROM burgers LIMIT 1');

  console.log('Hamburguesa obtenida:', rows[0]); // Imprime en consola

  expect(rows.length).toBeGreaterThan(0); // Asegura que hay al menos 1 hamburguesa
});


