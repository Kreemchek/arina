import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/AuthContext';
import { FiMail, FiLock, FiHeart, FiAward } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [premiumRequired, setPremiumRequired] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (router.query.premium === 'required') {
      setPremiumRequired(true);
    }
  }, [router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Логотип/Заголовок */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 rounded-full mb-4">
            <FiHeart className="text-white text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Личный ассистент
          </h1>
          <p className="text-gray-600">Добро пожаловать обратно! 💕</p>
        </div>

        {/* Форма входа */}
        <div className="card">
          {premiumRequired && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-4">
              <div className="flex items-start">
                <FiAward className="text-yellow-600 text-xl mr-2 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Требуется премиум подписка</p>
                  <p className="text-sm">Для доступа к приложению необходима премиум подписка. Обратитесь к администратору.</p>
                </div>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full text-lg py-3"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Нет аккаунта?{' '}
              <Link href="/register" className="text-primary-500 font-medium hover:text-primary-600">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

