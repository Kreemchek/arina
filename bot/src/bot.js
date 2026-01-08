require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const cron = require('node-cron');
const { getApiClient } = require('./api');
const handlers = require('./handlers');
const notifications = require('./notifications');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN не найден в .env файле');
  process.exit(1);
}

// Создание бота
const bot = new Telegraf(BOT_TOKEN);

// Хранилище для связки пользователей (в продакшене использовать БД)
// { telegramId: { token: 'jwt-token', userId: 'uuid' } }
global.userSessions = {};

/**
 * Команда /start - приветствие
 */
bot.start((ctx) => {
  const welcomeMessage = `
👋 Привет! Я твой личный ассистент! 💕

Я помогу тебе:
✨ Отслеживать привычки
📔 Вести дневник настроения
💅 Не забывать о красоте
🎯 Достигать целей

Для начала используй команду /login чтобы подключить свой аккаунт.

Доступные команды:
/login - Войти в аккаунт
/habits - Мои привычки
/today - Задачи на сегодня
/mood - Записать настроение
/goals - Мои цели
/stats - Моя статистика
/help - Помощь
  `;

  ctx.reply(welcomeMessage, 
    Markup.keyboard([
      ['📝 Привычки', '🎯 Цели'],
      ['😊 Настроение', '📊 Статистика'],
      ['ℹ️ Помощь']
    ]).resize()
  );
});

/**
 * Команда /help - помощь
 */
bot.command('help', handlers.handleHelp);

/**
 * Команда /login - вход в систему
 */
bot.command('login', handlers.handleLoginRequest);

/**
 * Команда /habits - список привычек
 */
bot.command('habits', handlers.handleHabits);
bot.hears('📝 Привычки', handlers.handleHabits);

/**
 * Команда /goals - список целей
 */
bot.command('goals', handlers.handleGoals);
bot.hears('🎯 Цели', handlers.handleGoals);

/**
 * Команда /mood - записать настроение
 */
bot.command('mood', handlers.handleMoodRequest);
bot.hears('😊 Настроение', handlers.handleMoodRequest);

/**
 * Команда /stats - статистика
 */
bot.command('stats', handlers.handleStats);
bot.hears('📊 Статистика', handlers.handleStats);

/**
 * Команда /today - задачи на сегодня
 */
bot.command('today', handlers.handleToday);

/**
 * Обработка callback-кнопок
 */
bot.on('callback_query', async (ctx) => {
  const data = ctx.callbackQuery.data;

  try {
    if (data.startsWith('complete_habit_')) {
      const habitId = data.replace('complete_habit_', '');
      await handlers.handleCompleteHabit(ctx, habitId);
    } else if (data.startsWith('complete_goal_')) {
      const goalId = data.replace('complete_goal_', '');
      await handlers.handleCompleteGoal(ctx, goalId);
    } else if (data.startsWith('mood_')) {
      const mood = data.replace('mood_', '');
      await handlers.handleMoodSelection(ctx, mood);
    }
  } catch (error) {
    console.error('Ошибка обработки callback:', error);
    ctx.answerCbQuery('Произошла ошибка');
  }
});

/**
 * Обработка текстовых сообщений для ввода заметок
 */
bot.on('text', async (ctx) => {
  // Проверяем, ждём ли мы заметки для дневника
  const userId = ctx.from.id;
  if (global.awaitingMoodNotes && global.awaitingMoodNotes[userId]) {
    await handlers.handleMoodNotes(ctx);
  }
});

/**
 * Настройка ежедневных напоминаний
 * Отправка в 9:00 каждый день
 */
cron.schedule('0 9 * * *', async () => {
  console.log('⏰ Отправка ежедневных напоминаний...');
  await notifications.sendDailyReminders(bot);
});

/**
 * Вечерние напоминания о настроении
 * Отправка в 21:00 каждый день
 */
cron.schedule('0 21 * * *', async () => {
  console.log('🌙 Отправка вечерних напоминаний о настроении...');
  await notifications.sendEveningReminders(bot);
});

/**
 * Обработка ошибок
 */
bot.catch((err, ctx) => {
  console.error('Ошибка бота:', err);
  ctx.reply('Произошла ошибка. Попробуйте позже или используйте /help');
});

/**
 * Запуск бота
 */
bot.launch()
  .then(() => {
    console.log('🤖 Telegram-бот запущен!');
    console.log('📱 Бот готов принимать сообщения');
  })
  .catch((error) => {
    console.error('❌ Ошибка запуска бота:', error);
    process.exit(1);
  });

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;

