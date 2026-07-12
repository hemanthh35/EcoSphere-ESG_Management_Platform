
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Audit } from '../types/governance';
import { AuditStatus } from '../types/governance';
import { useCreateAudit, useUpdateAudit } from '../hooks/useGovernance';
import { useDepartmentDropdown } from '@/hooks/useDepartments';
import { X, Loader2 } from 'lucide-react';

const schema = z.object({
  audit_code: z.string().min(1, 'Audit code is required'),
  title: z.string().min(1, 'Title is required'),
  department_id: z.string().min(1, 'Department is required'),
  auditor_id: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional().or(z.literal('')),
  findings: z.string().optional(),
  status: z.nativeEnum(AuditStatus).default(AuditStatus.PLANNED)
});

type FormData = z.infer<typeof schema>;

interface Props {
  initialData?: Audit | null;
  onClose: () => void;
}

export function AuditForm({ initialData, onClose }: Props) {
  const isEditing = !!initialData;
  const { data: deptResponse } = useDepartmentDropdown();
  
  const createMutation = useCreateAudit();
  const updateMutation = useUpdateAudit();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      audit_code: initialData?.audit_code || '',
      title: initialData?.title || '',
      department_id: initialData?.department_id || '',
      auditor_id: initialData?.auditor_id || '',
      start_date: initialData?.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : '',
      end_date: initialData?.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : '',
      findings: initialData?.findings || '',
      status: initialData?.status || AuditStatus.PLANNED
    }
  });

  const onSubmit = (data: FormData) => {
    const cleanData: any = {
      ...data,
      end_date: data.end_date === '' ? undefined : data.end_date,
      auditor_id: data.auditor_id === '' ? undefined : data.auditor_id
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
            {isEditing ? 'Edit Audit' : 'New Audit'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="audit-form" onSubmit={(e) => { handleSubmit(onSubmit as any)(e); }} className="space-y-6">
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Audit Code *</label>
                  <input {...register('audit_code')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. AUD-2026-01" />
                  {errors.audit_code && <p className="text-red-500 text-xs">{errors.audit_code.message as string}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <select {...register('status')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    {Object.values(AuditStatus).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Title *</label>
                <input {...register('title')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. Q1 ISO 14001 Compliance Audit" />
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
                  <label className="text-sm font-medium text-slate-700">Start Date *</label>
                  <input type="date" {...register('start_date')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                  {errors.start_date && <p className="text-red-500 text-xs">{errors.start_date.message as string}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">End Date</label>
                  <input type="date" {...register('end_date')} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Findings / Notes</label>
                <textarea {...register('findings')} rows={6} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Audit findings and observations..." />
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
            form="audit-form"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Create Audit'}
          </button>
        </div>
      </div>
    </div>
  );
}
