import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'
import rateLimit from 'express-rate-limit';

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) throw new Error("req.user is undefined!");
    next();
  } catch(err) {
    console.error(err.message);
    res.status(401).json({ message: 'Not authorized, expired token' });
  }
};


export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1min
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    message: 'Too many attempts from this IP, please try again after 1 minute'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});