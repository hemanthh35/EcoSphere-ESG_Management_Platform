import { useNavigate, Link } from 'react-router-dom';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { authService } from '../services/auth.service';
import type { ForgotPasswordFormData } from '../validation/schemas';

function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#10a368"/>
      <path d="M20 8C16.5 6 9 7 7 13c-2 6 1 11 6 13 1-3 2-7 7-18z" fill="white" fillOpacity="0.9"/>
      <path d="M15 25c-1-4-2-10 5-15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7"/>
    </svg>
  );
}

function MailIllustration() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#f0fdf6"/>
      <rect x="10" y="18" width="44" height="30" rx="6" fill="#dcfcec" stroke="#10a368" strokeWidth="1.5"/>
      <path d="M10 24 L32 38 L54 24" stroke="#10a368" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    await authService.forgotPassword(data);
  };

  return (
    <div className="min-h-screen auth-bg flex flex-col justify-center px-6 py-12">
      <div className="w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <LogoMark />
          <span className="text-xl font-bold text-neutral-900 tracking-tight">
            Eco<span style={{ color: '#10a368' }}>Sphere</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 animate-fade-in">
          <div className="mb-6">
            <MailIllustration />
            <h1 className="text-xl font-bold text-neutral-900 mt-4 mb-1 tracking-tight">Reset your password</h1>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          <ForgotPasswordForm
            onSubmit={handleSubmit}
            onBackToLogin={() => navigate('/login')}
          />
        </div>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
