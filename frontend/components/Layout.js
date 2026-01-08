import { useAuth } from '../utils/AuthContext';
import Navigation from './Navigation';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Layout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const publicPages = ['/login', '/register'];
  const isPublicPage = publicPages.includes(router.pathname);

  useEffect(() => {
    if (!loading && !user && !isPublicPage) {
      router.push('/login');
    }
    // Проверка premium статуса
    if (!loading && user && !user.premiumFlag && !isPublicPage) {
      router.push('/login?premium=required');
    }
  }, [user, loading, router, isPublicPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary-500 text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!user && !isPublicPage) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {user && <Navigation />}
      <main className="pb-20">
        {children}
      </main>
    </div>
  );
}

