import { useState } from 'react';
import { usePolicies, useDeletePolicy } from '../hooks/useGovernance';
import type { ESGPolicy } from '../types/governance';
import { PolicyForm } from './PolicyForm';
import { Search, Plus, Edit2, Trash2, FileText, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export function PolicyTable() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = usePolicies({ search: search || undefined });
  const deleteMutation = useDeletePolicy();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<ESGPolicy | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to archive this policy?')) {
      deleteMutation.mutate(id);
    }
  };

  const openEdit = (policy: ESGPolicy) => {
    setEditingPolicy(policy);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingPolicy(null);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search policies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
          />
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Policy
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-6 py-4">Policy Code & Title</th>
                <th className="px-6 py-4">Version</th>
                <th className="px-6 py-4">Effective Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                      Loading policies...
                    </div>
                  </td>
                </tr>
              ) : data?.items?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-4">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-medium text-slate-900">No policies found</h3>
                    <p className="text-sm text-slate-500 mt-1">Get started by creating a new ESG policy.</p>
                  </td>
                </tr>
              ) : (
                data?.items?.map((policy) => (
                  <tr key={policy.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-slate-900">{policy.policy_code}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{policy.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700">v{policy.version}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700">{format(new Date(policy.effective_date), 'MMM d, yyyy')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        policy.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                        policy.status === 'DRAFT' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {policy.status === 'ACTIVE' && <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
                        {policy.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(policy)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          title="Edit Policy"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(policy.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Archive Policy"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {isFormOpen && (
        <PolicyForm
          initialData={editingPolicy}
          onClose={closeForm}
        />
      )}
    </div>
  );
}
