import { useState, useEffect } from 'react';
import { Bell, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { settingsService } from '@/services/settingsService';

export function NotificationSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // States
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [complianceAlerts, setComplianceAlerts] = useState(true);
  const [challengeUpdates, setChallengeUpdates] = useState(true);
  const [badgeMilestones, setBadgeMilestones] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const data = await settingsService.getNotificationSettings();
        setEmailAlerts(data.email_alerts);
        setComplianceAlerts(data.compliance_alerts);
        setChallengeUpdates(data.challenge_updates);
        setBadgeMilestones(data.badge_milestones);
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);
      await settingsService.updateNotificationSettings({
        email_alerts: emailAlerts,
        compliance_alerts: complianceAlerts,
        challenge_updates: challengeUpdates,
        badge_milestones: badgeMilestones
      });
      setMessage({ type: 'success', text: 'Notification preferences saved successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update preferences' });
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
        <Bell className="w-5 h-5 text-indigo-500" />
        <div>
          <h2 className="text-lg font-bold text-slate-800">Notification Settings</h2>
          <p className="text-slate-500 text-xs mt-0.5">Customize your alert delivery channels</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-6">
        {message && (
          <div className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 rounded-lg border border-slate-100 hover:bg-slate-50/50 transition-colors">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Email Alerts</h4>
              <p className="text-slate-500 text-xs mt-0.5">Receive digests and updates via email</p>
            </div>
            <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" style={{ width: '20px', height: '20px' }} />
          </div>

          <div className="flex justify-between items-center p-4 rounded-lg border border-slate-100 hover:bg-slate-50/50 transition-colors">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Compliance Alerts</h4>
              <p className="text-slate-500 text-xs mt-0.5">Receive warnings about due audits and compliance issues</p>
            </div>
            <input type="checkbox" checked={complianceAlerts} onChange={(e) => setComplianceAlerts(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" style={{ width: '20px', height: '20px' }} />
          </div>

          <div className="flex justify-between items-center p-4 rounded-lg border border-slate-100 hover:bg-slate-50/50 transition-colors">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Challenge Updates</h4>
              <p className="text-slate-500 text-xs mt-0.5">Receive notifications when new challenges start or end</p>
            </div>
            <input type="checkbox" checked={challengeUpdates} onChange={(e) => setChallengeUpdates(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" style={{ width: '20px', height: '20px' }} />
          </div>

          <div className="flex justify-between items-center p-4 rounded-lg border border-slate-100 hover:bg-slate-50/50 transition-colors">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Badge & Milestones</h4>
              <p className="text-slate-500 text-xs mt-0.5">Receive notifications when you unlock achievements or badges</p>
            </div>
            <input type="checkbox" checked={badgeMilestones} onChange={(e) => setBadgeMilestones(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" style={{ width: '20px', height: '20px' }} />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <Save className="w-4 h-4" />
            {saving ? 'Saving Preferences...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
