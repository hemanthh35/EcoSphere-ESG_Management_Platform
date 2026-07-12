import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth/AuthContext';
import { LogOut, LayoutDashboard, Users, ShieldCheck, Target, BarChart3, Settings, Leaf } from 'lucide-react';

function LogoMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#10a368"/>
      <path d="M20 8C16.5 6 9 7 7 13c-2 6 1 11 6 13 1-3 2-7 7-18z" fill="white" fillOpacity="0.9"/>
      <path d="M15 25c-1-4-2-10 5-15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7"/>
    </svg>
  );
}

function NavDivider({ label }: { label: string }) {
  return (
    <div className="px-3 pt-5 pb-1">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400">{label}</p>
    </div>
  );
}

const navigation = [
  {
    group: 'Main',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    group: 'ESG Modules',
    items: [
      { name: 'Environmental', href: '/environmental', icon: Leaf },
      { name: 'Social', href: '/social', icon: Users },
      { name: 'Governance', href: '/governance', icon: ShieldCheck },
      { name: 'Gamification', href: '/gamification', icon: Target },
    ],
  },
  {
    group: 'Analytics',
    items: [
      { name: 'Reports', href: '/reports', icon: BarChart3 },
    ],
  },
  {
    group: 'Admin',
    items: [
      { name: 'Settings', href: '/settings/departments', icon: Settings },
    ],
  },
];

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (href: string) =>
    href === '/dashboard'
      ? location.pathname === href
      : location.pathname.startsWith(href);

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="min-h-screen flex" style={{ background: '#f3f4f6' }}>
      {/* ── Sidebar ──────────────────────────────────── */}
      <aside className="w-[220px] flex-shrink-0 flex flex-col bg-white border-r border-neutral-200"
        style={{ boxShadow: '1px 0 0 0 #e5e7eb' }}>

        {/* Logo */}
        <div className="h-[60px] flex items-center gap-2.5 px-4 border-b border-neutral-200 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <LogoMark />
            <span className="text-[17px] font-bold text-neutral-900 tracking-tight">
              Eco<span style={{ color: '#10a368' }}>Sphere</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {navigation.map((group) => (
            <div key={group.group}>
              <NavDivider label={group.group} />
              <ul className="px-2 space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`
                          flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
                          ${active
                            ? 'bg-brand-50 text-brand-700 shadow-[inset_3px_0_0_#10a368]'
                            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                          }
                        `}
                      >
                        <Icon
                          className={`w-4 h-4 flex-shrink-0 ${active ? 'text-brand-600' : 'text-neutral-400'}`}
                          strokeWidth={active ? 2.2 : 1.8}
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-neutral-200 p-3 flex-shrink-0">
          <Link
            to="/profile"
            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-neutral-100 transition-colors group mb-1"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-brand-700"
              style={{ background: 'linear-gradient(135deg, #dcfcec 0%, #b8f5d6 100%)' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-neutral-800 truncate leading-none mb-0.5">
                {user?.full_name || 'User'}
              </p>
              <p className="text-[10px] text-neutral-400 truncate leading-none capitalize">
                {user?.role?.toLowerCase() || 'member'}
              </p>
            </div>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-neutral-500 hover:text-danger hover:bg-danger-bg transition-all duration-150"
          >
            <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-[60px] bg-white border-b border-neutral-200 flex items-center px-6 flex-shrink-0">
          <div className="flex-1" />
          {/* Right side: notifications placeholder + avatar */}
          <div className="flex items-center gap-3">
            <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-brand-700"
                style={{ background: 'linear-gradient(135deg, #dcfcec 0%, #b8f5d6 100%)' }}>
                {initials}
              </div>
              <span className="text-sm font-medium text-neutral-700 hidden sm:block">{user?.full_name}</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
