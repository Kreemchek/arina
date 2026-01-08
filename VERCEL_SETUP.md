# 🚀 Настройка Vercel + Telegram Bot

Инструкция по настройке интеграции между Vercel фронтендом и Telegram ботом.

## 📋 Что у вас есть

✅ Telegram Bot Token: `8232747700:AAGIphSHtyMAv7xdQTnmq927YCqNoofB4fY`  
✅ Frontend задеплоен на Vercel  
⚠️ Нужно задеплоить Backend  

## 🎯 План настройки

### 1️⃣ Деплой Backend

Backend нужно задеплоить на одном из этих сервисов:

#### Вариант A: Railway (Рекомендуется)

```bash
# 1. Создайте аккаунт на railway.app
# 2. Установите Railway CLI
npm i -g @railway/cli

# 3. Войдите в Railway
railway login

# 4. Создайте новый проект
railway init

# 5. Добавьте PostgreSQL
# В Railway Dashboard: New → Database → PostgreSQL

# 6. Настройте переменные окружения в Railway Dashboard:
DATABASE_URL=<автоматически из PostgreSQL плагина>
JWT_SECRET="personal-assistant-super-secret-key-2024"
JWT_EXPIRES_IN="7d"
NODE_ENV="production"
PORT="3001"
CORS_ORIGIN="https://your-vercel-app.vercel.app"

# 7. Деплой backend
cd backend
railway up

# 8. Выполните миграции
railway run npm run prisma:migrate deploy
railway run npm run prisma:seed
```

После деплоя Railway даст вам URL типа: `https://your-app.up.railway.app`

#### Вариант B: Render

1. Перейдите на [render.com](https://render.com)
2. Создайте новый Web Service из GitHub репозитория
3. Настройки:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run prisma:generate`
   - **Start Command**: `npm start`
4. Создайте PostgreSQL Database на Render
5. Добавьте Environment Variables (как выше)

#### Вариант C: Heroku

```bash
# 1. Установите Heroku CLI
npm install -g heroku

# 2. Войдите
heroku login

# 3. Создайте приложение
cd backend
heroku create your-assistant-backend

# 4. Добавьте PostgreSQL
heroku addons:create heroku-postgresql:mini

# 5. Настройте переменные
heroku config:set JWT_SECRET="personal-assistant-super-secret-key-2024"
heroku config:set JWT_EXPIRES_IN="7d"
heroku config:set NODE_ENV="production"
heroku config:set CORS_ORIGIN="https://your-vercel-app.vercel.app"

# 6. Деплой
git push heroku main

# 7. Миграции
heroku run npm run prisma:migrate deploy
heroku run npm run prisma:seed
```

### 2️⃣ Обновите Frontend на Vercel

1. Откройте ваш проект на Vercel
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте переменную:
   ```
   NEXT_PUBLIC_API_URL = https://your-backend-url.com/api
   ```
4. **Redeploy** проект

### 3️⃣ Деплой Telegram Bot

Бот нужно запустить на сервере, который работает 24/7.

#### Вариант A: Railway (тот же проект)

```bash
# Из корневой директории проекта
cd bot

# Создайте отдельный сервис в Railway для бота
railway link  # выберите тот же проект
railway service create bot

# Настройте переменные окружения для бота:
TELEGRAM_BOT_TOKEN="8232747700:AAGIphSHtyMAv7xdQTnmq927YCqNoofB4fY"
API_URL="https://your-backend-url.railway.app/api"
NODE_ENV="production"

# Деплой
railway up
```

#### Вариант B: Render

1. Создайте новый Web Service для бота
2. Настройки:
   - **Root Directory**: `bot`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Добавьте Environment Variables

#### Вариант C: VPS (Digital Ocean, AWS, etc.)

```bash
# На сервере
git clone your-repo-url
cd Аринка/bot

# Установите зависимости
npm install

# Создайте .env файл
cat > .env << EOF
TELEGRAM_BOT_TOKEN="8232747700:AAGIphSHtyMAv7xdQTnmq927YCqNoofB4fY"
API_URL="https://your-backend-url.com/api"
NODE_ENV="production"
EOF

# Установите PM2
npm install -g pm2

# Запустите бота
pm2 start src/bot.js --name assistant-bot
pm2 save
pm2 startup
```

### 4️⃣ Webhook для Telegram бота (Опционально, для production)

Для лучшей производительности используйте webhook вместо polling:

```javascript
// bot/src/bot.js - добавьте это вместо bot.launch()

const express = require('express');
const app = express();

if (process.env.NODE_ENV === 'production') {
  // Webhook mode
  const domain = process.env.WEBHOOK_DOMAIN; // https://your-bot-domain.com
  const webhookPath = `/webhook/${BOT_TOKEN}`;
  
  bot.telegram.setWebhook(`${domain}${webhookPath}`);
  app.use(bot.webhookCallback(webhookPath));
  
  app.listen(process.env.PORT || 3002, () => {
    console.log('Bot webhook server started');
  });
} else {
  // Polling mode (для разработки)
  bot.launch();
}
```

## 🔧 Итоговая конфигурация

После всех настроек у вас будет:

```
Frontend (Vercel):
https://your-app.vercel.app
↓
Backend (Railway/Render/Heroku):
https://your-backend.railway.app
↓
Database (Railway/Render/Heroku):
PostgreSQL
↓
Telegram Bot (Railway/Render/VPS):
Работает 24/7
```

## ✅ Проверка работоспособности

### 1. Проверьте Backend
```bash
curl https://your-backend-url.com/
# Должен вернуть JSON с информацией об API
```

### 2. Проверьте Frontend
- Откройте https://your-vercel-app.vercel.app
- Попробуйте зарегистрироваться
- Создайте привычку

### 3. Проверьте Telegram Bot
- Найдите бота в Telegram: `@your_bot_name`
- Отправьте `/start`
- Попробуйте команды `/help`, `/habits`

## 🔐 Важные переменные окружения

### Backend (Railway/Render/Heroku)
```env
DATABASE_URL=<автоматически>
JWT_SECRET="personal-assistant-super-secret-key-2024"
JWT_EXPIRES_IN="7d"
NODE_ENV="production"
PORT="3001"
CORS_ORIGIN="https://your-vercel-app.vercel.app"
```

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

### Bot (Railway/Render/VPS)
```env
TELEGRAM_BOT_TOKEN="8232747700:AAGIphSHtyMAv7xdQTnmq927YCqNoofB4fY"
API_URL="https://your-backend-url.com/api"
NODE_ENV="production"
```

## 🐛 Troubleshooting

### Backend не отвечает
1. Проверьте логи в Railway/Render Dashboard
2. Убедитесь что миграции выполнены
3. Проверьте DATABASE_URL

### Frontend не может подключиться к Backend
1. Проверьте CORS_ORIGIN в backend
2. Убедитесь что NEXT_PUBLIC_API_URL указывает на правильный URL
3. Проверьте что backend доступен

### Бот не отвечает
1. Проверьте что процесс запущен
2. Проверьте логи бота
3. Убедитесь что API_URL правильный
4. Проверьте токен бота

## 📞 Следующие шаги

1. ✅ Задеплойте backend на Railway/Render
2. ✅ Обновите переменные на Vercel
3. ✅ Запустите бота на Railway/Render/VPS
4. ✅ Протестируйте всю систему
5. ✅ Настройте мониторинг (Sentry)
6. ✅ Настройте backup БД

## 🎉 Готово!

После выполнения всех шагов у вас будет полностью работающее приложение:
- ✨ Frontend на Vercel
- 🚀 Backend на Railway/Render
- 🤖 Telegram Bot 24/7
- 🗄️ PostgreSQL Database

---

**Нужна помощь?** Проверьте логи сервисов или напишите в поддержку! 💕

