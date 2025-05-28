// Importamos supertest para realizar pruebas de API
const request = require('supertest');
// Importamos nuestra aplicación Express
const app = require('../../app');

// Grupo de pruebas para validaciones de usuario
describe('Pruebas de validaciones de usuario', () => {
  // Prueba para verificar que se rechaza un email con formato inválido
  test('Validar formato de email incorrecto', async () => {
    const datosInvalidos = {
      nombre: 'TestUser',
      email: 'emailinvalido', // Email sin formato correcto (@)
      password: '12345678',
      rol: 1
    };

    // Realizamos una petición POST al endpoint de creación de usuarios
    const response = await request(app)
      .post('/api/usuarios')
      .send(datosInvalidos);

    // Verificamos que la respuesta sea un error 400 (Bad Request)
    expect(response.status).toBe(400);
    // Verificamos que existan errores en el cuerpo de la respuesta
    expect(response.body.errors).toBeDefined();
  });

  // Prueba para verificar que se rechaza una contraseña demasiado corta
  test('Validar contraseña muy corta', async () => {
    const datosInvalidos = {
      nombre: 'TestUser',
      email: 'test@example.com',
      password: '123', // Contraseña demasiado corta
      rol: 1
    };

    // Realizamos una petición POST al endpoint de creación de usuarios
    const response = await request(app)
      .post('/api/usuarios')
      .send(datosInvalidos);

    // Verificamos que la respuesta sea un error 400 (Bad Request)
    expect(response.status).toBe(400);
    // Verificamos que existan errores en el cuerpo de la respuesta
    expect(response.body.errors).toBeDefined();
  });

  // Prueba para verificar que se rechaza un nombre de usuario vacío
  test('Validar nombre de usuario vacío', async () => {
    const datosInvalidos = {
      nombre: '', // Nombre vacío
      email: 'test@example.com',
      password: '12345678',
      rol: 1
    };

    // Realizamos una petición POST al endpoint de creación de usuarios
    const response = await request(app)
      .post('/api/usuarios')
      .send(datosInvalidos);

    // Verificamos que la respuesta sea un error 400 (Bad Request)
    expect(response.status).toBe(400);
    // Verificamos que existan errores en el cuerpo de la respuesta
    expect(response.body.errors).toBeDefined();
  });
});