const express = require('express');
const {
  getAllHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  completeHabit,
} = require('../controllers/habitsController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Все маршруты требуют аутентификации
router.use(authenticateUser);

/**
 * GET /api/habits
 * Получить все привычки пользователя
 */
router.get('/', getAllHabits);

/**
 * POST /api/habits
 * Создать новую привычку
 */
router.post('/', createHabit);

/**
 * PATCH /api/habits/:id
 * Обновить привычку
 */
router.patch('/:id', updateHabit);

/**
 * DELETE /api/habits/:id
 * Удалить привычку
 */
router.delete('/:id', deleteHabit);

/**
 * POST /api/habits/:id/complete
 * Отметить выполнение привычки
 */
router.post('/:id/complete', completeHabit);

module.exports = router;

