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
    apis: ["./routes/*.js"], // Include all route files for Swagger documentation
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);

  // Set up the Swagger UI at /api-docs
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;