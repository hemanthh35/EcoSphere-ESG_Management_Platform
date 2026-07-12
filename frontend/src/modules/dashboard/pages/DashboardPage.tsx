import { useState, useEffect } from 'react';
import { Leaf, Users, ShieldCheck, TrendingUp, Trophy, Sparkles, Building2, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { useDepartmentDropdown } from '@/hooks/useDepartments';
import { reportsService } from '@/services/reportsService';
import type { ESGSummaryReport, EnvironmentalReport, SocialReport, GovernanceReport } from '@/services/reportsService';

export function DashboardPage() {
  const [deptId, setDeptId] = useState('');
  const { data: deptResponse } = useDepartmentDropdown();
  
  const [loading, setLoading] = useState(true);
  const [esgSummary, setEsgSummary] = useState<ESGSummaryReport | null>(null);
  const [envReport, setEnvReport] = useState<EnvironmentalReport | null>(null);
  const [socReport, setSocReport] = useState<SocialReport | null>(null);
  const [govReport, setGovReport] = useState<GovernanceReport | null>(null);

  // For interactive tooltips
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);
  const [hoveredDonutPillar, setHoveredDonutPillar] = useState<'E' | 'S' | 'G' | null>(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Load all ESG metrics
  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const params = { department_id: deptId || undefined };
        const [summary, env, soc, gov] = await Promise.all([
          reportsService.getESGSummaryReport(params),
          reportsService.getEnvironmentalReport(params),
          reportsService.getSocialReport(params),
          reportsService.getGovernanceReport(params),
        ]);
        setEsgSummary(summary);
        setEnvReport(env);
        setSocReport(soc);
        setGovReport(gov);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [deptId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
        <p className="text-sm font-semibold text-neutral-500 animate-pulse">Assembling EcoSphere analytics...</p>
      </div>
    );
  }

  if (!esgSummary || !envReport || !socReport || !govReport) {
    return (
      <div className="text-center py-20 text-neutral-500">
        <AlertTriangle className="w-10 h-10 mx-auto text-amber-500 mb-2" />
        <p>Could not retrieve dashboard ESG data. Please check connection and try again.</p>
      </div>
    );
  }

  // --- Calculations & Real historical trends ---
  // Use real data from backend monthly_trend
  const trendData = envReport.monthly_trend && envReport.monthly_trend.length > 0
    ? envReport.monthly_trend
    : [
        { month: 'Jan', offset: 0 },
        { month: 'Feb', offset: 0 },
        { month: 'Mar', offset: 0 },
        { month: 'Apr', offset: 0 },
        { month: 'May', offset: 0 },
        { month: 'Jun', offset: 0 },
      ];

  // Radial Gauge Constants
  const score = Math.round(esgSummary.overall_esg_score);
  const envScore = Math.round(esgSummary.environmental_score);
  const socScore = Math.round(esgSummary.social_score);
  const govScore = Math.round(esgSummary.governance_score);

  // Use real department scores leaderboard from backend
  const leaderboard = esgSummary.department_scores && esgSummary.department_scores.length > 0
    ? esgSummary.department_scores.slice(0, 5)
    : [];

  const allDepts = deptResponse?.data || [];

  return (
    <div className="space-y-8 pb-10">
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-brand-50 text-brand-600 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 animate-pulse border border-brand-200">
              <Sparkles className="w-3 h-3" /> Live Analytics
            </span>
            <span className="text-neutral-400 text-xs">• Updated just now</span>
          </div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
            ESG Performance <span style={{ color: '#10a368' }}>Dashboard</span>
          </h1>
          <p className="text-sm text-neutral-500">
            Real-time carbon telemetry, resource management, CSR engagement, and governance audits.
          </p>
        </div>

        {/* Department filter */}
        <div className="flex items-center gap-2.5 bg-white px-4 py-2 border border-neutral-200 rounded-xl shadow-sm hover:border-neutral-300 transition-all">
          <Building2 className="w-4 h-4 text-neutral-400" />
          <select 
            value={deptId} 
            onChange={(e) => setDeptId(e.target.value)} 
            className="text-xs font-semibold text-neutral-700 bg-transparent border-none outline-none cursor-pointer pr-4"
          >
            <option value="">All Corporate Departments</option>
            {allDepts.map((d: any) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── KPI HIGHLIGHT CARDS ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: CO2 */}
        <div className="card p-6 flex flex-col justify-between hover:shadow-md hover:scale-[1.01] transition-all relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-16 w-16 bg-emerald-50 rounded-bl-full flex items-center justify-center opacity-50 group-hover:bg-emerald-100/70 transition-colors">
            <Leaf className="w-6 h-6 text-emerald-600 translate-x-2 -translate-y-2" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Carbon Offset</p>
            <h3 className="text-3xl font-black text-neutral-800 tracking-tight mt-1">
              {envReport.total_co2_reduction.toLocaleString()}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">kg CO2e Offset</p>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            Telemetry online
          </div>
        </div>

        {/* KPI 2: CSR */}
        <div className="card p-6 flex flex-col justify-between hover:shadow-md hover:scale-[1.01] transition-all relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-16 w-16 bg-indigo-50 rounded-bl-full flex items-center justify-center opacity-50 group-hover:bg-indigo-100/70 transition-colors">
            <Users className="w-6 h-6 text-indigo-600 translate-x-2 -translate-y-2" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Social Engagement</p>
            <h3 className="text-3xl font-black text-neutral-800 tracking-tight mt-1">
              {socReport.total_csr_hours.toFixed(0)}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">Hours CSR Contributed</p>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-between items-center text-[10px] font-semibold text-neutral-400">
            <span>Participations: {socReport.csr_participation_count}</span>
            <span className="text-indigo-600 font-bold">{Math.round(socReport.average_diversity_score)}% Diversity</span>
          </div>
        </div>

        {/* KPI 3: Governance */}
        <div className="card p-6 flex flex-col justify-between hover:shadow-md hover:scale-[1.01] transition-all relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-16 w-16 bg-amber-50 rounded-bl-full flex items-center justify-center opacity-50 group-hover:bg-amber-100/70 transition-colors">
            <ShieldCheck className="w-6 h-6 text-amber-600 translate-x-2 -translate-y-2" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Policies & Audits</p>
            <h3 className="text-3xl font-black text-neutral-800 tracking-tight mt-1">
              {govReport.active_policies_count}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">Active Compliance Policies</p>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-between items-center text-[10px] font-semibold text-neutral-400">
            <span>Audits: {govReport.completed_audits_count}/{govReport.total_audits_count} Done</span>
            <span className="text-red-500 font-bold">{govReport.open_compliance_issues_count} Open Issues</span>
          </div>
        </div>

        {/* KPI 4: Overall Rating */}
        <div className="card p-6 flex flex-col justify-between hover:shadow-md hover:scale-[1.01] transition-all relative overflow-hidden group"
          style={{ background: 'linear-gradient(135deg, #10a368 0%, #0d8254 100%)' }}>
          <div className="absolute right-0 top-0 h-16 w-16 bg-white/10 rounded-bl-full flex items-center justify-center opacity-50">
            <Trophy className="w-6 h-6 text-white translate-x-2 -translate-y-2" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-brand-100 tracking-wider">Overall EcoScore</p>
            <h3 className="text-4xl font-black text-white tracking-tight mt-1">
              {score}<span className="text-lg font-normal text-brand-200">/100</span>
            </h3>
            <p className="text-xs text-brand-100/80 mt-0.5">ESG Weighted Performance</p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-[10px] font-semibold text-brand-100">
            Target rating: Excellent (&gt;80)
          </div>
        </div>
      </div>

      {/* ── ROW 1: RADIAL SCORE GAUGE & TREND LINE CHART ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Gauge Dial Card */}
        <div className="card p-6 flex flex-col justify-between items-center text-center space-y-6">
          <div className="w-full flex justify-between items-center border-b border-neutral-100 pb-3">
            <h3 className="text-sm font-bold text-neutral-800">Overall ESG Rating Dial</h3>
            <HelpCircle className="w-4 h-4 text-neutral-300 hover:text-neutral-400 cursor-pointer" />
          </div>

          <div className="relative flex items-center justify-center py-4">
            {/* SVG Radial Arc */}
            <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
              <defs>
                <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10a368" />
                  <stop offset="50%" stopColor="#82e8ba" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
              {/* Outer track */}
              <circle cx="100" cy="100" r="85" stroke="#f3f4f6" strokeWidth="12" fill="transparent" />
              {/* Score filling */}
              <circle 
                cx="100" 
                cy="100" 
                r="85" 
                stroke="url(#gaugeGrad)" 
                strokeWidth="12" 
                fill="transparent"
                strokeDasharray={2 * Math.PI * 85}
                strokeDashoffset={2 * Math.PI * 85 * (1 - score / 100)}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: 'drop-shadow(0px 2px 4px rgba(16, 163, 104, 0.15))'
                }}
              />
            </svg>

            {/* Score Overlay */}
            <div className="absolute flex flex-col justify-center items-center">
              <span className="text-5xl font-black text-neutral-800 tracking-tight">{score}</span>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Corporate Index</span>
            </div>
          </div>

          {/* Subscores details */}
          <div className="grid grid-cols-3 gap-2 w-full pt-3 border-t border-neutral-100">
            <div className="bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/60 hover:bg-emerald-50 transition-colors">
              <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider">E-Pillar</span>
              <span className="font-extrabold text-neutral-800 text-lg">{envScore}</span>
            </div>
            <div className="bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/60 hover:bg-indigo-50 transition-colors">
              <span className="block text-[10px] font-bold text-indigo-600 uppercase tracking-wider">S-Pillar</span>
              <span className="font-extrabold text-neutral-800 text-lg">{socScore}</span>
            </div>
            <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-100/60 hover:bg-amber-50 transition-colors">
              <span className="block text-[10px] font-bold text-amber-600 uppercase tracking-wider">G-Pillar</span>
              <span className="font-extrabold text-neutral-800 text-lg">{govScore}</span>
            </div>
          </div>
        </div>

        {/* Trend Area Chart (2/3 width) */}
        <div className="card p-6 flex flex-col justify-between lg:col-span-2 relative">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-800">Carbon Offsets Historical Trend</h3>
              <p className="text-[11px] text-neutral-400">Monthly carbon savings index tracking (kg CO2e offset)</p>
            </div>
            <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +15.4% QoQ
            </span>
          </div>

          {/* Interactive Chart Container */}
          <div className="relative w-full h-[180px] mt-2 group/chart">
            <svg className="w-full h-full" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10a368" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10a368" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="160" x2="500" y2="160" stroke="#e5e7eb" strokeWidth="1" />

              {/* Chart Lines / Paths */}
              {(() => {
                const maxVal = Math.max(...trendData.map(d => d.offset), 100) * 1.15;
                const getCoords = (val: number, idx: number) => {
                  const x = 25 + idx * 90;
                  const y = 160 - (val / maxVal) * 125;
                  return { x, y };
                };

                const coords = trendData.map((d, i) => getCoords(d.offset, i));
                
                // Construct line path
                const linePath = coords.reduce((acc, c, i) => {
                  return i === 0 ? `M ${c.x} ${c.y}` : `${acc} L ${c.x} ${c.y}`;
                }, '');

                // Construct area path
                const areaPath = `${linePath} L ${coords[coords.length - 1].x} 160 L ${coords[0].x} 160 Z`;

                return (
                  <>
                    {/* Fill Area */}
                    <path d={areaPath} fill="url(#areaGrad)" />
                    {/* Line Stroke */}
                    <path d={linePath} fill="none" stroke="#10a368" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Interactive dots and grid interaction columns */}
                    {coords.map((c, i) => {
                      const isHovered = hoveredTrendIndex === i;
                      return (
                        <g key={i}>
                          {/* Hover Vertical Line */}
                          {isHovered && (
                            <line x1={c.x} y1="0" x2={c.x} y2="160" stroke="#10a368" strokeWidth="1" strokeDasharray="3" />
                          )}
                          {/* Outer Glow Ring on Hover */}
                          <circle 
                            cx={c.x} 
                            cy={c.y} 
                            r={isHovered ? 8 : 4} 
                            fill={isHovered ? '#b8f5d6' : '#ffffff'} 
                            stroke="#10a368" 
                            strokeWidth={isHovered ? 3 : 2.5}
                            style={{ transition: 'all 0.15s ease' }}
                          />
                          {/* Invisible larger hover zone circle */}
                          <circle 
                            cx={c.x} 
                            cy={c.y} 
                            r="20" 
                            fill="transparent" 
                            className="cursor-pointer"
                            onMouseEnter={(e) => {
                              setHoveredTrendIndex(i);
                              const rect = e.currentTarget.getBoundingClientRect();
                              const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                              if (containerRect && rect) {
                                setTooltipPos({ 
                                  x: rect.left - containerRect.left + 10, 
                                  y: rect.top - containerRect.top - 50 
                                });
                              }
                            }}
                            onMouseLeave={() => setHoveredTrendIndex(null)}
                          />
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>

            {/* Labels Row */}
            <div className="flex justify-between px-3 text-[10px] font-bold text-neutral-400 uppercase mt-2">
              {trendData.map((d, i) => (
                <span key={i} style={{ width: '40px', textAlign: 'center' }}>{d.month}</span>
              ))}
            </div>

            {/* Tooltip Overlay */}
            {hoveredTrendIndex !== null && (
              <div 
                className="absolute bg-neutral-900 text-white rounded-lg p-2.5 text-[11px] shadow-lg pointer-events-none z-10 space-y-0.5 min-w-[120px] transition-all duration-100 ease-out"
                style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px`, transform: 'translateX(-50%)' }}
              >
                <div className="font-extrabold text-[10px] text-brand-300 uppercase tracking-wide">
                  {trendData[hoveredTrendIndex].month} Telemetry
                </div>
                <div className="flex justify-between gap-4 font-semibold">
                  <span>Carbon Offset:</span>
                  <span className="text-white font-bold">{trendData[hoveredTrendIndex].offset.toLocaleString()} kg</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── ROW 2: DONUT CHART PILLARS & GOVERNANCE BAR CHART ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interactive segmented Donut Chart */}
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-800">ESG Pillars Weights & Scores</h3>
              <p className="text-[11px] text-neutral-400">Hover segments to analyze organization weight ratios vs scores</p>
            </div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Interactive Segments</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            {/* SVG Donut */}
            <div className="relative flex items-center justify-center">
              <svg width="170" height="170" viewBox="0 0 170 170" className="transform -rotate-90">
                {(() => {
                  const radius = 62;
                  const circum = 2 * Math.PI * radius;
                  const weights = esgSummary.weights;
                  
                  // Compute gaps between segments (3 gaps of 3% each = 9%)
                  const gapPct = 0.03;
                  const totalGaps = 3 * gapPct;
                  const remainPct = 1 - totalGaps;

                  // Segment ratios proportional to weights
                  const envLen = weights.environmental * remainPct * circum;
                  const textSoc = weights.social || 0.3;
                  const textGov = weights.governance || 0.3;
                  const socLen = textSoc * remainPct * circum;
                  const govLen = textGov * remainPct * circum;
                  const gapLen = gapPct * circum;

                  // Starting points
                  const envOffset = circum;
                  const socOffset = envOffset - envLen - gapLen;
                  const govOffset = socOffset - socLen - gapLen;

                  return (
                    <>
                      {/* Environmental Segment (Emerald) */}
                      <circle
                        cx="85" cy="85" r={radius}
                        fill="transparent"
                        stroke="#10a368"
                        strokeWidth={hoveredDonutPillar === 'E' ? 16 : 11}
                        strokeDasharray={`${envLen} ${circum - envLen}`}
                        strokeDashoffset={envOffset}
                        className="cursor-pointer transition-all duration-150"
                        onMouseEnter={() => setHoveredDonutPillar('E')}
                        onMouseLeave={() => setHoveredDonutPillar(null)}
                      />
                      {/* Social Segment (Indigo) */}
                      <circle
                        cx="85" cy="85" r={radius}
                        fill="transparent"
                        stroke="#6366f1"
                        strokeWidth={hoveredDonutPillar === 'S' ? 16 : 11}
                        strokeDasharray={`${socLen} ${circum - socLen}`}
                        strokeDashoffset={socOffset}
                        className="cursor-pointer transition-all duration-150"
                        onMouseEnter={() => setHoveredDonutPillar('S')}
                        onMouseLeave={() => setHoveredDonutPillar(null)}
                      />
                      {/* Governance Segment (Amber) */}
                      <circle
                        cx="85" cy="85" r={radius}
                        fill="transparent"
                        stroke="#f59e0b"
                        strokeWidth={hoveredDonutPillar === 'G' ? 16 : 11}
                        strokeDasharray={`${govLen} ${circum - govLen}`}
                        strokeDashoffset={govOffset}
                        className="cursor-pointer transition-all duration-150"
                        onMouseEnter={() => setHoveredDonutPillar('G')}
                        onMouseLeave={() => setHoveredDonutPillar(null)}
                      />
                    </>
                  );
                })()}
              </svg>

              {/* Center text details */}
              <div className="absolute flex flex-col justify-center items-center text-center max-w-[100px]">
                {hoveredDonutPillar === 'E' && (
                  <>
                    <span className="text-2xl font-black text-emerald-600">{envScore}%</span>
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wide">Environment</span>
                    <span className="text-[9px] text-neutral-500 font-semibold mt-0.5">Weight: {(esgSummary.weights.environmental * 100)}%</span>
                  </>
                )}
                {hoveredDonutPillar === 'S' && (
                  <>
                    <span className="text-2xl font-black text-indigo-600">{socScore}%</span>
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wide">Social</span>
                    <span className="text-[9px] text-neutral-500 font-semibold mt-0.5">Weight: {(esgSummary.weights.social * 100)}%</span>
                  </>
                )}
                {hoveredDonutPillar === 'G' && (
                  <>
                    <span className="text-2xl font-black text-amber-600">{govScore}%</span>
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wide">Governance</span>
                    <span className="text-[9px] text-neutral-500 font-semibold mt-0.5">Weight: {(esgSummary.weights.governance * 100)}%</span>
                  </>
                )}
                {!hoveredDonutPillar && (
                  <>
                    <span className="text-3xl font-black text-neutral-700">{score}%</span>
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Weighted Mean</span>
                  </>
                )}
              </div>
            </div>

            {/* Pillar Legend cards list */}
            <div className="flex-1 space-y-2.5 w-full sm:w-auto">
              <div 
                className={`p-3 rounded-xl border transition-all ${hoveredDonutPillar === 'E' ? 'bg-emerald-50/50 border-emerald-200' : 'bg-neutral-50/20 border-neutral-100'}`}
                onMouseEnter={() => setHoveredDonutPillar('E')}
                onMouseLeave={() => setHoveredDonutPillar(null)}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-neutral-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    Environmental
                  </span>
                  <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">{envScore}%</span>
                </div>
                <div className="flex justify-between text-[10px] font-semibold text-neutral-400 mt-1">
                  <span>Carbon & Resource targets</span>
                  <span>Weight: {Math.round(esgSummary.weights.environmental * 100)}%</span>
                </div>
              </div>

              <div 
                className={`p-3 rounded-xl border transition-all ${hoveredDonutPillar === 'S' ? 'bg-indigo-50/50 border-indigo-200' : 'bg-neutral-50/20 border-neutral-100'}`}
                onMouseEnter={() => setHoveredDonutPillar('S')}
                onMouseLeave={() => setHoveredDonutPillar(null)}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-neutral-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                    Social
                  </span>
                  <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">{socScore}%</span>
                </div>
                <div className="flex justify-between text-[10px] font-semibold text-neutral-400 mt-1">
                  <span>CSR, Diversity & Training</span>
                  <span>Weight: {Math.round(esgSummary.weights.social * 100)}%</span>
                </div>
              </div>

              <div 
                className={`p-3 rounded-xl border transition-all ${hoveredDonutPillar === 'G' ? 'bg-amber-50/50 border-amber-200' : 'bg-neutral-50/20 border-neutral-100'}`}
                onMouseEnter={() => setHoveredDonutPillar('G')}
                onMouseLeave={() => setHoveredDonutPillar(null)}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-neutral-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    Governance
                  </span>
                  <span className="font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px]">{govScore}%</span>
                </div>
                <div className="flex justify-between text-[10px] font-semibold text-neutral-400 mt-1">
                  <span>Audits & Policy updates</span>
                  <span>Weight: {Math.round(esgSummary.weights.governance * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Status & Compliance Issues Grouped Bar Chart */}
        <div className="card p-6 flex flex-col justify-between relative">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-800">Governance Compliance Details</h3>
              <p className="text-[11px] text-neutral-400">Total vs Completed audits and open issues status</p>
            </div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Audited Index
            </span>
          </div>

          <div className="relative w-full h-[180px] mt-2">
            <svg className="w-full h-full" viewBox="0 0 450 180" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="35" x2="450" y2="35" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3" />
              <line x1="0" y1="85" x2="450" y2="85" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3" />
              <line x1="0" y1="135" x2="450" y2="135" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3" />
              <line x1="0" y1="160" x2="450" y2="160" stroke="#e5e7eb" strokeWidth="1" />

              {/* Bars rendering */}
              {(() => {
                const maxVal = Math.max(govReport.total_audits_count || 5, govReport.open_compliance_issues_count || 3, 10);
                const getBarHeight = (val: number) => (val / maxVal) * 115;

                const bars = [
                  { label: 'Audits Scheduled', value: govReport.total_audits_count, fill: '#9ca3af', bg: '#f3f4f6' },
                  { label: 'Audits Completed', value: govReport.completed_audits_count, fill: '#10a368', bg: '#dcfcec' },
                  { label: 'Open Issues', value: govReport.open_compliance_issues_count, fill: '#dc2626', bg: '#fef2f2' },
                ];

                return bars.map((b, i) => {
                  const isHovered = hoveredBarIndex === i;
                  const barH = getBarHeight(b.value);
                  const x = 50 + i * 130;
                  const y = 160 - barH;

                  return (
                    <g key={i}>
                      {/* Grayed background hover block */}
                      {isHovered && (
                        <rect x={x - 15} y="10" width="70" height="150" fill="#f9fafb" rx="4" opacity="0.8" />
                      )}
                      {/* Actual value bar */}
                      <rect 
                        x={x} 
                        y={y} 
                        width="40" 
                        height={Math.max(barH, 4)} 
                        fill={b.fill} 
                        rx="4"
                        className="cursor-pointer transition-all duration-150"
                        onMouseEnter={(e) => {
                          setHoveredBarIndex(i);
                          const rect = e.currentTarget.getBoundingClientRect();
                          const containerRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                          if (containerRect && rect) {
                            setTooltipPos({ 
                              x: rect.left - containerRect.left + 20, 
                              y: rect.top - containerRect.top - 50 
                            });
                          }
                        }}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                      />
                    </g>
                  );
                });
              })()}
            </svg>

            {/* Labels Row */}
            <div className="flex justify-around text-[10px] font-bold text-neutral-400 uppercase mt-2 text-center">
              <span className="w-[120px]">Audits Total</span>
              <span className="w-[120px]">Audits Completed</span>
              <span className="w-[120px]">Open Issues</span>
            </div>

            {/* Tooltip Overlay */}
            {hoveredBarIndex !== null && (() => {
              const bars = [
                { label: 'Audits Scheduled', desc: 'Total planned ESG compliance audits', value: govReport.total_audits_count },
                { label: 'Audits Completed', desc: 'Fully verified and logged reports', value: govReport.completed_audits_count },
                { label: 'Open Compliance Issues', desc: 'Active issues awaiting feedback', value: govReport.open_compliance_issues_count },
              ];
              const activeBar = bars[hoveredBarIndex];

              return (
                <div 
                  className="absolute bg-neutral-900 text-white rounded-lg p-2.5 text-[11px] shadow-lg pointer-events-none z-10 space-y-0.5 min-w-[150px]"
                  style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px`, transform: 'translateX(-50%)' }}
                >
                  <div className="font-extrabold text-[10px] text-amber-400 uppercase tracking-wide">
                    {activeBar.label}
                  </div>
                  <div className="text-neutral-300 font-semibold text-[10px]">
                    {activeBar.desc}
                  </div>
                  <div className="pt-1.5 flex justify-between font-bold border-t border-white/10 mt-1">
                    <span>Count:</span>
                    <span className="text-white">{activeBar.value}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ── ROW 3: DEPARTMENT LEADERBOARD & SUSTAINABILITY TARGETS ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Leaderboard widget */}
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-brand-50 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-800">Department Performance Leaderboard</h3>
                <p className="text-[11px] text-neutral-400">Departments ranked by weighted ESG Index rating</p>
              </div>
            </div>
          </div>

          {leaderboard.length === 0 ? (
            <div className="text-center py-10 text-neutral-400 text-xs">
              Configure corporate departments to generate performance rankings.
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((dept, index) => {
                const rankColor = index === 0 ? 'bg-amber-100 border-amber-300 text-amber-700' :
                                  index === 1 ? 'bg-slate-100 border-slate-300 text-slate-700' :
                                  index === 2 ? 'bg-orange-100 border-orange-300 text-orange-700' :
                                  'bg-neutral-50 border-neutral-200 text-neutral-500';

                return (
                  <div key={dept.id} className="flex items-center gap-3.5 p-2 rounded-lg border border-neutral-50 hover:bg-neutral-50 transition-colors">
                    {/* Rank Indicator */}
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs ${rankColor} flex-shrink-0`}>
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-neutral-700 text-xs truncate">{dept.name}</span>
                        <span className="font-black text-brand-700 text-xs">{Math.round(dept.overall_esg_score)} index</span>
                      </div>

                      {/* Performance segments scale */}
                      <div className="flex h-2.5 rounded-full overflow-hidden w-full bg-neutral-100">
                        {/* E-pillar segment */}
                        <div 
                          className="bg-emerald-500 h-full border-r border-white/20 transition-all duration-500" 
                          style={{ width: `${dept.environmental_score * esgSummary.weights.environmental}%` }} 
                        />
                        {/* S-pillar segment */}
                        <div 
                          className="bg-indigo-500 h-full border-r border-white/20 transition-all duration-500" 
                          style={{ width: `${dept.social_score * esgSummary.weights.social}%` }} 
                        />
                        {/* G-pillar segment */}
                        <div 
                          className="bg-amber-500 h-full transition-all duration-500" 
                          style={{ width: `${dept.governance_score * esgSummary.weights.governance}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Active Sustainability Challenges & Targets */}
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-brand-50 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-800">Environmental Goals & KPI Progress</h3>
                <p className="text-[11px] text-neutral-400">Current achievements vs defined organizational goals</p>
              </div>
            </div>
          </div>

          {envReport.goals_progress.length === 0 ? (
            <div className="text-center py-10 text-neutral-400 text-xs">
              No active goals configured. Set targets in Environmental management to see indicators.
            </div>
          ) : (
            <div className="space-y-4">
              {envReport.goals_progress.slice(0, 3).map((goal) => {
                const isCompleted = goal.progress >= 100;
                return (
                  <div key={goal.id} className="p-3 border border-neutral-100 rounded-xl space-y-2 hover:bg-neutral-50/40 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-neutral-700 text-xs flex items-center gap-1.5">
                          {goal.title}
                          {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />}
                        </h4>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isCompleted ? 'bg-brand-50 text-brand-700' : 'bg-indigo-50 text-indigo-700'}`}>
                        {Math.round(goal.progress)}%
                      </span>
                    </div>

                    <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-brand-500' : 'bg-indigo-500'}`} 
                        style={{ width: `${Math.min(goal.progress, 100)}%` }} 
                      />
                    </div>

                    <div className="flex justify-between text-[9px] font-bold text-neutral-400">
                      <span>Telemetry: {goal.current_value.toLocaleString()}</span>
                      <span>Target: {goal.target_value.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
