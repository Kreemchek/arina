const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile, logout, grantPremium } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/auth/register
 * Регистрация нового пользователя
 */
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Имя обязательно'),
    body('email').isEmail().normalizeEmail().withMessage('Некорректный email'),
    body('password').isLength({ min: 6 }).withMessage('Пароль должен быть минимум 6 символов'),
  ],
  register
);

/**
 * POST /api/auth/login
 * Вход пользователя
 */
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Некорректный email'),
    body('password').notEmpty().withMessage('Пароль обязателен'),
  ],
  login
);

/**
 * GET /api/auth/profile
 * Получение профиля текущего пользователя
 */
router.get('/profile', authenticateUser, getProfile);

/**
 * POST /api/auth/logout
 * Выход пользователя
 */
router.post('/logout', authenticateUser, logout);

/**
 * POST /api/auth/grant-premium
 * Выдача premium подписки по telegramId
 */
router.post('/grant-premium', grantPremium);

module.exports = router;

