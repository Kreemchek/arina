/**
 * Скрипт для выдачи premium подписки пользователям
 * Запуск: node grant_premium.js
 */

require('dotenv').config();
const prisma = require('./src/utils/prisma');

const PREMIUM_TELEGRAM_IDS = ['7681450378', '937128381'];

async function grantPremium() {
  try {
    console.log('🚀 Выдача premium подписки...\n');

    for (const telegramId of PREMIUM_TELEGRAM_IDS) {
      // Ищем пользователя по telegramId
      const user = await prisma.user.findFirst({
        where: { telegramId },
      });

      if (user) {
        // Обновляем premium статус
        await prisma.user.update({
          where: { id: user.id },
          data: { premiumFlag: true },
        });
        console.log(`✅ Premium выдан пользователю: ${user.name} (${user.email}) - telegramId: ${telegramId}`);
      } else {
        console.log(`⚠️  Пользователь с telegramId ${telegramId} не найден`);
      }
    }

    console.log('\n✅ Готово!');
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

grantPremium();
