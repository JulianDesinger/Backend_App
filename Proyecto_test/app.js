const express = require('express');
const path = require('path');
const app = express();
const db = require('./config/database');

// Middleware
app.use(express.json());

// 👉 Servir archivos estáticos (HTML, CSS, JS) desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// 👉 Rutas para autenticación (registro y login)
const userRoutes = require('./routes/users');
app.use('/api/auth', userRoutes); // POST /api/auth/register y /api/auth/login

// 👉 Rutas para gestión de usuarios (listar, registrar desde admin)
const usuariosRoutes = require('./routes/usuarios');
app.use('/api/usuarios', usuariosRoutes); // GET/POST /api/usuarios

// Ruta para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('¡Servidor funcionando correctamente!');
});

// Ruta para obtener hamburguesas
app.get('/api/burgers', (req, res) => {
  db.query('SELECT * FROM burgers', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    res.status(200).json(results);
  });
});

module.exports = app;
