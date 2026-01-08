const express = require('express');
const {
  getAllBeautyTasks,
  createBeautyTask,
  updateBeautyTask,
  deleteBeautyTask,
} = require('../controllers/beautyController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Все маршруты требуют аутентификации
router.use(authenticateUser);

/**
 * GET /api/beauty
 * Получить все задачи красоты
 */
router.get('/', getAllBeautyTasks);

/**
 * POST /api/beauty
 * Создать новую задачу
 */
router.post('/', createBeautyTask);

/**
 * PATCH /api/beauty/:id
 * Обновить задачу
 */
router.patch('/:id', updateBeautyTask);

/**
 * DELETE /api/beauty/:id
 * Удалить задачу
 */
router.delete('/:id', deleteBeautyTask);

module.exports = router;

