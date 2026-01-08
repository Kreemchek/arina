const prisma = require('../utils/prisma');

/**
 * Получить прогресс пользователя
 */
async function getProgress(req, res) {
  try {
    const { startDate, endDate, limit = 30 } = req.query;

    const where = { userId: req.userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const progress = await prisma.progress.findMany({
      where,
      orderBy: { date: 'desc' },
      take: parseInt(limit),
    });

    res.json({ progress });
  } catch (error) {
    console.error('Ошибка получения прогресса:', error);
    res.status(500).json({ error: 'Ошибка при получении прогресса' });
  }
}

/**
 * Создать или обновить прогресс за день
 */
async function saveProgress(req, res) {
  try {
    const { date, completedHabits, completedGoals, moodScore, notes } = req.body;

    const progressDate = date ? new Date(date) : new Date();
    progressDate.setHours(0, 0, 0, 0); // Обнуляем время для поиска по дате

    // Проверяем, есть ли уже запись за этот день
    const existing = await prisma.progress.findUnique({
      where: {
        userId_date: {
          userId: req.userId,
          date: progressDate,
        },
      },
    });

    let progress;
    if (existing) {
      // Обновляем существующую запись
      progress = await prisma.progress.update({
        where: { id: existing.id },
        data: {
          completedHabits: completedHabits || existing.completedHabits,
          completedGoals: completedGoals || existing.completedGoals,
          moodScore: moodScore !== undefined ? moodScore : existing.moodScore,
          notes: notes !== undefined ? notes : existing.notes,
        },
      });
    } else {
      // Создаём новую запись
      progress = await prisma.progress.create({
        data: {
          userId: req.userId,
          date: progressDate,
          completedHabits: completedHabits || [],
          completedGoals: completedGoals || [],
          moodScore: moodScore || 5,
          notes: notes || null,
        },
      });
    }

    res.json({
      message: 'Прогресс сохранён!',
      progress,
    });
  } catch (error) {
    console.error('Ошибка сохранения прогресса:', error);
    res.status(500).json({ error: 'Ошибка при сохранении прогресса' });
  }
}

/**
 * Получить статистику пользователя
 */
async function getStats(req, res) {
  try {
    // Подсчёт общей статистики
    const [totalHabits, activeHabits, totalGoals, completedGoals] = await Promise.all([
      prisma.habit.count({ where: { userId: req.userId } }),
      prisma.habit.count({ where: { userId: req.userId, isActive: true } }),
      prisma.goal.count({ where: { userId: req.userId } }),
      prisma.goal.count({ where: { userId: req.userId, doneFlag: true } }),
    ]);

    // Прогресс за последние 30 дней
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentProgress = await prisma.progress.findMany({
      where: {
        userId: req.userId,
        date: { gte: thirtyDaysAgo },
      },
      orderBy: { date: 'asc' },
    });

    // Средний mood score за 30 дней
    const avgMoodScore =
      recentProgress.length > 0
        ? recentProgress.reduce((sum, p) => sum + p.moodScore, 0) / recentProgress.length
        : 0;

    res.json({
      stats: {
        totalHabits,
        activeHabits,
        totalGoals,
        completedGoals,
        avgMoodScore: avgMoodScore.toFixed(1),
        recentProgress,
      },
    });
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ error: 'Ошибка при получении статистики' });
  }
}

module.exports = {
  getProgress,
  saveProgress,
  getStats,
};

