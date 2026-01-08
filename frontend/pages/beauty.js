import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { beautyAPI } from '../utils/api';
import { FiPlus, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

const categories = [
  { value: 'skincare', label: 'Уход за кожей', icon: '✨' },
  { value: 'makeup', label: 'Макияж', icon: '💄' },
  { value: 'hair', label: 'Волосы', icon: '💇‍♀️' },
  { value: 'nails', label: 'Ногти', icon: '💅' },
  { value: 'style', label: 'Стиль', icon: '👗' },
];

export default function Beauty() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'skincare',
    dueDate: '',
  });

  useEffect(() => {
    loadTasks();
  }, [selectedCategory]);

  const loadTasks = async () => {
    try {
      const response = await beautyAPI.getAll(selectedCategory || undefined);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Ошибка загрузки задач:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await beautyAPI.create(newTask);
      setNewTask({ title: '', description: '', category: 'skincare', dueDate: '' });
      setShowModal(false);
      loadTasks();
    } catch (error) {
      console.error('Ошибка создания задачи:', error);
    }
  };

  const handleToggleTask = async (id, currentStatus) => {
    try {
      await beautyAPI.update(id, { doneFlag: !currentStatus });
      loadTasks();
    } catch (error) {
      console.error('Ошибка обновления задачи:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm('Удалить эту задачу?')) return;
    try {
      await beautyAPI.delete(id);
      loadTasks();
    } catch (error) {
      console.error('Ошибка удаления задачи:', error);
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
          <h1 className="text-2xl font-bold text-gray-800">Красота & Стиль</h1>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <FiPlus /> Добавить
          </button>
        </div>

        {/* Фильтр по категориям */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === ''
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 border-2 border-gray-200'
            }`}
          >
            Все
          </button>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 border-2 border-gray-200'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {tasks.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">
              {selectedCategory ? 'Нет задач в этой категории' : 'У вас пока нет задач'}
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
            >
              Создать задачу
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => {
              const category = categories.find(c => c.value === task.category);
              return (
                <div key={task.id} className={`card ${task.doneFlag ? 'opacity-60' : ''}`}>
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggleTask(task.id, task.doneFlag)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        task.doneFlag
                          ? 'bg-primary-500 border-primary-500'
                          : 'border-gray-300 hover:border-primary-400'
                      }`}
                    >
                      {task.doneFlag && <FiCheck className="text-white text-sm" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`font-semibold text-gray-800 ${task.doneFlag ? 'line-through' : ''}`}>
                            {category?.icon} {task.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          <div className="text-xs text-gray-500 mt-2">
                            {category?.label}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Модальное окно создания задачи */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Новая задача</h2>
                <button onClick={() => setShowModal(false)}>
                  <FiX className="text-gray-500 text-2xl" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="input"
                    placeholder="Например: Сделать маску для лица"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="input min-h-[80px]"
                    placeholder="Детали задачи..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категория
                  </label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="input"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
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

