import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Challenge } from '../types/gamification';
import { ChallengeDifficulty, ChallengeStatus } from '../types/gamification';
import { useCreateChallenge, useUpdateChallenge } from '../hooks/useGamification';
import { useCategoryDropdown } from '@/hooks/useCategories';
import { X, Loader2 } from 'lucide-react';

const schema = z.object({
  challenge_code: z.string().min(1, 'Challenge code is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category_id: z.string().min(1, 'Category is required'),
  xp_points: z.coerce.number().min(1, 'XP must be at least 1').default(100),
  difficulty: z.string().default(ChallengeDifficulty.MEDIUM),
  evidence_required: z.boolean().default(true),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional().or(z.literal('')),
  status: z.string().default(ChallengeStatus.ACTIVE),
});

type FormData = z.infer<typeof schema>;

interface Props {
  initialData?: Challenge | null;
  onClose: () => void;
}

export function ChallengeForm({ initialData, onClose }: Props) {
  const isEditing = !!initialData;
  const { data: categoryResponse } = useCategoryDropdown();

  const createMutation = useCreateChallenge();
  const updateMutation = useUpdateChallenge();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      challenge_code: initialData?.challenge_code || '',
      title: initialData?.title || '',
      description: initialData?.description || '',
      category_id: initialData?.category_id || '',
      xp_points: initialData?.xp_points || 100,
      difficulty: initialData?.difficulty || ChallengeDifficulty.MEDIUM,
      evidence_required: initialData?.evidence_required ?? true,
      start_date: initialData?.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : '',
      end_date: initialData?.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : '',
      status: initialData?.status || ChallengeStatus.ACTIVE,
    },
  });

  const onSubmit = (data: FormData) => {
    const cleanData: any = { ...data, end_date: data.end_date === '' ? undefined : data.end_date };
    if (isEditing && initialData?.id) {
      updateMutation.mutate({ id: initialData.id, data: cleanData }, { onSuccess: onClose });
    } else {
      createMutation.mutate(cleanData, { onSuccess: onClose });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-end z-50">
      <div className="bg-white h-full w-full max-w-lg flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-semibold text-slate-800">{isEditing ? 'Edit Challenge' : 'New Challenge'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="challenge-form" onSubmit={(e) => { handleSubmit(onSubmit as any)(e); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Challenge Code *</label>
                <input {...register('challenge_code')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500" placeholder="e.g. CHAL-001" />
                {errors.challenge_code && <p className="text-red-500 text-xs">{errors.challenge_code.message as string}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">XP Points *</label>
                <input type="number" {...register('xp_points')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500" />
                {errors.xp_points && <p className="text-red-500 text-xs">{errors.xp_points.message as string}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Title *</label>
              <input {...register('title')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500" placeholder="e.g. Go Paperless for a Week" />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message as string}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Category *</label>
              <select {...register('category_id')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
                <option value="">Select Category...</option>
                {(Array.isArray(categoryResponse) ? categoryResponse : (categoryResponse as any)?.data || []).map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.category_id && <p className="text-red-500 text-xs">{errors.category_id.message as string}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Difficulty</label>
                <select {...register('difficulty')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
                  {Object.values(ChallengeDifficulty).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select {...register('status')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
                  {Object.values(ChallengeStatus).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Start Date *</label>
                <input type="date" {...register('start_date')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500" />
                {errors.start_date && <p className="text-red-500 text-xs">{errors.start_date.message as string}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">End Date</label>
                <input type="date" {...register('end_date')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Description *</label>
              <textarea {...register('description')} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-violet-500" placeholder="Describe the challenge and what employees need to do..." />
              {errors.description && <p className="text-red-500 text-xs">{errors.description.message as string}</p>}
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <input type="checkbox" id="evidence_required" {...register('evidence_required')} className="w-4 h-4 text-violet-600 border-slate-300 rounded focus:ring-violet-500" />
              <label htmlFor="evidence_required" className="text-sm font-medium text-slate-700">Require evidence/proof of completion</label>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" form="challenge-form" disabled={isSubmitting} className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-md hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Create Challenge'}
          </button>
        </div>
      </div>
    </div>
  );
}
