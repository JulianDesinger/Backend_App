const db = require('../config/database');

// Obtener todos los menús disponibles
async function obtenerMenus() {
    const [menus] = await db.query(`
        SELECT 
            m.id,
            m.nombre AS menu,
            b.nombre AS hamburguesa,
            be.nombre AS bebida,
            m.precio_total
        FROM menus m
        JOIN menu_items mi ON m.id = mi.menu_id
        JOIN burgers b ON mi.burger_id = b.id
        JOIN bebidas be ON mi.bebida_id = be.id
    `);
    return menus;
}

// Obtener un menú específico por ID
async function obtenerMenuPorId(id) {
    const [menus] = await db.query(`
        SELECT 
            m.id,
            m.nombre AS menu,
            b.nombre AS hamburguesa,
            be.nombre AS bebida,
            m.precio_total
        FROM menus m
        JOIN menu_items mi ON m.id = mi.menu_id
        JOIN burgers b ON mi.burger_id = b.id
        JOIN bebidas be ON mi.bebida_id = be.id
        WHERE m.id = ?
    `, [id]);
    return menus[0];
}

// Crear un nuevo menú
async function crearMenu(nombre, precio_total, burger_id, bebida_id) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            'INSERT INTO menus (nombre, precio_total) VALUES (?, ?)',
            [nombre, precio_total]
        );
        const menuId = result.insertId;

        await connection.query(
            'INSERT INTO menu_items (menu_id, burger_id, bebida_id) VALUES (?, ?, ?)',
            [menuId, burger_id, bebida_id]
        );

        await connection.commit();
        connection.release();
        return menuId;
    } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
    }
}

// Actualizar un menú existente
async function actualizarMenu(id, nombre, precio_total, burger_id, bebida_id) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query(
            'UPDATE menus SET nombre = ?, precio_total = ? WHERE id = ?',
            [nombre, precio_total, id]
        );

        await connection.query(
            'UPDATE menu_items SET burger_id = ?, bebida_id = ? WHERE menu_id = ?',
            [burger_id, bebida_id, id]
        );

        await connection.commit();
        connection.release();
        return true;
    } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
    }
}

// Eliminar un menú
async function eliminarMenu(id) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query('DELETE FROM menu_items WHERE menu_id = ?', [id]);
        await connection.query('DELETE FROM menus WHERE id = ?', [id]);

        await connection.commit();
        connection.release();
        return true;
    } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
    }
}

module.exports = {
    obtenerMenus,
    obtenerMenuPorId,
    crearMenu,
    actualizarMenu,
    eliminarMenu
}; 