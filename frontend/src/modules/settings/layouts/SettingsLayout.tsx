import { Outlet, Link, useLocation } from 'react-router-dom';
import { Settings, Building2, LayoutGrid, Sliders, Bell, Users } from 'lucide-react';

export function SettingsLayout() {
  const location = useLocation();

  const tabs = [
    { name: 'Departments', href: '/settings/departments', icon: Building2 },
    { name: 'Categories', href: '/settings/categories', icon: LayoutGrid },
    { name: 'Employees', href: '/settings/employees', icon: Users },
    { name: 'ESG Configuration', href: '/settings/configuration', icon: Sliders },
    { name: 'Notification Settings', href: '/settings/notifications', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Settings & Administration
        </h1>
        <p className="text-sm text-slate-500">
          Manage system configurations, organizational structure, and application defaults.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.name}
                to={tab.href}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors
                  ${
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }
                `}
              >
                <tab.icon
                  className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-slate-400'}`}
                />
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="pt-2">
        <Outlet />
      </div>
    </div>
  );
}
