// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';
// import dotenv from 'dotenv';

// dotenv.config();

// const API_URL = process.env.API_URL;

// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'DL Suspension API',
//       version: '1.0.0',
//       description: 'Driving License Suspension Recommendation Proccess',
//     },
//     servers: [
//       {
//         url: API_URL,
//         description: 'Development server',
//       },
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: 'http',
//           scheme: 'bearer',
//           bearerFormat: 'JWT',
//         },
//       },
//     },
//     security: [{
//       bearerAuth: [],
//     }],
//   },
//   apis: ['./routes/*.js'],
// };

// const specs = swaggerJsdoc(options);

// export { swaggerUi, specs };


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