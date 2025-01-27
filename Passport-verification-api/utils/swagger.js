import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const setupSwagger = (app) => {
  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Passport Verification API",
        version: "1.0.0",
        description: "API documentation for the Passport Verification system.",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
    servers: [
      {
        url: "http://localhost:3003/api",
        description: "Development server",
      },
    ],
    apis: ["./routes/*.js"], // Include all route files for Swagger documentation
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);

  // No need for custom authAction in this case
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
