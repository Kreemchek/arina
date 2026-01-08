const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Генерация JWT токена
 * @param {Object} payload - Данные для токена (обычно userId)
 * @returns {string} JWT токен
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Проверка JWT токена
 * @param {string} token - JWT токен для проверки
 * @returns {Object} Декодированные данные токена
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Недействительный токен');
  }
}

module.exports = {
  generateToken,
  verifyToken,
};

