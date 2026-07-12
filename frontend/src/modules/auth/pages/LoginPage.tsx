import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth/AuthContext';
import { LoginForm } from '@/modules/auth/components/LoginForm';
import type { LoginFormData } from '@/modules/auth/validation/schemas';
import { authService } from '@/modules/auth/services/auth.service';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSubmit = async (data: LoginFormData) => {
    // We can use the service directly, but we also need to update Context
    const response = await authService.login(data);
    await login(response.access_token, response.refresh_token);
    
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  const handleForgotPassword = () => {
    navigate('/auth/forgot-password');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to EcoSphere
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enterprise ESG Management Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <LoginForm 
            onSubmit={handleLoginSubmit} 
            onForgotPassword={handleForgotPassword} 
          />
        </div>
      </div>
    </div>
  );
}
