import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { useCreateDepartment, useUpdateDepartment } from '@/hooks/useDepartments';
import type { Department } from '@/types/department';

const schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(255),
  code: z.string().min(2, 'Code must be at least 2 characters').max(50),
  description: z.string().max(1000).optional(),
  employee_count: z.coerce.number().min(0, 'Must be 0 or more'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  parent_department_id: z.string().uuid().optional().nullable(),
});

type FormData = z.infer<typeof schema>;


interface DepartmentFormProps {
  department?: Department;
  onClose: () => void;
}

export function DepartmentForm({ department, onClose }: DepartmentFormProps) {
  const isEdit = !!department;
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment(department?.id || '');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: department?.name ?? '',
      code: department?.code ?? '',
      description: department?.description ?? '',
      employee_count: department?.employee_count ?? 0,
      status: department?.status ?? 'ACTIVE',
      parent_department_id: department?.parent_department_id ?? null,
    },
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      const payload = {
        ...data,
        code: data.code.toUpperCase(),
      };
      if (isEdit) {
        await updateMutation.mutateAsync(payload);
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.3)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dept-form-title"
    >
      <div
        className="bg-white rounded-xl w-full max-w-lg mx-4"
        style={{ boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 id="dept-form-title" className="text-lg font-semibold text-slate-700">
            {isEdit ? 'Edit Department' : 'New Department'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 flex items-center justify-center rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit as Parameters<typeof handleSubmit>[0])} className="px-6 py-5 space-y-4">

          {serverError && (
            <div role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {serverError}
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="dept-name" className="block text-sm font-medium text-slate-600 mb-1.5">
              Department Name <span className="text-slate-400">*</span>
            </label>
            <input
              id="dept-name"
              {...register('name')}
              placeholder="e.g. Engineering"
              className="w-full px-3 py-2 text-sm border rounded-md text-slate-700 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-colors"
              style={{ borderColor: errors.name ? '#ef4444' : '#e2e8f0' }}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          {/* Code */}
          <div>
            <label htmlFor="dept-code" className="block text-sm font-medium text-slate-600 mb-1.5">
              Department Code <span className="text-slate-400">*</span>
            </label>
            <input
              id="dept-code"
              {...register('code')}
              placeholder="e.g. ENG"
              className="w-full px-3 py-2 text-sm border rounded-md font-mono text-slate-700 placeholder-slate-400 uppercase focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-colors"
              style={{ borderColor: errors.code ? '#ef4444' : '#e2e8f0' }}
            />
            {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="dept-desc" className="block text-sm font-medium text-slate-600 mb-1.5">
              Description
            </label>
            <textarea
              id="dept-desc"
              {...register('description')}
              rows={3}
              placeholder="Optional department description"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md text-slate-700 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-colors resize-none"
            />
          </div>

          {/* Employee Count & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dept-count" className="block text-sm font-medium text-slate-600 mb-1.5">
                Employee Count
              </label>
              <input
                id="dept-count"
                type="number"
                min={0}
                {...register('employee_count')}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-colors"
              />
              {errors.employee_count && (
                <p className="text-xs text-red-500 mt-1">{errors.employee_count.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="dept-status" className="block text-sm font-medium text-slate-600 mb-1.5">
                Status
              </label>
              <select
                id="dept-status"
                {...register('status')}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-colors bg-white"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#10b981' }}
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? 'Save Changes' : 'Create Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
