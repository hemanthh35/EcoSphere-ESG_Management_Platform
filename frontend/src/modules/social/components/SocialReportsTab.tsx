import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';

export function SocialReportsTab() {
  const [reportType, setReportType] = useState<'csr' | 'participation' | 'diversity' | 'training'>('csr');
  const [format, setFormat] = useState<'csv' | 'xlsx' | 'pdf'>('csv');
  const [dept, setDept] = useState('ALL');
  const [loading, setLoading] = useState(false);

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      // Create a mock download link for CSV/XLSX
      if (format === 'pdf') {
        alert('PDF Report generated! Check your downloads folder (Simulated).');
      } else {
        const headers = ['Report Title', 'Department Filter', 'Period', 'Generated At'];
        const rows = [
          [`Social Module - ${reportType.toUpperCase()} Report`, dept, 'Q2 2026', new Date().toISOString()]
        ];
        let csvContent = "data:text/csv;charset=utf-8," 
          + headers.join(",") + "\n"
          + rows.map(e => e.join(",")).join("\n");
          
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `ecosphere_social_${reportType}_report.${format}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-8 py-6 bg-slate-50 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 text-base">Consolidated Social Reports</h3>
        <p className="text-slate-500 text-xs mt-0.5">Export activities, employee ESG participation, and training records.</p>
      </div>

      <form onSubmit={handleExport} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Report Category</label>
            <select
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 bg-white"
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
            >
              <option value="csr">CSR Activities Overview</option>
              <option value="participation">Employee CSR Participation & Points</option>
              <option value="diversity">Diversity & Inclusion Metrics</option>
              <option value="training">ESG Training & Certifications Status</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Department</label>
            <select
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 bg-white"
              value={dept}
              onChange={(e) => setDept(e.target.value)}
            >
              <option value="ALL">All Departments</option>
              <option value="Product Engineering">Product Engineering</option>
              <option value="Marketing & Sales">Marketing & Sales</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance & Accounts">Finance & Accounts</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Date Range / Period</label>
            <select className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 bg-white">
              <option>Current Quarter (Q2 2026)</option>
              <option>Last Quarter (Q1 2026)</option>
              <option>Full Year 2026</option>
              <option>Full Year 2025</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'csv', label: 'CSV', icon: FileText },
                { id: 'xlsx', label: 'Excel', icon: FileSpreadsheet },
                { id: 'pdf', label: 'PDF', icon: Download },
              ].map((fmt) => {
                const Icon = fmt.icon;
                const active = format === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setFormat(fmt.id as any)}
                    className={`flex flex-col items-center justify-center py-2.5 px-3 border rounded-xl gap-1 transition-all cursor-pointer ${
                      active 
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-semibold' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px]">{fmt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-sm hover:shadow cursor-pointer"
          >
            {loading ? 'Generating...' : 'Export Report'}
          </button>
        </div>
      </form>
    </div>
  );
}
