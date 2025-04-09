// Importa la conexión a la base de datos desde la configuración (usando Promesas)
const db = require('../config/database');

// Define una función asíncrona para obtener los combos del sistema
async function obtenerCombos() {
    // Ejecuta una consulta SQL para obtener los combos
    // Se selecciona el nombre del menú, la hamburguesa, la bebida y el precio total
    const [rows] = await db.query(`
        SELECT 
            m.nombre AS menu,           -- Nombre del combo (menú)
            b.nombre AS hamburguesa,    -- Nombre de la hamburguesa incluida
            be.nombre AS bebida,        -- Nombre de la bebida incluida
            m.precio_total              -- Precio total del combo
        FROM menus m
        JOIN menu_items mi ON m.id = mi.menu_id        -- Relación entre menú y sus ítems
        JOIN burgers b ON mi.burger_id = b.id          -- Une con la tabla de hamburguesas
        JOIN bebidas be ON mi.bebida_id = be.id;       -- Une con la tabla de bebidas
    `);

    // Retorna el resultado de la consulta (un arreglo de combos)
    return rows;
}

// Exporta la función para que pueda usarse en otras partes del proyecto (por ejemplo, en rutas o tests)
module.exports = { obtenerCombos };
