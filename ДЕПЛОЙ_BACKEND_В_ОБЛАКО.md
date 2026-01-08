# ☁️ Как Задеплоить Backend в Облако

## 🎯 Зачем Это Нужно?

Чтобы **Frontend на Vercel мог подключиться к Backend**, нужно чтобы Backend тоже был в интернете, а не только на вашем компьютере (`localhost`).

---

## 🚀 Вариант 1: Railway.app (Рекомендуется)

### Преимущества
- ✅ Бесплатный тариф ($5/месяц кредитов)
- ✅ PostgreSQL включен
- ✅ Деплой из GitHub
- ✅ Автоматический HTTPS
- ✅ Логи и мониторинг

### Шаги

#### 1. Регистрация
1. Откройте https://railway.app
2. Войдите через GitHub
3. Подключите репозиторий `Kreemchek/arina`

#### 2. Создание Проекта
```bash
# В Railway Dashboard:
1. New Project → Deploy from GitHub repo
2. Выберите репозиторий: Kreemchek/arina
3. Root Directory: /backend
```

#### 3. Настройка Переменных Окружения
В Railway → Settings → Variables добавьте:
```
DATABASE_URL=<автоматически создастся PostgreSQL>
PORT=3001
NODE_ENV=production
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

#### 4. Настройка PostgreSQL
```bash
# Railway автоматически создаст PostgreSQL
# Скопируйте DATABASE_URL из настроек PostgreSQL
```

#### 5. Изменить schema.prisma обратно на PostgreSQL
```prisma
datasource db {
  provider = "postgresql"  // изменить с sqlite
  url      = env("DATABASE_URL")
}
```

#### 6. Деплой
```bash
# Railway автоматически задеплоит после commit
git add .
git commit -m "Configure for Railway deployment"
git push origin main
```

#### 7. Получить URL Backend
```
Railway Dashboard → Deployments → Domain
Пример: https://arina-production.up.railway.app
```

#### 8. Обновить Frontend на Vercel
```bash
# В Vercel Dashboard → Settings → Environment Variables
NEXT_PUBLIC_API_URL=https://arina-production.up.railway.app/api
```

---

## 🚀 Вариант 2: Render.com

### Преимущества
- ✅ Бесплатный тариф (с ограничениями)
- ✅ PostgreSQL включен
- ✅ Простой интерфейс

### Шаги

#### 1. Регистрация
1. https://render.com
2. Sign up через GitHub

#### 2. Создание Web Service
```
Dashboard → New → Web Service
- Repository: Kreemchek/arina
- Root Directory: backend
- Environment: Node
- Build Command: npm install && npx prisma generate
- Start Command: npm start
```

#### 3. Environment Variables
```
NODE_ENV=production
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

#### 4. Создание PostgreSQL
```
Dashboard → New → PostgreSQL
- Name: arina-db
- Plan: Free
```

#### 5. Подключить БД
```
В Web Service → Environment → Add from Database
Выберите созданную БД
```

---

## 🚀 Вариант 3: Heroku

### Шаги

```bash
# 1. Установить Heroku CLI
brew install heroku/brew/heroku

# 2. Войти
heroku login

# 3. Создать приложение
cd /Users/zalogudachi/Desktop/Аринка/backend
heroku create arina-backend

# 4. Добавить PostgreSQL
heroku addons:create heroku-postgresql:mini

# 5. Настроить переменные
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key
heroku config:set JWT_EXPIRES_IN=7d

# 6. Деплой
git push heroku main

# 7. Запустить миграции
heroku run npx prisma db push
```

---

## 🚀 Вариант 4: Временное Решение - ngrok

Если нужно **быстро показать** проект, но не деплоить:

### Установка
```bash
# MacOS
brew install ngrok

# Регистрация
ngrok config add-authtoken YOUR_TOKEN
```

### Использование
```bash
# Запустить туннель к localhost:3001
ngrok http 3001

# Вы получите публичный URL:
# https://abc123.ngrok.io → localhost:3001
```

### Обновить Vercel
```bash
# В Vercel Environment Variables:
NEXT_PUBLIC_API_URL=https://abc123.ngrok.io/api
```

**⚠️ Важно**: ngrok URL меняется при каждом перезапуске (бесплатная версия)

---

## 📝 После Деплоя Backend

### 1. Обновить Frontend на Vercel
```bash
# Vercel Dashboard → Project → Settings → Environment Variables
NEXT_PUBLIC_API_URL=https://ваш-backend-url.com/api

# Потом:
Vercel Dashboard → Deployments → Redeploy
```

### 2. Обновить Bot
```bash
# В bot/.env:
API_URL=https://ваш-backend-url.com/api

# Перезапустить бота
```

### 3. Изменить CORS в Backend
```javascript
// backend/src/server.js
app.use(cors({
  origin: [
    'https://your-vercel-app.vercel.app',
    'http://localhost:3000'  // для локальной разработки
  ]
}));
```

---

## 🎯 Рекомендуемая Архитектура для Продакшена

```
Frontend (Vercel)
    ↓ HTTPS
Backend (Railway/Render)
    ↓
PostgreSQL (Railway/Render)

Bot (Локально или VPS)
    ↓ HTTPS
Backend (Railway/Render)
```

---

## 💰 Стоимость

| Сервис | Бесплатный Тариф | Платный |
|--------|------------------|---------|
| **Vercel** (Frontend) | ✅ Unlimited | $20/мес |
| **Railway** (Backend) | $5 кредитов/мес | От $5/мес |
| **Render** (Backend) | ✅ 750 часов/мес | От $7/мес |
| **Heroku** (Backend) | ❌ Нет | От $5/мес |

---

## 🔍 Проверка

После деплоя Backend проверьте:

```bash
# Здоровье API
curl https://your-backend-url.com/api/auth/register -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Должен вернуть JWT токен
```

---

## 🐛 Частые Проблемы

### 1. CORS ошибка
**Решение**: Добавьте домен Vercel в CORS origin

### 2. База данных не подключается
**Решение**: Проверьте DATABASE_URL в environment variables

### 3. Prisma ошибки
**Решение**: 
```bash
# В Railway/Render добавить в Build Command:
npm install && npx prisma generate && npx prisma db push
```

---

## 🎉 Итог

После деплоя Backend у вас будет:

```
✅ Frontend: https://arina.vercel.app
✅ Backend:  https://arina.railway.app (или другой)
✅ Bot:      Локально (или на VPS)
```

И всё будет работать из любой точки мира! 🌍

