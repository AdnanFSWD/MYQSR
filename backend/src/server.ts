import app from './app';
import { prisma } from './prisma/client';

// Determine the server port
const PORT = process.env.PORT || 5000;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`  Server is running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`  Server started on port ${PORT}`);
  console.log(`  Health check: http://localhost:${PORT}/api/health`);
  console.log(`=============================================`);
});

/**
 * Handle graceful shutdown of the server.
 * Closes the server and disconnects active database sessions to avoid orphan connections.
 */
const handleGracefulShutdown = async (signal: string) => {
  console.log(`\n[${signal}] Received. Starting graceful shutdown...`);
  
  server.close(async (err) => {
    if (err) {
      console.error('Error closing the Express server:', err);
      process.exit(1);
    }
    
    console.log('HTTP server closed.');

    try {
      // Disconnect Prisma Client from PostgreSQL
      await prisma.$disconnect();
      console.log('Database connection disconnected.');
      process.exit(0);
    } catch (dbErr) {
      console.error('Error disconnecting database connection:', dbErr);
      process.exit(1);
    }
  });

  // Force close after 10s if graceful shutdown hangs
  setTimeout(() => {
    console.error('Forced shutdown: could not close connections in time.');
    process.exit(1);
  }, 10000);
};

// Listen to termination signals
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason: Error) => {
  console.error('Unhandled Promise Rejection:', reason);
  // Optional: Gracefully shutdown the server depending on production policy
});

// Catch uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
