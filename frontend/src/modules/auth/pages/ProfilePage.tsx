import { useState } from 'react';
import { useAuth } from '@/modules/auth/AuthContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import apiClient from '@/lib/apiClient';
import { Loader2, Save, User, Mail, Briefcase, Phone, Shield, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const profileSchema = z.object({
  full_name:   z.string().min(2, 'Name must be at least 2 characters'),
  designation: z.string().optional(),
  phone:       z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

function AvatarSVG({ initials }: { initials: string }) {
  return (
    <div
      className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-brand-700 select-none"
      style={{ background: 'linear-gradient(135deg, #dcfcec 0%, #b8f5d6 100%)' }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

interface FieldRowProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}
function FieldRow({ label, icon, children }: FieldRowProps) {
  return (
    <div className="grid sm:grid-cols-3 gap-3 items-start py-5 border-b border-neutral-100 last:border-0">
      <label className="flex items-center gap-2 text-sm font-medium text-neutral-600 pt-2">
        <span className="text-neutral-400">{icon}</span>
        {label}
      </label>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg,   setErrorMsg]   = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name:   user?.full_name   || '',
      designation: user?.designation || '',
      phone:       user?.phone       || '',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    try {
      setErrorMsg(null);
      setSuccessMsg(null);
      const response = await apiClient.put('/auth/profile', data);
      updateUser(response.data);
      setSuccessMsg('Profile updated successfully.');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update profile.');
    }
  };

  if (!user) return null;

  const initials = user.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your personal information and account settings.</p>
      </div>

      {/* Identity card */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 flex items-center gap-5"
        style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.06)' }}>
        <AvatarSVG initials={initials} />
        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold text-neutral-900 truncate">{user.full_name}</p>
          <p className="text-sm text-neutral-500 truncate">{user.email}</p>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="badge badge-green capitalize">{user.role?.toLowerCase()}</span>
            {user.designation && (
              <span className="badge badge-neutral">{user.designation}</span>
            )}
          </div>
        </div>
        <Link
          to="/profile/settings"
          className="btn btn-secondary btn-sm hidden sm:flex"
        >
          <Shield className="w-3.5 h-3.5" />
          Security
        </Link>
      </div>

      {/* Edit form */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
        style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.06)' }}>
        {/* Card header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">Personal Information</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Update your name, role, and contact details.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6">
            {/* Read-only fields */}
            <FieldRow label="Email address" icon={<Mail className="w-4 h-4" />}>
              <input
                type="email"
                disabled
                value={user.email}
                className="input"
                style={{ background: '#f9fafb', color: '#9ca3af', cursor: 'not-allowed' }}
              />
            </FieldRow>

            <FieldRow label="Role" icon={<Shield className="w-4 h-4" />}>
              <input
                type="text"
                disabled
                value={user.role}
                className="input capitalize"
                style={{ background: '#f9fafb', color: '#9ca3af', cursor: 'not-allowed' }}
              />
            </FieldRow>

            {/* Editable fields */}
            <FieldRow label="Full name" icon={<User className="w-4 h-4" />}>
              <input
                type="text"
                {...register('full_name')}
                className={`input ${errors.full_name ? 'input-error' : ''}`}
                placeholder="Your full name"
              />
              {errors.full_name && (
                <p className="mt-1.5 text-xs text-danger">{errors.full_name.message}</p>
              )}
            </FieldRow>

            <FieldRow label="Designation" icon={<Briefcase className="w-4 h-4" />}>
              <input
                type="text"
                {...register('designation')}
                className="input"
                placeholder="e.g. Sustainability Manager"
              />
            </FieldRow>

            <FieldRow label="Phone" icon={<Phone className="w-4 h-4" />}>
              <input
                type="text"
                {...register('phone')}
                className="input"
                placeholder="+1 (555) 000-0000"
              />
            </FieldRow>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-4">
            <div className="text-sm">
              {successMsg && (
                <span className="flex items-center gap-1.5 text-brand-600 font-medium">
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M5 8 L7 10 L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {successMsg}
                </span>
              )}
              {errorMsg && (
                <span className="text-danger text-sm">{errorMsg}</span>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="btn btn-primary btn-md"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center justify-between"
        style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.06)' }}>
        <div>
          <p className="text-sm font-medium text-neutral-800">Password &amp; Security</p>
          <p className="text-xs text-neutral-400 mt-0.5">Manage your login credentials.</p>
        </div>
        <Link to="/profile/settings" className="btn btn-secondary btn-sm">
          <LinkIcon className="w-3.5 h-3.5" />
          Change Password
        </Link>
      </div>

    </div>
  );
}
