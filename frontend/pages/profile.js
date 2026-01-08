import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../utils/AuthContext';
import { progressAPI, paymentsAPI } from '../utils/api';
import { FiUser, FiLogOut, FiDownload, FiAward } from 'react-icons/fi';
import jsPDF from 'jspdf';

export default function Profile() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const [statsRes, paymentsRes] = await Promise.all([
        progressAPI.getStats(),
        paymentsAPI.getStatus(),
      ]);
      setStats(statsRes.data.stats);
      setPaymentStatus(paymentsRes.data);
    } catch (error) {
      console.error('Ошибка загрузки данных профиля:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    
    // Заголовок
    doc.setFontSize(20);
    doc.text('Отчёт о прогрессе', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Пользователь: ${user?.name}`, 20, 35);
    doc.text(`Email: ${user?.email}`, 20, 45);
    doc.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, 20, 55);
    
    // Статистика
    doc.setFontSize(16);
    doc.text('Статистика', 20, 75);
    
    doc.setFontSize(12);
    doc.text(`Всего привычек: ${stats?.totalHabits || 0}`, 20, 90);
    doc.text(`Активных привычек: ${stats?.activeHabits || 0}`, 20, 100);
    doc.text(`Всего целей: ${stats?.totalGoals || 0}`, 20, 110);
    doc.text(`Достигнутых целей: ${stats?.completedGoals || 0}`, 20, 120);
    doc.text(`Среднее настроение: ${stats?.avgMoodScore || 0}/10`, 20, 130);
    
    // Сохранение
    doc.save(`progress-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleUpgradeToPremium = async () => {
    try {
      const response = await paymentsAPI.create({ plan: 'premium' });
      alert(response.data.message);
    } catch (error) {
      console.error('Ошибка создания платежа:', error);
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Профиль</h1>

        {/* Информация о пользователе */}
        <div className="card mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
              <FiUser className="text-white text-3xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          {user?.premiumFlag && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 mb-4">
              <FiCrown />
              <span className="font-semibold">Премиум аккаунт</span>
            </div>
          )}
        </div>

        {/* Статистика */}
        <div className="card mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Статистика</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-pastel-pink p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">{stats?.activeHabits || 0}</div>
              <div className="text-sm text-gray-600">Активных привычек</div>
            </div>
            <div className="bg-pastel-lavender p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">{stats?.completedGoals || 0}</div>
              <div className="text-sm text-gray-600">Целей достигнуто</div>
            </div>
            <div className="bg-pastel-mint p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">{stats?.totalGoals || 0}</div>
              <div className="text-sm text-gray-600">Всего целей</div>
            </div>
            <div className="bg-pastel-peach p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">{stats?.avgMoodScore || 0}</div>
              <div className="text-sm text-gray-600">Среднее настроение</div>
            </div>
          </div>
        </div>

        {/* PDF Отчёт */}
        <div className="card mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Отчёты</h3>
          <p className="text-gray-600 mb-4">
            Скачайте подробный отчёт о вашем прогрессе в формате PDF
          </p>
          <button
            onClick={generatePDFReport}
            className="btn btn-primary flex items-center gap-2"
          >
            <FiDownload /> Скачать отчёт
          </button>
        </div>

        {/* Премиум (заглушка) */}
        {!user?.premiumFlag && (
          <div className="card mb-6 bg-gradient-to-br from-pastel-lavender to-pastel-purple">
            <div className="flex items-start gap-4">
              <FiAward className="text-yellow-500 text-3xl flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Разблокируйте Премиум
                </h3>
                <ul className="text-sm text-gray-700 space-y-1 mb-4">
                  <li>✨ Безлимитные привычки и цели</li>
                  <li>📊 Продвинутая аналитика</li>
                  <li>📄 Персонализированные PDF-отчёты</li>
                  <li>💡 Персональные рекомендации</li>
                  <li>🎨 Эксклюзивные темы оформления</li>
                </ul>
                <button
                  onClick={handleUpgradeToPremium}
                  className="btn btn-primary"
                >
                  Обновить до Премиум
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  {paymentStatus?.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Выход */}
        <div className="card">
          <button
            onClick={logout}
            className="btn btn-secondary w-full flex items-center justify-center gap-2 text-red-500 border-red-500"
          >
            <FiLogOut /> Выйти из аккаунта
          </button>
        </div>
      </div>
    </Layout>
  );
}

