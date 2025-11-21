import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { pool } from './config/database';
import { initializeSuperAdmin } from './services/authService';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';

// Import routes
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import appsRoutes from './routes/apps.routes';
import sdkRoutes from './routes/sdk.routes';
import pushRoutes from './routes/push.routes';

const app: Application = express();

// Middleware
app.use(cors({
  origin: config.cors.frontendUrl,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/apps', appsRoutes);
app.use('/sdk', sdkRoutes);
app.use('/api/push', pushRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Initialize server
const startServer = async () => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');

    // Initialize super admin
    await initializeSuperAdmin();

    // Start server
    app.listen(config.server.port, () => {
      console.log(`🚀 Server running on port ${config.server.port}`);
      console.log(`📝 Environment: ${config.server.nodeEnv}`);
      console.log(`🌐 CORS enabled for: ${config.cors.frontendUrl}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await pool.end();
  process.exit(0);
});
