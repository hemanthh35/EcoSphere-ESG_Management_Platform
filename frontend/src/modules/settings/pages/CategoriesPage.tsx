import { useState } from 'react';
import { 
  useCategories, 
  useCategoryStatistics, 
  useCreateCategory, 
  useUpdateCategory, 
  useDeleteCategory 
} from '@/hooks/useCategories';
import { CategoryForm } from '../components/CategoryForm';
import type { Category } from '@/types/category';
import { CategoryType, CategoryStatus } from '@/types/category';

import { 
  LayoutGrid, Plus, Search, Edit2, Trash2, Tag, Leaf 
} from 'lucide-react';
import { format } from 'date-fns';

export function CategoriesPage() {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: stats } = useCategoryStatistics();
  const { data: categories, isLoading } = useCategories({
    search: search || undefined,
  });

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (data: any) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, ...data }, {
        onSuccess: () => setIsDialogOpen(false)
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => setIsDialogOpen(false)
      });
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Categories</h1>
          <p className="text-slate-500">Manage shared categories for CSR Activities and Challenges</p>
        </div>
        <button 
          onClick={handleOpenCreate} 
          className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-1">Total Categories</div>
          <div className="text-2xl font-bold text-slate-900">{stats?.total_categories || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-1">CSR Activities</div>
          <div className="text-2xl font-bold text-emerald-600">{stats?.csr_categories || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-1">Challenges</div>
          <div className="text-2xl font-bold text-blue-600">{stats?.challenge_categories || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-1">Active Categories</div>
          <div className="text-2xl font-bold text-slate-900">{stats?.active_categories || 0}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              placeholder="Search categories..." 
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 w-full border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Style</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">Loading categories...</td>
                </tr>
              ) : categories?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    <LayoutGrid className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No categories found
                  </td>
                </tr>
              ) : (
                categories?.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{cat.category_code}</td>
                    <td className="px-4 py-3 text-slate-700">{cat.category_name}</td>
                    <td className="px-4 py-3">
                      {cat.category_type === CategoryType.CSR_ACTIVITY ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Leaf className="w-3 h-3 mr-1" /> CSR Activity
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          <Tag className="w-3 h-3 mr-1" /> Challenge
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {cat.color && (
                          <div className="w-4 h-4 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: cat.color }} />
                        )}
                        {cat.icon && <span className="text-slate-500 text-xs bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{cat.icon}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${cat.status === CategoryStatus.ACTIVE ? 'bg-green-50 text-green-900 border-green-300' : 'bg-slate-100 text-slate-700 border-slate-300'}`}>
                        {cat.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {format(new Date(cat.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(cat as Category)}
                          className="w-8 h-8 flex items-center justify-center rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="w-8 h-8 flex items-center justify-center rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isDialogOpen && (
        <CategoryForm 
          initialData={editingCategory || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsDialogOpen(false)}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
}
