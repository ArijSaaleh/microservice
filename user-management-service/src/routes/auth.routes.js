import express from 'express';
import { registerUser, loginUser, getUserProfile, resetPassword, completePasswordReset } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { checkLoggedIn } from '../middlewares/loggedIn.middleware.js';

const router = express.Router();

/**
 * @route POST /signup
 * @desc Register a new user
 * @access Public
 */
router.post('/signup', registerUser);

/**
 * @route POST /login
 * @desc Log in a user
 * @access Public
 */
router.post('/login', checkLoggedIn, loginUser);

/**
 * @route GET /profile
 * @desc Get the authenticated user's profile
 * @access Private (requires JWT)
 */
router.get('/profile', authMiddleware, getUserProfile);

/**
 * @route POST /password-reset
 * @desc Request a password reset (sends reset token via email)
 * @access Public
 */
router.post('/password-reset', resetPassword);

/**
 * @route POST /password-reset/complete
 * @desc Complete the password reset process (using reset token)
 * @access Public
 */
router.post('/password-reset/complete', completePasswordReset);

export default router;
