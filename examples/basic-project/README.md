# Basic API Documentation

A simple Swaglex API documentation server that demonstrates the basic setup.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser to [http://localhost:3001](http://localhost:3001)

## Features

- Interactive Swagger UI at `/api-docs`
- OpenAPI spec available at `/api-docs.json` and `/api-docs.yaml`
- Health check endpoint at `/health`
- Automatic $ref resolution
- CORS enabled

## API Documentation

This example serves documentation for a simple user management API with endpoints for:
- `GET /users` - Get all users
- `GET /users/{id}` - Get user by ID
- `POST /users/{id}` - Create a new user

## Building Static Site

Swaglex supports building static sites. To generate a static version of the documentation, you can use the build-static.js script from the root directory:

```bash
node ../../build-static.js --spec ./api/openapi.yaml --output ./dist
```

This will create a `dist/` folder with static HTML/CSS/JS files that can be served by any web server.