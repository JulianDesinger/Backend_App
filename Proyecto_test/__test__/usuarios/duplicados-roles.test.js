const request = require('supertest');
const app = require('../../app');

describe('Pruebas de duplicados y roles', () => {
  test('Validar email duplicado', async () => {
    const usuario1 = {
      nombre: 'TestUser1',
      email: 'test@example.com',
      password: '12345678',
      rol: 1
    };

    await request(app)
      .post('/api/usuarios')
      .send(usuario1);

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
      rol: 999
    };

    const response = await request(app)
      .post('/api/usuarios')
      .send(datosInvalidos);

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});