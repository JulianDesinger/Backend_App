const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../../app');

describe('Pruebas de autenticación', () => {
  test('Validar token expirado', async () => {
    const token = jwt.sign({ rol: 1 }, 'tu_secreto_super_seguro', { expiresIn: '1ms' });
    
    await new Promise(resolve => setTimeout(resolve, 2));

    const response = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body.error).toContain('Token inválido');
  });
});