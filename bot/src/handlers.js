const { Markup } = require('telegraf');
const api = require('./api');

// Временное хранилище для ожидания ввода заметок
global.awaitingMoodNotes = {};

/**
 * Обработчик команды /help
 */
async function handleHelp(ctx) {
  const helpMessage = `
🤖 Доступные команды:

/start - Начать работу с ботом
/login - Войти в аккаунт (используй токен из веб-приложения)
/habits - Посмотреть мои привычки
/goals - Посмотреть мои цели
/today - Задачи и привычки на сегодня
/mood - Записать настроение
/stats - Моя статистика
/help - Показать эту справку

💡 Используй кнопки меню для быстрого доступа!
  `;
  
  await ctx.reply(helpMessage);
}

/**
 * Обработчик запроса входа
 */
async function handleLoginRequest(ctx) {
  const loginMessage = `
🔐 Для входа в систему:

1. Откройте веб-приложение и войдите в свой аккаунт
2. В профиле скопируйте ваш токен доступа
3. Отправьте мне команду в формате:
   /connect YOUR_TOKEN_HERE

⚠️ Внимание: в реальном приложении используется OAuth или специальный механизм связки аккаунтов.
Сейчас это заглушка для демонстрации функционала.

Для тестирования можно использовать email/password напрямую через веб-приложение.
  `;
  
  await ctx.reply(loginMessage);
}

/**
 * Получение привычек пользователя
 */
async function handleHabits(ctx) {
  try {
    const session = api.getUserSession(ctx.from.id);
    
    if (!session) {
      return ctx.reply('Сначала войдите в систему используя /login');
    }

    const habits = await api.getHabits(session.token);
    
    if (habits.length === 0) {
      return ctx.reply('У вас пока нет привычек. Создайте их в веб-приложении!');
    }

    const activeHabits = habits.filter(h => h.isActive);
    
    let message = '📝 Ваши активные привычки:\n\n';
    const buttons = [];

    activeHabits.forEach((habit, index) => {
      message += `${index + 1}. ${habit.title}\n`;
      message += `   Серия: ${habit.streak} дней | Прогресс: ${habit.progress}\n\n`;
      
      buttons.push([
        Markup.button.callback(
          `✅ Выполнить "${habit.title}"`,
          `complete_habit_${habit.id}`
        )
      ]);
    });

    await ctx.reply(message, Markup.inlineKeyboard(buttons));
  } catch (error) {
    console.error('Ошибка получения привычек:', error);
    ctx.reply('Ошибка загрузки привычек. Проверьте, что вы вошли в систему.');
  }
}

/**
 * Отметить выполнение привычки
 */
async function handleCompleteHabit(ctx, habitId) {
  try {
    const session = api.getUserSession(ctx.from.id);
    
    if (!session) {
      return ctx.answerCbQuery('Сначала войдите в систему');
    }

    await api.completeHabit(session.token, habitId);
    
    await ctx.answerCbQuery('✅ Привычка выполнена! Молодец! 🎉');
    await ctx.reply('Отлично! Продолжай в том же духе! 💪');
    
    // Обновляем список привычек
    await handleHabits(ctx);
  } catch (error) {
    console.error('Ошибка выполнения привычки:', error);
    ctx.answerCbQuery('Ошибка выполнения привычки');
  }
}

/**
 * Получение целей пользователя
 */
async function handleGoals(ctx) {
  try {
    const session = api.getUserSession(ctx.from.id);
    
    if (!session) {
      return ctx.reply('Сначала войдите в систему используя /login');
    }

    const goals = await api.getGoals(session.token);
    
    if (goals.length === 0) {
      return ctx.reply('У вас пока нет целей. Создайте их в веб-приложении!');
    }

    const activeGoals = goals.filter(g => !g.doneFlag);
    
    let message = '🎯 Ваши активные цели:\n\n';
    const buttons = [];

    activeGoals.forEach((goal, index) => {
      message += `${index + 1}. ${goal.title}\n`;
      if (goal.description) {
        message += `   ${goal.description}\n`;
      }
      message += '\n';
      
      buttons.push([
        Markup.button.callback(
          `✅ Отметить "${goal.title}"`,
          `complete_goal_${goal.id}`
        )
      ]);
    });

    await ctx.reply(message, Markup.inlineKeyboard(buttons));
  } catch (error) {
    console.error('Ошибка получения целей:', error);
    ctx.reply('Ошибка загрузки целей. Проверьте, что вы вошли в систему.');
  }
}

/**
 * Отметить выполнение цели
 */
async function handleCompleteGoal(ctx, goalId) {
  try {
    const session = api.getUserSession(ctx.from.id);
    
    if (!session) {
      return ctx.answerCbQuery('Сначала войдите в систему');
    }

    await api.completeGoal(session.token, goalId);
    
    await ctx.answerCbQuery('🎉 Цель достигнута! Поздравляю!');
    await ctx.reply('Невероятно! Ты достигла своей цели! 🌟✨');
    
    // Обновляем список целей
    await handleGoals(ctx);
  } catch (error) {
    console.error('Ошибка выполнения цели:', error);
    ctx.answerCbQuery('Ошибка выполнения цели');
  }
}

/**
 * Запрос настроения
 */
async function handleMoodRequest(ctx) {
  const session = api.getUserSession(ctx.from.id);
  
  if (!session) {
    return ctx.reply('Сначала войдите в систему используя /login');
  }

  const moodButtons = Markup.inlineKeyboard([
    [
      Markup.button.callback('😊 Счастлива', 'mood_happy'),
      Markup.button.callback('🤩 Взволнована', 'mood_excited'),
    ],
    [
      Markup.button.callback('😐 Нормально', 'mood_neutral'),
      Markup.button.callback('😢 Грустно', 'mood_sad'),
    ],
    [
      Markup.button.callback('😰 Тревожно', 'mood_anxious'),
    ],
  ]);

  await ctx.reply('Как ты себя чувствуешь сегодня?', moodButtons);
}

/**
 * Выбор настроения
 */
async function handleMoodSelection(ctx, mood) {
  const userId = ctx.from.id;
  
  // Сохраняем выбранное настроение
  if (!global.awaitingMoodNotes) {
    global.awaitingMoodNotes = {};
  }
  
  global.awaitingMoodNotes[userId] = {
    mood,
    timestamp: Date.now(),
  };

  await ctx.answerCbQuery();
  await ctx.reply('Расскажи, что произошло сегодня? Что ты чувствуешь?');
}

/**
 * Сохранение заметок о настроении
 */
async function handleMoodNotes(ctx) {
  const userId = ctx.from.id;
  const moodData = global.awaitingMoodNotes[userId];
  
  if (!moodData) {
    return;
  }

  try {
    const session = api.getUserSession(userId);
    
    if (!session) {
      delete global.awaitingMoodNotes[userId];
      return ctx.reply('Сначала войдите в систему используя /login');
    }

    const notes = ctx.message.text;
    
    // Определяем moodScore на основе типа настроения
    const moodScores = {
      happy: 8,
      excited: 9,
      neutral: 5,
      sad: 3,
      anxious: 4,
    };

    await api.createDiaryEntry(session.token, {
      mood: moodData.mood,
      moodScore: moodScores[moodData.mood] || 5,
      notes,
    });

    delete global.awaitingMoodNotes[userId];

    await ctx.reply('Спасибо за запись! Твоё настроение сохранено 💕');
  } catch (error) {
    console.error('Ошибка сохранения настроения:', error);
    delete global.awaitingMoodNotes[userId];
    ctx.reply('Ошибка сохранения настроения');
  }
}

/**
 * Получение статистики
 */
async function handleStats(ctx) {
  try {
    const session = api.getUserSession(ctx.from.id);
    
    if (!session) {
      return ctx.reply('Сначала войдите в систему используя /login');
    }

    const stats = await api.getStats(session.token);
    
    const message = `
📊 Твоя статистика:

✨ Привычки:
   • Всего: ${stats.totalHabits}
   • Активных: ${stats.activeHabits}

🎯 Цели:
   • Всего: ${stats.totalGoals}
   • Достигнуто: ${stats.completedGoals}

😊 Среднее настроение: ${stats.avgMoodScore}/10

Продолжай в том же духе! 💪
    `;

    await ctx.reply(message);
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    ctx.reply('Ошибка загрузки статистики');
  }
}

/**
 * Задачи на сегодня
 */
async function handleToday(ctx) {
  try {
    const session = api.getUserSession(ctx.from.id);
    
    if (!session) {
      return ctx.reply('Сначала войдите в систему используя /login');
    }

    const [habits, beautyTasks] = await Promise.all([
      api.getHabits(session.token),
      api.getBeautyTasks(session.token),
    ]);

    const activeHabits = habits.filter(h => h.isActive).slice(0, 5);
    const pendingBeauty = beautyTasks.filter(t => !t.doneFlag).slice(0, 3);

    let message = '📅 План на сегодня:\n\n';

    if (activeHabits.length > 0) {
      message += '✨ Привычки:\n';
      activeHabits.forEach((habit, i) => {
        message += `${i + 1}. ${habit.title}\n`;
      });
      message += '\n';
    }

    if (pendingBeauty.length > 0) {
      message += '💅 Красота:\n';
      pendingBeauty.forEach((task, i) => {
        message += `${i + 1}. ${task.title}\n`;
      });
      message += '\n';
    }

    if (activeHabits.length === 0 && pendingBeauty.length === 0) {
      message += 'Сегодня у тебя нет задач! Отдохни или создай новые в приложении 💕';
    } else {
      message += 'У тебя всё получится! 💪✨';
    }

    await ctx.reply(message);
  } catch (error) {
    console.error('Ошибка получения задач:', error);
    ctx.reply('Ошибка загрузки задач на сегодня');
  }
}

module.exports = {
  handleHelp,
  handleLoginRequest,
  handleHabits,
  handleCompleteHabit,
  handleGoals,
  handleCompleteGoal,
  handleMoodRequest,
  handleMoodSelection,
  handleMoodNotes,
  handleStats,
  handleToday,
};

