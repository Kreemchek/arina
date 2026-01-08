import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { diaryAPI } from '../utils/api';
import { FiPlus, FiX, FiSmile, FiMeh, FiFrown } from 'react-icons/fi';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const moodOptions = [
  { value: 'happy', label: 'Счастлива', icon: '😊', color: 'text-green-500' },
  { value: 'excited', label: 'Взволнована', icon: '🤩', color: 'text-yellow-500' },
  { value: 'neutral', label: 'Нормально', icon: '😐', color: 'text-gray-500' },
  { value: 'sad', label: 'Грустно', icon: '😢', color: 'text-blue-500' },
  { value: 'anxious', label: 'Тревожно', icon: '😰', color: 'text-purple-500' },
];

export default function Diary() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    mood: 'neutral',
    moodScore: 5,
    notes: '',
  });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const response = await diaryAPI.getAll(30);
      setEntries(response.data.entries);
    } catch (error) {
      console.error('Ошибка загрузки дневника:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEntry = async (e) => {
    e.preventDefault();
    try {
      await diaryAPI.create(newEntry);
      setNewEntry({ mood: 'neutral', moodScore: 5, notes: '' });
      setShowModal(false);
      loadEntries();
    } catch (error) {
      console.error('Ошибка создания записи:', error);
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
          <h1 className="text-2xl font-bold text-gray-800">Дневник настроения</h1>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <FiPlus /> Новая запись
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">У вас пока нет записей</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
            >
              Создать первую запись
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => {
              const mood = moodOptions.find(m => m.value === entry.mood);
              return (
                <div key={entry.id} className="card">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{mood?.icon}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold text-gray-800">{mood?.label}</div>
                          <div className="text-sm text-gray-500">
                            {format(new Date(entry.date), 'd MMMM yyyy, HH:mm', { locale: ru })}
                          </div>
                        </div>
                        <div className="text-sm font-medium text-primary-500">
                          {entry.moodScore}/10
                        </div>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{entry.notes}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Модальное окно создания записи */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Новая запись</h2>
                <button onClick={() => setShowModal(false)}>
                  <FiX className="text-gray-500 text-2xl" />
                </button>
              </div>

              <form onSubmit={handleCreateEntry} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Как вы себя чувствуете?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.value}
                        type="button"
                        onClick={() => setNewEntry({ ...newEntry, mood: mood.value })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          newEntry.mood === mood.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{mood.icon}</div>
                        <div className="text-xs">{mood.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Оценка настроения: {newEntry.moodScore}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newEntry.moodScore}
                    onChange={(e) => setNewEntry({ ...newEntry, moodScore: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ваши мысли
                  </label>
                  <textarea
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                    className="input min-h-[150px]"
                    placeholder="Что произошло сегодня? Как вы себя чувствуете?"
                    required
                  />
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
                    Сохранить
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

