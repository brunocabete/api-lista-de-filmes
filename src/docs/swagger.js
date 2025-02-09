const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Lista de Filmes API',
  },
  host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ['../index.ts'];

swaggerAutogen(outputFile, routes, doc);