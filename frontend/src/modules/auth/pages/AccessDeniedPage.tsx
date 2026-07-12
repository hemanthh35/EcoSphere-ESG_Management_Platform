import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Access Denied</h2>
        <h3 className="text-xl text-gray-700 mb-4">403 Forbidden</h3>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this resource. Please contact your administrator if you believe this is a mistake.
        </p>
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
