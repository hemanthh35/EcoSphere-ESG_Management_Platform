import { useState } from 'react';
import { Leaf, Activity, Target, Box } from 'lucide-react';
import { EmissionFactorsTab } from '../components/EmissionFactorsTab';
import { CarbonTransactionsTab } from '../components/CarbonTransactionsTab';
import { EnvironmentalGoalsTab } from '../components/EnvironmentalGoalsTab';
import ProductsPage from '@/modules/product-esg/pages/ProductsPage';

type Tab = 'factors' | 'profiles' | 'transactions' | 'goals';

const tabs = [
  { id: 'factors',      label: 'Emission Factors',      icon: Activity },
  { id: 'profiles',     label: 'Product ESG Profiles',  icon: Box },
  { id: 'transactions', label: 'Carbon Transactions',    icon: Leaf },
  { id: 'goals',        label: 'Environmental Goals',    icon: Target },
] as const;

export function EnvironmentalPage() {
  const [activeTab, setActiveTab] = useState<Tab>('factors');

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-brand-600" strokeWidth={2} />
          </div>
          <h1 className="page-title">Environmental Management</h1>
        </div>
        <p className="page-subtitle pl-10">
          Track emissions, manage factors, and set sustainability goals.
        </p>
      </div>

      {/* Tab card */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
        style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.06)' }}>
        <div className="border-b border-neutral-200 overflow-x-auto">
          <nav className="flex min-w-max px-2" aria-label="Environmental tabs">
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
                      ? 'border-brand-500 text-brand-700 bg-brand-50/50'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                    }
                  `}
                  aria-selected={active}
                  role="tab"
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-brand-500' : 'text-neutral-400'}`} strokeWidth={1.8} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'factors'      && <EmissionFactorsTab />}
          {activeTab === 'profiles'     && <ProductsPage />}
          {activeTab === 'transactions' && <CarbonTransactionsTab />}
          {activeTab === 'goals'        && <EnvironmentalGoalsTab />}
        </div>
      </div>
    </div>
  );
}
