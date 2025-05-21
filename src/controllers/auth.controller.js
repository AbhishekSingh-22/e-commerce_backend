import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Token from '../models/token.model.js';
import { signAccessToken, signRefreshToken } from '../utils/authUtils.js';


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

    return res.status(201).json({ message: 'User registered successfully'});

  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};


// login
export const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    // 2. Find user and ensure password is selected
    const user = await User.findOne({ email }).select('+password');
    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' });

    // 3. Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    // 4. Generate tokens
    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    if (!refreshToken) {
  return res.status(500).json({ message: 'Failed to generate refresh token' });
}

    // 5. Save refresh token (supporting rotation)
    await Token.create({ userId: user._id, token: refreshToken });

    // 6. Send response
    return res.status(200).json({
      accessToken,
      refreshToken,
      message: 'Logged in successfully',
    });

  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  // 1. Check for presence of refresh token
  if (!refreshToken)
    return res.status(400).json({ message: 'Refresh token is required' });

  let payload;
  try {
    // 2. Verify refresh token
    payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }

  try {
    // 3. Check if token exists in DB
    const storedToken = await Token.findOne({ token: refreshToken });
    if (!storedToken)
      return res.status(403).json({ message: 'Refresh token not found or already used' });

    // 4. Optional: Verify that user still exists
    const user = await User.findById(payload.id);
    if (!user)
      return res.status(404).json({ message: 'User associated with token not found' });

    // 5. Delete the used refresh token (token rotation)
    await storedToken.deleteOne();

    // 6. Generate new tokens
    const newAccessToken = signAccessToken(user._id);
    const newRefreshToken = signRefreshToken(user._id);

    // 7. Save new refresh token
    await Token.create({ userId: user._id, token: newRefreshToken });

    // 8. Respond with new tokens
    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

  } catch (err) {
    console.error('Token refresh error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



export const logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Token required' });

  await Token.findOneAndDelete({ token: refreshToken });
  res.json({ message: 'Logged out successfully' });
};
