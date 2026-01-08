const express = require('express');
const {
  getAllEntries,
  createEntry,
  updateEntry,
  getEntry,
} = require('../controllers/diaryController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Все маршруты требуют аутентификации
router.use(authenticateUser);

/**
 * GET /api/diary
 * Получить все записи дневника
 */
router.get('/', getAllEntries);

/**
 * POST /api/diary
 * Создать новую запись
 */
router.post('/', createEntry);

/**
 * GET /api/diary/:id
 * Получить запись по ID
 */
router.get('/:id', getEntry);

/**
 * PATCH /api/diary/:id
 * Обновить запись
 */
router.patch('/:id', updateEntry);

module.exports = router;

