const express = require('express');
const path = require('path');

// Import Swaglex components
const {
  loadSwaggerSpec,
  createJsonEndpoint,
  createYamlEndpoint,
  createHealthCheck,
  createErrorHandler,
  create404Handler
} = require('swaglex');

// Import custom middleware
const {
  requestLogger,
  corsOptions,
  securityMiddleware,
  compressionMiddleware,
  authMiddleware,
  rateLimitMiddleware,
  timingMiddleware
} = require('./middleware/custom');

// Import custom routes
const {
  getArticles,
  getArticleById,
  createArticle,
  getArticleComments,
  addComment,
  getUserProfile,
  updateUserProfile,
  getAnalytics,
  searchContent
} = require('./routes/blog');

// Configuration
const PORT = process.env.PORT || 3003;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Create Express app
const app = express();

// Apply middleware
app.use(securityMiddleware);
app.use(compressionMiddleware);
app.use(require('cors')(corsOptions));
app.use(requestLogger);
app.use(timingMiddleware);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api', rateLimitMiddleware(100, 15 * 60 * 1000)); // 100 requests per 15 minutes

// Load OpenAPI specification
let swaggerSpec;
try {
  swaggerSpec = loadSwaggerSpec(path.join(__dirname, 'api', 'openapi.yaml'));
  console.log('✅ OpenAPI specification loaded successfully');
} catch (error) {
  console.error('❌ Failed to load OpenAPI specification:', error.message);
  process.exit(1);
}

// Custom API routes
app.get('/api/articles', getArticles);
app.post('/api/articles', authMiddleware, createArticle);
app.get('/api/articles/:id', getArticleById);
app.get('/api/articles/:id/comments', getArticleComments);
app.post('/api/articles/:id/comments', addComment);

app.get('/api/users/profile', authMiddleware, getUserProfile);
app.put('/api/users/profile', authMiddleware, updateUserProfile);

app.get('/api/analytics', authMiddleware, getAnalytics);
app.get('/api/search', searchContent);

// API documentation routes using Swaglex components
app.get('/spec.json', createJsonEndpoint(swaggerSpec));
app.get('/spec.yaml', createYamlEndpoint(swaggerSpec));

// Enhanced health check
app.get('/health', createHealthCheck({
  version: swaggerSpec.info?.version,
  extra: {
    service: 'custom-blog-api',
    environment: NODE_ENV,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
    features: [
      'articles',
      'comments',
      'users',
      'analytics',
      'search',
      'custom-middleware',
      'rate-limiting',
      'compression'
    ]
  }
}));

// API info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: swaggerSpec.info?.title,
    version: swaggerSpec.info?.version,
    description: swaggerSpec.info?.description,
    environment: NODE_ENV,
    endpoints: {
      articles: '/api/articles',
      users: '/api/users',
      analytics: '/api/analytics',
      search: '/api/search',
      docs: '/docs',
      spec: {
        json: '/spec.json',
        yaml: '/spec.yaml'
      },
      health: '/health'
    },
    stats: {
      totalArticles: 1, // In real app, get from database
      totalUsers: 1,
      totalComments: 1
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Custom Blog API Server',
    version: swaggerSpec.info?.version,
    documentation: '/docs',
    api: {
      info: '/api/info',
      spec: {
        json: '/spec.json',
        yaml: '/spec.yaml'
      },
      health: '/health'
    },
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(createErrorHandler());

// 404 handler
const availableEndpoints = [
  'GET /',
  'GET /api/info',
  'GET /api/articles',
  'POST /api/articles',
  'GET /api/articles/{id}',
  'GET /api/articles/{id}/comments',
  'POST /api/articles/{id}/comments',
  'GET /api/users/profile',
  'PUT /api/users/profile',
  'GET /api/analytics',
  'GET /api/search',
  'GET /docs',
  'GET /spec.json',
  'GET /spec.yaml',
  'GET /health'
];

app.use(create404Handler(availableEndpoints));

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 Custom Blog API Server is running!

📖 Documentation: http://localhost:${PORT}/docs
📄 OpenAPI JSON: http://localhost:${PORT}/spec.json
📄 OpenAPI YAML: http://localhost:${PORT}/spec.yaml
❤️  Health Check: http://localhost:${PORT}/health
ℹ️  API Info: http://localhost:${PORT}/api/info

🌍 Environment: ${NODE_ENV}
🔌 Port: ${PORT}
📚 API: ${swaggerSpec.info?.title || 'Unknown'} v${swaggerSpec.info?.version || '1.0.0'}

Custom Features:
  • Rate limiting (100 req/15min)
  • Request compression
  • Security headers
  • Request logging
  • Custom middleware stack
  • Individual Swaglex components
  • Enhanced error handling
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

module.exports = app;