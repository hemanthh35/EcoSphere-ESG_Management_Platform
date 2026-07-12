import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/modules/auth/AuthContext';
import { LoginForm } from '@/modules/auth/components/LoginForm';
import type { LoginFormData } from '@/modules/auth/validation/schemas';
import { authService } from '@/modules/auth/services/auth.service';

function AuthIllustration() {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full max-w-sm mx-auto">
      {/* Globe base */}
      <circle cx="200" cy="260" r="140" fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.15" strokeWidth="1.5"/>
      <ellipse cx="200" cy="260" rx="70" ry="140" stroke="white" strokeOpacity="0.12" strokeWidth="1"/>
      <line x1="60" y1="260" x2="340" y2="260" stroke="white" strokeOpacity="0.12" strokeWidth="1"/>
      <line x1="80" y1="200" x2="320" y2="200" stroke="white" strokeOpacity="0.08" strokeWidth="1"/>
      <line x1="80" y1="320" x2="320" y2="320" stroke="white" strokeOpacity="0.08" strokeWidth="1"/>
      {/* Leaf / brand mark */}
      <path d="M200 130 C200 130 165 145 155 175 C145 205 155 235 175 245 C178 238 182 228 200 210 C218 228 222 238 225 245 C245 235 255 205 245 175 C235 145 200 130 200 130Z"
        fill="white" fillOpacity="0.9"/>
      <path d="M200 210 C200 220 200 232 200 245" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6"/>
      {/* Floating stat card */}
      <g transform="translate(48, 160)">
        <rect width="120" height="60" rx="12" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.2" strokeWidth="1"/>
        <rect x="12" y="14" width="50" height="7" rx="3.5" fill="white" fillOpacity="0.5"/>
        <rect x="12" y="28" width="36" height="12" rx="4" fill="white" fillOpacity="0.8"/>
        <circle cx="96" cy="30" r="14" fill="white" fillOpacity="0.1"/>
        <path d="M90 32 L96 26 L102 32" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8"/>
      </g>
      {/* Floating stat card 2 */}
      <g transform="translate(232, 330)">
        <rect width="120" height="60" rx="12" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.2" strokeWidth="1"/>
        <rect x="12" y="14" width="40" height="7" rx="3.5" fill="white" fillOpacity="0.5"/>
        <rect x="12" y="28" width="56" height="12" rx="4" fill="white" fillOpacity="0.8"/>
        <circle cx="96" cy="30" r="14" fill="white" fillOpacity="0.1"/>
        <path d="M89 30 L96 37 L103 30" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6"/>
      </g>
      {/* Mini bar chart */}
      <g transform="translate(270, 160)">
        <rect width="86" height="70" rx="10" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.15" strokeWidth="1"/>
        <rect x="12" y="40" width="10" height="18" rx="3" fill="white" fillOpacity="0.35"/>
        <rect x="26" y="30" width="10" height="28" rx="3" fill="white" fillOpacity="0.5"/>
        <rect x="40" y="22" width="10" height="36" rx="3" fill="white" fillOpacity="0.65"/>
        <rect x="54" y="28" width="10" height="30" rx="3" fill="white" fillOpacity="0.8"/>
      </g>
    </svg>
  );
}

function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#10a368"/>
      <path d="M20 8C16.5 6 9 7 7 13c-2 6 1 11 6 13 1-3 2-7 7-18z" fill="white" fillOpacity="0.9"/>
      <path d="M15 25c-1-4-2-10 5-15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7"/>
    </svg>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSubmit = async (data: LoginFormData) => {
    const response = await authService.login(data);
    await login(response.access_token, response.refresh_token);
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  const handleForgotPassword = () => {
    navigate('/auth/forgot-password');
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel: brand ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-col relative overflow-hidden flex-shrink-0"
        style={{ background: 'linear-gradient(160deg, #0d8254 0%, #10a368 40%, #1fbb7c 100%)' }}>
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
        {/* Glow */}
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 65%)' }} />

        <div className="relative z-10 flex flex-col h-full px-10 py-10">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="9" fill="white" fillOpacity="0.2"/>
              <path d="M20 8C16.5 6 9 7 7 13c-2 6 1 11 6 13 1-3 2-7 7-18z" fill="white" fillOpacity="0.9"/>
              <path d="M15 25c-1-4-2-10 5-15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7"/>
            </svg>
            <span className="text-xl font-bold text-white tracking-tight">EcoSphere</span>
          </div>

          {/* Middle content */}
          <div className="flex-1 flex flex-col justify-center">
            <AuthIllustration />
            <div className="mt-8 text-center">
              <h2 className="font-serif text-3xl text-white mb-3 leading-tight">
                Sustainability starts<br/>with visibility
              </h2>
              <p className="text-white/70 text-sm leading-relaxed max-w-xs mx-auto">
                Track every ESG metric, meet every compliance requirement, and inspire every employee — all from one platform.
              </p>
            </div>
          </div>

          {/* Bottom testimonial */}
          <blockquote className="border-l-2 border-white/30 pl-4 mt-6">
            <p className="text-white/80 text-sm italic leading-relaxed">
              "EcoSphere reduced our ESG reporting time by 60% and gave us full confidence in our audit readiness."
            </p>
            <footer className="mt-2 text-white/50 text-xs">— Chief Sustainability Officer, Global 500 Company</footer>
          </blockquote>
        </div>
      </div>

      {/* ── Right panel: form ──────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center auth-bg px-6 py-12 sm:px-10">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <LogoMark />
            <span className="text-xl font-bold text-neutral-900 tracking-tight">
              Eco<span style={{ color: '#10a368' }}>Sphere</span>
            </span>
          </div>

          <div className="mb-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-neutral-900 mb-1 tracking-tight">Welcome back</h1>
            <p className="text-sm text-neutral-500">Sign in to your EcoSphere account</p>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm animate-fade-in delay-100">
            <LoginForm
              onSubmit={handleLoginSubmit}
              onForgotPassword={handleForgotPassword}
            />
          </div>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
