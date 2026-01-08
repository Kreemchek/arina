const express = require('express');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Все маршруты требуют аутентификации
router.use(authenticateUser);

/**
 * GET /api/payments/status
 * Получить статус подписки (заглушка)
 */
router.get('/status', async (req, res) => {
  res.json({
    premiumActive: false,
    subscriptionType: 'free',
    message: 'Платежи пока не подключены. Это заглушка для будущей функциональности.',
    features: {
      free: ['Базовые привычки', 'Дневник настроения', 'До 5 целей'],
      premium: ['Безлимитные привычки', 'Продвинутая аналитика', 'PDF-отчёты', 'Безлимитные цели', 'Персональные рекомендации'],
    },
  });
});

/**
 * POST /api/payments/create
 * Создать платёж (заглушка)
 */
router.post('/create', async (req, res) => {
  res.json({
    success: false,
    message: 'Платежная система ещё не подключена. Скоро будет доступна!',
    redirectUrl: null,
  });
});

/**
 * POST /api/payments/webhook
 * Webhook для обработки платежей (заглушка)
 */
router.post('/webhook', async (req, res) => {
  res.json({ received: true });
});

module.exports = router;

