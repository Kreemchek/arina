const prisma = require('../utils/prisma');

/**
 * Получить все задачи красоты пользователя
 */
async function getAllBeautyTasks(req, res) {
  try {
    const { category } = req.query;

    const tasks = await prisma.beauty.findMany({
      where: {
        userId: req.userId,
        ...(category && { category }),
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Ошибка получения задач красоты:', error);
    res.status(500).json({ error: 'Ошибка при получении задач' });
  }
}

/**
 * Создать новую задачу красоты
 */
async function createBeautyTask(req, res) {
  try {
    const { title, description, category, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Название задачи обязательно' });
    }

    const task = await prisma.beauty.create({
      data: {
        userId: req.userId,
        title,
        description: description || '',
        category: category || 'skincare',
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    res.status(201).json({
      message: 'Задача создана!',
      task,
    });
  } catch (error) {
    console.error('Ошибка создания задачи:', error);
    res.status(500).json({ error: 'Ошибка при создании задачи' });
  }
}

/**
 * Обновить задачу красоты
 */
async function updateBeautyTask(req, res) {
  try {
    const { id } = req.params;
    const { title, description, category, doneFlag, dueDate } = req.body;

    // Проверяем, что задача принадлежит пользователю
    const existingTask = await prisma.beauty.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }

    const task = await prisma.beauty.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(category && { category }),
        ...(doneFlag !== undefined && { doneFlag }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
    });

    res.json({
      message: 'Задача обновлена!',
      task,
    });
  } catch (error) {
    console.error('Ошибка обновления задачи:', error);
    res.status(500).json({ error: 'Ошибка при обновлении задачи' });
  }
}

/**
 * Удалить задачу красоты
 */
async function deleteBeautyTask(req, res) {
  try {
    const { id } = req.params;

    const existingTask = await prisma.beauty.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }

    await prisma.beauty.delete({ where: { id } });

    res.json({ message: 'Задача удалена!' });
  } catch (error) {
    console.error('Ошибка удаления задачи:', error);
    res.status(500).json({ error: 'Ошибка при удалении задачи' });
  }
}

module.exports = {
  getAllBeautyTasks,
  createBeautyTask,
  updateBeautyTask,
  deleteBeautyTask,
};

