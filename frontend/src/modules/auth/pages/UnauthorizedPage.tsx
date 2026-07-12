import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <LogIn className="mx-auto h-16 w-16 text-orange-500 mb-4" />
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Unauthorized</h2>
        <h3 className="text-xl text-gray-700 mb-4">401 Session Expired</h3>
        <p className="text-gray-600 mb-8">
          Your session has expired or you are not logged in. Please log in to continue.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
