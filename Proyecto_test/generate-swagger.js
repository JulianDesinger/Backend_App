

import swaggerAutogen from 'swagger-autogen';
import glob from 'glob';

// Crear instancia del generador
const generateSwagger = swaggerAutogen();

// Archivo de salida y búsqueda automática de endpoints en la carpeta routes
const outputFile = './swagger.json';
const endpointsFiles = glob.sync('./routes/*.js');

// Configuración adicional de la documentación
const doc = {
  info: {
    title: 'API BURGERS',
    description: 'Esta API sirve para gestionar un sitio web local',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Token JWT con formato: Bearer <token>',
    },
  },
};

// Verificar que existan rutas antes de generar
if (endpointsFiles.length === 0) {
  console.error('❌ No se encontraron archivos de rutas en ./routes/*.js');
  process.exit(1);
}

// Mostrar archivos detectados
console.log('Endpoints detectados:', endpointsFiles);

// Generar swagger.json
generateSwagger(outputFile, endpointsFiles, doc)
  .then(() => {
    console.log('✅ swagger.json generado correctamente');
  })
  .catch((err) => {
    console.error('❌ Error generando Swagger:', err);
    process.exit(1);
  });
