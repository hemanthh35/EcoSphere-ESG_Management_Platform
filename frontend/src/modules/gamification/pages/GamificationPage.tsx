import { useState } from 'react';
import { Target, Trophy, Award } from 'lucide-react';
import { ChallengesTab } from '../components/ChallengesTab';
import { LeaderboardTab } from '../components/LeaderboardTab';
import { BadgesRewardsTab } from '../components/BadgesRewardsTab';

type Tab = 'challenges' | 'leaderboard' | 'badges';

const tabs = [
  { id: 'challenges',  label: 'Challenges',       icon: Target },
  { id: 'leaderboard', label: 'Leaderboard',      icon: Trophy },
  { id: 'badges',      label: 'Badges & Rewards', icon: Award },
] as const;

export default function GamificationPage() {
  const [activeTab, setActiveTab] = useState<Tab>('challenges');

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-violet-500" strokeWidth={2} />
          </div>
          <h1 className="page-title">Gamification</h1>
        </div>
        <p className="page-subtitle pl-10">
          Drive ESG engagement through challenges, XP, badges, and rewards.
        </p>
      </div>

      {/* Tab card */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
        style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.06)' }}>
        <div className="border-b border-neutral-200 overflow-x-auto">
          <nav className="flex min-w-max px-2" aria-label="Gamification tabs">
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
                      ? 'border-violet-500 text-violet-700 bg-violet-50/50'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                    }
                  `}
                  aria-selected={active}
                  role="tab"
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-violet-500' : 'text-neutral-400'}`} strokeWidth={1.8} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'challenges'  && <ChallengesTab />}
          {activeTab === 'leaderboard' && <LeaderboardTab />}
          {activeTab === 'badges'      && <BadgesRewardsTab />}
        </div>
      </div>
    </div>
  );
}
