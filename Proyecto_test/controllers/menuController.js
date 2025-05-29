const db = require('../config/database');

/**
 * Obtiene todos los menús disponibles
 * @returns {Promise<Array>} Lista de menús con sus detalles
 * @throws {Error} Si hay un error al consultar la base de datos
 */
async function obtenerMenus() {
    const [menus] = await db.query(`
        SELECT m.*, b.nombre as hamburguesa, d.nombre as bebida
        FROM menus m
        LEFT JOIN burgers b ON m.burger_id = b.id
        LEFT JOIN drinks d ON m.bebida_id = d.id
    `);
    return menus;
}

/**
 * Obtiene un menú específico por su ID
 * @param {number} id - ID del menú a obtener
 * @returns {Promise<Object>} Detalles del menú
 * @throws {Error} Si hay un error al consultar la base de datos
 */
async function obtenerMenuPorId(id) {
    const [menus] = await db.query(`
        SELECT m.*, b.nombre as hamburguesa, d.nombre as bebida
        FROM menus m
        LEFT JOIN burgers b ON m.burger_id = b.id
        LEFT JOIN drinks d ON m.bebida_id = d.id
        WHERE m.id = ?
    `, [id]);
    return menus[0];
}

/**
 * Crea un nuevo menú
 * @param {string} nombre - Nombre del menú
 * @param {number} precio_total - Precio total del menú
 * @param {number} burger_id - ID de la hamburguesa
 * @param {number} bebida_id - ID de la bebida
 * @returns {Promise<Object>} Resultado de la inserción
 * @throws {Error} Si hay un error al insertar en la base de datos
 */
async function crearMenu(nombre, precio_total, burger_id, bebida_id) {
    const [result] = await db.query(
        'INSERT INTO menus (nombre, precio_total, burger_id, bebida_id) VALUES (?, ?, ?, ?)',
        [nombre, precio_total, burger_id, bebida_id]
    );
    return result;
}

/**
 * Actualiza un menú existente
 * @param {number} id - ID del menú a actualizar
 * @param {string} nombre - Nuevo nombre del menú
 * @param {number} precio_total - Nuevo precio total
 * @param {number} burger_id - Nuevo ID de hamburguesa
 * @param {number} bebida_id - Nuevo ID de bebida
 * @returns {Promise<Object>} Resultado de la actualización
 * @throws {Error} Si hay un error al actualizar en la base de datos
 */
async function actualizarMenu(id, nombre, precio_total, burger_id, bebida_id) {
    const [result] = await db.query(
        'UPDATE menus SET nombre = ?, precio_total = ?, burger_id = ?, bebida_id = ? WHERE id = ?',
        [nombre, precio_total, burger_id, bebida_id, id]
    );
    return result;
}

/**
 * Elimina un menú
 * @param {number} id - ID del menú a eliminar
 * @returns {Promise<Object>} Resultado de la eliminación
 * @throws {Error} Si hay un error al eliminar de la base de datos
 */
async function eliminarMenu(id) {
    const [result] = await db.query('DELETE FROM menus WHERE id = ?', [id]);
    return result;
}

module.exports = {
    obtenerMenus,
    obtenerMenuPorId,
    crearMenu,
    actualizarMenu,
    eliminarMenu
}; 