import { AlertTriangle } from 'lucide-react';

export function ComplianceIssuesTab() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">Compliance Issues Tracker</h3>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        Track and resolve compliance issues raised during audits. This module is under construction and will be available soon.
      </p>
    </div>
  );
}
