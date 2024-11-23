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
                url: 'http://localhost:7777', // 로컬 개발 서버 URL
                description: 'Local Server',
            },
            {
                url: 'http://43.202.172.0:7777/', // 배포 서버 URL
                description: 'Production Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT 인증이 필요합니다. 토큰을 입력하세요.',
                },
            },
        },
        security: [
            {
                bearerAuth: [], // 인증을 모든 API에 적용하려면 이 섹션 추가
            },
        ],
    },
    apis: ['./routes/*.js'], // API 경로에서 주석을 스캔
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
