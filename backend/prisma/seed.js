const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начало заполнения базы данных...');

  // Создание тестового пользователя
  const passwordHash = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'Тестовая Пользовательница',
      email: 'test@example.com',
      passwordHash,
      premiumFlag: false,
    },
  });

  console.log('✅ Создан пользователь:', user.email);

  // Создание тестовых привычек
  const habits = await Promise.all([
    prisma.habit.create({
      data: {
        userId: user.id,
        title: 'Выпить 2 литра воды',
        type: 'daily',
        frequency: 'everyday',
        color: '#AEC6CF',
        progress: 5,
        streak: 3,
      },
    }),
    prisma.habit.create({
      data: {
        userId: user.id,
        title: 'Сделать зарядку',
        type: 'daily',
        frequency: 'everyday',
        color: '#C1E1C1',
        progress: 8,
        streak: 8,
      },
    }),
    prisma.habit.create({
      data: {
        userId: user.id,
        title: 'Медитация 10 минут',
        type: 'daily',
        frequency: 'everyday',
        color: '#E6E6FA',
        progress: 2,
        streak: 2,
      },
    }),
  ]);

  console.log(`✅ Создано привычек: ${habits.length}`);

  // Создание тестовых записей дневника
  const diaryEntries = await Promise.all([
    prisma.diary.create({
      data: {
        userId: user.id,
        mood: 'happy',
        moodScore: 8,
        notes: 'Отличный день! Успела сделать всё, что планировала. Чувствую себя продуктивной и счастливой.',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // вчера
      },
    }),
    prisma.diary.create({
      data: {
        userId: user.id,
        mood: 'neutral',
        moodScore: 5,
        notes: 'Обычный день. Ничего особенного не произошло.',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // позавчера
      },
    }),
  ]);

  console.log(`✅ Создано записей дневника: ${diaryEntries.length}`);

  // Создание задач красоты
  const beautyTasks = await Promise.all([
    prisma.beauty.create({
      data: {
        userId: user.id,
        title: 'Маска для лица',
        description: 'Увлажняющая маска 2 раза в неделю',
        category: 'skincare',
        doneFlag: false,
      },
    }),
    prisma.beauty.create({
      data: {
        userId: user.id,
        title: 'Покрасить ногти',
        description: 'Новый цвет - нежно-розовый',
        category: 'nails',
        doneFlag: false,
      },
    }),
    prisma.beauty.create({
      data: {
        userId: user.id,
        title: 'Обновить гардероб',
        description: 'Купить новое платье для вечеринки',
        category: 'style',
        doneFlag: false,
      },
    }),
  ]);

  console.log(`✅ Создано задач красоты: ${beautyTasks.length}`);

  // Создание целей
  const goals = await Promise.all([
    prisma.goal.create({
      data: {
        userId: user.id,
        title: 'Выучить английский до B2',
        description: 'Подготовиться к международному экзамену',
        category: 'personal',
        steps: [
          { text: 'Пройти 20 уроков на Duolingo', done: true },
          { text: 'Прочитать книгу на английском', done: false },
          { text: 'Практиковать разговорный 3 раза в неделю', done: false },
          { text: 'Сдать пробный экзамен', done: false },
        ],
        doneFlag: false,
        deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // через 6 месяцев
      },
    }),
    prisma.goal.create({
      data: {
        userId: user.id,
        title: 'Похудеть на 5 кг',
        description: 'Здоровое питание и спорт',
        category: 'health',
        steps: [
          { text: 'Составить план питания', done: true },
          { text: 'Ходить в зал 3 раза в неделю', done: false },
          { text: 'Исключить фастфуд', done: false },
        ],
        doneFlag: false,
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // через 3 месяца
      },
    }),
  ]);

  console.log(`✅ Создано целей: ${goals.length}`);

  // Создание записей прогресса
  const progressEntries = await Promise.all([
    prisma.progress.create({
      data: {
        userId: user.id,
        date: new Date(),
        completedHabits: [habits[0].id, habits[1].id],
        completedGoals: [],
        moodScore: 8,
        notes: 'Хороший день!',
      },
    }),
  ]);

  console.log(`✅ Создано записей прогресса: ${progressEntries.length}`);

  console.log('');
  console.log('🎉 База данных успешно заполнена!');
  console.log('');
  console.log('📧 Email: test@example.com');
  console.log('🔑 Password: password123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

