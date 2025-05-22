import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    req.user = jwt.verify(token, process.env.ACCESS_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default protect;