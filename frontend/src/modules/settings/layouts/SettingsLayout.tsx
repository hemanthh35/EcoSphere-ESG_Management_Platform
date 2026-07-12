import { Outlet, Link, useLocation } from 'react-router-dom';
import { Settings, Building2, LayoutGrid, Sliders, Bell, Users, Box } from 'lucide-react';

const tabs = [
  { name: 'Departments', href: '/settings/departments', icon: Building2 },
  { name: 'Categories',  href: '/settings/categories',  icon: LayoutGrid },
  { name: 'Employees',   href: '/settings/employees',   icon: Users },
  { name: 'Products',    href: '/settings/products',    icon: Box },
  { name: 'ESG Config',  href: '/settings/configuration', icon: Sliders },
  { name: 'Notifications', href: '/settings/notifications', icon: Bell },
];

export function SettingsLayout() {
  const location = useLocation();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
            <Settings className="w-4 h-4 text-brand-600" strokeWidth={2} />
          </div>
          <h1 className="page-title">Settings &amp; Administration</h1>
        </div>
        <p className="page-subtitle pl-10">
          Manage system configuration, organisational structure, and application defaults.
        </p>
      </div>

      {/* Tab strip */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
        style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.06)' }}>
        <div className="border-b border-neutral-200 overflow-x-auto">
          <nav className="flex min-w-max px-2" aria-label="Settings tabs">
            {tabs.map((tab) => {
              const active = location.pathname.startsWith(tab.href);
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.name}
                  to={tab.href}
                  className={`
                    inline-flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                    ${active
                      ? 'border-brand-500 text-brand-700 bg-brand-50/50'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                    }
                  `}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-brand-500' : 'text-neutral-400'}`} strokeWidth={1.8} />
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Tab content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
