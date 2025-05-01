const express = require('express');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const swaggerDocumentation = require('./generate-swagger.json'); // Asegúrate de que esté en la raíz o cambia la ruta
const db = require('./config/database');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Swagger docs disponibles en /api-docs
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocumentation));
app.use('/document', swaggerUI.serve, swaggerUI.setup(swaggerDocumentation));
// Rutas de autenticación (registro/login)
const userRoutes = require('./routes/users');
app.use('/api/auth', userRoutes);

// Rutas de gestión de usuarios (listar, registrar)
const usuariosRoutes = require('./routes/usuarios');
app.use('/api/usuarios', usuariosRoutes);

// Ruta de prueba
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

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
  console.log(`📚 Documentación Swagger en http://localhost:${PORT}/api-docs`);
});

module.exports = app;
