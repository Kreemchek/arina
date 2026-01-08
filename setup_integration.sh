#!/bin/bash

# 🔗 Скрипт для настройки интеграции Backend с Frontend и Bot

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔗 НАСТРОЙКА ИНТЕГРАЦИИ BACKEND"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Запрос URL Backend
echo "Введите URL вашего Backend на Railway:"
echo "Пример: https://arina-production.up.railway.app"
read -r BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
  echo "❌ URL не может быть пустым!"
  exit 1
fi

# Убрать /api если есть
BACKEND_URL=${BACKEND_URL%/api}
API_URL="${BACKEND_URL}/api"

echo ""
echo "✅ Backend URL: $BACKEND_URL"
echo "✅ API URL: $API_URL"
echo ""

# Обновление bot/.env
echo "📝 Обновляю bot/.env..."
cat > bot/.env << EOF
TELEGRAM_BOT_TOKEN="8232747700:AAGIphSHtyMAv7xdQTnmq927YCqNoofB4fY"
API_URL="${API_URL}"
NODE_ENV=development
EOF
echo "✅ bot/.env обновлён"
echo ""

# Создание файла с URL для Vercel
echo "📝 Создаю файл VERCEL_ENV.txt с инструкциями..."
cat > VERCEL_ENV.txt << EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 НАСТРОЙКА VERCEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Откройте: https://vercel.com/dashboard
2. Найдите проект: arina
3. Settings → Environment Variables
4. Добавьте/Обновите:

   Name:  NEXT_PUBLIC_API_URL
   Value: ${API_URL}

5. Выберите: Production, Preview, Development
6. Save
7. Deployments → Redeploy последний деплой

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 НАСТРОЙКА RAILWAY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

В Railway Dashboard → Environment Variables добавьте:

CORS_ORIGIN=https://ваш-vercel-app.vercel.app,http://localhost:3000

(Замените ваш-vercel-app на реальный URL Vercel)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ГОТОВО!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Backend URL: ${BACKEND_URL}
API URL: ${API_URL}

Следующие шаги:
1. Обновите Vercel (см. VERCEL_ENV.txt)
2. Перезапустите бота: cd bot && npm start
3. Выполните миграции в Railway: npx prisma db push

EOF

echo "✅ Создан файл VERCEL_ENV.txt"
echo ""

# Тест подключения
echo "🔍 Тестирую подключение к Backend..."
if curl -s -f "${API_URL}" > /dev/null 2>&1; then
  echo "✅ Backend доступен!"
else
  echo "⚠️  Backend не отвечает (возможно ещё деплоится)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ НАСТРОЙКА ЗАВЕРШЕНА!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Что дальше:"
echo "   1. Откройте VERCEL_ENV.txt для инструкций по Vercel"
echo "   2. Перезапустите бота: cd bot && npm start"
echo "   3. Выполните миграции в Railway"
echo ""
