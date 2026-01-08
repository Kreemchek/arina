const prisma = require('../utils/prisma');

/**
 * Получить все привычки пользователя
 */
async function getAllHabits(req, res) {
  try {
    const habits = await prisma.habit.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ habits });
  } catch (error) {
    console.error('Ошибка получения привычек:', error);
    res.status(500).json({ error: 'Ошибка при получении привычек' });
  }
}

/**
 * Создать новую привычку
 */
async function createHabit(req, res) {
  try {
    const { title, type, frequency, color } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: 'Название и тип привычки обязательны' });
    }

    const habit = await prisma.habit.create({
      data: {
        userId: req.userId,
        title,
        type: type || 'daily',
        frequency: frequency || 'everyday',
        color: color || '#FFB6C1',
      },
    });

    res.status(201).json({ 
      message: 'Привычка создана!',
      habit 
    });
  } catch (error) {
    console.error('Ошибка создания привычки:', error);
    res.status(500).json({ error: 'Ошибка при создании привычки' });
  }
}

/**
 * Обновить привычку
 */
async function updateHabit(req, res) {
  try {
    const { id } = req.params;
    const { title, type, frequency, color, progress, streak, isActive } = req.body;

    // Проверяем, что привычка принадлежит пользователю
    const existingHabit = await prisma.habit.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingHabit) {
      return res.status(404).json({ error: 'Привычка не найдена' });
    }

    const habit = await prisma.habit.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(type && { type }),
        ...(frequency && { frequency }),
        ...(color && { color }),
        ...(progress !== undefined && { progress }),
        ...(streak !== undefined && { streak }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.json({ 
      message: 'Привычка обновлена!',
      habit 
    });
  } catch (error) {
    console.error('Ошибка обновления привычки:', error);
    res.status(500).json({ error: 'Ошибка при обновлении привычки' });
  }
}

/**
 * Удалить привычку
 */
async function deleteHabit(req, res) {
  try {
    const { id } = req.params;

    // Проверяем, что привычка принадлежит пользователю
    const existingHabit = await prisma.habit.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingHabit) {
      return res.status(404).json({ error: 'Привычка не найдена' });
    }

    await prisma.habit.delete({ where: { id } });

    res.json({ message: 'Привычка удалена!' });
  } catch (error) {
    console.error('Ошибка удаления привычки:', error);
    res.status(500).json({ error: 'Ошибка при удалении привычки' });
  }
}

/**
 * Отметить выполнение привычки
 */
async function completeHabit(req, res) {
  try {
    const { id } = req.params;

    const existingHabit = await prisma.habit.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingHabit) {
      return res.status(404).json({ error: 'Привычка не найдена' });
    }

    // Увеличиваем прогресс и streak
    const habit = await prisma.habit.update({
      where: { id },
      data: {
        progress: existingHabit.progress + 1,
        streak: existingHabit.streak + 1,
      },
    });

    res.json({ 
      message: 'Привычка выполнена! 🎉',
      habit 
    });
  } catch (error) {
    console.error('Ошибка отметки привычки:', error);
    res.status(500).json({ error: 'Ошибка при отметке привычки' });
  }
}

module.exports = {
  getAllHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  completeHabit,
};

