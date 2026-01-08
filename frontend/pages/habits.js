import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { habitsAPI } from '../utils/api';
import { FiPlus, FiTrash2, FiCheckCircle, FiX } from 'react-icons/fi';

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newHabit, setNewHabit] = useState({
    title: '',
    type: 'daily',
    frequency: 'everyday',
    color: '#FFB6C1',
  });

  const colors = [
    { name: 'Розовый', value: '#FFB6C1' },
    { name: 'Лавандовый', value: '#E6E6FA' },
    { name: 'Персиковый', value: '#FFDAB9' },
    { name: 'Мятный', value: '#C1E1C1' },
    { name: 'Голубой', value: '#AEC6CF' },
    { name: 'Сиреневый', value: '#D8BFD8' },
  ];

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const response = await habitsAPI.getAll();
      setHabits(response.data.habits);
    } catch (error) {
      console.error('Ошибка загрузки привычек:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    try {
      await habitsAPI.create(newHabit);
      setNewHabit({ title: '', type: 'daily', frequency: 'everyday', color: '#FFB6C1' });
      setShowModal(false);
      loadHabits();
    } catch (error) {
      console.error('Ошибка создания привычки:', error);
    }
  };

  const handleDeleteHabit = async (id) => {
    if (!confirm('Удалить эту привычку?')) return;
    try {
      await habitsAPI.delete(id);
      loadHabits();
    } catch (error) {
      console.error('Ошибка удаления привычки:', error);
    }
  };

  const handleCompleteHabit = async (id) => {
    try {
      await habitsAPI.complete(id);
      loadHabits();
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
      <div className="max-w-4xl mx-auto px-4 py-6 mt-16 md:mt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Мои привычки</h1>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <FiPlus /> Добавить
          </button>
        </div>

        {habits.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">У вас пока нет привычек</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
            >
              Создать первую привычку
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => (
              <div key={habit.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="w-6 h-6 rounded-full flex-shrink-0"
                      style={{ backgroundColor: habit.color }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{habit.title}</h3>
                      <div className="flex gap-4 text-sm text-gray-500 mt-1">
                        <span>Серия: {habit.streak} дней</span>
                        <span>Прогресс: {habit.progress}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCompleteHabit(habit.id)}
                      className="btn btn-primary text-sm"
                    >
                      <FiCheckCircle />
                    </button>
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="btn btn-secondary text-sm text-red-500 border-red-500"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Модальное окно создания привычки */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Новая привычка</h2>
                <button onClick={() => setShowModal(false)}>
                  <FiX className="text-gray-500 text-2xl" />
                </button>
              </div>

              <form onSubmit={handleCreateHabit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название привычки
                  </label>
                  <input
                    type="text"
                    value={newHabit.title}
                    onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                    className="input"
                    placeholder="Например: Выпить 2л воды"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Частота
                  </label>
                  <select
                    value={newHabit.frequency}
                    onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
                    className="input"
                  >
                    <option value="everyday">Каждый день</option>
                    <option value="weekdays">По будням</option>
                    <option value="weekends">По выходным</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Цвет
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setNewHabit({ ...newHabit, color: color.value })}
                        className={`w-10 h-10 rounded-full transition-transform ${
                          newHabit.color === color.value ? 'ring-4 ring-primary-300 scale-110' : ''
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Отмена
                  </button>
                  <button type="submit" className="btn btn-primary flex-1">
                    Создать
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

