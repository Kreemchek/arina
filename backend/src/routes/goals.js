const express = require('express');
const {
  getAllGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} = require('../controllers/goalsController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Все маршруты требуют аутентификации
router.use(authenticateUser);

/**
 * GET /api/goals
 * Получить все цели
 */
router.get('/', getAllGoals);

/**
 * POST /api/goals
 * Создать новую цель
 */
router.post('/', createGoal);

/**
 * PATCH /api/goals/:id
 * Обновить цель
 */
router.patch('/:id', updateGoal);

/**
 * DELETE /api/goals/:id
 * Удалить цель
 */
router.delete('/:id', deleteGoal);

module.exports = router;

