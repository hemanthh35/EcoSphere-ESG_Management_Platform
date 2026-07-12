import { useNavigate } from 'react-router-dom';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { authService } from '../services/auth.service';
import type { ForgotPasswordFormData } from '../validation/schemas';

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    await authService.forgotPassword(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <ForgotPasswordForm 
            onSubmit={handleSubmit} 
            onBackToLogin={() => navigate('/login')} 
          />
        </div>
      </div>
    </div>
  );
}
