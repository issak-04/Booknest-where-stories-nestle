const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify JWT token and authenticate user
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader)
    return res.status(401).json({ message: 'No token, authorization denied' });

  const token = authHeader.split(' ')[1];
  if (!token)
    return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// POST /register - Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    // Create new user; password hashing handled in User model pre-save hook
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Create and sign JWT token
    const payload = { userId: newUser._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with token
    res.status(201).json({ token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /login - Authenticate user and return token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'User not found' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    // Create JWT token
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /me - Get current logged-in user (protected)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('Fetch user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
