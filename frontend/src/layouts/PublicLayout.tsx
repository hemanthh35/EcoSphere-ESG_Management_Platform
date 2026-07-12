import { Outlet, Link } from 'react-router-dom';

function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#10a368"/>
      <path d="M20 8C16.5 6 9 7 7 13c-2 6 1 11 6 13 1-3 2-7 7-18z" fill="white" fillOpacity="0.9"/>
      <path d="M15 25c-1-4-2-10 5-15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7"/>
    </svg>
  );
}

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Nav ─────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-[60px] items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <LogoMark />
              <span className="text-xl font-bold text-neutral-900 tracking-tight">
                Eco<span style={{ color: '#10a368' }}>Sphere</span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="btn btn-ghost btn-sm text-neutral-600 hover:text-neutral-900"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Page Content ───────────────────────────────── */}
      <main className="flex-grow pt-[60px]">
        <Outlet />
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <LogoMark />
              <span className="text-sm font-semibold text-neutral-700">EcoSphere</span>
            </div>
            <p className="text-xs text-neutral-400">
              &copy; {new Date().getFullYear()} EcoSphere. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">Privacy</a>
              <a href="#" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">Terms</a>
              <a href="#" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
