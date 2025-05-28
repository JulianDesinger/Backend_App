// Importamos las dependencias necesarias
const request = require('supertest');
const app = require('../../app');

// Grupo de pruebas para validar duplicados y roles
describe('Pruebas de duplicados y roles', () => {
  // Prueba para verificar que no se pueden crear usuarios con email duplicado
  test('Validar email duplicado', async () => {
    // Creamos el primer usuario
    const usuario1 = {
      nombre: 'TestUser1',
      email: 'test@example.com',
      password: '12345678',
      rol: 1
    };

    // Registramos el primer usuario
    await request(app)
      .post('/api/usuarios')
      .send(usuario1);

    // Intentamos crear un segundo usuario con el mismo email
    const usuario2 = {
      nombre: 'TestUser2',
      email: 'test@example.com', // Email duplicado
      password: '87654321',
      rol: 1
    };

    // Verificamos que la creación del segundo usuario falle
    const response = await request(app)
      .post('/api/usuarios')
      .send(usuario2);

    // Comprobamos que se reciba un error 400
    expect(response.status).toBe(400);
    // Verificamos el mensaje de error específico
    expect(response.body.error).toContain('email ya existe');
  });

  // Prueba para verificar que se rechacen roles inválidos
  test('Validar rol inválido', async () => {
    // Intentamos crear un usuario con un rol que no existe
    const datosInvalidos = {
      nombre: 'TestUser',
      email: 'test@example.com',
      password: '12345678',
      rol: 999 // Rol inexistente
    };

    // Realizamos la petición
    const response = await request(app)
      .post('/api/usuarios')
      .send(datosInvalidos);

    // Verificamos que se rechace con error 400
    expect(response.status).toBe(400);
    // Comprobamos que exista un mensaje de error
    expect(response.body.error).toBeDefined();
  });
});