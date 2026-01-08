import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../utils/AuthContext';
import { habitsAPI, progressAPI, goalsAPI } from '../utils/api';
import { FiCheckCircle, FiTrendingUp, FiSmile, FiTarget } from 'react-icons/fi';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  const loadDashboard = async () => {
    try {
      const [statsRes, habitsRes, goalsRes] = await Promise.all([
        progressAPI.getStats(),
        habitsAPI.getAll(),
        goalsAPI.getAll(),
      ]);

      setStats(statsRes.data.stats);
      setHabits(habitsRes.data.habits.filter(h => h.isActive).slice(0, 5));
      setGoals(goalsRes.data.goals.filter(g => !g.doneFlag).slice(0, 3));
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteHabit = async (habitId) => {
    try {
      await habitsAPI.complete(habitId);
      loadDashboard();
    } catch (error) {
      console.error('Ошибка выполнения привычки:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-primary-500 text-xl">Загрузка...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6 mt-16 md:mt-20">
        {/* Приветствие */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Привет, {user?.name}! 💕
          </h1>
          <p className="text-gray-600">
            {format(new Date(), 'EEEE, d MMMM yyyy', { locale: ru })}
          </p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card bg-gradient-to-br from-pastel-pink to-pastel-peach">
            <FiCheckCircle className="text-3xl mb-2 text-primary-600" />
            <div className="text-2xl font-bold text-gray-800">{stats?.activeHabits || 0}</div>
            <div className="text-sm text-gray-600">Активных привычек</div>
          </div>

          <div className="card bg-gradient-to-br from-pastel-lavender to-pastel-purple">
            <FiTarget className="text-3xl mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-gray-800">{stats?.completedGoals || 0}</div>
            <div className="text-sm text-gray-600">Целей достигнуто</div>
          </div>

          <div className="card bg-gradient-to-br from-pastel-mint to-pastel-blue">
            <FiTrendingUp className="text-3xl mb-2 text-green-600" />
            <div className="text-2xl font-bold text-gray-800">{stats?.totalGoals || 0}</div>
            <div className="text-sm text-gray-600">Всего целей</div>
          </div>

          <div className="card bg-gradient-to-br from-pastel-peach to-pastel-pink">
            <FiSmile className="text-3xl mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-gray-800">{stats?.avgMoodScore || 0}</div>
            <div className="text-sm text-gray-600">Средн. настроение</div>
          </div>
        </div>

        {/* Привычки на сегодня */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiCheckCircle className="text-primary-500" />
            Привычки на сегодня
          </h2>
          {habits.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              У вас пока нет привычек. Создайте первую!
            </p>
          ) : (
            <div className="space-y-3">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <div>
                      <div className="font-medium text-gray-800">{habit.title}</div>
                      <div className="text-sm text-gray-500">
                        Серия: {habit.streak} дней
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCompleteHabit(habit.id)}
                    className="btn btn-primary text-sm"
                  >
                    Выполнено
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Текущие цели */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiTarget className="text-primary-500" />
            Текущие цели
          </h2>
          {goals.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              У вас пока нет целей. Поставьте первую!
            </p>
          ) : (
            <div className="space-y-3">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <div className="font-medium text-gray-800 mb-1">{goal.title}</div>
                  {goal.deadline && (
                    <div className="text-sm text-gray-500">
                      До: {format(new Date(goal.deadline), 'd MMMM yyyy', { locale: ru })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

