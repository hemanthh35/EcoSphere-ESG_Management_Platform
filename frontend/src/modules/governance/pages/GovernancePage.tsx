import { useState } from 'react';
import { FileText, CheckSquare, ShieldCheck, AlertTriangle } from 'lucide-react';
import { PolicyTable } from '../components/PolicyTable';
import { AuditTable } from '../components/AuditTable';
import { AcknowledgementsTab } from '../components/AcknowledgementsTab';
import { ComplianceIssuesTab } from '../components/ComplianceIssuesTab';

type Tab = 'policies' | 'acknowledgements' | 'audits' | 'issues';

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState<Tab>('policies');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'policies':
        return <PolicyTable />;
      case 'acknowledgements':
        return <AcknowledgementsTab />;
      case 'audits':
        return <AuditTable />;
      case 'issues':
        return <ComplianceIssuesTab />;
      default:
        return <PolicyTable />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Governance & Compliance</h1>
        <p className="text-sm text-slate-500 mt-1">Manage ESG policies, audits, and compliance tracking.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex -mb-px px-4" aria-label="Tabs">
            {[
              { id: 'policies', label: 'ESG Policies', icon: FileText },
              { id: 'acknowledgements', label: 'Acknowledgements', icon: CheckSquare },
              { id: 'audits', label: 'Audits', icon: ShieldCheck },
              { id: 'issues', label: 'Compliance Issues', icon: AlertTriangle },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`
                    group inline-flex items-center px-4 py-4 border-b-2 font-medium text-sm transition-colors
                    ${isActive 
                      ? 'border-indigo-500 text-indigo-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }
                  `}
                >
                  <Icon className={`
                    mr-2 h-4 w-4
                    ${isActive ? 'text-indigo-500' : 'text-slate-400 group-hover:text-slate-500'}
                  `} />
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
