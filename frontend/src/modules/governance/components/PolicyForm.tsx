
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { ESGPolicy } from '../types/governance';
import { PolicyStatus } from '../types/governance';
import { useCreatePolicy, useUpdatePolicy } from '../hooks/useGovernance';
import { useDepartmentDropdown } from '@/hooks/useDepartments';
import { X, Loader2 } from 'lucide-react';

const schema = z.object({
  policy_code: z.string().min(1, 'Policy code is required'),
  title: z.string().min(1, 'Title is required'),
  version: z.string().min(1, 'Version is required'),
  department_id: z.string().min(1, 'Department is required'),
  description: z.string().optional(),
  effective_date: z.string().min(1, 'Effective date is required'),
  expiry_date: z.string().optional().or(z.literal('')),
  status: z.nativeEnum(PolicyStatus).default(PolicyStatus.DRAFT)
});

type FormData = z.infer<typeof schema>;

interface Props {
  initialData?: ESGPolicy | null;
  onClose: () => void;
}

export function PolicyForm({ initialData, onClose }: Props) {
  const isEditing = !!initialData;
  const { data: deptResponse } = useDepartmentDropdown();
  
  const createMutation = useCreatePolicy();
  const updateMutation = useUpdatePolicy();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      policy_code: initialData?.policy_code || '',
      title: initialData?.title || '',
      version: initialData?.version || '1.0',
      department_id: initialData?.department_id || '',
      description: initialData?.description || '',
      effective_date: initialData?.effective_date ? new Date(initialData.effective_date).toISOString().split('T')[0] : '',
      expiry_date: initialData?.expiry_date ? new Date(initialData.expiry_date).toISOString().split('T')[0] : '',
      status: initialData?.status || PolicyStatus.DRAFT
    }
  });

  const onSubmit = (data: FormData) => {
    const cleanData: any = {
      ...data,
      expiry_date: data.expiry_date === '' ? undefined : data.expiry_date
    };

    if (isEditing && initialData?.id) {
      updateMutation.mutate(
        { id: initialData.id, data: cleanData },
        { onSuccess: () => onClose() }
      );
    } else {
      createMutation.mutate(cleanData, { onSuccess: () => onClose() });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-end z-50">
      <div className="bg-white h-full w-full max-w-lg flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-semibold text-slate-800">
            {isEditing ? 'Edit Policy' : 'New Policy'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="policy-form" onSubmit={(e) => { handleSubmit(onSubmit as any)(e); }} className="space-y-6">
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Policy Code *</label>
                  <input {...register('policy_code')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. POL-001" />
                  {errors.policy_code && <p className="text-red-500 text-xs">{errors.policy_code.message as string}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Version *</label>
                  <input {...register('version')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="1.0" />
                  {errors.version && <p className="text-red-500 text-xs">{errors.version.message as string}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Title *</label>
                <input {...register('title')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. Environmental Sustainability Policy" />
                {errors.title && <p className="text-red-500 text-xs">{errors.title.message as string}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Department *</label>
                <select {...register('department_id')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">Select Department...</option>
                  {deptResponse?.data?.map((d: any) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                {errors.department_id && <p className="text-red-500 text-xs">{errors.department_id.message as string}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Effective Date *</label>
                  <input type="date" {...register('effective_date')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                  {errors.effective_date && <p className="text-red-500 text-xs">{errors.effective_date.message as string}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Expiry Date</label>
                  <input type="date" {...register('expiry_date')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select {...register('status')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  {Object.values(PolicyStatus).map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea {...register('description')} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Details about the policy..." />
              </div>

            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="policy-form"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Create Policy'}
          </button>
        </div>
      </div>
    </div>
  );
}
