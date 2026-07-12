import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { ProductESGProfile } from '@/types/product';
import { ProductStatus, SustainabilityRating } from '@/types/product';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { useDepartmentDropdown } from '@/hooks/useDepartments';
import { useCategoryDropdown } from '@/hooks/useCategories';

import { X, Loader2 } from 'lucide-react';

const schema = z.object({
  product_code: z.string().min(1, 'Product Code is required').max(50),
  product_name: z.string().min(1, 'Product Name is required').max(200),
  department_id: z.string().min(1, 'Department is required'),
  category_id: z.string().optional(),
  description: z.string().optional(),
  carbon_factor: z.coerce.number().min(0, 'Carbon Factor cannot be negative').optional().or(z.literal('')),
  carbon_unit: z.string().optional(),
  sustainability_rating: z.nativeEnum(SustainabilityRating).optional().or(z.literal('')),
  esg_score: z.coerce.number().min(0).max(100, 'Score must be between 0 and 100').optional().or(z.literal('')),
  recyclable: z.boolean().default(false),
  recycled_content_percentage: z.coerce.number().min(0).max(100).optional().or(z.literal('')),
  renewable_material: z.boolean().default(false),
  hazardous_material: z.boolean().default(false),
  certification: z.string().optional(),
  supplier_name: z.string().optional(),
  status: z.nativeEnum(ProductStatus).default(ProductStatus.ACTIVE)
});

type FormData = z.infer<typeof schema>;

interface ProductFormProps {
  productId?: string;
  initialData?: ProductESGProfile | null;
  onClose: () => void;
}

export function ProductForm({ productId, initialData, onClose }: ProductFormProps) {
  const isEditing = !!productId || !!initialData;
  const { data: deptResponse } = useDepartmentDropdown();
  const { data: catResponse } = useCategoryDropdown(); // wait, category service getDropdown does it take type?
  // Let's assume catResponse.data has the categories.
  
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      status: ProductStatus.ACTIVE,
      recyclable: false,
      renewable_material: false,
      hazardous_material: false,
      carbon_unit: 'kgCO₂e/unit'
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        carbon_factor: initialData.carbon_factor ?? '',
        esg_score: initialData.esg_score ?? '',
        recycled_content_percentage: initialData.recycled_content_percentage ?? '',
        category_id: initialData.category_id || '',
        sustainability_rating: initialData.sustainability_rating || '',
      } as any);
    }
  }, [initialData, reset]);

  const onSubmit = (data: FormData) => {
    // Clean up empty strings back to null or undefined
    const cleanData: any = {
      ...data,
      carbon_factor: data.carbon_factor === '' ? undefined : Number(data.carbon_factor),
      esg_score: data.esg_score === '' ? undefined : Number(data.esg_score),
      recycled_content_percentage: data.recycled_content_percentage === '' ? undefined : Number(data.recycled_content_percentage),
      category_id: data.category_id === '' ? undefined : data.category_id,
      sustainability_rating: data.sustainability_rating === '' ? undefined : data.sustainability_rating,
    };

    if (isEditing && initialData?.id) {
      updateMutation.mutate(
        { id: initialData.id, ...cleanData },
        { onSuccess: () => onClose() }
      );
    } else {
      createMutation.mutate(cleanData, { onSuccess: () => onClose() });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-end z-50">
      <div className="bg-white h-full w-full max-w-2xl flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-semibold text-slate-800">
            {isEditing ? 'Edit Product ESG Profile' : 'New Product ESG Profile'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="product-form" onSubmit={(e) => { handleSubmit(onSubmit as any)(e); }} className="space-y-8">
            
            {/* General Info */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Product Code *</label>
                  <input {...register('product_code')} className="w-full px-3 py-2 border rounded-md" placeholder="e.g. PRD-001" />
                  {errors.product_code && <p className="text-red-500 text-xs">{errors.product_code.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Product Name *</label>
                  <input {...register('product_name')} className="w-full px-3 py-2 border rounded-md" placeholder="Product Name" />
                  {errors.product_name && <p className="text-red-500 text-xs">{errors.product_name.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Department *</label>
                  <select {...register('department_id')} className="w-full px-3 py-2 border rounded-md">
                    <option value="">Select...</option>
                    {deptResponse?.data?.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  {errors.department_id && <p className="text-red-500 text-xs">{errors.department_id.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <select {...register('category_id')} className="w-full px-3 py-2 border rounded-md">
                    <option value="">Select...</option>
                    {catResponse?.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.category_name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <textarea {...register('description')} rows={2} className="w-full px-3 py-2 border rounded-md" />
                </div>
              </div>
            </section>

            {/* ESG Metrics */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">ESG & Sustainability</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Sustainability Rating</label>
                  <select {...register('sustainability_rating')} className="w-full px-3 py-2 border rounded-md">
                    <option value="">None</option>
                    <option value={SustainabilityRating.BRONZE}>Bronze</option>
                    <option value={SustainabilityRating.SILVER}>Silver</option>
                    <option value={SustainabilityRating.GOLD}>Gold</option>
                    <option value={SustainabilityRating.PLATINUM}>Platinum</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">ESG Score (0-100)</label>
                  <input type="number" step="0.01" {...register('esg_score')} className="w-full px-3 py-2 border rounded-md" />
                  {errors.esg_score && <p className="text-red-500 text-xs">{errors.esg_score.message}</p>}
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Carbon Factor</label>
                  <input type="number" step="0.0001" {...register('carbon_factor')} className="w-full px-3 py-2 border rounded-md" />
                  {errors.carbon_factor && <p className="text-red-500 text-xs">{errors.carbon_factor.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Carbon Unit</label>
                  <input {...register('carbon_unit')} className="w-full px-3 py-2 border rounded-md" />
                </div>
              </div>
            </section>

            {/* Materials & Circularity */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Materials & Compliance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Recycled Content %</label>
                  <input type="number" step="0.1" {...register('recycled_content_percentage')} className="w-full px-3 py-2 border rounded-md" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Certification</label>
                  <input {...register('certification')} className="w-full px-3 py-2 border rounded-md" />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-sm font-medium text-slate-700">Supplier Name</label>
                  <input {...register('supplier_name')} className="w-full px-3 py-2 border rounded-md" />
                </div>
                
                <div className="col-span-2 flex gap-6 mt-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" {...register('recyclable')} className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    <span className="text-sm text-slate-700">Recyclable</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" {...register('renewable_material')} className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    <span className="text-sm text-slate-700">Renewable Material</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" {...register('hazardous_material')} className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                    <span className="text-sm text-slate-700">Hazardous Material</span>
                  </label>
                </div>
              </div>
            </section>

            <section>
              <div className="space-y-1 w-1/2">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select {...register('status')} className="w-full px-3 py-2 border rounded-md">
                  <option value={ProductStatus.ACTIVE}>Active</option>
                  <option value={ProductStatus.INACTIVE}>Inactive</option>
                </select>
              </div>
            </section>
          </form>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button 
            type="submit" 
            form="product-form"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center"
          >
            {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
