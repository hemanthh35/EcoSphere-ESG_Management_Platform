import React, { useState } from 'react';
import { Leaf, Activity, Target, Box } from 'lucide-react';
import { EmissionFactorsTab } from '../components/EmissionFactorsTab';
import { CarbonTransactionsTab } from '../components/CarbonTransactionsTab';
import { EnvironmentalGoalsTab } from '../components/EnvironmentalGoalsTab';
import { ProductsPage } from '@/modules/product-esg/pages/ProductsPage';

type Tab = 'factors' | 'profiles' | 'transactions' | 'goals';

export function EnvironmentalPage() {
  const [activeTab, setActiveTab] = useState<Tab>('factors');

  const tabs = [
    { id: 'factors', label: 'Emission Factors', icon: Activity },
    { id: 'profiles', label: 'Product ESG Profiles', icon: Box },
    { id: 'transactions', label: 'Carbon Transactions', icon: Leaf },
    { id: 'goals', label: 'Environmental Goals', icon: Target },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Environmental Management</h1>
        <p className="text-slate-500 text-sm mt-1">Track emissions, manage factors, and set sustainability goals.</p>
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
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors focus-ring
                  ${
                    isActive
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }
                `}
              >
                <Icon
                  className={`
                    -ml-0.5 mr-2 h-5 w-5
                    ${isActive ? 'text-green-500' : 'text-slate-400 group-hover:text-slate-500'}
                  `}
                />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-2">
        {activeTab === 'factors' && <EmissionFactorsTab />}
        {activeTab === 'profiles' && <ProductsPage />}
        {activeTab === 'transactions' && <CarbonTransactionsTab />}
        {activeTab === 'goals' && <EnvironmentalGoalsTab />}
      </div>
    </div>
  );
}
