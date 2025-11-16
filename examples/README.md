# Swaglex Examples

This directory contains three complete project examples demonstrating different ways to use Swaglex for API documentation.

## Projects

### 1. Basic Project (`basic-project/`)

A simple Swaglex server demonstrating the basic setup and configuration.

**Features:**
- Single-command server setup
- Basic OpenAPI spec for user management
- Default Swagger UI styling
- Health check endpoint

**Quick Start:**
```bash
cd basic-project
npm install
npm start
# Visit: http://localhost:3001
```

### 2. Advanced Project (`advanced-project/`)

A comprehensive example showcasing advanced Swaglex features and customization.

**Features:**
- Custom styling and theming
- API analytics endpoints
- Enhanced health checks
- Multiple custom routes
- E-commerce API specification
- Authentication and security

**Quick Start:**
```bash
cd advanced-project
npm install
npm start
# Visit: http://localhost:3002/docs
```

### 3. Custom Project (`custom-project/`)

A highly customized server built using individual Swaglex components for maximum flexibility.

**Features:**
- Modular architecture with separate middleware and routes
- Security middleware (Helmet, CORS, rate limiting)
- Request logging and monitoring
- Blog API with articles, comments, and users
- Search and analytics functionality
- Individual Swaglex component usage

**Quick Start:**
```bash
cd custom-project
npm install
npm start
# Visit: http://localhost:3003/docs
```

## Static Site Generation

All projects support building static sites for deployment using the build-static.js script from the root directory:

```bash
# In any project directory
node ../../build-static.js --spec ./api/openapi.yaml --output ./dist
```

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build static site
node ../../build-static.js --spec ./api/openapi.yaml --output ./dist
```

## API Specifications

Each project includes a complete OpenAPI 3.0 specification:
- `basic-project/api/openapi.yaml` - Simple user API
- `advanced-project/api/openapi.yaml` - E-commerce platform API
- `custom-project/api/openapi.yaml` - Blog platform API

## Learning Path

1. **Start with Basic** - Learn the fundamentals
2. **Explore Advanced** - Discover customization options
3. **Study Custom** - Understand modular architecture

## Requirements

- Node.js 14.0.0 or higher
- npm or yarn

## Support

For questions about these examples, check the main Swaglex documentation or open an issue in the repository.