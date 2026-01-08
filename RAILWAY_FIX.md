# 🔧 Исправление Ошибки Prisma на Railway

## ✅ Что Исправлено

1. ✅ Добавлен `postinstall` скрипт для автоматической генерации Prisma Client
2. ✅ Добавлен `build` скрипт
3. ✅ `prisma` перемещён из `devDependencies` в `dependencies`
4. ✅ Схема изменена обратно на PostgreSQL

---

## 🚀 Настройка Railway

### 1. Build Command
В Railway Dashboard → Settings → Build:
```
npm install && npm run build
```

Или просто:
```
npm install
```
(так как `postinstall` автоматически запустит `prisma generate`)

### 2. Start Command
```
npm start
```

### 3. Root Directory
```
backend
```

### 4. Environment Variables
```
DATABASE_URL=<автоматически из PostgreSQL плагина>
NODE_ENV=production
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

---

## 📋 После Деплоя

### 1. Выполнить миграции
В Railway → Deployments → View Logs → Run Command:
```bash
npx prisma db push
```

Или через Railway CLI:
```bash
railway run npx prisma db push
```

### 2. Проверить работу
```bash
curl https://your-railway-url.up.railway.app/api/auth/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

---

## 🔍 Проверка Логов

Если всё ещё не работает, проверьте логи:
```bash
railway logs
```

Ищите:
- ✅ `Generated Prisma Client` - успешно
- ❌ `@prisma/client did not initialize` - ошибка

---

## 💡 Альтернатива: Использовать Dockerfile

Если проблемы продолжаются, создайте `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "start"]
```

И в Railway выберите "Dockerfile" вместо "Nixpacks".

---

## ✅ Готово!

После этих изменений Railway должен успешно задеплоить Backend! 🎉
