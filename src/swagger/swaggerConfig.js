import swaggerJsdoc from 'swagger-jsdoc';

export default swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Fake E-Commerce API', version: '1.0.0' },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        UserCredentials: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'user@example.com' },
            password: { type: 'string', example: 'secret123' }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }],
    servers: [{ url: 'http://localhost:3000' }]
  },
  apis: ['./src/routes/*.js']
});
