const db = require('../../config/database');
const bcrypt = require('bcrypt');
const request = require('supertest');
const app = require('../../app');

describe('Pruebas de registro de usuario', () => {
  afterEach(async () => {
    await db.query('DELETE FROM usuarios WHERE email LIKE ?', ['test%']);
  });

  test('Registrar usuario e imprimir todos los registrados', async () => {
    const nombre = 'RiveraOF';
    const email = `RiveraOF${Date.now()}@example.com`;
    const password = await bcrypt.hash('123456', 10);
    const rol = 1;

    const [registro] = await db.query(`
      INSERT INTO usuarios (nombre, email, contraseña, rol_id)
      VALUES (?, ?, ?, ?)`,
      [nombre, email, password, rol]
    );

    const [usuarios] = await db.query(`
      SELECT id, nombre, email, rol_id FROM usuarios
    `);

    console.log('📋 Usuarios registrados:');
    console.table(usuarios);

    expect(usuarios.length).toBeGreaterThan(0);
  });
});

afterAll(async () => {
  await db.end();
});