# Advanced E-Commerce API Documentation

A comprehensive Swaglex API documentation server showcasing advanced features including custom styling, analytics endpoints, and extensive configuration options.

## Features

✨ **Custom Styling** - Beautiful gradient themes and modern UI design
📊 **API Analytics** - Built-in endpoints for API statistics and insights
🔐 **Authentication** - JWT-based authentication with Bearer tokens
🛒 **E-Commerce API** - Complete shopping cart and order management
🎨 **Enhanced UI** - Custom CSS with color-coded HTTP methods
📈 **Health Monitoring** - Detailed health checks with system metrics
🔗 **Custom Routes** - Additional utility endpoints for API exploration

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser to [http://localhost:3002/docs](http://localhost:3002/docs)

## API Endpoints

### Documentation
- `GET /docs` - Interactive Swagger UI
- `GET /api-spec.json` - OpenAPI specification in JSON
- `GET /api-spec.yaml` - OpenAPI specification in YAML

### Analytics & Utilities
- `GET /api/stats` - API statistics and metadata
- `GET /api/paths` - List all API paths and operations
- `GET /api/tags` - API operations grouped by tags
- `GET /api/version` - API version information
- `GET /health` - Health check with system metrics

### Static Files
- `GET /static/*` - Serve static files from `public/` directory

## API Features

This example demonstrates a complete e-commerce API with:

- **User Management**: Registration, login, JWT authentication
- **Product Catalog**: CRUD operations with categories and search
- **Shopping Cart**: Add/remove items, calculate totals
- **Order Processing**: Create orders, track status
- **Security**: Bearer token authentication, role-based access

## Custom Styling

The documentation features:
- Gradient backgrounds for header and containers
- Color-coded HTTP method badges (GET=green, POST=orange, PUT/PATCH=red, DELETE=dark red)
- Modern typography and spacing
- Status code color indicators
- Custom button styling

## Building Static Site

Generate a static version for deployment:

```bash
node ../../build-static.js --spec ./api/openapi.yaml --output ./dist --title 'Advanced API Documentation'
```

## Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3002)

## Development

The server includes development-friendly features:
- Request/response logging
- Development API keys
- Detailed error responses
- CORS enabled for cross-origin requests