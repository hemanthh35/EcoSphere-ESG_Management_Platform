import React, { useState, useEffect } from 'react';
import { Plus, Award, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { socialApi } from '@/services/socialService';
import { employeeService } from '@/services/employeeService';
import type { TrainingRecord } from '@/modules/social/types/social.types';

export function TrainingRecordsTab() {
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [employeeId, setEmployeeId] = useState('');
  const [trainingName, setTrainingName] = useState('ESG Fundamentals & Compliance');
  const [completionDate, setCompletionDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [certUrl, setCertUrl] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const recordsData = await socialApi.listTrainingRecords();
      setRecords(recordsData);
    } catch (err) {
      console.error(err);
      setRecords([]);
    }

    try {
      const empRes = await employeeService.getDropdown();
      if (empRes) {
        setEmployees(empRes.map(emp => ({ id: emp.id, name: emp.full_name })));
      } else {
        setEmployees([]);
      }
    } catch (err) {
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) return alert('Please select an employee');
    try {
      const payload = {
        employee_id: employeeId,
        training_name: trainingName,
        completion_date: completionDate ? new Date(completionDate).toISOString() : undefined,
        expiry_date: expiryDate ? new Date(expiryDate).toISOString() : undefined,
        certificate_url: certUrl || undefined,
        status: 'COMPLETED' as const
      };
      await socialApi.createTrainingRecord(payload);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Failed to save training record');
    }
  };

  const filtered = records.filter(r => 
    r.training_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by training name..."
            className="pl-9 pr-4 py-2 w-full border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => {
            setEmployeeId(employees[0]?.id || '');
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Assign & Record
        </button>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading training records...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Employee</th>
                <th className="py-4 px-6">Training Name</th>
                <th className="py-4 px-6">Completion Date</th>
                <th className="py-4 px-6">Expiry Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700 text-sm">
              {filtered.map((r) => {
                const emp = employees.find((e: any) => e.id === r.employee_id);
                const isExpired = r.status === 'EXPIRED' || (r.expiry_date && new Date(r.expiry_date) < new Date());
                return (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-semibold">{emp ? emp.name : 'Unknown Employee'}</td>
                    <td className="py-4 px-6">{r.training_name}</td>
                    <td className="py-4 px-6">
                      {r.completion_date ? new Date(r.completion_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      {r.expiry_date ? new Date(r.expiry_date).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        isExpired 
                          ? 'bg-rose-50 text-rose-700 border-rose-100'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      }`}>
                        {isExpired ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                        {isExpired ? 'Expired' : 'Active'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {r.certificate_url ? (
                        <a 
                          href={r.certificate_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          <Award className="w-4 h-4" />
                          View Certificate
                        </a>
                      ) : (
                        <span className="text-slate-400 text-xs">No Upload</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-slide-up">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-base">Record Training Completion</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Employee *</label>
                <select
                  required
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Training Program Name *</label>
                <input
                  required
                  type="text"
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500"
                  value={trainingName}
                  onChange={(e) => setTrainingName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Completion Date *</label>
                <input
                  required
                  type="date"
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Expiry Date</label>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Certificate URL (PDF/Image)</label>
                <input
                  type="url"
                  placeholder="https://example.com/certificate.pdf"
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500"
                  value={certUrl}
                  onChange={(e) => setCertUrl(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold rounded-lg">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
