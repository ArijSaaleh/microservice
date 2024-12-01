import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import {userRoutes} from './routes/user.routes.js';
import {authRoutes} from './routes/auth.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { setupSwaggerDocs } from './docs/swagger.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());  // for parsing application/json
// Swagger docs setup
setupSwaggerDocs(app);
// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
