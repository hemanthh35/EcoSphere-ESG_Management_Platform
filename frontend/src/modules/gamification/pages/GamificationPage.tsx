import { useState } from 'react';
import { Target, Trophy, Award } from 'lucide-react';
import { ChallengesTab } from '../components/ChallengesTab';
import { LeaderboardTab } from '../components/LeaderboardTab';
import { BadgesRewardsTab } from '../components/BadgesRewardsTab';

type Tab = 'challenges' | 'leaderboard' | 'badges';

export default function GamificationPage() {
  const [activeTab, setActiveTab] = useState<Tab>('challenges');

  const tabs = [
    { id: 'challenges', label: 'Challenges', icon: Target },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'badges', label: 'Badges & Rewards', icon: Award },
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'challenges': return <ChallengesTab />;
      case 'leaderboard': return <LeaderboardTab />;
      case 'badges': return <BadgesRewardsTab />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gamification</h1>
        <p className="text-sm text-slate-500 mt-1">Drive ESG engagement through challenges, XP, badges, and rewards.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex -mb-px px-4" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`group inline-flex items-center px-4 py-4 border-b-2 font-medium text-sm transition-colors
                    ${isActive
                      ? 'border-violet-500 text-violet-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                  <Icon className={`mr-2 h-4 w-4 ${isActive ? 'text-violet-500' : 'text-slate-400 group-hover:text-slate-500'}`} />
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
