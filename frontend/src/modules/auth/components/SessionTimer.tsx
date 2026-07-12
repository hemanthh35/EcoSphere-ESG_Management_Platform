import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Clock } from 'lucide-react';

export function SessionTimer() {
  const { isAuthenticated, logout } = useAuth();
  const [timeLeft, setTimeLeft] = useState<number>(30 * 60); // 30 minutes default
  
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // In a real app, read from token expiration
    // Here we just mock a 30 min countdown
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          logout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated, logout]);

  if (!isAuthenticated) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isWarning = timeLeft < 5 * 60; // less than 5 min

  return (
    <div className={`flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded-md ${isWarning ? 'bg-red-50 text-red-600' : 'text-gray-500'}`}>
      <Clock className="w-3.5 h-3.5" />
      <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
    </div>
  );
}
