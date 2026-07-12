import { useState, useEffect } from 'react';
import { FileCode, Save, CheckCircle, Download } from 'lucide-react';
import { reportsService } from '@/services/reportsService';
import type { ReportTemplate } from '@/services/reportsService';

interface Props {
  deptId: string;
}

export function CustomReportBuilder({ deptId }: Props) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [modules, setModules] = useState<string[]>(['environmental']);
  const [savedTemplates, setSavedTemplates] = useState<ReportTemplate[]>([]);
  const [successMsg, setSuccessMsg] = useState('');

  const loadTemplates = async () => {
    try {
      const data = await reportsService.getTemplates();
      setSavedTemplates(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleModuleToggle = (mod: string) => {
    if (modules.includes(mod)) {
      setModules(modules.filter(m => m !== mod));
    } else {
      setModules([...modules, mod]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert('Template name is required');
    try {
      await reportsService.saveTemplate({
        name,
        description: desc,
        config: { modules, department_id: deptId || undefined }
      });
      setName('');
      setDesc('');
      setSuccessMsg('Report template saved successfully!');
      loadTemplates();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Failed to save template');
    }
  };

  const handleExport = (templateType: string) => {
    reportsService.downloadCSV(templateType, deptId);
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      {/* Builder Control Panel */}
      <form onSubmit={handleSave} className="col-span-2 space-y-6 bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-3">
          <FileCode className="w-5 h-5 text-indigo-500" />
          Custom Report Configurator
        </h3>

        {successMsg && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">Template Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Monthly ESG Snapshot" className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">Description</label>
            <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Summary of what this report highlights" className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        {/* Modules selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 block">Include ESG Pillars</label>
          <div className="flex gap-4">
            {[
              { id: 'environmental', label: 'Environmental' },
              { id: 'social', label: 'Social' },
              { id: 'governance', label: 'Governance' }
            ].map(pillar => (
              <button
                key={pillar.id}
                type="button"
                onClick={() => handleModuleToggle(pillar.id)}
                className={`px-4 py-2 border rounded-lg text-xs font-bold transition-all ${
                  modules.includes(pillar.id)
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {pillar.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm">
            <Save className="w-4 h-4" />
            Save Template
          </button>
        </div>
      </form>

      {/* Saved templates sidebar */}
      <div className="space-y-6 bg-slate-50/50 p-6 rounded-xl border border-slate-200/60">
        <h3 className="text-sm font-bold text-slate-800">Saved Configs</h3>
        <div className="space-y-3">
          {savedTemplates.length === 0 ? (
            <p className="text-slate-400 text-xs">No templates configured yet.</p>
          ) : (
            savedTemplates.map((template) => (
              <div key={template.id} className="p-3 bg-white border border-slate-100 rounded-lg shadow-xs flex justify-between items-center hover:shadow-sm">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{template.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{template.description || 'Custom ESG fields'}</p>
                </div>
                <button
                  onClick={() => handleExport(template.config.modules?.[0] || 'environmental')}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Run & Export"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
