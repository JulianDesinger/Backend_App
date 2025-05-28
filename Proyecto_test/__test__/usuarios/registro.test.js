// Importamos las dependencias necesarias
const db = require('../../config/database');
const bcrypt = require('bcrypt');
const request = require('supertest');
const app = require('../../app');

// Grupo de pruebas para el registro de usuarios
describe('Pruebas de registro de usuario', () => {
  // Después de cada prueba, limpiamos los usuarios de prueba
  afterEach(async () => {
    await db.query('DELETE FROM usuarios WHERE email LIKE ?', ['test%']);
  });

  // Prueba para registrar un usuario y mostrar todos los usuarios
  test('Registrar usuario e imprimir todos los registrados', async () => {
    // Preparamos los datos del usuario
    const nombre = 'RiveraOF';
    const email = `RiveraOF${Date.now()}@example.com`; // Email único
    const password = await bcrypt.hash('12345678', 10); // Encriptamos la contraseña
    const rol = 2;

    // Insertamos el usuario en la base de datos
    const [registro] = await db.query(`
      INSERT INTO usuarios (nombre, email, contraseña, rol_id)
      VALUES (?, ?, ?, ?)`,
      [nombre, email, password, rol]
    );

    // Consultamos todos los usuarios
    const [usuarios] = await db.query(`
      SELECT id, nombre, email, rol_id FROM usuarios
    `);

    // Mostramos los usuarios en la consola
    console.log('📋 Usuarios registrados:');
    console.table(usuarios);

    // Verificamos que existan usuarios en la base de datos
    expect(usuarios.length).toBeGreaterThan(0);
  });
});