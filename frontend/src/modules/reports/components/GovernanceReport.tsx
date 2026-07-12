import { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, Download } from 'lucide-react';
import { reportsService } from '@/services/reportsService';
import type { GovernanceReport as GovReportType } from '@/services/reportsService';

interface Props {
  deptId: string;
}

export function GovernanceReport({ deptId }: Props) {
  const [data, setData] = useState<GovReportType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);
        const report = await reportsService.getGovernanceReport({ department_id: deptId || undefined });
        setData(report);
      } catch (err) {
        console.error('Failed to load governance report', err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [deptId]);

  const handleExport = () => {
    reportsService.downloadCSV('governance', deptId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200/60">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Governance & Compliance Report</h3>
            <p className="text-slate-500 text-xs mt-0.5">Summary of policy status, compliance issues and active audits</p>
          </div>
        </div>
        <button onClick={handleExport} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 shadow-sm transition-colors">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Grid KPIs */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Policies</span>
          <div className="flex items-baseline gap-1.5">
            <h4 className="text-2xl font-black text-slate-800">{data.active_policies_count}</h4>
            <span className="text-xs font-semibold text-slate-500">active</span>
          </div>
          <p className="text-[10px] text-indigo-600 font-medium">Approved ESG policies</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Audits</span>
          <div className="flex items-baseline gap-1.5">
            <h4 className="text-2xl font-black text-slate-800">{data.total_audits_count}</h4>
            <span className="text-xs font-semibold text-slate-500">audits</span>
          </div>
          <p className="text-[10px] text-amber-600 font-medium">Planned audits</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed Audits</span>
          <div className="flex items-baseline gap-1.5">
            <h4 className="text-2xl font-black text-slate-800">{data.completed_audits_count}</h4>
            <span className="text-xs font-semibold text-slate-500">finished</span>
          </div>
          <p className="text-[10px] text-emerald-600 font-medium">Successfully completed</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Open Issues</span>
          <div className="flex items-baseline gap-1.5">
            <h4 className="text-2xl font-black text-slate-800">{data.open_compliance_issues_count}</h4>
            <span className="text-xs font-semibold text-slate-500">issues</span>
          </div>
          <p className="text-[10px] text-red-600 font-medium">Require quick resolution</p>
        </div>
      </div>

      {/* Compliance issues alerts */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <AlertTriangle className="w-4.5 h-4.5 text-slate-400" />
          Active Compliance Issues
        </h3>

        {data.compliance_issues.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">No active compliance issues found.</div>
        ) : (
          <div className="space-y-3">
            {data.compliance_issues.map((issue) => (
              <div key={issue.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-lg bg-slate-50/20">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{issue.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Due Date: {issue.due_date}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                  issue.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                  issue.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {issue.severity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
