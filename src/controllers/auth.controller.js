import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Token from '../models/token.model.js';
import { signAccessToken, signRefreshToken } from '../utils/authUtils.js';


// 1. register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validate required fields
    if (!email || !password || !name) {
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
    const user = await User.create({name, email, password, role });

    return res.status(201).json({ message: 'User registered successfully', registerdUser : user});

  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};


// 2. login
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

    // check if token already exist for the user
    const tokenUser = await Token.findOne(({userId: user._id}));
    if (tokenUser) {
      await Token.deleteOne({ _id: tokenUser._id });
      res.clearCookie('refreshToken');
    }

    // 5. Save refresh token (supporting rotation)
    await Token.create({ userId: user._id, token: refreshToken });

      // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

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


// 3. refresh-token
export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    const payload = jwt.verify(token, process.env.REFRESH_SECRET);

    const existingToken = await Token.findOne({ token });
    if (!existingToken) return res.status(403).json({ message: 'Token not found or already used' });

    // Rotate token
    await existingToken.deleteOne();

    const newAccessToken = signAccessToken(payload.id);
    const newRefreshToken = signRefreshToken(payload.id);

    await Token.create({ userId: payload.id, token: newRefreshToken });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error('Refresh error:', err.message);
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

// 4. update user
export const updateUser = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) return res.status(404).json({ message: 'User not found' });

  // Update only allowed fields
  try {
    const { name, email, address, phone } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (phone) user.phone = phone;
  } catch (error) {
    console.error(error);
    return res.json({message: "Invalid input body"});
  }

  // Save updated user
  try {
    const updatedUser = await user.save();
    res.json({payload: 
      {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        address: updatedUser.address,
        phone: updatedUser.phone,
      },
      message: "user details updated!"
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating user' });
  }
};


// 5. delete user
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user._id);
    if (!deleteUser) throw new Error("User was not able to be deleted");
    res.status(200).json({
      message: "User deleted successfully",
      deletedUser
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: error
    });
  }
}


// 6. logout
export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      await Token.deleteOne({ token });
      res.clearCookie('refreshToken');
    }
  
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.json({message: error});
  }
};
