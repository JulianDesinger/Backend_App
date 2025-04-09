const { obtenerCombos } = require('../models/combos');

describe('Test de combos', () => {
  test('Debe obtener combos de la base de datos', async () => {
    const combos = await obtenerCombos();
    console.log('Combos:', combos);
    expect(Array.isArray(combos)).toBe(true);
  });
});
