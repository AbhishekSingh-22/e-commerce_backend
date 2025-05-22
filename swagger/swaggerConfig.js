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
          required: ['name','email', 'password'],
          properties: {
            name: { type: 'string', example: 'dummyUser'},
            email: { type: 'string', example: 'user@example.com' },
            password: { type: 'string', example: 'secret123' },
            address: {type: 'string', example: 'Building NewPeace, Big Lane, India'},
            phone: {type: 'string', example: '9931458341'},
            role: {type: 'string', example: 'customer'}
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js']
});
