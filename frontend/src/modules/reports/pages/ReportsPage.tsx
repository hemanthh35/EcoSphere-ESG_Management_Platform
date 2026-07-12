import { useState, useEffect } from 'react';
import { Leaf, Users, ShieldCheck, FileSpreadsheet, Building2, BarChart2 } from 'lucide-react';
import { useDepartmentDropdown } from '@/hooks/useDepartments';
import { reportsService } from '@/services/reportsService';
import type { ESGSummaryReport } from '@/services/reportsService';
import { EnvironmentalReport } from '../components/EnvironmentalReport';
import { SocialReport } from '../components/SocialReport';
import { GovernanceReport } from '../components/GovernanceReport';
import { CustomReportBuilder } from '../components/CustomReportBuilder';

type Tab = 'summary' | 'environmental' | 'social' | 'governance' | 'builder';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('summary');
  const [deptId, setDeptId] = useState('');
  const { data: deptResponse } = useDepartmentDropdown();
  const [summaryData, setSummaryData] = useState<ESGSummaryReport | null>(null);
  const [loading, setLoading] = useState(true);

  // Load ESG Summary scorecard data
  useEffect(() => {
    async function loadSummary() {
      try {
        setLoading(true);
        const data = await reportsService.getESGSummaryReport({ department_id: deptId || undefined });
        setSummaryData(data);
      } catch (err) {
        console.error('Failed to load summary', err);
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, [deptId]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return renderSummaryTab();
      case 'environmental':
        return <EnvironmentalReport deptId={deptId} />;
      case 'social':
        return <SocialReport deptId={deptId} />;
      case 'governance':
        return <GovernanceReport deptId={deptId} />;
      case 'builder':
        return <CustomReportBuilder deptId={deptId} />;
      default:
        return renderSummaryTab();
    }
  };

  const renderSummaryTab = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      );
    }
    if (!summaryData) return null;

    return (
      <div className="space-y-8">
        {/* Main overall score radial/text mockup */}
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white rounded-2xl p-8 border border-indigo-950 flex justify-between items-center">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold tracking-wider text-indigo-200 uppercase">Weighted Corporate ESG Performance</h3>
            <h2 className="text-5xl font-black tracking-tight">{Math.round(summaryData.overall_esg_score)} <span className="text-xl text-indigo-300">/ 100</span></h2>
            <p className="text-xs text-indigo-200/80">Aggregated with weights configured in organization parameters</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center px-4 py-2 border border-indigo-700/60 rounded-xl bg-indigo-800/40">
              <span className="block text-[10px] uppercase font-bold text-indigo-300">Env ({(summaryData.weights.environmental * 100)}%)</span>
              <span className="font-bold text-lg">{Math.round(summaryData.environmental_score)}</span>
            </div>
            <div className="text-center px-4 py-2 border border-indigo-700/60 rounded-xl bg-indigo-800/40">
              <span className="block text-[10px] uppercase font-bold text-indigo-300">Soc ({(summaryData.weights.social * 100)}%)</span>
              <span className="font-bold text-lg">{Math.round(summaryData.social_score)}</span>
            </div>
            <div className="text-center px-4 py-2 border border-indigo-700/60 rounded-xl bg-indigo-800/40">
              <span className="block text-[10px] uppercase font-bold text-indigo-300">Gov ({(summaryData.weights.governance * 100)}%)</span>
              <span className="font-bold text-lg">{Math.round(summaryData.governance_score)}</span>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Card */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { title: 'Environmental Pillar', score: summaryData.environmental_score, icon: Leaf, color: 'text-emerald-600 border-emerald-100 bg-emerald-50/30' },
            { title: 'Social Pillar', score: summaryData.social_score, icon: Users, color: 'text-indigo-600 border-indigo-100 bg-indigo-50/30' },
            { title: 'Governance Pillar', score: summaryData.governance_score, icon: ShieldCheck, color: 'text-amber-600 border-amber-100 bg-amber-50/30' }
          ].map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className={`p-6 rounded-xl border ${pillar.color} space-y-4`}>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-sm">{pillar.title}</span>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Performance Rating</span>
                    <span>{Math.round(pillar.score)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${Math.round(pillar.score)}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ESG Reports & Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Generate Environmental, Social, and Governance reports.</p>
        </div>

        {/* Department selector */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm">
          <Building2 className="w-4 h-4 text-slate-400" />
          <select value={deptId} onChange={(e) => setDeptId(e.target.value)} className="text-xs font-semibold text-slate-700 bg-transparent border-none outline-none cursor-pointer">
            <option value="">All Departments</option>
            {deptResponse?.data?.map((d: any) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex -mb-px px-4" aria-label="Tabs">
            {[
              { id: 'summary', label: 'Overall ESG Summary', icon: BarChart2 },
              { id: 'environmental', label: 'Environmental', icon: Leaf },
              { id: 'social', label: 'Social', icon: Users },
              { id: 'governance', label: 'Governance', icon: ShieldCheck },
              { id: 'builder', label: 'Custom Builder', icon: FileSpreadsheet },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`group inline-flex items-center px-4 py-4 border-b-2 font-medium text-sm transition-colors
                    ${isActive
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                  <Icon className={`mr-2 h-4 w-4 ${isActive ? 'text-indigo-500' : 'text-slate-400 group-hover:text-slate-500'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
