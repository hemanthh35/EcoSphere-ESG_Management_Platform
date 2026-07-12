import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
      <p className="mt-4 text-sm font-medium text-gray-700">{message}</p>
    </div>
  );
}
