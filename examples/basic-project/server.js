const { createSwaggerServer } = require('swaglex');
const path = require('path');

// Basic Swaglex server setup
const server = createSwaggerServer({
  specPath: path.join(__dirname, 'api', 'openapi.yaml'),
  port: 3001
});

// Start the server
server.start();