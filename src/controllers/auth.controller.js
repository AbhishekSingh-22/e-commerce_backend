import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });


// register
export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1. Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    // 3. Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // 4. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    // 5. Create user
    const user = await User.create({ email, password, role });

    // 6. Return JWT
    const token = signToken(user._id);
    return res.status(201).json({ message: 'User registered successfully', token });

  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};


// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // 2. Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 3. Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 4. Issue token
    const token = signToken(user._id);
    res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
