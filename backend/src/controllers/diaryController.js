const prisma = require('../utils/prisma');

/**
 * Получить все записи дневника пользователя
 */
async function getAllEntries(req, res) {
  try {
    const { limit = 30 } = req.query;

    const entries = await prisma.diary.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'desc' },
      take: parseInt(limit),
    });

    res.json({ entries });
  } catch (error) {
    console.error('Ошибка получения записей:', error);
    res.status(500).json({ error: 'Ошибка при получении записей дневника' });
  }
}

/**
 * Создать новую запись в дневнике
 */
async function createEntry(req, res) {
  try {
    const { date, mood, moodScore, notes } = req.body;

    if (!mood || !notes) {
      return res.status(400).json({ error: 'Настроение и заметки обязательны' });
    }

    const entry = await prisma.diary.create({
      data: {
        userId: req.userId,
        date: date ? new Date(date) : new Date(),
        mood,
        moodScore: moodScore || 5,
        notes,
      },
    });

    res.status(201).json({
      message: 'Запись создана!',
      entry,
    });
  } catch (error) {
    console.error('Ошибка создания записи:', error);
    res.status(500).json({ error: 'Ошибка при создании записи' });
  }
}

/**
 * Обновить запись дневника
 */
async function updateEntry(req, res) {
  try {
    const { id } = req.params;
    const { mood, moodScore, notes } = req.body;

    // Проверяем, что запись принадлежит пользователю
    const existingEntry = await prisma.diary.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingEntry) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    const entry = await prisma.diary.update({
      where: { id },
      data: {
        ...(mood && { mood }),
        ...(moodScore !== undefined && { moodScore }),
        ...(notes && { notes }),
      },
    });

    res.json({
      message: 'Запись обновлена!',
      entry,
    });
  } catch (error) {
    console.error('Ошибка обновления записи:', error);
    res.status(500).json({ error: 'Ошибка при обновлении записи' });
  }
}

/**
 * Получить запись по ID
 */
async function getEntry(req, res) {
  try {
    const { id } = req.params;

    const entry = await prisma.diary.findFirst({
      where: { id, userId: req.userId },
    });

    if (!entry) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    res.json({ entry });
  } catch (error) {
    console.error('Ошибка получения записи:', error);
    res.status(500).json({ error: 'Ошибка при получении записи' });
  }
}

module.exports = {
  getAllEntries,
  createEntry,
  updateEntry,
  getEntry,
};

