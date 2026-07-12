import { useAuth } from '../AuthContext';
import type { Role } from '../types';

export const useCurrentUser = () => {
  const { user } = useAuth();
  return user;
};

export const useLogin = () => {
  const { login } = useAuth();
  return login;
};

export const useLogout = () => {
  const { logout } = useAuth();
  return logout;
};

export const useRole = () => {
  const { user } = useAuth();
  return user?.role;
};

export const usePermission = (requiredRole: Role | Role[]) => {
  const { user } = useAuth();
  
  if (!user) return false;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role);
  }
  
  return user.role === requiredRole;
};

export const useSession = () => {
  const { isAuthenticated, isLoading } = useAuth();
  return { isAuthenticated, isLoading };
};
