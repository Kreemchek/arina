require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Импорт маршрутов
const authRoutes = require('./routes/auth');
const habitsRoutes = require('./routes/habits');
const diaryRoutes = require('./routes/diary');
const beautyRoutes = require('./routes/beauty');
const goalsRoutes = require('./routes/goals');
const progressRoutes = require('./routes/progress');
const paymentsRoutes = require('./routes/payments');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// CORS настройка для работы с Vercel и локальной разработкой
const corsOptions = {
  origin: function (origin, callback) {
    // Разрешить запросы без origin (например, Postman, мобильные приложения)
    if (!origin) return callback(null, true);
    
    // Разрешить локальную разработку
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Разрешить Vercel домены
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Разрешить кастомные домены из переменной окружения
    const allowedOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : [];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(null, true); // Разрешить все для разработки
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Базовый маршрут для проверки работы API
app.get('/', (req, res) => {
  res.json({
    message: 'API личного ассистента работает! 💖',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      habits: '/api/habits',
      diary: '/api/diary',
      beauty: '/api/beauty',
      goals: '/api/goals',
      progress: '/api/progress',
      payments: '/api/payments'
    }
  });
});

// API маршруты
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/beauty', beautyRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/payments', paymentsRoutes);

// Обработка ошибок 404
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Глобальная обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка сервера:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Внутренняя ошибка сервера',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Backend сервер запущен на http://localhost:${PORT}`);
  console.log(`📚 Окружение: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

