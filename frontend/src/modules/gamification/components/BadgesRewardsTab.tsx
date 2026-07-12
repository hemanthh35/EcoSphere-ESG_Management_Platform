import { Award, Gift } from 'lucide-react';

export function BadgesRewardsTab() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="w-16 h-16 bg-violet-50 text-violet-400 rounded-full flex items-center justify-center mb-4">
          <Award className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Badge Gallery</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-xs">
          Badges are automatically awarded when employees meet achievement milestones. Coming in the next update.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="w-16 h-16 bg-amber-50 text-amber-400 rounded-full flex items-center justify-center mb-4">
          <Gift className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Rewards Store</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-xs">
          Employees can redeem their earned XP points for rewards. Coming in the next update.
        </p>
      </div>
    </div>
  );
}
