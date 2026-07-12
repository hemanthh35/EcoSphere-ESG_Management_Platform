import { useLeaderboard } from '../hooks/useGamification';
import { Trophy, Zap, Medal } from 'lucide-react';

const medalColors = ['text-yellow-500', 'text-slate-400', 'text-amber-700'];
const medalBg = ['bg-yellow-50 border-yellow-200', 'bg-slate-50 border-slate-200', 'bg-amber-50 border-amber-200'];

export function LeaderboardTab() {
  const { data: leaderboard, isLoading } = useLeaderboard(50);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-50 rounded-lg border border-amber-200">
          <Trophy className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Global XP Leaderboard</h2>
          <p className="text-xs text-slate-500">Rankings based on total XP earned from completed challenges.</p>
        </div>
      </div>

      {/* Top 3 podium */}
      {!isLoading && leaderboard && leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, i) => {
            if (!entry) return null;
            const podiumRank = [2, 1, 3][i];
            const heights = ['h-28', 'h-36', 'h-24'];
            return (
              <div key={entry.employee_id} className={`flex flex-col items-center justify-end ${heights[i]} bg-gradient-to-t from-slate-50 to-white rounded-xl border border-slate-200 p-4 text-center`}>
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 ${medalBg[podiumRank - 1]}`}>
                  <Medal className={`w-5 h-5 ${medalColors[podiumRank - 1]}`} />
                </div>
                <p className="text-xs font-semibold text-slate-800 leading-tight">{entry.full_name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span className="text-xs text-amber-600 font-bold">{entry.total_xp.toLocaleString()} XP</span>
                </div>
                <span className="text-xs text-slate-400 mt-0.5">#{podiumRank}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4 w-16">Rank</th>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4 text-right">Total XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mb-4"></div>
                    <span className="text-slate-500">Loading leaderboard...</span>
                  </div>
                </td>
              </tr>
            ) : !leaderboard || leaderboard.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 text-amber-400 mb-4">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-medium text-slate-900">No entries yet</h3>
                  <p className="text-sm text-slate-500 mt-1">Complete challenges to earn XP and appear on the leaderboard.</p>
                </td>
              </tr>
            ) : (
              leaderboard.map((entry) => (
                <tr key={entry.employee_id} className={`hover:bg-slate-50 transition-colors ${entry.rank <= 3 ? 'bg-amber-50/30' : ''}`}>
                  <td className="px-6 py-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                        entry.rank === 2 ? 'bg-slate-100 text-slate-600' :
                        entry.rank === 3 ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-50 text-slate-500'}`}>
                      {entry.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-700 font-semibold text-sm">
                        {entry.full_name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-slate-900">{entry.full_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-1.5 text-amber-600 font-bold text-sm">
                      <Zap className="w-4 h-4" />
                      {entry.total_xp.toLocaleString()} XP
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
