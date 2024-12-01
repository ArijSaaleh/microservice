import { registerUserService, loginUserService, getUserByIdService, resetPasswordService } from '../services/user.service.js';
import { generateToken } from '../utils/jwt.util.js';
import logger from '../utils/logger.js';  // Logging utility for monitoring
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
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [EVENT_PLANNER, VENUE_OWNER, ADMIN, GUEST]
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
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Bad Request
 */
export const registerUser = async (req, res) => {
  const { email, password, role } = req.body;
  
  try {
    // Register the user by calling the service
    const user = await registerUserService(email, password, role);
    
    // Send a response with user data (excluding password hash for security)
    res.status(201).json({
      message: 'User created successfully!',
      user: { email: user.email, role: user.role },
    });
    logger.info(`New user created: ${user.email}`);
  } catch (error) {
    logger.error(`Error during user registration: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login an existing user
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Login the user and get the token
    const { user, token } = await loginUserService(email, password);
    
    // Return the user data and token
    res.status(200).json({
      message: 'Login successful!',
      user: { email: user.email, role: user.role },
      token,
    });
    logger.info(`User logged in: ${user.email}`);
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(401).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get the profile of the authenticated user
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
 *                 role:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized access (invalid or expired token)
 */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;  // The user ID should be decoded from the JWT
    const user = await getUserByIdService(userId);
    
    res.status(200).json({
      message: 'User profile fetched successfully!',
      user: { email: user.email, role: user.role, createdAt: user.createdAt },
    });
  } catch (error) {
    logger.error(`Error fetching user profile: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};
/**
 * @swagger
 * /api/users/password-reset:
 *   post:
 *     summary: Trigger password reset process
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
 *     responses:
 *       200:
 *         description: Reset token sent to email
 *       400:
 *         description: User not found
 */

export const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const response = await resetPasswordService(email);
    
    res.status(200).json(response);
  } catch (error) {
    logger.error(`Error initiating password reset: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};
