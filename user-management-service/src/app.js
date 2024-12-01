import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';  // Importing the authentication routes
import userRoutes from './routes/user.routes.js';
import { setupSwaggerDocs } from './docs/swagger.js'; // Swagger setup (optional)
import { errorHandler } from './middlewares/error.middleware.js';  // Global error handler (if applicable)

dotenv.config();  // Load environment variables from .env

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Route for authentication and user management
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Setup Swagger API documentation (Optional)
setupSwaggerDocs(app);

// Global error handling middleware (optional)
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
