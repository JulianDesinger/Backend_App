const request = require('supertest');
const app = require('../../app');
const db = require('../../config/database');

describe('Pruebas de validaciones de usuario', () => {
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
});

afterAll(async () => {
  await db.end();
});