const db = require('../config/database');
const bcrypt = require('bcrypt');

describe('Pruebas de usuarios', () => {
  test('Registrar usuario e imprimir todos los registrados', async () => {
    const nombre = 'RiveraOF';
    const email = `RiveraOF${Date.now()}@example.com`;
    const password = await bcrypt.hash('123456', 10);
    const rol = 1;

    // 👉 Insertar usuario
    const [registro] = await db.query(`
      INSERT INTO usuarios (nombre, email, contraseña, rol_id)
      VALUES (?, ?, ?, ?)`,
      [nombre, email, password, rol]
    );


    // 👉 Consultar todos los usuarios
    const [usuarios] = await db.query(`
      SELECT id, nombre, email, rol_id FROM usuarios
    `);

    console.log('📋 Usuarios registrados:');
    console.table(usuarios);

    // 👉 Asegurarse de que haya al menos uno
    expect(usuarios.length).toBeGreaterThan(0);
  });
});
