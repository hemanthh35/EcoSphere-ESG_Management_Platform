import type { UserProfile } from '../AuthContext';

interface ProfileCardProps {
  user: UserProfile;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
          {user.full_name.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{user.full_name}</h2>
          <p className="text-sm text-gray-500">{user.designation || 'No designation set'}</p>
        </div>
      </div>
      
      <div className="mt-6 border-t border-gray-100 pt-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Email address</dt>
            <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Phone number</dt>
            <dd className="mt-1 text-sm text-gray-900">{user.phone || 'Not provided'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Role</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {user.role}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Employee Code</dt>
            <dd className="mt-1 text-sm text-gray-900">{user.employee_code || 'N/A'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
