const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const rawHeader = req.header('Authorization');
  const token = rawHeader?.replace('Bearer ', '');

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified:', decoded);
    
    req.user = { id: decoded.userId }; // ✅ match your token format
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
