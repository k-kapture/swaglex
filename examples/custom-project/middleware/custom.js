const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

/**
 * Custom middleware for the blog API
 */

// Request logging middleware
const requestLogger = morgan((tokens, req, res) => {
  return [
    new Date().toISOString(),
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ');
});

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:3003'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Security middleware
const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
});

// Compression middleware
const compressionMiddleware = compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
});

// Custom authentication middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or invalid authorization header',
      code: 401
    });
  }

  const token = authHeader.substring(7);

  // In a real application, you would verify the JWT token here
  // For demo purposes, we'll just check if it's not empty
  if (!token || token.length < 10) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token',
      code: 401
    });
  }

  // Mock user ID extraction from token
  req.user = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    username: 'demo_user',
    role: 'writer'
  };

  next();
};

// Rate limiting middleware (simple in-memory implementation)
const rateLimitStore = new Map();

const rateLimitMiddleware = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, []);
    }

    const requests = rateLimitStore.get(key);
    const recentRequests = requests.filter(time => time > windowStart);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        code: 429,
        retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000)
      });
    }

    recentRequests.push(now);
    rateLimitStore.set(key, recentRequests);

    // Clean up old entries periodically
    if (Math.random() < 0.01) {
      for (const [ip, times] of rateLimitStore.entries()) {
        const validTimes = times.filter(time => time > windowStart);
        if (validTimes.length === 0) {
          rateLimitStore.delete(ip);
        } else {
          rateLimitStore.set(ip, validTimes);
        }
      }
    }

    next();
  };
};

// Request timing middleware
const timingMiddleware = (req, res, next) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1000000; // Convert to milliseconds
    console.log(`${req.method} ${req.url} - ${duration.toFixed(2)}ms`);
  });
  next();
};

module.exports = {
  requestLogger,
  corsOptions,
  securityMiddleware,
  compressionMiddleware,
  authMiddleware,
  rateLimitMiddleware,
  timingMiddleware
};