import {
  registerUserService,
  loginUserService,
  getUserByIdService,
  resetPasswordService,
  completePasswordResetService,
} from '../services/user.service.js';
import logger from '../utils/logger.js';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for user management
 */

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *               role:
 *                 type: string
 *                 enum: [EVENT_PLANNER, VENUE_OWNER, ADMIN, GUEST]
 *                 example: "EVENT_PLANNER"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully!"
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "test@example.com"
 *                     role:
 *                       type: string
 *                       example: "EVENT_PLANNER"
 *       400:
 *         description: Bad request (e.g., email already exists)
 */
export const registerUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await registerUserService(email, password, role);
    res.status(201).json({
      message: 'User created successfully!',
      user: { email: user.email, role: user.role },
    });
    logger.info(`User registration successful: ${user.email}`);
  } catch (error) {
    logger.error(`User registration failed: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful!"
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "test@example.com"
 *                     role:
 *                       type: string
 *                       example: "EVENT_PLANNER"
 *                 token:
 *                   type: string
 *                   example: "jwt-token-here"
 *       401:
 *         description: Unauthorized (e.g., invalid credentials)
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, token } = await loginUserService(email, password);
    res.status(200).json({
      message: 'Login successful!',
      user: { email: user.email, role: user.role },
      token,
    });
    logger.info(`Login successful: ${user.email}`);
  } catch (error) {
    logger.error(`Login failed: ${error.message}`);
    res.status(401).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: "test@example.com"
 *                 role:
 *                   type: string
 *                   example: "EVENT_PLANNER"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-12-01T08:00:00Z"
 *       401:
 *         description: Unauthorized (invalid token)
 */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user ID is decoded from JWT by middleware
    const user = await getUserByIdService(userId);
    res.status(200).json({
      message: 'User profile fetched successfully!',
      user,
    });
  } catch (error) {
    logger.error(`Failed to fetch user profile: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/users/password-reset:
 *   post:
 *     summary: Request password reset
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@example.com"
 *     responses:
 *       200:
 *         description: Password reset link sent to your email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset link sent to your email"
 *       400:
 *         description: User not found
 */
export const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const response = await resetPasswordService(email);
    res.status(200).json(response);
  } catch (error) {
    logger.error(`Password reset failed: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/users/password-reset/complete:
 *   post:
 *     summary: Complete the password reset process
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@example.com"
 *               resetToken:
 *                 type: string
 *                 example: "reset-token-here"
 *               newPassword:
 *                 type: string
 *                 example: "newSecurePassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset successfully"
 *       400:
 *         description: Invalid or expired reset token
 */
export const completePasswordReset = async (req, res) => {
  const { email, resetToken, newPassword } = req.body;

  try {
    const response = await completePasswordResetService(email, resetToken, newPassword);
    res.status(200).json(response);
  } catch (error) {
    logger.error(`Password reset completion failed: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};
