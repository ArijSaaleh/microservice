import prisma from '../../prisma/client.js';             // Prisma client to interact with PostgreSQL
import bcrypt from 'bcryptjs';                        // For password hashing and comparison
import { generateToken, verifyToken} from '../utils/jwt.util.js'; // JWT token generation utility
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email.util.js'; // Email utilities
import logger from '../utils/logger.js';              // Winston logger for logging activities

// Register a new user
export const registerUserService = async (email, password, role) => {
  // Check if the email already exists in the database
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    logger.warn(`Attempted registration with existing email: ${email}`);
    throw new Error('Email already exists');
  }

  // Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new user in the database
  const newUser = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      role,
    },
  });

  logger.info(`New user registered: ${newUser.email}`);

  // Generate a verification token (JWT)
  const token = generateToken(newUser);

  // Send verification email
  await sendVerificationEmail(newUser.email, token);

  return newUser;
};
/**
 * @desc Authenticate and log in a user, returning a JWT token
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {object} - The logged-in user's data and token
 */
// Login user (check email + password and if user already logged in)
export const loginUserService = async (email, password, existingToken) => {
  // Find the user by email in the database
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Compare the provided password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // If an existing token is passed, verify if it's still valid
  if (existingToken) {
    try {
      const decoded = verifyToken(existingToken);

      // If the token is valid and belongs to the same user, return the existing token
      if (decoded.userId === user.id) {
        return { user, token: existingToken, message: 'Already logged in.' };
      }
    } catch (error) {
      // Token is invalid or expired, continue with generating a new token
    }
  }

  // Generate a new JWT token for the user
  const newToken = generateToken(user);

  // Update the lastLogin field
  await prisma.user.update({
    where: { email },
    data: { lastLogin: new Date() }
  });

  return { user, token: newToken, message: 'Login successful!' };
};


// Get the user's profile by their ID
export const getUserByIdService = async (userId) => {
  // Find the user in the database by their ID
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    logger.error(`User profile fetch failed for non-existing ID: ${userId}`);
    throw new Error('User not found');
  }

  // Return the user details (excluding sensitive information like passwordHash)
  return {
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
  };
};

// Initiate password reset (send reset email with token)
export const resetPasswordService = async (email) => {
  // Find the user by their email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    logger.warn(`Password reset attempt for non-existing email: ${email}`);
    throw new Error('User not found');
  }

  // Generate a random reset token and expiry time (1 hour)
  const resetToken = Math.random().toString(36).substr(2);
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

  // Update the user with the reset token and expiry
  await prisma.user.update({
    where: { email },
    data: {
      resetToken,
      resetTokenExpiry,
    },
  });

  // Send the reset email to the user
  await sendPasswordResetEmail(user.email, resetToken);
  logger.info(`Password reset email sent to: ${user.email}`);

  return { message: 'Password reset link sent to your email' };
};

// Complete password reset (verify reset token and update password)
export const completePasswordResetService = async (email, resetToken, newPassword) => {
  // Find the user by their email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.resetToken !== resetToken || user.resetTokenExpiry < new Date()) {
    logger.warn(`Invalid or expired reset token for email: ${email}`);
    throw new Error('Invalid or expired reset token');
  }

  // Hash the new password before storing it
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user with the new password and clear the reset token
  await prisma.user.update({
    where: { email },
    data: {
      passwordHash: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  logger.info(`Password successfully reset for user: ${email}`);
  return { message: 'Password reset successfully' };
};
