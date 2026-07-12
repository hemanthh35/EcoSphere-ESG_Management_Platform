import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Users, ShieldCheck, Leaf } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="w-full relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-primary/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8 animate-fade-in">
            <Leaf className="w-4 h-4" />
            <span>Enterprise ESG Management Platform</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
            Manage your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">Sustainability</span> <br className="hidden lg:block" />
            with Precision
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-10">
            EcoSphere is the comprehensive platform for modern enterprises to track, report, and improve their Environmental, Social, and Governance (ESG) performance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-primary rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl active:scale-95 group w-full sm:w-auto"
            >
              Get Started for Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all shadow-sm w-full sm:w-auto"
            >
              Sign In
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-400/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
      </section>

      {/* Features Section */}
      <section className="w-full py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to succeed</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built for enterprise scale, EcoSphere gives your organization the tools required to meet global ESG compliance standards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary/30 transition-colors group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Analytics</h3>
              <p className="text-gray-600">Track carbon footprint, diversity metrics, and governance compliance in one unified dashboard.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary/30 transition-colors group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Organization Hierarchy</h3>
              <p className="text-gray-600">Map your entire enterprise structure and assign ESG goals across global departments seamlessly.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary/30 transition-colors group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Audit-ready Reporting</h3>
              <p className="text-gray-600">Generate automated, compliant reports aligned with global frameworks like GRI and SASB.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
