import { useState } from 'react';
import { Activity, Users, GraduationCap, BarChart3, FileSpreadsheet } from 'lucide-react';
import { SocialDashboardTab } from '../components/SocialDashboardTab';
import { CsrActivitiesTab } from '../components/CsrActivitiesTab';
import { DiversityMetricsTab } from '../components/DiversityMetricsTab';
import { TrainingRecordsTab } from '../components/TrainingRecordsTab';
import { SocialReportsTab } from '../components/SocialReportsTab';

type Tab = 'dashboard' | 'csr' | 'diversity' | 'training' | 'reports';

const tabs = [
  { id: 'dashboard', label: 'Executive Dashboard', icon: BarChart3 },
  { id: 'csr',       label: 'CSR Activities',      icon: Activity },
  { id: 'diversity', label: 'Diversity Metrics',   icon: Users },
  { id: 'training',  label: 'Training Records',    icon: GraduationCap },
  { id: 'reports',   label: 'Social Reports',      icon: FileSpreadsheet },
] as const;

export function SocialPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Users className="w-4 h-4 text-indigo-500" strokeWidth={2} />
          </div>
          <h1 className="page-title">Social ESG Module</h1>
        </div>
        <p className="page-subtitle pl-10">
          Manage CSR activities, track workforce diversity, and log ESG training progress.
        </p>
      </div>

      {/* Tab card */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
        style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.06)' }}>
        <div className="border-b border-neutral-200 overflow-x-auto">
          <nav className="flex min-w-max px-2" aria-label="Social tabs">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    inline-flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer
                    ${active
                      ? 'border-indigo-500 text-indigo-700 bg-indigo-50/50'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                    }
                  `}
                  aria-selected={active}
                  role="tab"
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-indigo-500' : 'text-neutral-400'}`} strokeWidth={1.8} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'dashboard' && <SocialDashboardTab />}
          {activeTab === 'csr'       && <CsrActivitiesTab />}
          {activeTab === 'diversity' && <DiversityMetricsTab />}
          {activeTab === 'training'  && <TrainingRecordsTab />}
          {activeTab === 'reports'   && <SocialReportsTab />}
        </div>
      </div>
    </div>
  );
}
