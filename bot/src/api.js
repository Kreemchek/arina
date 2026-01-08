const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3001/api';

/**
 * Создание API клиента с токеном пользователя
 */
function getApiClient(token) {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
}

/**
 * Получение сессии пользователя по Telegram ID
 */
function getUserSession(telegramId) {
  return global.userSessions[telegramId];
}

/**
 * Сохранение сессии пользователя
 */
function setUserSession(telegramId, session) {
  global.userSessions[telegramId] = session;
}

/**
 * API методы для привычек
 */
async function getHabits(token) {
  const api = getApiClient(token);
  const response = await api.get('/habits');
  return response.data.habits;
}

async function completeHabit(token, habitId) {
  const api = getApiClient(token);
  const response = await api.post(`/habits/${habitId}/complete`);
  return response.data;
}

/**
 * API методы для целей
 */
async function getGoals(token) {
  const api = getApiClient(token);
  const response = await api.get('/goals');
  return response.data.goals;
}

async function completeGoal(token, goalId) {
  const api = getApiClient(token);
  const response = await api.patch(`/goals/${goalId}`, { doneFlag: true });
  return response.data;
}

/**
 * API методы для дневника
 */
async function createDiaryEntry(token, data) {
  const api = getApiClient(token);
  const response = await api.post('/diary', data);
  return response.data;
}

/**
 * API методы для прогресса
 */
async function getStats(token) {
  const api = getApiClient(token);
  const response = await api.get('/progress/stats');
  return response.data.stats;
}

async function getProgress(token) {
  const api = getApiClient(token);
  const response = await api.get('/progress', { params: { limit: 7 } });
  return response.data.progress;
}

/**
 * API методы для задач красоты
 */
async function getBeautyTasks(token) {
  const api = getApiClient(token);
  const response = await api.get('/beauty');
  return response.data.tasks;
}

module.exports = {
  getApiClient,
  getUserSession,
  setUserSession,
  getHabits,
  completeHabit,
  getGoals,
  completeGoal,
  createDiaryEntry,
  getStats,
  getProgress,
  getBeautyTasks,
};

