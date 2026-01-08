const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const prisma = require('../utils/prisma');
const { generateToken } = require('../utils/jwt');

/**
 * Регистрация нового пользователя
 */
async function register(req, res) {
  try {
    // Валидация входных данных
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, telegramId } = req.body;

    // Проверка существования пользователя
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    // Хеширование пароля
    const passwordHash = await bcrypt.hash(password, 10);

    // Проверка telegramId для автоматической выдачи premium
    const premiumTelegramIds = ['7681450378', '937128381'];
    const isPremium = telegramId && premiumTelegramIds.includes(telegramId);

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        telegramId: telegramId || null,
        premiumFlag: isPremium,
      },
      select: {
        id: true,
        name: true,
        email: true,
        telegramId: true,
        premiumFlag: true,
        createdAt: true,
      },
    });

    // Генерация токена
    const token = generateToken({ userId: user.id, email: user.email });

    res.status(201).json({
      message: 'Регистрация успешна!',
      token,
      user,
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ error: 'Ошибка при регистрации' });
  }
}

/**
 * Вход пользователя
 */
async function login(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Поиск пользователя
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Проверка пароля
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Генерация токена
    const token = generateToken({ userId: user.id, email: user.email });

    res.json({
      message: 'Вход выполнен успешно!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        telegramId: user.telegramId,
        premiumFlag: user.premiumFlag,
      },
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ error: 'Ошибка при входе' });
  }
}

/**
 * Получение профиля текущего пользователя
 */
async function getProfile(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        telegramId: true,
        premiumFlag: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ error: 'Ошибка при получении профиля' });
  }
}

/**
 * Выход пользователя (заглушка - токен удаляется на клиенте)
 */
async function logout(req, res) {
  res.json({ message: 'Выход выполнен успешно' });
}

/**
 * Выдача premium подписки пользователю по telegramId
 */
async function grantPremium(req, res) {
  try {
    const { telegramId } = req.body;
    
    if (!telegramId) {
      return res.status(400).json({ error: 'telegramId обязателен' });
    }

    const premiumTelegramIds = ['7681450378', '937128381'];
    if (!premiumTelegramIds.includes(telegramId)) {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }

    const user = await prisma.user.update({
      where: { telegramId },
      data: { premiumFlag: true },
      select: {
        id: true,
        name: true,
        email: true,
        telegramId: true,
        premiumFlag: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь с таким telegramId не найден' });
    }

    res.json({
      message: 'Premium подписка активирована!',
      user,
    });
  } catch (error) {
    console.error('Ошибка выдачи premium:', error);
    res.status(500).json({ error: 'Ошибка при выдаче premium' });
  }
}

module.exports = {
  register,
  login,
  getProfile,
  logout,
  grantPremium,
};

