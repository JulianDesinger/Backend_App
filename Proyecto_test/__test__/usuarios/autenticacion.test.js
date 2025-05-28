// Importamos jsonwebtoken para manejar tokens JWT
const jwt = require('jsonwebtoken');
// Importamos supertest para realizar pruebas de API
const request = require('supertest');
// Importamos nuestra aplicación Express
const app = require('../../app');

// Grupo de pruebas relacionadas con la autenticación
describe('Pruebas de autenticación', () => {
  // Prueba para verificar el comportamiento con un token expirado
  test('Validar token expirado', async () => {
    // Creamos un token que expira en 1 milisegundo
    const token = jwt.sign({ rol: 1 }, 'tu_secreto_super_seguro', { expiresIn: '1ms' });
    
    // Esperamos 2ms para asegurarnos que el token expire
    await new Promise(resolve => setTimeout(resolve, 2));

    // Intentamos hacer una petición GET con el token expirado
    const response = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${token}`);

    // Verificamos que se rechace la petición con código 403
    expect(response.status).toBe(403);
    // Verificamos que el mensaje de error sea el esperado
    expect(response.body.error).toContain('Token inválido');
  });
});