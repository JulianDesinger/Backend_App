const db = require('../config/database');
const bcrypt = require('bcrypt');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');

describe('Pruebas de usuarios', () => {
  // Limpiar la base de datos después de cada prueba
  afterEach(async () => {
    await db.query('DELETE FROM usuarios WHERE email LIKE ?', ['test%']);
  });

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

  test('Validar formato de email incorrecto', async () => {
    const datosInvalidos = {
      nombre: 'TestUser',
      email: 'emailinvalido',
      password: '12345678',
      rol: 1
    };

    const response = await request(app)
      .post('/api/usuarios')
      .send(datosInvalidos);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  test('Validar contraseña muy corta', async () => {
    const datosInvalidos = {
      nombre: 'TestUser',
      email: 'test@example.com',
      password: '123',
      rol: 1
    };

    const response = await request(app)
      .post('/api/usuarios')
      .send(datosInvalidos);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  test('Validar nombre de usuario vacío', async () => {
    const datosInvalidos = {
      nombre: '',
      email: 'test@example.com',
      password: '12345678',
      rol: 1
    };

    const response = await request(app)
      .post('/api/usuarios')
      .send(datosInvalidos);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  test('Validar email duplicado', async () => {
    // Primer usuario
    const usuario1 = {
      nombre: 'TestUser1',
      email: 'test@example.com',
      password: '12345678',
      rol: 1
    };

    await request(app)
      .post('/api/usuarios')
      .send(usuario1);

    // Intentar registrar segundo usuario con mismo email
    const usuario2 = {
      nombre: 'TestUser2',
      email: 'test@example.com',
      password: '87654321',
      rol: 1
    };

    const response = await request(app)
      .post('/api/usuarios')
      .send(usuario2);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('email ya existe');
  });

  test('Validar rol inválido', async () => {
    const datosInvalidos = {
      nombre: 'TestUser',
      email: 'test@example.com',
      password: '12345678',
      rol: 999 // Rol que no existe
    };

    const response = await request(app)
      .post('/api/usuarios')
      .send(datosInvalidos);

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test('Validar token expirado', async () => {
    const token = jwt.sign({ rol: 1 }, 'tu_secreto_super_seguro', { expiresIn: '1ms' });
    
    // Esperamos un momento para que expire el token
    await new Promise(resolve => setTimeout(resolve, 2));

    const response = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body.error).toContain('Token inválido');
  });
});
