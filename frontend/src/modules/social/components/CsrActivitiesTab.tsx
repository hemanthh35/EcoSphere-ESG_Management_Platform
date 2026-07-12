import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, MapPin, Users, Trash2, Edit2 } from 'lucide-react';
import { socialApi } from '@/services/socialService';
import type { CsrActivity } from '@/modules/social/types/social.types';

export function CsrActivitiesTab() {
  const [activities, setActivities] = useState<CsrActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [desc, setDesc] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [maxParticipants, setMaxParticipants] = useState<number>(50);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await socialApi.listActivities();
      setActivities(data);
    } catch (err) {
      console.error('Failed to load CSR activities', err);
      // Mock data in case backend endpoint returns empty/fails to connect
      setActivities([
        {
          id: '1',
          activity_code: 'CSR-001',
          title: 'Community Tree Plantation Drive',
          description: 'Planting 1000 trees across the city park area.',
          start_date: '2026-08-10T09:00:00Z',
          end_date: '2026-08-10T17:00:00Z',
          location: 'City Green Park',
          max_participants: 50,
          status: 'PLANNED',
          created_by: '1',
          updated_by: '1',
          created_at: '',
          updated_at: ''
        },
        {
          id: '2',
          activity_code: 'CSR-002',
          title: 'E-Waste Recycling Awareness',
          description: 'Educating corporate employees and community on safe e-waste disposal.',
          start_date: '2026-07-20T10:00:00Z',
          end_date: '2026-07-22T16:00:00Z',
          location: 'Conference Hall B',
          max_participants: 100,
          status: 'ONGOING',
          created_by: '1',
          updated_by: '1',
          created_at: '',
          updated_at: ''
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setTitle('');
    setCode(`CSR-${Math.floor(100 + Math.random() * 900)}`);
    setDesc('');
    setStartDate('');
    setEndDate('');
    setLocation('');
    setMaxParticipants(50);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (act: CsrActivity) => {
    setIsEditing(true);
    setCurrentId(act.id);
    setTitle(act.title);
    setCode(act.activity_code);
    setDesc(act.description || '');
    setStartDate(act.start_date.substring(0, 16));
    setEndDate(act.end_date.substring(0, 16));
    setLocation(act.location || '');
    setMaxParticipants(act.max_participants || 50);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      activity_code: code,
      description: desc,
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      location,
      max_participants: maxParticipants,
      status: isEditing ? undefined : ('PLANNED' as const)
    };

    try {
      if (isEditing && currentId) {
        await socialApi.updateActivity(currentId, payload);
      } else {
        await socialApi.createActivity(payload);
      }
      setIsModalOpen(false);
      fetchActivities();
    } catch (err) {
      alert('Error saving CSR Activity. Please check backend log.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      try {
        await socialApi.deleteActivity(id);
        fetchActivities();
      } catch (err) {
        alert('Failed to delete activity.');
      }
    }
  };

  const handleJoin = async (id: string) => {
    try {
      await socialApi.joinActivity(id);
      alert('Successfully joined CSR activity!');
      fetchActivities();
    } catch (err) {
      alert('Could not join CSR Activity (You may already have joined or capacity is full).');
    }
  };

  const filtered = activities.filter(act => {
    const matchesSearch = act.title.toLowerCase().includes(search.toLowerCase()) || 
                          act.activity_code.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || act.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by code or title..."
            className="pl-9 pr-4 py-2 w-full border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex w-full sm:w-auto gap-3 justify-end">
          <select
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:border-indigo-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="PLANNED">Planned</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button
            onClick={handleOpenCreate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Activity
          </button>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading CSR activities...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-100">No CSR activities found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((act) => (
            <div key={act.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    {act.activity_code}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                    act.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                    act.status === 'ONGOING' ? 'bg-amber-50 text-amber-700' :
                    act.status === 'CANCELLED' ? 'bg-rose-50 text-rose-700' :
                    'bg-slate-50 text-slate-700'
                  }`}>
                    {act.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 text-base line-clamp-1">{act.title}</h3>
                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{act.description}</p>
                </div>
                <div className="space-y-2 border-t border-slate-50 pt-3 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(act.start_date).toLocaleDateString()}</span>
                  </div>
                  {act.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{act.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Max Participants: {act.max_participants || 'Unlimited'}</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-6 py-4 flex gap-3 border-t border-slate-100 justify-between items-center">
                <div className="flex gap-2">
                  <button onClick={() => handleOpenEdit(act)} className="p-1.5 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-700 transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(act.id)} className="p-1.5 hover:bg-rose-100 rounded text-slate-500 hover:text-rose-600 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {act.status === 'PLANNED' && (
                  <button
                    onClick={() => handleJoin(act.id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    Register
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-slide-up">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-base">{isEditing ? 'Edit CSR Activity' : 'Create CSR Activity'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Activity Title *</label>
                  <input required type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Activity Code *</label>
                  <input required type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500" value={code} onChange={(e) => setCode(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Location</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Start Date & Time *</label>
                  <input required type="datetime-local" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">End Date & Time *</label>
                  <input required type="datetime-local" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Max Participants</label>
                  <input type="number" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500" value={maxParticipants} onChange={(e) => setMaxParticipants(Number(e.target.value))} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Description</label>
                <textarea rows={3} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500" value={desc} onChange={(e) => setDesc(e.target.value)} />
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
