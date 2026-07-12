import { useState, useEffect } from 'react';
import { Users, Hourglass, Download } from 'lucide-react';
import { reportsService } from '@/services/reportsService';
import type { SocialReport as SocialReportType } from '@/services/reportsService';

interface Props {
  deptId: string;
}

export function SocialReport({ deptId }: Props) {
  const [data, setData] = useState<SocialReportType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);
        const report = await reportsService.getSocialReport({ department_id: deptId || undefined });
        setData(report);
      } catch (err) {
        console.error('Failed to load social report', err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [deptId]);

  const handleExport = () => {
    reportsService.downloadCSV('social', deptId);
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
          <Users className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Social Performance Report</h3>
            <p className="text-slate-500 text-xs mt-0.5">Aggregated metrics on CSR, training completion, and workplace diversity</p>
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
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CSR Volunteer Hours</span>
          <div className="flex items-baseline gap-1.5">
            <h4 className="text-2xl font-black text-slate-800">{data.total_csr_hours.toLocaleString()}</h4>
            <span className="text-xs font-semibold text-slate-500">hours</span>
          </div>
          <p className="text-[10px] text-indigo-600 font-medium">Estimated commitment</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CSR Registrations</span>
          <div className="flex items-baseline gap-1.5">
            <h4 className="text-2xl font-black text-slate-800">{data.csr_participation_count.toLocaleString()}</h4>
            <span className="text-xs font-semibold text-slate-500">signups</span>
          </div>
          <p className="text-[10px] text-emerald-600 font-medium">Unique signups tracked</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Workforce Diversity</span>
          <div className="flex items-baseline gap-1.5">
            <h4 className="text-2xl font-black text-slate-800">{Math.round(data.average_diversity_score)}</h4>
            <span className="text-xs font-semibold text-slate-500">%</span>
          </div>
          <p className="text-[10px] text-amber-600 font-medium">Mean diversity quotient</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Training Rate</span>
          <div className="flex items-baseline gap-1.5">
            <h4 className="text-2xl font-black text-slate-800">{Math.round(data.training_completion_rate)}</h4>
            <span className="text-xs font-semibold text-slate-500">%</span>
          </div>
          <p className="text-[10px] text-rose-600 font-medium">ESG course completion</p>
        </div>
      </div>

      {/* Active CSR overview */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Hourglass className="w-4.5 h-4.5 text-slate-400" />
          Active Corporate Social Responsibility (CSR) Activities
        </h3>

        {data.active_csr_initiatives.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">No active CSR activities found for this selection.</div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
            {data.active_csr_initiatives.map((act) => (
              <div key={act.id} className="flex justify-between items-center p-4 hover:bg-slate-50/50 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{act.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Maximum Participants: {act.max_participants || 50}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                  act.status === 'ONGOING' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {act.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
