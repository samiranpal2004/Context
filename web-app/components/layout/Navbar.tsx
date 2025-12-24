
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Search, MessageSquare, LayoutDashboard, Database, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/memories', label: 'Memories', icon: <Database size={20} /> },
    { path: '/chat', label: 'Chat', icon: <MessageSquare size={20} /> },
    { path: '/search', label: 'Search', icon: <Search size={20} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="p-2 premium-gradient rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Brain className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold gradient-text tracking-tight">Context</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200">
                <User size={18} />
              </div>
              <span className="hidden sm:inline text-sm font-semibold text-slate-700">{user?.name}</span>
            </Link>
            <button 
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
