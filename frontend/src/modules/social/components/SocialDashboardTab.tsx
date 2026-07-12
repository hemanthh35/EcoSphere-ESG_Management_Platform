import { Award, Users, GraduationCap, Building2, TrendingUp, Calendar } from 'lucide-react';

export function SocialDashboardTab() {
  const kpis = [
    { title: 'Total CSR Projects', value: '18', change: '+12% from last quarter', icon: Calendar, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { title: 'Employee Participation', value: '84.2%', change: '+5.4% growth', icon: Users, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { title: 'Training Completion', value: '92.6%', change: '98 active licenses', icon: GraduationCap, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { title: 'Total ESG Points Earned', value: '12,450', change: 'Top: ESG Champions', icon: Award, color: 'text-rose-600 bg-rose-50 border-rose-100' },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
              <div className="space-y-2">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{kpi.title}</p>
                <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{kpi.value}</h3>
                <span className="text-emerald-600 text-xs font-medium flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {kpi.change}
                </span>
              </div>
              <div className={`p-4 rounded-xl border ${kpi.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Rankings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CSR Participation Trends */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-800">CSR Participation by Quarter</h2>
              <p className="text-slate-500 text-xs">Overview of employees joining CSR activities</p>
            </div>
            <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 font-medium">
              <option>Year 2026</option>
              <option>Year 2025</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end justify-between px-4 pt-4 border-b border-slate-100 relative">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border-t border-dashed border-slate-100 w-full h-0" />
              ))}
            </div>
            
            {/* Custom SVG/HTML Bar Chart */}
            {[
              { label: 'Q1 2025', value: 45, height: 'h-[45%]' },
              { label: 'Q2 2025', value: 60, height: 'h-[60%]' },
              { label: 'Q3 2025', value: 55, height: 'h-[55%]' },
              { label: 'Q4 2025', value: 72, height: 'h-[72%]' },
              { label: 'Q1 2026', value: 80, height: 'h-[80%]' },
              { label: 'Q2 2026', value: 95, height: 'h-[95%]' },
            ].map((bar) => (
              <div key={bar.label} className="flex flex-col items-center gap-2 w-1/6 z-10">
                <div className={`w-10 ${bar.height} bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg transition-all duration-500 hover:from-indigo-600 hover:to-indigo-500 relative group cursor-pointer`}>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-semibold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
                    {bar.value}% Participated
                  </div>
                </div>
                <span className="text-slate-500 text-[10px] font-semibold">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Diversity metrics snapshot */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Workforce Diversity</h2>
            <p className="text-slate-500 text-xs">Workforce composition metrics</p>
          </div>
          
          <div className="space-y-5">
            {[
              { label: 'Gender Diversity (Female %)', value: 42, color: 'bg-indigo-500' },
              { label: 'Management Diversity', value: 38, color: 'bg-emerald-500' },
              { label: 'Minority & Underrepresented Group', value: 24, color: 'bg-amber-500' },
              { label: 'Differently Abled Representation', value: 6, color: 'bg-rose-500' },
            ].map((metric) => (
              <div key={metric.label} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{metric.label}</span>
                  <span>{metric.value}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${metric.color} rounded-full`} style={{ width: `${metric.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Departments */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-slate-800">Top Departments by ESG Points</h2>
          </div>
          <div className="space-y-4">
            {[
              { rank: 1, name: 'Product Engineering', points: '4,850 points', percentage: '100%' },
              { rank: 2, name: 'Marketing & Sales', points: '3,200 points', percentage: '70%' },
              { rank: 3, name: 'Human Resources', points: '2,900 points', percentage: '60%' },
              { rank: 4, name: 'Finance & Accounts', points: '1,500 points', percentage: '35%' },
            ].map((dept) => (
              <div key={dept.name} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-extrabold ${dept.rank === 1 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>{dept.rank}</span>
                  <span className="text-slate-700 font-semibold text-sm">{dept.name}</span>
                </div>
                <span className="text-slate-900 font-extrabold text-sm">{dept.points}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Employees Dashboard widget */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-slate-800">Social Module ESG Champions</h2>
          </div>
          <div className="space-y-4">
            {[
              { rank: 1, name: 'Jane Doe', dept: 'Product Engineering', points: '650 pts' },
              { rank: 2, name: 'John Smith', dept: 'Marketing & Sales', points: '580 pts' },
              { rank: 3, name: 'Robert Johnson', dept: 'Human Resources', points: '520 pts' },
              { rank: 4, name: 'Emily Davis', dept: 'Finance & Accounts', points: '450 pts' },
            ].map((emp) => (
              <div key={emp.name} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-extrabold ${emp.rank === 1 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>{emp.rank}</span>
                  <div>
                    <div className="text-slate-700 font-semibold text-sm">{emp.name}</div>
                    <div className="text-slate-400 text-[10px]">{emp.dept}</div>
                  </div>
                </div>
                <span className="text-indigo-600 font-extrabold text-sm">{emp.points}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
