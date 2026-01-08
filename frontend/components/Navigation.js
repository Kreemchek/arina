import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  FiHome, 
  FiCheckCircle, 
  FiBook, 
  FiStar, 
  FiTarget, 
  FiUser 
} from 'react-icons/fi';

export default function Navigation() {
  const router = useRouter();

  const navItems = [
    { href: '/', icon: FiHome, label: 'Главная' },
    { href: '/habits', icon: FiCheckCircle, label: 'Привычки' },
    { href: '/diary', icon: FiBook, label: 'Дневник' },
    { href: '/beauty', icon: FiStar, label: 'Красота' },
    { href: '/goals', icon: FiTarget, label: 'Цели' },
    { href: '/profile', icon: FiUser, label: 'Профиль' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl z-50 md:top-0 md:bottom-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.href;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive 
                    ? 'text-primary-500' 
                    : 'text-gray-400 hover:text-primary-400'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs mt-1 hidden sm:block">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

