import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import memoryRoutes from "./routes/memory.route.js";
import searchRoutes from './routes/search.route.js';
import chatRoutes from './routes/chat.route.js';

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// 1. Body Parser - Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. CORS - Allow cross-origin requests
// Convert string to array by splitting on comma
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000"];
app.use(cors({
  origin: true,
  credentials: true
}));

// 3. Request Logger (Development only)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}


// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Context API is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes (we'll add these later)
app.use("/api/auth", authRoutes);
app.use("/api/memories", memoryRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/chat', chatRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
