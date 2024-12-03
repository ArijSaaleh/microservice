import express from 'express';
import { getUserProfile } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get user profile (protected route)
router.get('/profile', authMiddleware, getUserProfile);

export default router;
