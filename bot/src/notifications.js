const api = require('./api');

/**
 * Отправка ежедневных утренних напоминаний
 */
async function sendDailyReminders(bot) {
  try {
    // Получаем всех пользователей с активными сессиями
    const users = Object.entries(global.userSessions);

    for (const [telegramId, session] of users) {
      try {
        // Получаем привычки пользователя
        const habits = await api.getHabits(session.token);
        const activeHabits = habits.filter(h => h.isActive);

        if (activeHabits.length === 0) continue;

        let message = '🌅 Доброе утро! ✨\n\n';
        message += 'Вот твои привычки на сегодня:\n\n';

        activeHabits.slice(0, 5).forEach((habit, index) => {
          message += `${index + 1}. ${habit.title}\n`;
        });

        message += '\nТы справишься! Начни свой день правильно! 💪💕';

        await bot.telegram.sendMessage(telegramId, message);
      } catch (error) {
        console.error(`Ошибка отправки напоминания пользователю ${telegramId}:`, error);
      }
    }

    console.log(`✅ Отправлено напоминаний: ${users.length}`);
  } catch (error) {
    console.error('Ошибка отправки ежедневных напоминаний:', error);
  }
}

/**
 * Отправка вечерних напоминаний о настроении
 */
async function sendEveningReminders(bot) {
  try {
    const users = Object.entries(global.userSessions);

    for (const [telegramId, session] of users) {
      try {
        const message = `
🌙 Добрый вечер! 

Как прошёл твой день? Расскажи мне о своём настроении!

Используй команду /mood чтобы записать, как ты себя чувствуешь 💕

Хорошего отдыха! ✨
        `;

        await bot.telegram.sendMessage(telegramId, message);
      } catch (error) {
        console.error(`Ошибка отправки вечернего напоминания пользователю ${telegramId}:`, error);
      }
    }

    console.log(`✅ Отправлено вечерних напоминаний: ${users.length}`);
  } catch (error) {
    console.error('Ошибка отправки вечерних напоминаний:', error);
  }
}

/**
 * Отправка персональных напоминаний о задачах красоты
 */
async function sendBeautyReminders(bot, telegramId) {
  try {
    const session = api.getUserSession(telegramId);
    if (!session) return;

    const beautyTasks = await api.getBeautyTasks(session.token);
    const pendingTasks = beautyTasks.filter(t => !t.doneFlag);

    if (pendingTasks.length === 0) return;

    let message = '💅 Напоминание о красоте!\n\n';
    message += 'У тебя есть незавершённые задачи:\n\n';

    pendingTasks.slice(0, 3).forEach((task, index) => {
      message += `${index + 1}. ${task.title}\n`;
    });

    message += '\nНе забудь позаботиться о себе! ✨';

    await bot.telegram.sendMessage(telegramId, message);
  } catch (error) {
    console.error('Ошибка отправки напоминания о красоте:', error);
  }
}

/**
 * Отправка мотивационного сообщения
 */
async function sendMotivationalMessage(bot, telegramId) {
  const messages = [
    'Ты прекрасна! Продолжай двигаться к своим целям! 💪✨',
    'Каждый день - это новая возможность стать лучше! 🌟',
    'Верь в себя! У тебя всё получится! 💕',
    'Маленькие шаги каждый день ведут к большим результатам! 🎯',
    'Ты уже сделала так много! Гордись собой! 🌸',
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  try {
    await bot.telegram.sendMessage(telegramId, randomMessage);
  } catch (error) {
    console.error('Ошибка отправки мотивационного сообщения:', error);
  }
}

module.exports = {
  sendDailyReminders,
  sendEveningReminders,
  sendBeautyReminders,
  sendMotivationalMessage,
};

