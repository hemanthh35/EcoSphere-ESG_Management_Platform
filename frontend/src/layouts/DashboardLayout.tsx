import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth/AuthContext';
import { 
  LogOut, LayoutDashboard, Leaf, Users, ShieldCheck, 
  Target, BarChart3, Settings 
} from 'lucide-react';

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Environmental', href: '/environmental', icon: Leaf },
    { name: 'Social', href: '/social', icon: Users },
    { name: 'Governance', href: '/governance', icon: ShieldCheck },
    { name: 'Gamification', href: '/gamification', icon: Target },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Settings', href: '/settings/departments', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-600">
              EcoSphere
            </span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                              (item.href !== '/' && location.pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {user?.full_name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
            <div className="ml-3 truncate">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.full_name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
