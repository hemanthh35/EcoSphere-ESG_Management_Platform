import { useNavigate, Link } from 'react-router-dom';
import { RegisterForm } from '@/modules/auth/components/RegisterForm';
import type { RegisterFormData } from '@/modules/auth/validation/schemas';
import { authService } from '@/modules/auth/services/auth.service';
import { useState } from 'react';

function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#10a368"/>
      <path d="M20 8C16.5 6 9 7 7 13c-2 6 1 11 6 13 1-3 2-7 7-18z" fill="white" fillOpacity="0.9"/>
      <path d="M15 25c-1-4-2-10 5-15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7"/>
    </svg>
  );
}

function SuccessIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="40" cy="40" r="40" fill="#f0fdf6"/>
      <circle cx="40" cy="40" r="28" fill="#dcfcec"/>
      <path d="M27 40 L36 49 L53 32" stroke="#10a368" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const benefits = [
  'Free 30-day trial, no credit card required',
  'GDPR-compliant data handling',
  'SOC 2 Type II certified infrastructure',
  'Dedicated onboarding support',
];

export function RegisterPage() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    await authService.register(data);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen auth-bg flex items-center justify-center px-6 py-12">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-10 max-w-md w-full text-center animate-fade-in">
          <SuccessIllustration />
          <h2 className="text-2xl font-bold text-neutral-900 mt-6 mb-2 tracking-tight">Account Created</h2>
          <p className="text-neutral-500 text-sm mb-8 leading-relaxed">
            Your account has been created successfully. If email confirmation is required, check your inbox. Otherwise you can sign in now.
          </p>
          <button onClick={() => navigate('/login')} className="btn btn-primary btn-lg w-full">
            Continue to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel: brand ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-[400px] xl:w-[460px] flex-col flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0d8254 0%, #10a368 40%, #1fbb7c 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
        <div className="relative z-10 flex flex-col h-full px-10 py-10">
          <div className="flex items-center gap-2.5">
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="9" fill="white" fillOpacity="0.2"/>
              <path d="M20 8C16.5 6 9 7 7 13c-2 6 1 11 6 13 1-3 2-7 7-18z" fill="white" fillOpacity="0.9"/>
              <path d="M15 25c-1-4-2-10 5-15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7"/>
            </svg>
            <span className="text-xl font-bold text-white tracking-tight">EcoSphere</span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h2 className="font-serif text-3xl text-white mb-4 leading-tight">
              Join the ESG<br/>revolution
            </h2>
            <p className="text-white/70 text-sm leading-relaxed mb-8">
              Thousands of sustainability leaders trust EcoSphere to manage their ESG programs.
            </p>
            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-white mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" fill="white" fillOpacity="0.2"/>
                    <path d="M5 8 L7 10 L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-white/80 text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-white/40 text-xs mt-6">
            &copy; {new Date().getFullYear()} EcoSphere. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right panel: form ──────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center auth-bg px-6 py-12 sm:px-10 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <LogoMark />
            <span className="text-xl font-bold text-neutral-900 tracking-tight">
              Eco<span style={{ color: '#10a368' }}>Sphere</span>
            </span>
          </div>

          <div className="mb-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-neutral-900 mb-1 tracking-tight">Create your account</h1>
            <p className="text-sm text-neutral-500">Get started with EcoSphere in minutes</p>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm animate-fade-in delay-100">
            <RegisterForm onSubmit={handleRegisterSubmit} />
          </div>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
