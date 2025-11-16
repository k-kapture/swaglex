const { createSwaggerServer } = require('swaglex');
const express = require('express');
const path = require('path');

// Advanced Swaglex server with custom configuration
const server = createSwaggerServer({
  specPath: path.join(__dirname, 'api', 'openapi.yaml'),
  port: 3002,

  // Custom paths
  uiPath: '/docs',
  jsonPath: '/api-spec.json',
  yamlPath: '/api-spec.yaml',

  // Custom styling with modern design
  apiName: 'Advanced E-Commerce API',
  siteTitle: 'Advanced E-Commerce API - Complete Documentation',
  customCss: `
    .swagger-ui .topbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .swagger-ui .topbar .link {
      display: none;
    }
    .swagger-ui .info .title {
      color: #2c3e50;
      font-weight: 700;
      font-size: 2.5em;
      margin-bottom: 10px;
    }
    .swagger-ui .info .description {
      color: #34495e;
      font-size: 1.1em;
      line-height: 1.6;
    }
    .swagger-ui .scheme-container {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      padding: 20px;
      border-radius: 10px;
      margin: 20px 0;
    }
    .swagger-ui .opblock-tag {
      background: #3498db;
      color: white;
      border-radius: 5px;
      margin: 5px 0;
    }
    .swagger-ui .opblock-summary-method {
      background: #27ae60;
      color: white;
      font-weight: bold;
    }
    .swagger-ui .opblock-summary-method.post {
      background: #f39c12;
    }
    .swagger-ui .opblock-summary-method.put {
      background: #e74c3c;
    }
    .swagger-ui .opblock-summary-method.delete {
      background: #c0392b;
    }
    .swagger-ui .btn {
      background: #3498db;
      border-color: #3498db;
      color: white;
    }
    .swagger-ui .btn:hover {
      background: #2980b9;
      border-color: #2980b9;
    }
    .swagger-ui .response-col_status {
      font-weight: bold;
    }
    .swagger-ui .response-col_status[data-status="200"] {
      color: #27ae60;
    }
    .swagger-ui .response-col_status[data-status="201"] {
      color: #27ae60;
    }
    .swagger-ui .response-col_status[data-status="400"] {
      color: #e74c3c;
    }
    .swagger-ui .response-col_status[data-status="404"] {
      color: #e74c3c;
    }
    .swagger-ui .response-col_status[data-status="500"] {
      color: #c0392b;
    }
  `,

  // Enhanced Swagger UI options
  swaggerUiOptions: {
    explorer: true,
    tryItOutEnabled: true,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      requestInterceptor: (req) => {
        // Add custom headers for development
        if (process.env.NODE_ENV === 'development') {
          req.headers['X-API-Key'] = 'dev-api-key';
        }
        return req;
      },
      responseInterceptor: (res) => {
        // Log responses in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`API Response: ${res.status} ${res.url}`);
        }
        return res;
      }
    }
  },

  // Enhanced health check
  healthExtra: {
    service: 'advanced-ecommerce-api-docs',
    environment: process.env.NODE_ENV || 'development',
    version: '2.1.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    features: [
      'authentication',
      'product-management',
      'shopping-cart',
      'order-processing',
      'custom-styling',
      'api-analytics'
    ]
  },

  // Custom routes for API analytics and utilities
  routes: (app, spec) => {
    // API Statistics endpoint
    app.get('/api/stats', (req, res) => {
      const pathCount = Object.keys(spec.paths || {}).length;
      const operations = Object.values(spec.paths || {}).reduce((count, path) => {
        return count + Object.keys(path).filter(key =>
          ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(key)
        ).length;
      }, 0);

      const tags = new Set();
      Object.values(spec.paths || {}).forEach(path => {
        Object.values(path).forEach(operation => {
          if (operation.tags) {
            operation.tags.forEach(tag => tags.add(tag));
          }
        });
      });

      res.json({
        apiTitle: spec.info?.title,
        version: spec.info?.version,
        description: spec.info?.description,
        statistics: {
          totalPaths: pathCount,
          totalOperations: operations,
          totalTags: tags.size,
          tags: Array.from(tags),
          servers: spec.servers?.length || 0,
          securitySchemes: Object.keys(spec.components?.securitySchemes || {}).length
        },
        endpoints: {
          docs: '/docs',
          jsonSpec: '/api-spec.json',
          yamlSpec: '/api-spec.yaml',
          health: '/health',
          stats: '/api/stats',
          paths: '/api/paths',
          tags: '/api/tags'
        }
      });
    });

    // API Paths listing
    app.get('/api/paths', (req, res) => {
      const paths = Object.keys(spec.paths || {}).map(path => ({
        path,
        methods: Object.keys(spec.paths[path]).filter(key =>
          ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(key)
        ),
        operations: Object.keys(spec.paths[path]).filter(key =>
          ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(key)
        ).map(method => ({
          method: method.toUpperCase(),
          summary: spec.paths[path][method].summary,
          tags: spec.paths[path][method].tags || []
        }))
      }));

      res.json({
        totalPaths: paths.length,
        paths: paths
      });
    });

    // API Tags information
    app.get('/api/tags', (req, res) => {
      const tagDescriptions = {};
      const tagOperations = {};

      Object.values(spec.paths || {}).forEach(path => {
        Object.values(path).forEach(operation => {
          if (operation.tags) {
            operation.tags.forEach(tag => {
              if (!tagDescriptions[tag]) {
                tagDescriptions[tag] = 0;
                tagOperations[tag] = [];
              }
              tagDescriptions[tag]++;
              tagOperations[tag].push({
                path: Object.keys(spec.paths).find(p => spec.paths[p] === path),
                method: operation.operationId || 'unknown',
                summary: operation.summary
              });
            });
          }
        });
      });

      res.json({
        tags: Object.keys(tagDescriptions).map(tag => ({
          name: tag,
          operationCount: tagDescriptions[tag],
          operations: tagOperations[tag]
        }))
      });
    });

    // API Version info
    app.get('/api/version', (req, res) => {
      res.json({
        title: spec.info?.title,
        version: spec.info?.version,
        description: spec.info?.description,
        contact: spec.info?.contact,
        license: spec.info?.license,
        servers: spec.servers,
        lastUpdated: new Date().toISOString()
      });
    });

    // Serve static files from public directory
    app.use('/static', express.static(path.join(__dirname, 'public')));
  }
});

// Start the server
server.start(undefined, () => {
  console.log('\n📊 Advanced API Analytics Endpoints:');
  console.log('   GET /api/stats     - API statistics and metadata');
  console.log('   GET /api/paths     - List all API paths and operations');
  console.log('   GET /api/tags      - API operations grouped by tags');
  console.log('   GET /api/version   - API version and server information');
  console.log('   GET /static/*      - Static file serving\n');
});