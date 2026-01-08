const { verifyToken } = require('../utils/jwt');

/**
 * Middleware для проверки аутентификации пользователя
 * Проверяет наличие и валидность JWT токена в заголовке Authorization
 */
async function authenticateUser(req, res, next) {
  try {
    // Получаем токен из заголовка
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Токен не предоставлен' });
    }

    const token = authHeader.substring(7); // Убираем 'Bearer '
    
    // Проверяем токен
    const decoded = verifyToken(token);
    
    // Добавляем данные пользователя в request
    req.userId = decoded.userId;
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Недействительный токен' });
  }
}

/**
 * Middleware для проверки премиум статуса (заглушка)
 */
async function checkPremium(req, res, next) {
  // Здесь будет проверка премиум статуса
  // Пока пропускаем всех
  if (process.env.PREMIUM_ENABLED === 'true') {
    // Проверка премиум статуса из БД
    // if (!req.user.premiumFlag) {
    //   return res.status(403).json({ error: 'Требуется премиум подписка' });
    // }
  }
  next();
}

module.exports = {
  authenticateUser,
  checkPremium,
};

