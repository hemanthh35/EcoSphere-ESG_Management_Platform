import { useState } from 'react';
import { useChallenges, useDeleteChallenge } from '../hooks/useGamification';
import type { Challenge } from '../types/gamification';
import { ChallengeDifficulty } from '../types/gamification';
import { ChallengeForm } from './ChallengeForm';
import { Search, Plus, Edit2, Trash2, Zap, Target } from 'lucide-react';
import { format } from 'date-fns';

const difficultyConfig = {
  [ChallengeDifficulty.EASY]: { label: 'Easy', className: 'bg-emerald-100 text-emerald-700' },
  [ChallengeDifficulty.MEDIUM]: { label: 'Medium', className: 'bg-amber-100 text-amber-700' },
  [ChallengeDifficulty.HARD]: { label: 'Hard', className: 'bg-red-100 text-red-700' },
};

const statusConfig: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  UPCOMING: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-slate-100 text-slate-700',
  ARCHIVED: 'bg-red-100 text-red-700',
};

export function ChallengesTab() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useChallenges({ search: search || undefined });
  const deleteMutation = useDeleteChallenge();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this challenge?')) {
      deleteMutation.mutate(id);
    }
  };

  const openEdit = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingChallenge(null);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search challenges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors shadow-sm font-medium text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Challenge
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4">Challenge</th>
              <th className="px-6 py-4">XP & Difficulty</th>
              <th className="px-6 py-4">Dates</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mb-4"></div>
                    <span className="text-slate-500">Loading challenges...</span>
                  </div>
                </td>
              </tr>
            ) : data?.items?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-violet-50 text-violet-400 mb-4">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-medium text-slate-900">No challenges yet</h3>
                  <p className="text-sm text-slate-500 mt-1">Create the first sustainability challenge for your employees.</p>
                </td>
              </tr>
            ) : (
              data?.items?.map((challenge) => {
                const diff = difficultyConfig[challenge.difficulty] ?? { label: challenge.difficulty, className: 'bg-slate-100 text-slate-600' };
                return (
                  <tr key={challenge.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
                          <Target className="w-5 h-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-slate-900">{challenge.challenge_code}</div>
                          <div className="text-xs text-slate-500 mt-0.5 max-w-xs truncate">{challenge.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-sm">
                          <Zap className="w-3.5 h-3.5" />
                          {challenge.xp_points} XP
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${diff.className}`}>
                          {diff.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {format(new Date(challenge.start_date), 'MMM d, yyyy')}
                      {challenge.end_date && <> → {format(new Date(challenge.end_date), 'MMM d, yyyy')}</>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[challenge.status] || 'bg-slate-100 text-slate-700'}`}>
                        {challenge.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(challenge)} className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-md transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(challenge.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && <ChallengeForm initialData={editingChallenge} onClose={closeForm} />}
    </div>
  );
}
