import jwt from 'jsonwebtoken';

// Generate a JWT token for a user
export const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, role: user.role },           // Payload: user ID and role
    process.env.JWT_SECRET,                        // Secret key from .env file
    { expiresIn: '1h' }                            // Token expiry time
  );
};

// Verify a JWT token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
