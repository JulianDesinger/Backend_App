const express = require('express');
const path = require('path');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { limiter } = require('./middleware/security');
const app = express();
const db = require('./config/database');

// Middleware de seguridad
app.use(helmet()); // Protección de cabeceras HTTP
app.use(limiter); // Rate limiting
app.use(express.json({ limit: '10kb' })); // Limitar tamaño del payload

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

// Ruta para verificar la conexión a la base de datos
app.get('/api/test-connection', async (req, res) => {
  try {
    const [result] = await db.query('SELECT 1');
    res.json({ 
      status: 'success', 
      message: 'Conexión a la base de datos establecida correctamente',
      result: result
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Error al conectar con la base de datos',
      error: error.message 
    });
  }
});

// Configuración de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        requestId: req.id // Para seguimiento de errores
    });
});

module.exports = app;
