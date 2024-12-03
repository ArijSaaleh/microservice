import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Swagger definition for documentation
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Management API",
      version: "1.0.0",
      description: "API documentation for user management microservice",
    },
    servers: [
      {
        url: "http://localhost:4000", // Change if using a different base URL
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"], // Adjust to your file structure
};
// Initialize Swagger JSdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Set up Swagger UI with the generated documentation
const setupSwaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export { setupSwaggerDocs };
