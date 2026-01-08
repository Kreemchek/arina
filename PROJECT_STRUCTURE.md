# 📁 Структура проекта

Полное описание структуры файлов и папок проекта.

## 📊 Общая структура

```
Аринка/
│
├── 📂 backend/                  # Backend сервер (Node.js + Express)
│   ├── 📂 prisma/
│   │   ├── schema.prisma       # Схема БД
│   │   └── seed.js             # Тестовые данные
│   ├── 📂 src/
│   │   ├── 📂 controllers/     # Бизнес-логика
│   │   │   ├── authController.js
│   │   │   ├── habitsController.js
│   │   │   ├── diaryController.js
│   │   │   ├── beautyController.js
│   │   │   ├── goalsController.js
│   │   │   └── progressController.js
│   │   ├── 📂 routes/          # API маршруты
│   │   │   ├── auth.js
│   │   │   ├── habits.js
│   │   │   ├── diary.js
│   │   │   ├── beauty.js
│   │   │   ├── goals.js
│   │   │   ├── progress.js
│   │   │   └── payments.js
│   │   ├── 📂 middleware/      # Middleware функции
│   │   │   └── auth.js
│   │   ├── 📂 utils/           # Утилиты
│   │   │   ├── prisma.js       # Prisma Client
│   │   │   └── jwt.js          # JWT утилиты
│   │   └── server.js           # Точка входа
│   ├── package.json
│   └── .env.example
│
├── 📂 frontend/                 # Frontend (Next.js + React)
│   ├── 📂 components/          # React компоненты
│   │   ├── Layout.js           # Главный layout
│   │   └── Navigation.js       # Навигация
│   ├── 📂 pages/               # Next.js страницы
│   │   ├── _app.js             # App wrapper
│   │   ├── _document.js        # Document wrapper
│   │   ├── index.js            # Главная страница
│   │   ├── login.js            # Страница входа
│   │   ├── register.js         # Страница регистрации
│   │   ├── habits.js           # Управление привычками
│   │   ├── diary.js            # Дневник
│   │   ├── beauty.js           # Задачи красоты
│   │   ├── goals.js            # Цели
│   │   └── profile.js          # Профиль
│   ├── 📂 styles/              # Стили
│   │   └── globals.css         # Глобальные стили
│   ├── 📂 utils/               # Утилиты
│   │   ├── api.js              # API клиент
│   │   └── AuthContext.js      # Контекст аутентификации
│   ├── next.config.js          # Next.js конфигурация
│   ├── tailwind.config.js      # Tailwind конфигурация
│   ├── postcss.config.js       # PostCSS конфигурация
│   ├── package.json
│   └── .env.example
│
├── 📂 bot/                      # Telegram бот (Telegraf)
│   ├── 📂 src/
│   │   ├── bot.js              # Главный файл бота
│   │   ├── handlers.js         # Обработчики команд
│   │   ├── notifications.js    # Система уведомлений
│   │   └── api.js              # API клиент
│   ├── package.json
│   └── .env.example
│
├── 📂 database/                 # (опционально) SQL скрипты
│
├── 📄 docker-compose.yml        # PostgreSQL в Docker
├── 📄 package.json              # Root package.json
├── 📄 .gitignore                # Git ignore
├── 📄 .env.example              # Пример переменных окружения
│
├── 📖 README.md                 # Главная документация
├── 📖 QUICKSTART.md             # Быстрый старт
├── 📖 PROJECT_STRUCTURE.md      # Этот файл
├── 📖 DEPLOYMENT.md             # Руководство по деплою
├── 📖 CONTRIBUTING.md           # Руководство для контрибьюторов
├── 📖 CHANGELOG.md              # История изменений
└── 📄 LICENSE                   # MIT License
```

## 🎯 Назначение основных файлов

### Backend

#### Controllers
Отвечают за бизнес-логику приложения:
- `authController.js` - регистрация, вход, профиль
- `habitsController.js` - CRUD операции с привычками
- `diaryController.js` - управление записями дневника
- `beautyController.js` - задачи красоты и стиля
- `goalsController.js` - управление целями
- `progressController.js` - отслеживание прогресса и статистика

#### Routes
Определяют API endpoints:
- `auth.js` - `/api/auth/*` - аутентификация
- `habits.js` - `/api/habits/*` - привычки
- `diary.js` - `/api/diary/*` - дневник
- `beauty.js` - `/api/beauty/*` - красота
- `goals.js` - `/api/goals/*` - цели
- `progress.js` - `/api/progress/*` - прогресс
- `payments.js` - `/api/payments/*` - платежи (заглушка)

#### Middleware
- `auth.js` - проверка JWT токенов, аутентификация пользователей

#### Utils
- `prisma.js` - singleton instance Prisma Client
- `jwt.js` - генерация и проверка JWT токенов

### Frontend

#### Components
Переиспользуемые React компоненты:
- `Layout.js` - wrapper для всех страниц с навигацией
- `Navigation.js` - нижняя/верхняя панель навигации

#### Pages
Next.js страницы (роутинг на основе файловой структуры):
- `index.js` - главная панель с дашбордом
- `login.js` / `register.js` - аутентификация
- `habits.js` - список и управление привычками
- `diary.js` - записи дневника настроения
- `beauty.js` - задачи по уходу за собой
- `goals.js` - постановка и отслеживание целей
- `profile.js` - профиль пользователя, статистика, PDF экспорт

#### Utils
- `api.js` - axios клиент для работы с backend API
- `AuthContext.js` - React Context для управления состоянием аутентификации

### Bot

#### src/
- `bot.js` - главный файл, инициализация бота, обработка команд
- `handlers.js` - функции-обработчики для команд бота
- `notifications.js` - система отправки напоминаний (cron jobs)
- `api.js` - клиент для взаимодействия с backend API

## 🗄️ Модели базы данных

### User (Пользователь)
```prisma
- id: UUID
- name: String
- email: String (unique)
- telegramId: String (optional, unique)
- passwordHash: String
- premiumFlag: Boolean (для премиум подписки)
- timestamps
```

### Habit (Привычка)
```prisma
- id: UUID
- userId: UUID (FK)
- title: String
- type: String (daily/weekly/custom)
- frequency: String (everyday/weekdays/weekends)
- color: String (HEX)
- progress: Int (счётчик выполнений)
- streak: Int (серия дней подряд)
- isActive: Boolean
- timestamps
```

### Diary (Дневник)
```prisma
- id: UUID
- userId: UUID (FK)
- date: DateTime
- mood: String (happy/neutral/sad/anxious/excited)
- moodScore: Int (1-10)
- notes: Text
- timestamps
```

### Beauty (Красота/Стиль)
```prisma
- id: UUID
- userId: UUID (FK)
- title: String
- description: Text
- category: String (skincare/makeup/hair/nails/style)
- doneFlag: Boolean
- dueDate: DateTime (optional)
- timestamps
```

### Goal (Цель)
```prisma
- id: UUID
- userId: UUID (FK)
- title: String
- description: Text (optional)
- steps: JSON (массив шагов [{text, done}])
- doneFlag: Boolean
- deadline: DateTime (optional)
- category: String (career/health/personal/financial)
- timestamps
```

### Progress (Прогресс)
```prisma
- id: UUID
- userId: UUID (FK)
- date: DateTime (unique per user per day)
- completedHabits: JSON (array of habit IDs)
- completedGoals: JSON (array of goal IDs)
- moodScore: Int
- notes: Text (optional)
- timestamp
```

## 🔄 Поток данных

```
┌─────────────┐
│   User      │
│  Browser    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│   Frontend      │◄──── React State Management
│   (Next.js)     │      AuthContext
└────────┬────────┘
         │
         │ HTTP/REST API
         │ (axios)
         ▼
┌──────────────────┐
│   Backend        │◄──── JWT Auth Middleware
│   (Express)      │      Request Validation
└────────┬─────────┘
         │
         │ Prisma ORM
         ▼
┌──────────────────┐
│   Database       │
│  (PostgreSQL)    │
└──────────────────┘

Параллельно:

┌──────────────────┐
│  Telegram Bot    │
│  (Telegraf)      │
└────────┬─────────┘
         │
         │ HTTP/REST API
         ▼
┌──────────────────┐
│   Backend API    │
└──────────────────┘
```

## 🔐 Аутентификация

1. User регистрируется/входит через frontend
2. Backend генерирует JWT токен
3. Frontend сохраняет токен в localStorage
4. Каждый запрос включает токен в Authorization header
5. Backend проверяет токен в middleware
6. При валидном токене запрос обрабатывается

## 📦 Зависимости

### Backend
- `express` - веб-фреймворк
- `@prisma/client` - ORM клиент
- `bcryptjs` - хеширование паролей
- `jsonwebtoken` - JWT токены
- `cors` - CORS middleware
- `dotenv` - переменные окружения
- `express-validator` - валидация данных
- `morgan` - HTTP логирование

### Frontend
- `next` - React фреймворк
- `react` - UI библиотека
- `react-dom` - рендеринг React
- `axios` - HTTP клиент
- `tailwindcss` - CSS фреймворк
- `date-fns` - работа с датами
- `jspdf` - генерация PDF
- `react-icons` - иконки

### Bot
- `telegraf` - Telegram bot framework
- `axios` - HTTP клиент
- `node-cron` - планировщик задач
- `dotenv` - переменные окружения

## 🎨 Дизайн система

### Цвета
```css
Primary: #FF5B8B (розовый)
Pastel Pink: #FFB6C1
Pastel Lavender: #E6E6FA
Pastel Peach: #FFDAB9
Pastel Mint: #C1E1C1
Pastel Blue: #AEC6CF
Pastel Purple: #D8BFD8
```

### Типографика
- Font Family: Inter
- Sizes: текст 14-16px, заголовки 20-32px

### Компоненты
- Cards с rounded-2xl и shadow-lg
- Buttons с transitions и hover эффектами
- Inputs с border и focus states
- Modal окна для создания/редактирования

---

**Для более детальной информации см. комментарии в коде! 💡**

