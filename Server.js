import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./Routes/userRoutes.js";
import plantRoutes from "./Routes/plantRoutes.js";
import { errorHandler } from "./Middlewares/errorMiddlewares.js";

dotenv.config();
const app = express();

// Middleware - MUST come before routes
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect DB
connectDB();

// Root Route
app.get("/", (req, res) => {
  res.json({ 
    message: "API is running...",
    endpoints: {
      users: "/api/users",
      plants: "/api/plants",
      test: "/api/test"
    }
  });
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ 
    success: true, 
    message: "Server is working!",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/plants", plantRoutes);

// 404 Handler
app.use((req, res) => {
  console.log(` 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n Server running on http://localhost:${PORT}`);
  // console.log(` Test: http://localhost:${PORT}/api/test`);
  // console.log(` Users: http://localhost:${PORT}/api/users`);
  // console.log(`Plants: http://localhost:${PORT}/api/plants\n`);
});