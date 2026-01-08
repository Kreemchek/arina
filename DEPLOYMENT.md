# 🚀 Руководство по деплою

Инструкция по развертыванию приложения "Личный Ассистент" в production.

## 📋 Содержание

1. [Подготовка](#подготовка)
2. [Деплой Backend](#деплой-backend)
3. [Деплой Frontend](#деплой-frontend)
4. [Деплой Telegram-бота](#деплой-telegram-бота)
5. [Настройка базы данных](#настройка-базы-данных)
6. [Мониторинг и логирование](#мониторинг-и-логирование)

## Подготовка

### 1. Checklist перед деплоем

- [ ] Изменены все секретные ключи (JWT_SECRET)
- [ ] Настроены переменные окружения для production
- [ ] Обновлены CORS настройки
- [ ] Настроен SSL/HTTPS
- [ ] Созданы backup базы данных
- [ ] Протестировано на staging окружении

### 2. Необходимые сервисы

- **Хостинг backend**: Railway, Render, Heroku, VPS
- **Хостинг frontend**: Vercel, Netlify, AWS Amplify
- **База данных**: Supabase, Railway, AWS RDS, DigitalOcean
- **Telegram бот**: VPS, Railway, Render
- **CDN**: Cloudflare (опционально)

## Деплой Backend

### Вариант 1: Railway

1. Создайте аккаунт на [Railway.app](https://railway.app)

2. Создайте новый проект и добавьте PostgreSQL

3. Клонируйте репозиторий в Railway:
   ```bash
   railway login
   railway init
   railway link
   ```

4. Настройте переменные окружения:
   ```bash
   railway variables set DATABASE_URL="postgresql://..."
   railway variables set JWT_SECRET="your-production-secret"
   railway variables set NODE_ENV="production"
   railway variables set PORT="3001"
   ```

5. Деплой:
   ```bash
   cd backend
   railway up
   ```

6. Выполните миграции:
   ```bash
   railway run npm run prisma:migrate
   ```

### Вариант 2: Render

1. Создайте аккаунт на [Render.com](https://render.com)

2. Создайте новый Web Service из GitHub репозитория

3. Настройки:
   - Build Command: `cd backend && npm install && npm run prisma:generate`
   - Start Command: `cd backend && npm start`
   - Environment: Node

4. Добавьте Environment Variables в Render Dashboard

5. Создайте PostgreSQL Database на Render и подключите к сервису

### Вариант 3: VPS (Ubuntu)

```bash
# Обновить систему
sudo apt update && sudo apt upgrade -y

# Установить Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Установить PostgreSQL
sudo apt install postgresql postgresql-contrib

# Установить PM2
sudo npm install -g pm2

# Клонировать репозиторий
git clone your-repo-url
cd backend

# Установить зависимости
npm install

# Настроить .env файл
nano .env

# Выполнить миграции
npm run prisma:migrate

# Запустить с PM2
pm2 start src/server.js --name "assistant-backend"
pm2 save
pm2 startup

# Настроить Nginx как reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/assistant

# Nginx конфигурация:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Активировать сайт
sudo ln -s /etc/nginx/sites-available/assistant /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Настроить SSL с Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Деплой Frontend

### Вариант 1: Vercel (рекомендуется для Next.js)

1. Установите Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Деплой:
   ```bash
   cd frontend
   vercel
   ```

3. Настройте Environment Variables в Vercel Dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
   ```

4. Каждый push в main ветку будет автоматически деплоиться

### Вариант 2: Netlify

1. Создайте аккаунт на [Netlify](https://netlify.com)

2. Подключите GitHub репозиторий

3. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/.next`

4. Добавьте Environment Variables

5. Deploy!

## Деплой Telegram-бота

### Webhook вместо Polling (для production)

1. Обновите `bot/src/bot.js` для использования webhook:

```javascript
// Вместо bot.launch() используйте:
const domain = process.env.WEBHOOK_DOMAIN; // https://your-bot-domain.com
const webhookPath = `/webhook/${BOT_TOKEN}`;

bot.telegram.setWebhook(`${domain}${webhookPath}`);

// Настройте Express для обработки webhook
const express = require('express');
const app = express();

app.use(bot.webhookCallback(webhookPath));
app.listen(process.env.PORT || 3002, () => {
  console.log('Bot webhook server started');
});
```

2. Деплой на Railway/Render аналогично backend

### Запуск на VPS с PM2

```bash
cd bot
npm install
pm2 start src/bot.js --name "assistant-bot"
pm2 save
```

## Настройка базы данных

### Production PostgreSQL

#### Supabase (рекомендуется)

1. Создайте проект на [Supabase](https://supabase.com)
2. Скопируйте Database URL из Settings > Database
3. Обновите DATABASE_URL в переменных окружения
4. Включите SSL: `DATABASE_URL="postgresql://...?sslmode=require"`

#### Railway PostgreSQL

1. Создайте PostgreSQL Plugin в Railway
2. Скопируйте DATABASE_URL
3. Настройте автоматические backup

#### AWS RDS

1. Создайте PostgreSQL instance в RDS
2. Настройте Security Groups
3. Включите автоматические backup
4. Настройте Read Replicas для масштабирования

### Миграции в production

```bash
# Выполните миграции после деплоя
cd backend
npx prisma migrate deploy

# Опционально: заполните начальными данными
npx prisma db seed
```

## Мониторинг и логирование

### 1. Sentry для отслеживания ошибок

```bash
npm install @sentry/node @sentry/tracing
```

```javascript
// backend/src/server.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

### 2. PM2 Monitoring

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Просмотр логов
pm2 logs
pm2 monit
```

### 3. Логирование с Winston

```bash
npm install winston
```

```javascript
// backend/src/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;
```

### 4. Healthcheck endpoints

```javascript
// backend/src/server.js
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});
```

## Безопасность в Production

### 1. Helmet.js для HTTP headers

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 2. Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов
});

app.use('/api/', limiter);
```

### 3. CORS в production

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
```

## Backup и восстановление

### Автоматический backup PostgreSQL

```bash
# Создайте скрипт backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
# Загрузите в S3 или другое хранилище

# Настройте cron
crontab -e
0 2 * * * /path/to/backup.sh
```

### Восстановление из backup

```bash
psql $DATABASE_URL < backup_20240108.sql
```

## Финальный Checklist

- [ ] Backend развернут и доступен по HTTPS
- [ ] Frontend развернут и доступен
- [ ] База данных настроена с backup
- [ ] Telegram бот работает на webhook
- [ ] SSL сертификаты установлены
- [ ] Мониторинг настроен (Sentry, PM2)
- [ ] Логирование настроено
- [ ] Rate limiting включен
- [ ] CORS настроен правильно
- [ ] Environment variables в безопасности
- [ ] Healthcheck endpoints работают
- [ ] Документация обновлена

---

**Успешного деплоя! 🚀**

