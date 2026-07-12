import type { ReactNode } from 'react';
import { useAuth } from '../AuthContext';
import type { Role } from '../types';

interface PermissionGuardProps {
  children: ReactNode;
  allowedRoles?: Role[];
  fallback?: ReactNode;
}

export function PermissionGuard({ children, allowedRoles, fallback = null }: PermissionGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  // If roles are specified, check if user has one of them
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return <>{fallback}</>;
    }
  }

  // In a real app with granular permissions, we would check specific permissions here
  // e.g., if (requiredPermissions && !hasPermissions(user, requiredPermissions)) return fallback;

  return <>{children}</>;
}
