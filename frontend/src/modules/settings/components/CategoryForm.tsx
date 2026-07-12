import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import type { CategoryCreate } from '@/types/category';
import { CategoryType, CategoryStatus } from '@/types/category';

const schema = z.object({
  category_name: z.string().min(3, "Name must be at least 3 characters").max(100),
  category_code: z.string().min(2, "Code must be at least 2 characters")
    .regex(/^[A-Za-z0-9-_]+$/, "Only alphanumeric, hyphens, and underscores"),
  category_type: z.nativeEnum(CategoryType),
  description: z.string().max(1000).optional(),
  color: z.string().max(20).optional(),
  icon: z.string().max(50).optional(),
  display_order: z.coerce.number().min(0),
  status: z.nativeEnum(CategoryStatus),
});

type FormData = z.infer<typeof schema>;

interface CategoryFormProps {
  initialData?: Partial<CategoryCreate>;
  onSubmit: (data: CategoryCreate) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function CategoryForm({ initialData, onSubmit, isLoading, onCancel }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      category_name: initialData?.category_name || '',
      category_code: initialData?.category_code || '',
      category_type: initialData?.category_type || CategoryType.CSR_ACTIVITY,
      description: initialData?.description || '',
      color: initialData?.color || '#10b981',
      icon: initialData?.icon || '',
      display_order: initialData?.display_order || 0,
      status: initialData?.status || CategoryStatus.ACTIVE,
    },
  });

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            {initialData ? 'Edit Category' : 'Create Category'}
          </h2>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="category-form" onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category Name</label>
              <input 
                {...register('category_name')} 
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                placeholder="e.g. Energy Efficiency" 
              />
              {errors.category_name && <p className="text-red-500 text-xs mt-1">{errors.category_name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category Code</label>
              <input 
                {...register('category_code')} 
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 uppercase" 
                placeholder="e.g. ENV-001" 
              />
              {errors.category_code && <p className="text-red-500 text-xs mt-1">{errors.category_code.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category Type</label>
              <select 
                {...register('category_type')}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value={CategoryType.CSR_ACTIVITY}>CSR Activity</option>
                <option value={CategoryType.CHALLENGE}>Challenge</option>
              </select>
              {errors.category_type && <p className="text-red-500 text-xs mt-1">{errors.category_type.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea 
                {...register('description')} 
                rows={3} 
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Optional description..." 
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Color Badge</label>
                <input 
                  type="color" 
                  {...register('color')} 
                  className="w-full h-10 p-1 border border-slate-300 rounded-md cursor-pointer" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Icon Name</label>
                <input 
                  {...register('icon')} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g. Leaf, Zap" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Display Order</label>
                <input 
                  type="number" 
                  min="0" 
                  {...register('display_order')} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select 
                  {...register('status')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value={CategoryStatus.ACTIVE}>Active</option>
                  <option value={CategoryStatus.INACTIVE}>Inactive</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="category-form"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </div>
    </div>
  );
}
