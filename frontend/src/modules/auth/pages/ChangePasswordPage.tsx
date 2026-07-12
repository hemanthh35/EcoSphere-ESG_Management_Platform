import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordSchema, type PasswordFormData } from '../validation/schemas';
import { authService } from '../services/auth.service';
import { Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

function PasswordInput({
  id,
  placeholder,
  registration,
  error,
}: {
  id: string;
  placeholder: string;
  registration: ReturnType<ReturnType<typeof useForm<PasswordFormData>>['register']>;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
        <input
          id={id}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          className={`input pl-9 pr-10 ${error ? 'input-error' : ''}`}
          {...registration}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}

export function ChangePasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success,     setSuccess]     = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  const handleFormSubmit = async (data: PasswordFormData) => {
    try {
      setServerError(null);
      setSuccess(false);
      await authService.changePassword(data);
      setSuccess(true);
      reset();
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Failed to change password.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Password &amp; Security</h1>
        <p className="page-subtitle">Update your password to keep your account secure.</p>
      </div>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-neutral-400" aria-label="Breadcrumb">
        <Link to="/profile" className="hover:text-brand-600 transition-colors font-medium">Profile</Link>
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M4 2 L8 6 L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-neutral-600">Change Password</span>
      </nav>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
        style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.06)' }}>

        {/* Card header */}
        <div className="px-6 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-900">Change Password</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Use a minimum of 8 characters with a mix of letters, numbers, and symbols.
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-5 space-y-5">

          {/* Server messages */}
          {serverError && (
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-danger-bg border border-red-200 text-sm text-danger">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M8 5 L8 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="11" r="0.75" fill="currentColor"/>
              </svg>
              {serverError}
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-brand-50 border border-brand-200 text-sm text-brand-700">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 8 L7 10 L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Password updated successfully.
            </div>
          )}

          {/* Fields */}
          <div className="space-y-1">
            <label htmlFor="current_password" className="block text-sm font-medium text-neutral-700">
              Current Password
            </label>
            <PasswordInput
              id="current_password"
              placeholder="Enter your current password"
              registration={register('current_password')}
              error={errors.current_password?.message}
            />
          </div>

          <div className="border-t border-neutral-100 pt-5 space-y-4">
            <div className="space-y-1">
              <label htmlFor="new_password" className="block text-sm font-medium text-neutral-700">
                New Password
              </label>
              <PasswordInput
                id="new_password"
                placeholder="Choose a new password"
                registration={register('new_password')}
                error={errors.new_password?.message}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="confirm_password" className="block text-sm font-medium text-neutral-700">
                Confirm New Password
              </label>
              <PasswordInput
                id="confirm_password"
                placeholder="Repeat your new password"
                registration={register('confirm_password')}
                error={errors.confirm_password?.message}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 -mx-6 px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-3">
            <Link to="/profile" className="btn btn-ghost btn-sm text-neutral-500">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-md"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Security tips */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5"
        style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.06)' }}>
        <h3 className="text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-3">Password Tips</h3>
        <ul className="space-y-2">
          {[
            'Use at least 8 characters',
            'Mix uppercase and lowercase letters',
            'Include numbers and special characters',
            'Avoid using personal information',
            'Do not reuse passwords from other sites',
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-sm text-neutral-500">
              <svg className="w-3.5 h-3.5 text-brand-400 mt-0.5 flex-shrink-0" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="6" fill="#dcfcec"/>
                <path d="M4.5 7 L6 8.5 L9.5 5" stroke="#10a368" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {tip}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
