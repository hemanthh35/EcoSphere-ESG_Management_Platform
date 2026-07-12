import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Users, ShieldCheck, TrendingUp, Award, Globe } from 'lucide-react';

// ── SVG Illustrations ────────────────────────────────────────────

function HeroIllustration() {
  return (
    <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Background card */}
      <rect x="32" y="40" width="456" height="340" rx="20" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1.5"/>
      {/* Header bar */}
      <rect x="32" y="40" width="456" height="52" rx="20" fill="#f9fafb"/>
      <rect x="32" y="72" width="456" height="20" fill="#f9fafb"/>
      <circle cx="64" cy="66" r="8" fill="#10a368" fillOpacity="0.15"/>
      <circle cx="64" cy="66" r="4" fill="#10a368"/>
      <rect x="84" y="60" width="80" height="12" rx="6" fill="#e5e7eb"/>
      {/* Sidebar */}
      <rect x="32" y="92" width="96" height="288" rx="0" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="0"/>
      <rect x="32" y="92" width="1" height="288" fill="#e5e7eb"/>
      <rect x="48" y="112" width="64" height="8" rx="4" fill="#10a368" fillOpacity="0.8"/>
      <rect x="48" y="132" width="52" height="7" rx="3.5" fill="#d1d5db"/>
      <rect x="48" y="150" width="58" height="7" rx="3.5" fill="#d1d5db"/>
      <rect x="48" y="168" width="46" height="7" rx="3.5" fill="#d1d5db"/>
      <rect x="48" y="186" width="54" height="7" rx="3.5" fill="#d1d5db"/>
      <rect x="48" y="204" width="40" height="7" rx="3.5" fill="#d1d5db"/>
      {/* Stat cards row */}
      <rect x="144" y="108" width="100" height="62" rx="10" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1.2"/>
      <rect x="256" y="108" width="100" height="62" rx="10" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1.2"/>
      <rect x="368" y="108" width="100" height="62" rx="10" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1.2"/>
      {/* Stat card 1 */}
      <rect x="156" y="120" width="28" height="8" rx="4" fill="#d1d5db"/>
      <rect x="156" y="134" width="48" height="14" rx="5" fill="#10a368" fillOpacity="0.15"/>
      <rect x="162" y="138" width="36" height="6" rx="3" fill="#10a368"/>
      <circle cx="232" cy="130" r="10" fill="#10a368" fillOpacity="0.1"/>
      <path d="M228 130 L232 126 L236 130" stroke="#10a368" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Stat card 2 */}
      <rect x="268" y="120" width="28" height="8" rx="4" fill="#d1d5db"/>
      <rect x="268" y="134" width="48" height="14" rx="5" fill="#6366f1" fillOpacity="0.1"/>
      <rect x="274" y="138" width="36" height="6" rx="3" fill="#6366f1"/>
      <circle cx="344" cy="130" r="10" fill="#6366f1" fillOpacity="0.1"/>
      <circle cx="344" cy="130" r="4" fill="#6366f1" fillOpacity="0.5"/>
      {/* Stat card 3 */}
      <rect x="380" y="120" width="28" height="8" rx="4" fill="#d1d5db"/>
      <rect x="380" y="134" width="48" height="14" rx="5" fill="#f59e0b" fillOpacity="0.1"/>
      <rect x="386" y="138" width="36" height="6" rx="3" fill="#f59e0b"/>
      <circle cx="456" cy="130" r="10" fill="#f59e0b" fillOpacity="0.1"/>
      <path d="M452 132 L456 128 L460 132" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Chart area */}
      <rect x="144" y="182" width="216" height="130" rx="10" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1.2"/>
      <rect x="158" y="194" width="60" height="8" rx="4" fill="#111827"/>
      <rect x="158" y="207" width="40" height="6" rx="3" fill="#d1d5db"/>
      {/* Bar chart */}
      <rect x="166" y="248" width="18" height="40" rx="4" fill="#10a368" fillOpacity="0.3"/>
      <rect x="192" y="236" width="18" height="52" rx="4" fill="#10a368" fillOpacity="0.5"/>
      <rect x="218" y="225" width="18" height="63" rx="4" fill="#10a368" fillOpacity="0.7"/>
      <rect x="244" y="218" width="18" height="70" rx="4" fill="#10a368"/>
      <rect x="270" y="231" width="18" height="57" rx="4" fill="#10a368" fillOpacity="0.6"/>
      <rect x="296" y="240" width="18" height="48" rx="4" fill="#10a368" fillOpacity="0.4"/>
      {/* Line chart */}
      <rect x="372" y="182" width="96" height="130" rx="10" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1.2"/>
      <rect x="384" y="194" width="44" height="7" rx="3.5" fill="#111827"/>
      <polyline points="384,260 396,248 408,254 420,238 432,244 444,232 456,240"
        stroke="#10a368" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="384,260 396,248 408,254 420,238 432,244 444,232 456,240"
        stroke="#10a368" strokeWidth="0" fill="url(#greenFade)" fillOpacity="0.15"/>
      <defs>
        <linearGradient id="greenFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10a368" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#10a368" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Bottom table */}
      <rect x="144" y="324" width="324" height="76" rx="10" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1.2"/>
      <rect x="144" y="324" width="324" height="22" rx="10" fill="#f9fafb"/>
      <rect x="144" y="336" width="324" height="10" fill="#f9fafb"/>
      <rect x="160" y="330" width="40" height="6" rx="3" fill="#9ca3af"/>
      <rect x="240" y="330" width="40" height="6" rx="3" fill="#9ca3af"/>
      <rect x="340" y="330" width="40" height="6" rx="3" fill="#9ca3af"/>
      <rect x="160" y="354" width="56" height="7" rx="3.5" fill="#374151"/>
      <rect x="240" y="354" width="36" height="7" rx="3.5" fill="#10a368"/>
      <rect x="340" y="354" width="48" height="7" rx="3.5" fill="#374151"/>
      <rect x="160" y="370" width="48" height="7" rx="3.5" fill="#d1d5db"/>
      <rect x="240" y="370" width="28" height="7" rx="3.5" fill="#f59e0b"/>
      <rect x="340" y="370" width="40" height="7" rx="3.5" fill="#d1d5db"/>
    </svg>
  );
}

function LeafSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="currentColor" fillOpacity="0.1"/>
      <path d="M17 7C15 5 9 5 7 9c-2 4 0 8 4 9 1-2 2-5 6-11z" fill="currentColor" fillOpacity="0.8"/>
      <path d="M11 18c-1-3-1-7 4-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// ── Feature Card Data ─────────────────────────────────────────────

const features = [
  {
    icon: BarChart3,
    color: 'text-brand-600',
    bg: 'bg-brand-50',
    title: 'Real-time Analytics',
    desc: 'Track carbon footprint, diversity metrics, and governance compliance in one unified dashboard with live data.',
  },
  {
    icon: Users,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
    title: 'Organization Hierarchy',
    desc: 'Map your entire enterprise structure and assign ESG goals across global departments seamlessly.',
  },
  {
    icon: ShieldCheck,
    color: 'text-sky-500',
    bg: 'bg-sky-50',
    title: 'Audit-ready Reporting',
    desc: 'Generate automated, compliant reports aligned with global frameworks like GRI, SASB, and TCFD.',
  },
  {
    icon: TrendingUp,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    title: 'Goal Tracking',
    desc: 'Set measurable ESG targets and monitor progress with intelligent alerts and milestone tracking.',
  },
  {
    icon: Award,
    color: 'text-violet-500',
    bg: 'bg-violet-50',
    title: 'Gamification Engine',
    desc: 'Drive sustainable behaviors through challenges, leaderboards, and reward systems for employees.',
  },
  {
    icon: Globe,
    color: 'text-teal-500',
    bg: 'bg-teal-50',
    title: 'Global Compliance',
    desc: 'Stay aligned with international ESG regulations and reporting standards across jurisdictions.',
  },
];

const stats = [
  { value: '2,400+', label: 'Enterprises Onboarded' },
  { value: '98%', label: 'Reporting Accuracy' },
  { value: '40%', label: 'Avg. Carbon Reduction' },
  { value: '150+', label: 'Compliance Frameworks' },
];

// ── Main Component ────────────────────────────────────────────────

export function LandingPage() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white pt-20 pb-16 lg:pt-28 lg:pb-24">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
            opacity: 0.4,
          }}
        />
        {/* Green glow blobs */}
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgb(16 163 104 / 0.08) 0%, transparent 70%)' }} />
        <div className="absolute top-0 right-0 w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgb(99 102 241 / 0.06) 0%, transparent 70%)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-200 bg-brand-50 text-brand-700 text-xs font-semibold tracking-wide uppercase mb-6">
                <LeafSVG className="w-3.5 h-3.5 text-brand-600" />
                Enterprise ESG Management Platform
              </div>

              <h1 className="font-serif text-5xl lg:text-6xl text-neutral-900 leading-[1.1] tracking-tight mb-6">
                Manage your{' '}
                <span style={{ color: '#10a368' }}>Sustainability</span>
                {' '}with Precision
              </h1>

              <p className="text-lg text-neutral-500 leading-relaxed mb-8 max-w-lg">
                EcoSphere is the comprehensive platform for modern enterprises to track, report, and improve their Environmental, Social, and Governance performance.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/register" className="btn btn-primary btn-xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-xl">
                  Sign In
                </Link>
              </div>

              {/* Trust line */}
              <p className="mt-6 text-xs text-neutral-400 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-brand-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 1a9 9 0 100 18A9 9 0 0010 1zm3.857 6.857a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
                </svg>
                No credit card required. Free 30-day trial.
              </p>
            </div>

            {/* Right: Illustration */}
            <div className="animate-fade-in delay-200 hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 60% 40%, rgb(16 163 104 / 0.08) 0%, transparent 65%)' }} />
                <HeroIllustration />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────── */}
      <section className="bg-neutral-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <dt className="text-3xl font-bold text-white mb-1">{s.value}</dt>
                <dd className="text-sm text-neutral-400">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="bg-neutral-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold tracking-widest text-brand-600 uppercase mb-3">Platform Capabilities</p>
            <h2 className="font-serif text-4xl text-neutral-900 mb-4">Everything you need to lead on ESG</h2>
            <p className="text-neutral-500 text-base leading-relaxed">
              Built for enterprise scale, EcoSphere gives your organization the tools to meet global ESG compliance standards and drive meaningful impact.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title}
                  className="bg-white border border-neutral-200 rounded-2xl p-6 hover:border-brand-300 hover:shadow-md transition-all duration-200 group">
                  <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-800 mb-2">{f.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────── */}
      <section className="bg-white border-t border-neutral-200 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200 mb-6">
            <LeafSVG className="w-7 h-7 text-brand-600" />
          </div>
          <h2 className="font-serif text-4xl text-neutral-900 mb-4">Ready to make an impact?</h2>
          <p className="text-neutral-500 text-base mb-8 leading-relaxed">
            Join thousands of forward-thinking enterprises using EcoSphere to build a more sustainable future.
          </p>
          <Link to="/register" className="btn btn-primary btn-xl mx-auto">
            Start Your Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
