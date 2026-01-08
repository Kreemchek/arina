const { verifyToken } = require('../utils/jwt');
const prisma = require('../utils/prisma');

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
    
    // Получаем пользователя из БД для проверки premium
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, premiumFlag: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }
    
    // Добавляем данные пользователя в request
    req.userId = user.id;
    req.user = { ...decoded, premiumFlag: user.premiumFlag };
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Недействительный токен' });
  }
}

/**
 * Middleware для проверки премиум статуса
 * Требует премиум подписку для доступа
 */
async function checkPremium(req, res, next) {
  // Проверяем premium статус из БД
  if (!req.user || !req.user.premiumFlag) {
    return res.status(403).json({ 
      error: 'Требуется премиум подписка для доступа к приложению' 
    });
  }
  next();
}

module.exports = {
  authenticateUser,
  checkPremium,
};

