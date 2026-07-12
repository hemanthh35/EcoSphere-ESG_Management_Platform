import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '@/modules/auth/components/RegisterForm';
import type { RegisterFormData } from '@/modules/auth/validation/schemas';
import { authService } from '@/modules/auth/services/auth.service';
import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export function RegisterPage() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    await authService.register(data);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Registration Successful</h2>
          <p className="text-gray-600 mb-8">
            Your account has been created. If email confirmations are required, please check your inbox. Otherwise, you can now sign in.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join EcoSphere, the Enterprise ESG Management Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <RegisterForm onSubmit={handleRegisterSubmit} />
        </div>
      </div>
    </div>
  );
}
