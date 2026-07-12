import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateEmissionFactor, useUpdateEmissionFactor } from '../hooks/useEnvironmental';
import { EmissionFactor } from '../types/environmental';
import { format } from 'date-fns';

interface Props {
  factor?: EmissionFactor;
  onClose: () => void;
}

export function EmissionFactorForm({ factor, onClose }: Props) {
  const isEditing = !!factor;
  const createMutation = useCreateEmissionFactor();
  const updateMutation = useUpdateEmissionFactor();

  const [formData, setFormData] = useState({
    factor_code: factor?.factor_code ?? '',
    factor_name: factor?.factor_name ?? '',
    source: factor?.source ?? '',
    category: factor?.category ?? '',
    unit: factor?.unit ?? '',
    co2e_factor: factor?.co2e_factor ?? 0,
    effective_from: factor?.effective_from ? format(new Date(factor.effective_from), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    effective_to: factor?.effective_to ? format(new Date(factor.effective_to), 'yyyy-MM-dd') : '',
    status: factor?.status ?? 'ACTIVE',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: factor.id, data: formData });
      } else {
        await createMutation.mutateAsync(formData as any);
      }
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to save');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'co2e_factor' ? parseFloat(value) : value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">
            {isEditing ? 'Edit Emission Factor' : 'Add Emission Factor'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 focus-ring rounded-full p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Factor Code</label>
            <input required name="factor_code" value={formData.factor_code} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Factor Name</label>
            <input required name="factor_name" value={formData.factor_name} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <input required name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Unit (e.g., kWh)</label>
              <input required name="unit" value={formData.unit} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Source (e.g., EPA 2023)</label>
            <input required name="source" value={formData.source} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">CO2e Factor (kg)</label>
            <input required type="number" step="0.0001" name="co2e_factor" value={formData.co2e_factor} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Effective From</label>
              <input required type="date" name="effective_from" value={formData.effective_from} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Effective To</label>
              <input type="date" name="effective_to" value={formData.effective_to} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded-md">
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
        </form>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50">
            {isEditing ? 'Save Changes' : 'Add Factor'}
          </button>
        </div>
      </div>
    </div>
  );
}
