# 🎉 НАЧНИТЕ ЗДЕСЬ!

## ⚡ Ваша конфигурация

✅ **Telegram Bot Token**: `8232747700:AAGIphSHtyMAv7xdQTnmq927YCqNoofB4fY`  
✅ **Frontend**: Задеплоен на Vercel  
⏳ **Backend**: Нужно задеплоить  
⏳ **Bot**: Нужно запустить  

---

## 🚀 Быстрый старт (5 минут)

### Шаг 1: Создайте .env файлы

Создайте файл `.env` в корне проекта:

```bash
cat > .env << 'EOF'
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/assistant_db"

# Backend
PORT=3001
NODE_ENV=development
JWT_SECRET="personal-assistant-super-secret-key-2024"
JWT_EXPIRES_IN="7d"

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Telegram Bot
TELEGRAM_BOT_TOKEN="8232747700:AAGIphSHtyMAv7xdQTnmq927YCqNoofB4fY"
API_URL="http://localhost:3001/api"

# Premium
PREMIUM_ENABLED=false
EOF
```

Создайте файл `backend/.env`:

```bash
cat > backend/.env << 'EOF'
DATABASE_URL="postgresql://user:password@localhost:5432/assistant_db"
PORT=3001
NODE_ENV=development
JWT_SECRET="personal-assistant-super-secret-key-2024"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:3000"
EOF
```

Создайте файл `frontend/.env.local`:

```bash
cat > frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001/api
EOF
```

Создайте файл `bot/.env`:

```bash
cat > bot/.env << 'EOF'
TELEGRAM_BOT_TOKEN="8232747700:AAGIphSHtyMAv7xdQTnmq927YCqNoofB4fY"
API_URL="http://localhost:3001/api"
NODE_ENV=development
EOF
```

### Шаг 2: Установите зависимости

```bash
npm run install:all
```

### Шаг 3: Запустите базу данных

```bash
docker-compose up -d
```

### Шаг 4: Настройте базу данных

```bash
cd backend
npm run prisma:migrate
npm run prisma:seed
cd ..
```

### Шаг 5: Запустите все сервисы

```bash
npm run dev
```

### Шаг 6: Откройте приложение

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Telegram Bot**: работает в фоне

### Шаг 7: Тестовый аккаунт

```
Email: test@example.com
Password: password123
```

### Шаг 8: Протестируйте Telegram бота

1. Откройте Telegram
2. Найдите вашего бота (имя бота зависит от настройки в BotFather)
3. Отправьте `/start`
4. Попробуйте команды: `/help`, `/habits`, `/mood`

---

## 📱 Следующие шаги

### Для локальной разработки:
✅ Всё готово! Начинайте использовать приложение

### Для production:

1. **Деплой Backend** (выберите один):
   - Railway (рекомендуется) - см. `VERCEL_SETUP.md`
   - Render
   - Heroku

2. **Обновите Frontend на Vercel**:
   - Добавьте переменную: `NEXT_PUBLIC_API_URL=https://your-backend-url.com/api`
   - Redeploy

3. **Запустите Telegram Bot**:
   - Railway/Render (рекомендуется)
   - VPS с PM2
   - См. детали в `TELEGRAM_BOT_INSTRUCTIONS.md`

---

## 📚 Документация

| Файл | Что внутри |
|------|-----------|
| **START_HERE.md** | ⭐ Этот файл - начните здесь! |
| **QUICKSTART.md** | Быстрый старт за 5 минут |
| **VERCEL_SETUP.md** | Настройка Vercel + Backend + Bot |
| **TELEGRAM_BOT_INSTRUCTIONS.md** | Всё про Telegram бота |
| **README.md** | Полная документация проекта |
| **DEPLOYMENT.md** | Деплой в production |
| **PROJECT_STRUCTURE.md** | Описание структуры |

---

## 🎯 Команды для работы

```bash
# Установка
npm run install:all

# Запуск всего проекта
npm run dev

# Запуск по отдельности
npm run dev:backend    # Backend на :3001
npm run dev:frontend   # Frontend на :3000
npm run dev:bot        # Telegram bot

# База данных
cd backend
npm run prisma:studio    # Открыть Prisma Studio
npm run prisma:migrate   # Выполнить миграции
npm run prisma:seed      # Заполнить тестовыми данными

# Docker
docker-compose up -d     # Запустить PostgreSQL
docker-compose down      # Остановить
docker-compose restart   # Перезапустить
```

---

## 🤖 Команды Telegram-бота

После `/start` в боте:

- `/help` - показать все команды
- `/habits` - привычки с кнопками выполнения
- `/goals` - список целей
- `/mood` - записать настроение
- `/today` - задачи на сегодня
- `/stats` - статистика

**Или используйте кнопки**:
- 📝 Привычки
- 🎯 Цели
- 😊 Настроение
- 📊 Статистика

**Уведомления**:
- 🌅 9:00 - утренние напоминания
- 🌙 21:00 - вечерние напоминания

---

## 🐛 Проблемы?

### "Cannot connect to database"
```bash
docker-compose restart
```

### "Port 3000/3001 already in use"
```bash
# Измените порты в .env файлах
```

### "Prisma error"
```bash
cd backend
rm -rf node_modules/.prisma
npm run prisma:generate
```

### "Bot not responding"
1. Проверьте что backend запущен
2. Проверьте токен бота в `.env`
3. Проверьте логи в консоли

---

## 🎊 Готово!

Теперь у вас есть:
- ✨ Полностью работающее веб-приложение
- 🤖 Telegram бот с вашим токеном
- 📊 База данных с тестовыми данными
- 📚 Подробная документация

---

## 📞 Что дальше?

### Хотите задеплоить в production?
→ Читайте **VERCEL_SETUP.md**

### Хотите настроить бота детальнее?
→ Читайте **TELEGRAM_BOT_INSTRUCTIONS.md**

### Хотите изучить код?
→ Читайте **PROJECT_STRUCTURE.md**

### Хотите полную документацию?
→ Читайте **README.md**

---

**Приятной работы! 💕✨**

Ваш токен бота сохранён и готов к использованию:
`8232747700:AAGIphSHtyMAv7xdQTnmq927YCqNoofB4fY`

