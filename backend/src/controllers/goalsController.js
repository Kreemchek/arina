const prisma = require('../utils/prisma');

/**
 * Получить все цели пользователя
 */
async function getAllGoals(req, res) {
  try {
    const { category } = req.query;

    const goals = await prisma.goal.findMany({
      where: {
        userId: req.userId,
        ...(category && { category }),
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ goals });
  } catch (error) {
    console.error('Ошибка получения целей:', error);
    res.status(500).json({ error: 'Ошибка при получении целей' });
  }
}

/**
 * Создать новую цель
 */
async function createGoal(req, res) {
  try {
    const { title, description, steps, deadline, category } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Название цели обязательно' });
    }

    const goal = await prisma.goal.create({
      data: {
        userId: req.userId,
        title,
        description: description || null,
        steps: steps || [],
        deadline: deadline ? new Date(deadline) : null,
        category: category || null,
      },
    });

    res.status(201).json({
      message: 'Цель создана!',
      goal,
    });
  } catch (error) {
    console.error('Ошибка создания цели:', error);
    res.status(500).json({ error: 'Ошибка при создании цели' });
  }
}

/**
 * Обновить цель
 */
async function updateGoal(req, res) {
  try {
    const { id } = req.params;
    const { title, description, steps, doneFlag, deadline, category } = req.body;

    // Проверяем, что цель принадлежит пользователю
    const existingGoal = await prisma.goal.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingGoal) {
      return res.status(404).json({ error: 'Цель не найдена' });
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(steps !== undefined && { steps }),
        ...(doneFlag !== undefined && { doneFlag }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
        ...(category !== undefined && { category }),
      },
    });

    res.json({
      message: 'Цель обновлена!',
      goal,
    });
  } catch (error) {
    console.error('Ошибка обновления цели:', error);
    res.status(500).json({ error: 'Ошибка при обновлении цели' });
  }
}

/**
 * Удалить цель
 */
async function deleteGoal(req, res) {
  try {
    const { id } = req.params;

    const existingGoal = await prisma.goal.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingGoal) {
      return res.status(404).json({ error: 'Цель не найдена' });
    }

    await prisma.goal.delete({ where: { id } });

    res.json({ message: 'Цель удалена!' });
  } catch (error) {
    console.error('Ошибка удаления цели:', error);
    res.status(500).json({ error: 'Ошибка при удалении цели' });
  }
}

module.exports = {
  getAllGoals,
  createGoal,
  updateGoal,
  deleteGoal,
};

