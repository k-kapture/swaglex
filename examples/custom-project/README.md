# Custom Blog API Documentation

A highly customized Swaglex server built using individual components for maximum flexibility and control. This example demonstrates advanced usage patterns including custom middleware, authentication, rate limiting, and modular architecture.

## Features

🔧 **Custom Architecture** - Built using individual Swaglex components
🛡️ **Security First** - Helmet, CORS, rate limiting, and authentication
📊 **Request Monitoring** - Morgan logging and custom timing middleware
🗜️ **Performance** - Compression and optimized middleware stack
🔐 **Authentication** - JWT-based auth with Bearer tokens
📝 **Blog API** - Complete blogging platform with articles, comments, and users
🔍 **Search** - Full-text search across content
📈 **Analytics** - Usage statistics and engagement metrics
🎯 **Modular Design** - Separate middleware, routes, and configuration

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser to [http://localhost:3003/docs](http://localhost:3003/docs)

## API Endpoints

### Core API
- `GET /api/articles` - List articles with filtering and pagination
- `POST /api/articles` - Create new article (authenticated)
- `GET /api/articles/{id}` - Get article details
- `GET /api/articles/{id}/comments` - Get article comments
- `POST /api/articles/{id}/comments` - Add comment to article

### User Management
- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/profile` - Update user profile (authenticated)

### Analytics & Search
- `GET /api/analytics` - Get blog analytics (authenticated)
- `GET /api/search` - Search across articles, comments, and users

### Documentation
- `GET /docs` - Interactive Swagger UI
- `GET /spec.json` - OpenAPI specification in JSON
- `GET /spec.yaml` - OpenAPI specification in YAML

### System
- `GET /` - API information and available endpoints
- `GET /api/info` - Detailed API metadata
- `GET /health` - Health check with system metrics

## Authentication

The API uses Bearer token authentication. Include the header:
```
Authorization: Bearer your-jwt-token-here
```

For development, you can use any non-empty token (minimum 10 characters).

## Rate Limiting

- 100 requests per 15-minute window per IP address
- Applied to all `/api/*` routes
- Returns 429 status with retry information

## Middleware Stack

1. **Security** - Helmet for security headers
2. **Compression** - Gzip compression for responses
3. **CORS** - Cross-origin resource sharing
4. **Logging** - Request logging with Morgan
5. **Timing** - Response time tracking
6. **Body Parsing** - JSON and URL-encoded parsing
7. **Rate Limiting** - Request throttling
8. **Routes** - API route handlers
9. **Error Handling** - Centralized error responses

## Custom Features

### Request Logging
All requests are logged with timestamp, method, URL, status, response size, and duration.

### Error Handling
Comprehensive error responses with consistent JSON format:
```json
{
  "error": "Validation Error",
  "message": "Invalid input data provided",
  "code": 400,
  "details": [...],
  "timestamp": "2023-...",
  "path": "/api/articles"
}
```

### Health Checks
Detailed health endpoint with system information:
```json
{
  "status": "ok",
  "timestamp": "2023-...",
  "version": "1.0.0",
  "service": "custom-blog-api",
  "environment": "development",
  "uptime": 3600.5,
  "memory": {...},
  "features": [...]
}
```

## Building Static Site

Generate a static version for deployment:

```bash
node ../../build-static.js --spec ./api/openapi.yaml --output ./dist --title 'Custom API Documentation'
```

## Environment Variables

- `PORT` - Server port (default: 3003)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Allowed CORS origins (comma-separated)

## Development

The server includes development-friendly features:
- Detailed request logging
- CORS for local development
- Mock authentication
- Comprehensive error messages
- System health monitoring

## Architecture

```
server.js              # Main application
├── middleware/custom.js # Custom middleware stack
├── routes/blog.js      # API route handlers
└── api/openapi.yaml    # OpenAPI specification
```

This modular approach allows for easy testing, maintenance, and extension of individual components.