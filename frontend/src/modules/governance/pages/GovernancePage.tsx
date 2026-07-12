import { useState } from 'react';
import { FileText, CheckSquare, ShieldCheck, AlertTriangle } from 'lucide-react';
import { PolicyTable } from '../components/PolicyTable';
import { AuditTable } from '../components/AuditTable';
import { AcknowledgementsTab } from '../components/AcknowledgementsTab';
import { ComplianceIssuesTab } from '../components/ComplianceIssuesTab';

type Tab = 'policies' | 'acknowledgements' | 'audits' | 'issues';

const tabs = [
  { id: 'policies',        label: 'ESG Policies',      icon: FileText },
  { id: 'acknowledgements',label: 'Acknowledgements',  icon: CheckSquare },
  { id: 'audits',          label: 'Audits',            icon: ShieldCheck },
  { id: 'issues',          label: 'Compliance Issues', icon: AlertTriangle },
] as const;

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState<Tab>('policies');

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-sky-500" strokeWidth={2} />
          </div>
          <h1 className="page-title">Governance &amp; Compliance</h1>
        </div>
        <p className="page-subtitle pl-10">
          Manage ESG policies, audits, and compliance tracking.
        </p>
      </div>

      {/* Tab card */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
        style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.06)' }}>
        <div className="border-b border-neutral-200 overflow-x-auto">
          <nav className="flex min-w-max px-2" aria-label="Governance tabs">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`
                    inline-flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer
                    ${active
                      ? 'border-sky-500 text-sky-700 bg-sky-50/50'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                    }
                  `}
                  aria-selected={active}
                  role="tab"
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-sky-500' : 'text-neutral-400'}`} strokeWidth={1.8} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'policies'        && <PolicyTable />}
          {activeTab === 'acknowledgements' && <AcknowledgementsTab />}
          {activeTab === 'audits'          && <AuditTable />}
          {activeTab === 'issues'          && <ComplianceIssuesTab />}
        </div>
      </div>
    </div>
  );
}
