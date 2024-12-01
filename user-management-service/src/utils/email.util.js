import nodemailer from "nodemailer";
import logger from "./logger.js"; // For logging email errors or successes
import dotenv from "dotenv";

dotenv.config(); // To load environment variables from .env

// Configure the transporter for sending emails
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // Your SMTP server
  port: process.env.EMAIL_PORT, // SMTP port (usually 587 for TLS)
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USERNAME, // Your email account
    pass: process.env.EMAIL_PASSWORD, // Your email password
  },
  tls: {
    rejectUnauthorized: false, // For development: accept self-signed certs
  },
});

// Function to send an email
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: `"Houddle Support" <${process.env.EMAIL_FROM}>`, // Sender address
      to, // List of receivers (e.g., user's email)
      subject, // Subject line
      html: htmlContent, // HTML body content (can be templates)
    });

    logger.info(`Email sent: ${info.messageId} to ${to}`);
  } catch (error) {
    logger.error(`Error sending email to ${to}: ${error.message}`);
    throw new Error("Error sending email");
  }
};

// Function to send a verification email
export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const htmlContent = `
    <h1>Email Verification</h1>
    <p>Thank you for registering on Houddle! Please click the link below to verify your email address:</p>
    <a href="${verificationLink}">Verify Email</a>
    <p>If you did not sign up, please ignore this email.</p>
  `;

  await sendEmail(email, "Verify Your Email", htmlContent);
};

// Function to send password reset email
export const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const htmlContent = `
    <h1>Password Reset</h1>
    <p>You requested to reset your password. Please click the link below to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>If you did not request a password reset, please ignore this email.</p>
  `;

  await sendEmail(email, "Password Reset Request", htmlContent);
};
