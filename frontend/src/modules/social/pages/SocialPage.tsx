import { useState } from 'react';
import { Activity, Users, GraduationCap, BarChart3, FileSpreadsheet } from 'lucide-react';
import { SocialDashboardTab } from '../components/SocialDashboardTab';
import { CsrActivitiesTab } from '../components/CsrActivitiesTab';
import { DiversityMetricsTab } from '../components/DiversityMetricsTab';
import { TrainingRecordsTab } from '../components/TrainingRecordsTab';
import { SocialReportsTab } from '../components/SocialReportsTab';

type Tab = 'dashboard' | 'csr' | 'diversity' | 'training' | 'reports';

export function SocialPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: BarChart3 },
    { id: 'csr', label: 'CSR Activities', icon: Activity },
    { id: 'diversity', label: 'Diversity Metrics', icon: Users },
    { id: 'training', label: 'Training Records', icon: GraduationCap },
    { id: 'reports', label: 'Social Reports', icon: FileSpreadsheet },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Social ESG Module</h1>
        <p className="text-slate-500 text-sm mt-1">Manage CSR activities, track workforce diversity, and log ESG training progress.</p>
      </div>

      <div className="border-b border-slate-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-semibold text-sm transition-colors focus:outline-none cursor-pointer
                  ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }
                `}
              >
                <Icon
                  className={`
                    -ml-0.5 mr-2 h-5 w-5
                    ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'}
                  `}
                />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-2">
        {activeTab === 'dashboard' && <SocialDashboardTab />}
        {activeTab === 'csr' && <CsrActivitiesTab />}
        {activeTab === 'diversity' && <DiversityMetricsTab />}
        {activeTab === 'training' && <TrainingRecordsTab />}
        {activeTab === 'reports' && <SocialReportsTab />}
      </div>
    </div>
  );
}
