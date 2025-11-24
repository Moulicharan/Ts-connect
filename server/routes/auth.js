const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// JWT helper
function createToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

/**
 * REGISTER
 * Only allow college emails (@student.nitw.ac.in)
 */
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6+ chars')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    // check college email domain
    if (!User.isCollegeEmail(email)) {
      return res.status(403).json({ error: 'Only @student.nitw.ac.in emails allowed' });
    }

    try {
      // check if user exists
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ error: 'Email already registered' });

      // hash password
      const passwordHash = await User.hashPassword(password);

      // create user
      const user = await User.create({
        name,
        email,
        passwordHash
      });

      const token = createToken(user);

      res.status(201).json({
        message: 'Registered successfully',
        token,
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

/**
 * LOGIN
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email required'),
    body('password').notEmpty().withMessage('Password required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'Invalid email or password' });

      const match = await user.comparePassword(password);
      if (!match) return res.status(400).json({ error: 'Invalid email or password' });

      const token = createToken(user);

      res.json({
        message: 'Login successful',
        token,
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);


// add near the bottom of server/routes/auth.js
const auth = require('../middleware/auth');

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error('GET /me error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all users (simple public list)
router.get('/all', async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json({ users });
  } catch (err) {
    console.error('GET /all error', err);
    res.status(500).json({ error: 'Server error' });
  }
});




module.exports = router;
