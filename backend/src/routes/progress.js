const express = require('express');
const {
  getProgress,
  saveProgress,
  getStats,
} = require('../controllers/progressController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Все маршруты требуют аутентификации
router.use(authenticateUser);

/**
 * GET /api/progress
 * Получить прогресс
 */
router.get('/', getProgress);

/**
 * POST /api/progress
 * Сохранить прогресс за день
 */
router.post('/', saveProgress);

/**
 * GET /api/progress/stats
 * Получить статистику
 */
router.get('/stats', getStats);

module.exports = router;

