const jwt = require('jsonwebtoken');
require('dotenv').config();

const validateUser = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token diperlukan!' });
  }

  const token = authorization.split(' ')[1];

  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({ message: 'Token diperlukan!' });
  }

  const key = process.env.SECRET_KEY;

  try {
    const decoded = jwt.verify(token, key);
    req.user = decoded; // simpan user info di request
    next(); // lanjut ke route berikutnya
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid!' });
  }
};

module.exports = { validateUser };