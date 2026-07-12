import { useState, useEffect } from 'react';
import { Award, Users, GraduationCap, Calendar, Loader2 } from 'lucide-react';
import { socialApi } from '@/services/socialService';
import { departmentApi } from '@/services/departmentService';
import type { CsrActivity, DiversityMetric, TrainingRecord } from '@/modules/social/types/social.types';

export function SocialDashboardTab() {
  const [activities, setActivities] = useState<CsrActivity[]>([]);
  const [diversityMetrics, setDiversityMetrics] = useState<DiversityMetric[]>([]);
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [departments, setDepartments] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [acts, divMetrics, trainings, deptsRes] = await Promise.all([
          socialApi.listActivities().catch(() => []),
          socialApi.listDiversityMetrics().catch(() => []),
          socialApi.listTrainingRecords().catch(() => []),
          departmentApi.getDropdown().catch(() => ({ data: [] }))
        ]);

        setActivities(acts);
        setDiversityMetrics(divMetrics);
        setTrainingRecords(trainings);

        const deptMap: Record<string, string> = {};
        deptsRes.data?.forEach((d: any) => {
          deptMap[d.id] = d.name;
        });
        setDepartments(deptMap);
      } catch (err) {
        console.error('Failed to load social dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
        <p className="text-sm text-slate-500">Loading social dashboard metrics...</p>
      </div>
    );
  }

  // Calculate metrics
  const totalCsr = activities.length;
  const activeCsr = activities.filter(a => a.status === 'ONGOING' || a.status === 'PLANNED').length;
  const totalTrainings = trainingRecords.length;
  const totalDiversityRecords = diversityMetrics.length;

  const kpis = [
    { title: 'Total CSR Projects', value: totalCsr.toString(), desc: `${activeCsr} active or planned`, icon: Calendar, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { title: 'Training completions', value: totalTrainings.toString(), desc: 'Total certified records', icon: GraduationCap, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { title: 'Diversity Records', value: totalDiversityRecords.toString(), desc: 'Tracked reporting periods', icon: Users, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { title: 'Social ESG Points', value: (totalCsr * 150 + totalTrainings * 50).toLocaleString(), desc: 'Est. points generated', icon: Award, color: 'text-rose-600 bg-rose-50 border-rose-100' },
  ];

  // Group diversity metrics by reporting period
  const latestPeriodMetrics = diversityMetrics.slice(-4); // Get latest 4 entries



  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
              <div className="space-y-2">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{kpi.title}</p>
                <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{kpi.value}</h3>
                <span className="text-slate-500 text-xs font-medium flex items-center gap-1">
                  {kpi.desc}
                </span>
              </div>
              <div className={`p-4 rounded-xl border ${kpi.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CSR Projects Summary List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">CSR Activities Overview</h2>
            <p className="text-slate-500 text-xs">Overview of current corporate social responsibility programs</p>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {activities.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">No CSR activities registered.</div>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="flex justify-between items-center border-b border-slate-50 pb-3 last:border-b-0 last:pb-0">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-slate-800">{act.title}</h4>
                    <p className="text-xs text-slate-500">{act.location || 'Online'} • Max {act.max_participants || 50} participants</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                    act.status === 'COMPLETED' ? 'bg-slate-100 text-slate-700' :
                    act.status === 'ONGOING' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {act.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Diversity Metrics Snapshot */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Workforce Diversity</h2>
            <p className="text-slate-500 text-xs">Workforce composition metrics from reporting data</p>
          </div>
          
          <div className="space-y-5">
            {latestPeriodMetrics.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">No diversity metrics recorded yet.</div>
            ) : (
              latestPeriodMetrics.map((metric) => (
                <div key={metric.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{metric.metric_name} ({departments[metric.department_id] || 'General'})</span>
                    <span>{metric.metric_value}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${metric.metric_value}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Period: {metric.reporting_period}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
