import { useState, useEffect } from 'react';
import { Leaf, FileText, Download } from 'lucide-react';
import { reportsService } from '@/services/reportsService';
import type { EnvironmentalReport as EnvReportType } from '@/services/reportsService';

interface Props {
  deptId: string;
}

export function EnvironmentalReport({ deptId }: Props) {
  const [data, setData] = useState<EnvReportType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);
        const report = await reportsService.getEnvironmentalReport({ department_id: deptId || undefined });
        setData(report);
      } catch (err) {
        console.error('Failed to load environmental report', err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [deptId]);

  const handleExport = () => {
    reportsService.downloadCSV('environmental', deptId);
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
          <Leaf className="w-5 h-5 text-emerald-500" />
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Environmental Performance Report</h3>
            <p className="text-slate-500 text-xs mt-0.5">Aggregated carbon reduction, resource consumption and environmental targets</p>
          </div>
        </div>
        <button onClick={handleExport} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 shadow-sm transition-colors">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Grid KPI Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CO2 Offsets</span>
          <div className="flex items-baseline gap-1.5">
            <h4 className="text-2xl font-black text-slate-800">{data.total_co2_reduction.toLocaleString()}</h4>
            <span className="text-xs font-semibold text-slate-500">kg CO2e</span>
          </div>
          <p className="text-[10px] text-emerald-600 font-medium">Offset reduction transactions</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Energy Saved</span>
          <div className="flex items-baseline gap-1.5">
            <h4 className="text-2xl font-black text-slate-800">{data.total_energy_saved.toLocaleString()}</h4>
            <span className="text-xs font-semibold text-slate-500">kWh</span>
          </div>
          <p className="text-[10px] text-amber-600 font-medium">Estimated from goal tracking</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Water Conserved</span>
          <div className="flex items-baseline gap-1.5">
            <h4 className="text-2xl font-black text-slate-800">{data.total_water_conserved.toLocaleString()}</h4>
            <span className="text-xs font-semibold text-slate-500">Liters</span>
          </div>
          <p className="text-[10px] text-blue-600 font-medium">Preservation initiatives</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Waste Recycled</span>
          <div className="flex items-baseline gap-1.5">
            <h4 className="text-2xl font-black text-slate-800">{data.total_waste_recycled.toLocaleString()}</h4>
            <span className="text-xs font-semibold text-slate-500">kg</span>
          </div>
          <p className="text-[10px] text-indigo-600 font-medium">Recycling programs</p>
        </div>
      </div>

      {/* Goals Progress */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <FileText className="w-4.5 h-4.5 text-slate-400" />
          Active Environmental Goals & Targets
        </h3>

        {data.goals_progress.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">No active environmental goals found for this selection.</div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {data.goals_progress.map((goal) => (
              <div key={goal.id} className="p-4 rounded-lg border border-slate-100 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-slate-800">{goal.title}</h4>
                  <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{Math.round(goal.progress)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(goal.progress, 100)}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Current: {goal.current_value.toLocaleString()}</span>
                  <span>Target: {goal.target_value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
