import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger definition for documentation
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'User Management API',
      version: '1.0.0',
      description: 'User Management Microservice for Houddle',
      contact: {
        name: 'Houddle Team',
        url: 'https://houddle.com',
        email: 'support@houddle.com',
      },
    },
    basePath: '/',
  },
  apis: ['./routes/*.js', './controllers/*.js'], // Files containing annotations
};

// Initialize Swagger JSdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Set up Swagger UI with the generated documentation
const setupSwaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export { setupSwaggerDocs };
