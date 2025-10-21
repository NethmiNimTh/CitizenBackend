import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./Routes/userRoutes.js";
import plantRoutes from "./Routes/plantRoutes.js";
import natureRoutes from "./Routes/natureRoutes.js";
import animalRoutes from "./Routes/animalRoutes.js";
import { errorHandler } from "./Middlewares/errorMiddlewares.js";


console.log('userRoutes type:', typeof userRoutes);
console.log('plantRoutes type:', typeof plantRoutes);
console.log('natureRoutes type:', typeof natureRoutes);
console.log('animalRoutes type:', typeof animalRoutes);


dotenv.config();
const app = express();

// Middleware
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
      nature: "/api/nature",
      animals: "/api/animals",
      
    }
  });
});



// API Routes
console.log('Registering /api/users...');
app.use("/api/users", userRoutes);

console.log('Registering /api/plants...');
app.use("/api/plants", plantRoutes);

console.log('Registering /api/nature...');
app.use("/api/nature", natureRoutes);

console.log('Registering /api/animals...');
app.use("/api/animals", animalRoutes);

console.log('All routes registered!');

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
  
  console.log(`Users: http://localhost:${PORT}/api/users`);
  console.log(`Plants: http://localhost:${PORT}/api/plants`);
  console.log(`Nature: http://localhost:${PORT}/api/nature`);
  console.log(`Animals: http://localhost:${PORT}/api/animals`);

});

export default app;