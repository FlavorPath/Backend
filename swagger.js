const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API Documentation',
            version: '1.0.0',
            description: 'API documentation for my project',
        },
        servers: [
            {
                url: 'http://43.202.172.0:7777',
                description: 'Production Server',
            },
            {
                url: 'http://localhost:7777',
                description: 'Local Server',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.js'], // API 주석 경로
};


const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
