import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ token: signToken(user._id) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password)))
    return res.status(400).json({ message: 'Invalid credentials' });

  res.json({ token: signToken(user._id) });
};
