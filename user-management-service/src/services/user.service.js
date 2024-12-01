import prisma from '../../prisma/client.js';  // Prisma client to interact with the DB
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.util.js';  // For JWT token generation
import { sendEmail } from '../utils/email.util.js';  // For sending emails (verification, reset)

// Register a new user
export const registerUserService = async (email, password, role) => {
  // Check if the email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new Error('Email already exists');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user in the database
  const newUser = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      role,
    },
  });

  // Send a verification email (optional, for email verification)
  const token = generateToken(newUser);
  await sendEmail(newUser.email, 'Verify your email', `Click the link to verify: /verify-email/${token}`);

  return newUser;
};

// Validate user login (compare password)
export const loginUserService = async (email, password) => {
  // Find user by email
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

  // Return the user and a JWT token
  const token = generateToken(user);
  return { user, token };
};

// Find user by ID (for user profile)
export const getUserByIdService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

// Reset password (send reset token)
export const resetPasswordService = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new Error('User not found');
  }

  // Generate a reset token and expiry time
  const resetToken = Math.random().toString(36).substring(2);
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

  // Update user with reset token and expiry
  await prisma.user.update({
    where: { email },
    data: {
      resetToken,
      resetTokenExpiry,
    },
  });

  // Send the reset email
  await sendEmail(user.email, 'Password Reset', `Your reset token is: ${resetToken}`);

  return { message: 'Reset token sent to email' };
};
