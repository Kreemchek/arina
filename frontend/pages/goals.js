import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { goalsAPI } from '../utils/api';
import { FiPlus, FiTrash2, FiCheck, FiX, FiTarget } from 'react-icons/fi';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const goalCategories = [
  { value: 'career', label: 'Карьера', icon: '💼' },
  { value: 'health', label: 'Здоровье', icon: '💪' },
  { value: 'personal', label: 'Личное', icon: '🌟' },
  { value: 'financial', label: 'Финансы', icon: '💰' },
];

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal',
    deadline: '',
    steps: [],
    currentStep: '',
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const response = await goalsAPI.getAll();
      setGoals(response.data.goals);
    } catch (error) {
      console.error('Ошибка загрузки целей:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      const goalData = {
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        deadline: newGoal.deadline || null,
        steps: newGoal.steps,
      };
      await goalsAPI.create(goalData);
      setNewGoal({ title: '', description: '', category: 'personal', deadline: '', steps: [], currentStep: '' });
      setShowModal(false);
      loadGoals();
    } catch (error) {
      console.error('Ошибка создания цели:', error);
    }
  };

  const handleToggleGoal = async (id, currentStatus) => {
    try {
      await goalsAPI.update(id, { doneFlag: !currentStatus });
      loadGoals();
    } catch (error) {
      console.error('Ошибка обновления цели:', error);
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!confirm('Удалить эту цель?')) return;
    try {
      await goalsAPI.delete(id);
      loadGoals();
    } catch (error) {
      console.error('Ошибка удаления цели:', error);
    }
  };

  const addStep = () => {
    if (newGoal.currentStep.trim()) {
      setNewGoal({
        ...newGoal,
        steps: [...newGoal.steps, { text: newGoal.currentStep, done: false }],
        currentStep: '',
      });
    }
  };

  const removeStep = (index) => {
    setNewGoal({
      ...newGoal,
      steps: newGoal.steps.filter((_, i) => i !== index),
    });
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

  const activeGoals = goals.filter(g => !g.doneFlag);
  const completedGoals = goals.filter(g => g.doneFlag);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6 mt-16 md:mt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Мои цели</h1>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <FiPlus /> Добавить
          </button>
        </div>

        {/* Активные цели */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FiTarget className="text-primary-500" />
            Активные цели ({activeGoals.length})
          </h2>
          {activeGoals.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-500 mb-4">У вас пока нет активных целей</p>
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-primary"
              >
                Поставить первую цель
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeGoals.map((goal) => {
                const category = goalCategories.find(c => c.value === goal.category);
                const steps = Array.isArray(goal.steps) ? goal.steps : [];
                const completedSteps = steps.filter(s => s.done).length;
                const progress = steps.length > 0 ? (completedSteps / steps.length) * 100 : 0;

                return (
                  <div key={goal.id} className="card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg mb-1">
                          {category?.icon} {goal.title}
                        </h3>
                        {goal.description && (
                          <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                        )}
                        {goal.deadline && (
                          <div className="text-xs text-gray-500">
                            До: {format(new Date(goal.deadline), 'd MMMM yyyy', { locale: ru })}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleGoal(goal.id, goal.doneFlag)}
                          className="btn btn-primary text-sm"
                        >
                          <FiCheck />
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="btn btn-secondary text-sm text-red-500 border-red-500"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    
                    {steps.length > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Прогресс</span>
                          <span>{completedSteps}/{steps.length}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div
                            className="bg-primary-500 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Завершённые цели */}
        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FiCheck className="text-green-500" />
              Достигнутые цели ({completedGoals.length})
            </h2>
            <div className="space-y-4">
              {completedGoals.map((goal) => {
                const category = goalCategories.find(c => c.value === goal.category);
                return (
                  <div key={goal.id} className="card opacity-60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FiCheck className="text-green-500 text-xl" />
                        <div>
                          <h3 className="font-semibold text-gray-800 line-through">
                            {category?.icon} {goal.title}
                          </h3>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Модальное окно создания цели */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Новая цель</h2>
                <button onClick={() => setShowModal(false)}>
                  <FiX className="text-gray-500 text-2xl" />
                </button>
              </div>

              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название цели
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    className="input"
                    placeholder="Например: Выучить английский"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание
                  </label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    className="input min-h-[80px]"
                    placeholder="Детали цели..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категория
                  </label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                    className="input"
                  >
                    {goalCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Срок достижения (необязательно)
                  </label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Шаги к цели (необязательно)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newGoal.currentStep}
                      onChange={(e) => setNewGoal({ ...newGoal, currentStep: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStep())}
                      className="input"
                      placeholder="Добавить шаг"
                    />
                    <button
                      type="button"
                      onClick={addStep}
                      className="btn btn-secondary"
                    >
                      <FiPlus />
                    </button>
                  </div>
                  {newGoal.steps.length > 0 && (
                    <div className="space-y-2">
                      {newGoal.steps.map((step, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                          <span className="flex-1 text-sm">{step.text}</span>
                          <button
                            type="button"
                            onClick={() => removeStep(index)}
                            className="text-red-500"
                          >
                            <FiX />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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

