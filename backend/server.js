import 'dotenv/config';
import app from './src/app.js';
import { testGemini } from './src/config/gemini.js';

// Test Gemini configuration (development only)
if (process.env.NODE_ENV === 'development') {
  testGemini();
}

// For local development only
// In Vercel, this entire block is ignored
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Context API Server (Local Development)`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 Server running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log('='.repeat(50));
  });
}

// Export for Vercel serverless
export default app;