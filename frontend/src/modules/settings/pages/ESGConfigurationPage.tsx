import { useState, useEffect } from 'react';
import { Sliders, Save, CheckCircle, Info, Percent, AlertCircle } from 'lucide-react';
import { settingsService } from '@/services/settingsService';

export function ESGConfigurationPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Input states
  const [envWeight, setEnvWeight] = useState(40);
  const [socWeight, setSocWeight] = useState(30);
  const [govWeight, setGovWeight] = useState(30);
  const [autoCarbon, setAutoCarbon] = useState(true);
  const [evidenceRequired, setEvidenceRequired] = useState(true);
  const [autoBadge, setAutoBadge] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        setLoading(true);
        const data = await settingsService.getESGConfig();
        setEnvWeight(data.environmental_weight * 100);
        setSocWeight(data.social_weight * 100);
        setGovWeight(data.governance_weight * 100);
        setAutoCarbon(data.auto_carbon_calculation);
        setEvidenceRequired(data.evidence_required);
        setAutoBadge(data.auto_badge_award);
      } catch (err) {
        console.error('Failed to load configuration', err);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (envWeight + socWeight + govWeight !== 100) {
      setMessage({ type: 'error', text: 'ESG Weights must sum exactly to 100%' });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);
      await settingsService.updateESGConfig({
        environmental_weight: envWeight / 100,
        social_weight: socWeight / 100,
        governance_weight: govWeight / 100,
        auto_carbon_calculation: autoCarbon,
        evidence_required: evidenceRequired,
        auto_badge_award: autoBadge,
      });
      setMessage({ type: 'success', text: 'ESG Configuration updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update configuration' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden max-w-4xl">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
        <Sliders className="w-5 h-5 text-indigo-500" />
        <div>
          <h2 className="text-lg font-bold text-slate-800">ESG Configuration & Parameters</h2>
          <p className="text-slate-500 text-xs mt-0.5">Define reporting weights and calculation rules</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-8">
        {message && (
          <div className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
            {message.text}
          </div>
        )}

        {/* ESG Weights */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-slate-500" />
              Weight Configurations
            </h3>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              envWeight + socWeight + govWeight === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              Total Weight: {envWeight + socWeight + govWeight}%
            </span>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-1.5 p-4 rounded-lg border border-slate-100 bg-slate-50/50">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Environmental</label>
              <div className="flex items-center gap-2">
                <input type="number" min="0" max="100" value={envWeight} onChange={(e) => setEnvWeight(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-bold" />
                <span className="text-slate-500 font-bold">%</span>
              </div>
            </div>

            <div className="space-y-1.5 p-4 rounded-lg border border-slate-100 bg-slate-50/50">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Social</label>
              <div className="flex items-center gap-2">
                <input type="number" min="0" max="100" value={socWeight} onChange={(e) => setSocWeight(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-bold" />
                <span className="text-slate-500 font-bold">%</span>
              </div>
            </div>

            <div className="space-y-1.5 p-4 rounded-lg border border-slate-100 bg-slate-50/50">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Governance</label>
              <div className="flex items-center gap-2">
                <input type="number" min="0" max="100" value={govWeight} onChange={(e) => setGovWeight(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-bold" />
                <span className="text-slate-500 font-bold">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Rules toggles */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-500" />
            Core ESG Rules & Automations
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-lg border border-slate-100 hover:bg-slate-50/50 transition-colors">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Auto Carbon Calculation</h4>
                <p className="text-slate-500 text-xs mt-0.5">Automatically trigger emission transactions using default emission factors</p>
              </div>
              <input type="checkbox" checked={autoCarbon} onChange={(e) => setAutoCarbon(e.target.checked)} className="w-10 h-5 rounded-full text-indigo-600 focus:ring-indigo-500 cursor-pointer" style={{ width: '20px', height: '20px' }} />
            </div>

            <div className="flex justify-between items-center p-4 rounded-lg border border-slate-100 hover:bg-slate-50/50 transition-colors">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Evidence Required</h4>
                <p className="text-slate-500 text-xs mt-0.5">Require employees to upload proof URLs before CSR or Challenge approvals</p>
              </div>
              <input type="checkbox" checked={evidenceRequired} onChange={(e) => setEvidenceRequired(e.target.checked)} className="w-10 h-5 rounded-full text-indigo-600 focus:ring-indigo-500 cursor-pointer" style={{ width: '20px', height: '20px' }} />
            </div>

            <div className="flex justify-between items-center p-4 rounded-lg border border-slate-100 hover:bg-slate-50/50 transition-colors">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Auto Badge Award</h4>
                <p className="text-slate-500 text-xs mt-0.5">Award badges instantly when unlock rules and XP milestones are met</p>
              </div>
              <input type="checkbox" checked={autoBadge} onChange={(e) => setAutoBadge(e.target.checked)} className="w-10 h-5 rounded-full text-indigo-600 focus:ring-indigo-500 cursor-pointer" style={{ width: '20px', height: '20px' }} />
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <Save className="w-4 h-4" />
            {saving ? 'Saving Configurations...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
