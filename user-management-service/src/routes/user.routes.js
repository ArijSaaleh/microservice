import express from 'express';
import { registerUser, loginUser, getUserProfile, resetPassword } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Register user
router.post('/signup', registerUser);

// Login user (returns JWT token)
router.post('/login', loginUser);

// Get user profile (protected route)
router.get('/profile', authMiddleware, getUserProfile);

// Password reset
router.post('/password-reset', resetPassword);

export default router;
