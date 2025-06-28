const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY_USER = process.env.SECRET_KEY;

/**
 * Generate JWT token
 * @param {Object} payload - Data yang akan dienkripsi dalam token
 * @param {String} expiresIn - Waktu kedaluwarsa token (default: 1 jam)
 * @returns {String} Token JWT yang sudah dienkripsi
 */
const generateToken = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, SECRET_KEY_USER, { expiresIn });
};

module.exports = { generateToken };
