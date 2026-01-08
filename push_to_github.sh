#!/bin/bash

# 🚀 Скрипт для загрузки проекта на GitHub

echo "═══════════════════════════════════════════════════"
echo "🚀 ЗАГРУЗКА ПРОЕКТА ARINA НА GITHUB"
echo "═══════════════════════════════════════════════════"
echo ""

# Запрос username
echo "Введите ваш GitHub username:"
read GITHUB_USERNAME

echo ""
echo "✅ Git репозиторий уже инициализирован"
echo "✅ Все файлы закоммичены (64 файла)"
echo ""

# Проверка наличия remote
if git remote | grep -q "origin"; then
    echo "⚠️  Remote 'origin' уже существует. Удаляю..."
    git remote remove origin
fi

# Добавление remote
echo "📡 Добавляю remote репозиторий..."
git remote add origin https://github.com/$GITHUB_USERNAME/arina.git

# Переименование ветки в main
echo "🔄 Переименовываю ветку в main..."
git branch -M main

# Push
echo ""
echo "═══════════════════════════════════════════════════"
echo "⚠️  ВАЖНО: При запросе пароля используйте ваш"
echo "    Personal Access Token (НЕ пароль от GitHub!)"
echo "═══════════════════════════════════════════════════"
echo ""
echo "🚀 Загружаю на GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "═══════════════════════════════════════════════════"
    echo "✅ УСПЕШНО! Проект загружен на GitHub!"
    echo "═══════════════════════════════════════════════════"
    echo ""
    echo "📍 Ваш репозиторий:"
    echo "   https://github.com/$GITHUB_USERNAME/arina"
    echo ""
    echo "🎯 Следующие шаги:"
    echo "   1. Откройте репозиторий в браузере"
    echo "   2. Деплойте frontend на Vercel"
    echo "   3. Запустите бота локально"
    echo ""
else
    echo ""
    echo "═══════════════════════════════════════════════════"
    echo "❌ ОШИБКА: Не удалось загрузить на GitHub"
    echo "═══════════════════════════════════════════════════"
    echo ""
    echo "Возможные причины:"
    echo "   1. Репозиторий 'arina' не создан на GitHub"
    echo "   2. Неверный username"
    echo "   3. Неверный токен"
    echo ""
    echo "Решение:"
    echo "   1. Создайте репозиторий на https://github.com/new"
    echo "   2. Название: arina"
    echo "   3. НЕ добавляйте README, .gitignore, license"
    echo "   4. Запустите этот скрипт снова"
    echo ""
fi

