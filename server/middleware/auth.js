// server/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Attach useful info to the request
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message || err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
