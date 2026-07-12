import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ResetPasswordForm } from '../components/ResetPasswordForm';
import { authService } from '../services/auth.service';
import type { ResetPasswordFormData } from '../validation/schemas';
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

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [success, setSuccess] = useState(false);
  const token = searchParams.get('token') || '';

  const handleSubmit = async (data: ResetPasswordFormData) => {
    if (!token) throw new Error('Invalid or missing reset token.');
    await authService.resetPassword({ ...data, token });
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen auth-bg flex items-center justify-center px-6 py-12">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-10 max-w-md w-full text-center animate-fade-in">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mx-auto mb-4" aria-hidden="true">
            <circle cx="32" cy="32" r="32" fill="#f0fdf6"/>
            <circle cx="32" cy="32" r="22" fill="#dcfcec"/>
            <path d="M22 32 L29 39 L42 25" stroke="#10a368" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2 className="text-xl font-bold text-neutral-900 mb-2 tracking-tight">Password reset successfully</h2>
          <p className="text-neutral-500 text-sm mb-8 leading-relaxed">
            Your password has been updated. You can now sign in with your new password.
          </p>
          <button onClick={() => navigate('/login')} className="btn btn-primary btn-lg w-full">
            Continue to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen auth-bg flex flex-col justify-center px-6 py-12">
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <LogoMark />
          <span className="text-xl font-bold text-neutral-900 tracking-tight">
            Eco<span style={{ color: '#10a368' }}>Sphere</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 animate-fade-in">
          <div className="mb-6">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-4" aria-hidden="true">
              <rect width="48" height="48" rx="12" fill="#f0fdf6"/>
              <rect x="14" y="22" width="20" height="14" rx="4" fill="#dcfcec" stroke="#10a368" strokeWidth="1.5"/>
              <path d="M18 22V18a6 6 0 0112 0v4" stroke="#10a368" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="24" cy="29" r="2" fill="#10a368"/>
            </svg>
            <h1 className="text-xl font-bold text-neutral-900 mb-1 tracking-tight">Create new password</h1>
            <p className="text-sm text-neutral-500">Choose a strong password for your account.</p>
          </div>
          <ResetPasswordForm onSubmit={handleSubmit} />
        </div>

        <p className="mt-6 text-center text-sm text-neutral-500">
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
