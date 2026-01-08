import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from './api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Загрузка пользователя при монтировании
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        
        // Проверка premium статуса
        if (!userData.premiumFlag && router.pathname !== '/login' && router.pathname !== '/register') {
          router.push('/login?premium=required');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [router]);

  // Вход
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;
      
      // Проверка premium статуса
      if (!userData.premiumFlag) {
        return {
          success: false,
          error: 'Требуется премиум подписка для доступа к приложению',
        };
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      router.push('/');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Ошибка входа',
      };
    }
  };

  // Регистрация
  const register = async (name, email, password, telegramId) => {
    try {
      const response = await authAPI.register({ name, email, password, telegramId });
      const { token, user: userData } = response.data;
      
      // Проверка premium статуса
      if (!userData.premiumFlag) {
        return {
          success: false,
          error: 'Требуется премиум подписка для доступа к приложению. Обратитесь к администратору.',
        };
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      router.push('/');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Ошибка регистрации',
      };
    }
  };

  // Выход
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Ошибка выхода:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

