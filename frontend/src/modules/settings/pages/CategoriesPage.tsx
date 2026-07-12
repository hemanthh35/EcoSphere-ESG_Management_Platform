import { LayoutGrid } from 'lucide-react';

export function CategoriesPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-12 text-center flex flex-col items-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <LayoutGrid className="w-8 h-8 text-slate-400" />
      </div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">Categories Management</h2>
      <p className="text-slate-500 max-w-md mx-auto">
        Configure shared category values used across the Social and Gamification modules (e.g., CSR Activity Categories, Challenge Categories).
      </p>
    </div>
  );
}
