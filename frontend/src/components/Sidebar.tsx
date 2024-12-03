import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authAtom, userAtom } from '../store/auth';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  School,
  CreditCard,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [, setAuth] = useAtom(authAtom);
  const [, setUser] = useAtom(userAtom);

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'لوحة التحكم' },
    { path: '/students', icon: Users, label: 'التلاميذ' },
    { path: '/teachers', icon: GraduationCap, label: 'الأساتذة' },
    { path: '/classes', icon: School, label: 'الفصول' },
    // { path: '/payments', icon: CreditCard, label: 'المدفوعات' },
    // { path: '/seances', icon: School, label: 'الحصص' },
    { path: '/support-lessons', icon: School, label:  'فصول الدروس الخصوصية' }, // Updated label for support lessons
    { path: '/sessions', icon: School, label: 'الحصص' }
  ];

  const handleLogout = () => {
    setAuth(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg">
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">المدرسة</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon size={20} className="ml-3" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <LogOut size={20} className="ml-3" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
