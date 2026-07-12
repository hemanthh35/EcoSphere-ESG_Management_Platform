import { useNavigate } from 'react-router-dom';

function LockSVG() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="80" height="80" rx="20" fill="#fffbeb"/>
      <rect x="22" y="38" width="36" height="24" rx="8" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5"/>
      <path d="M30 38V30a10 10 0 0120 0v8" stroke="#d97706" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="40" cy="50" r="3" fill="#d97706"/>
      <line x1="40" y1="53" x2="40" y2="57" stroke="#d97706" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-12 max-w-md w-full text-center animate-fade-in">
        <LockSVG />
        <div className="mt-6">
          <p className="text-xs font-semibold tracking-widest text-warning uppercase mb-2">401 Unauthorized</p>
          <h1 className="text-2xl font-bold text-neutral-900 mb-3 tracking-tight">Session Expired</h1>
          <p className="text-neutral-500 text-sm leading-relaxed mb-8">
            Your session has expired or you are not logged in. Please sign in to continue.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary btn-lg w-full"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
