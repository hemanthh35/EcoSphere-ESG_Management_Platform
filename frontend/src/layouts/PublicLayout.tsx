import { Outlet, Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-600">
                  EcoSphere
                </span>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
              >
                Sign in
              </Link>
              <Link 
                to="/register" 
                className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      
      <footer className="border-t border-gray-100 py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} EcoSphere. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
