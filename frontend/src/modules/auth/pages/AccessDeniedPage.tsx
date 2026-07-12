import { useNavigate } from 'react-router-dom';

function ShieldSVG() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="80" height="80" rx="20" fill="#fef2f2"/>
      <path d="M40 16 L58 24 L58 38 C58 50 40 62 40 62 C40 62 22 50 22 38 L22 24 L40 16Z"
        fill="#fee2e2" stroke="#dc2626" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M34 40 L38 44 L46 36" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0"/>
      <line x1="37" y1="34" x2="37" y2="42" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="37" cy="47" r="1.5" fill="#dc2626"/>
      <line x1="43" y1="34" x2="43" y2="42" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="43" cy="47" r="1.5" fill="#dc2626"/>
    </svg>
  );
}

export function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-12 max-w-md w-full text-center animate-fade-in">
        <ShieldSVG />
        <div className="mt-6">
          <p className="text-xs font-semibold tracking-widest text-danger uppercase mb-2">403 Forbidden</p>
          <h1 className="text-2xl font-bold text-neutral-900 mb-3 tracking-tight">Access Denied</h1>
          <p className="text-neutral-500 text-sm leading-relaxed mb-8">
            You don&apos;t have permission to access this resource. Please contact your administrator if you believe this is an error.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-secondary btn-md"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary btn-md"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
