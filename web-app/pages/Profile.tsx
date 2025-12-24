
import React, { useState, useEffect, useRef } from 'react';
import { User, Key, Settings, Copy, RefreshCcw, Check, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RevealOnScroll: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const current = domRef.current;
    if (current) observer.observe(current);
    return () => { if (current) observer.unobserve(current); };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ${isVisible ? 'reveal-visible' : 'reveal-hidden'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'api' | 'preferences'>('api');

  const copyKey = () => {
    navigator.clipboard.writeText(user?.apiKey || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'api', label: 'API & Integration', icon: <Key size={18} /> },
    { id: 'preferences', label: 'Preferences', icon: <Settings size={18} /> },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in">
      <header className="animate-slide-up">
        <h1 className="text-display-xl text-4xl mb-1 text-slate-900">Settings</h1>
        <p className="text-slate-500 font-medium">Manage your digital sovereignty and workspace configuration.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Navigation */}
        <nav className="w-full md:w-64 flex flex-col gap-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
                  : 'text-slate-500 hover:bg-white hover:text-blue-600 border border-transparent hover:border-slate-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content Card */}
        <div className="flex-grow animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div key={activeTab} className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm animate-fade-in">
            {activeTab === 'api' && (
              <div className="space-y-10">
                <RevealOnScroll>
                  <h2 className="text-display-xl text-2xl text-slate-900 mb-3">Browser Integration</h2>
                  <p className="text-slate-500 font-medium mb-8">Connect your second brain to your browsing experience. This key grants full access to your memory vault.</p>
                  
                  <div className="relative group">
                    <div className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] font-mono text-sm group-hover:bg-white group-hover:border-blue-200 transition-all">
                      <div className="flex-grow truncate text-slate-700 font-bold tracking-tight">{user?.apiKey}</div>
                      <button 
                        onClick={copyKey}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-all flex items-center gap-2 shadow-sm"
                      >
                        {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                        <span className="text-[10px] uppercase font-bold tracking-widest leading-none">{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={100}>
                  <div className="pt-10 border-t border-slate-100">
                    <div className="flex items-start gap-6 p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100 relative overflow-hidden group">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                        <Download size={24} />
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-display-xl text-xl text-slate-900 mb-2">Download Extension</h3>
                        <p className="text-slate-600 font-medium text-sm mb-6 leading-relaxed">The ultimate companion. Capture research, summarize articles, and chat with pages instantly as you browse.</p>
                        <button className="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                          Get Context for Chrome
                        </button>
                      </div>
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-30 blur-2xl"></div>
                    </div>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={200}>
                  <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                    <button className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-red-500 transition-colors">
                      <RefreshCcw size={14} />
                      Regenerate Access Key
                    </button>
                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest italic">Last updated 12 days ago</p>
                  </div>
                </RevealOnScroll>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-10">
                <RevealOnScroll>
                  <div className="flex items-center gap-8 mb-10">
                    <div className="w-24 h-24 bg-blue-50 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-blue-600 text-3xl font-display font-bold relative group">
                      {user?.name.charAt(0)}
                      <div className="absolute inset-0 bg-blue-600/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div>
                      <h3 className="text-display-xl text-xl text-slate-900 mb-2">Personal Identity</h3>
                      <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm">
                        Update Avatar
                      </button>
                    </div>
                  </div>
                </RevealOnScroll>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <RevealOnScroll delay={100}>
                    <label className="text-label-caps ml-1 mb-2 block">Full Legal Name</label>
                    <input 
                      type="text" 
                      defaultValue={user?.name} 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-medium transition-all" 
                    />
                  </RevealOnScroll>
                  <RevealOnScroll delay={200}>
                    <label className="text-label-caps ml-1 mb-2 block">Verified Email</label>
                    <input 
                      type="email" 
                      disabled 
                      defaultValue={user?.email} 
                      className="w-full px-6 py-4 bg-slate-100 border border-slate-100 rounded-2xl text-slate-400 cursor-not-allowed font-medium" 
                    />
                  </RevealOnScroll>
                </div>
                
                <RevealOnScroll delay={300}>
                  <div className="pt-6">
                    <button className="px-10 py-4 premium-gradient text-white rounded-2xl font-bold shadow-xl shadow-blue-100 hover:scale-[1.02] transition-all">
                      Save Profile Changes
                    </button>
                  </div>
                </RevealOnScroll>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-4">
                 {[
                   { id: 'detect', label: 'Auto-detect Sessions', desc: 'Automatically cluster memories by topical relevance and task sessions.', delay: 0 },
                   { id: 'suggest', label: 'Proactive Intelligence', desc: 'Context AI will resurface relevant memories dynamically as you browse new content.', delay: 100 },
                   { id: 'summarize', label: 'High-Density Summaries', desc: 'Generate multi-level summaries for long-form content using Gemini Flash.', delay: 200 }
                 ].map(opt => (
                   <RevealOnScroll key={opt.id} delay={opt.delay}>
                     <div className="flex items-center justify-between p-6 hover:bg-slate-50/50 border border-transparent hover:border-slate-100 rounded-3xl transition-all group">
                        <div className="max-w-md">
                          <h4 className="text-display-xl text-lg text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{opt.label}</h4>
                          <p className="text-slate-500 font-medium text-sm leading-relaxed">{opt.desc}</p>
                        </div>
                        <div className="w-14 h-7 bg-blue-600 rounded-full relative cursor-pointer shadow-inner">
                          <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-lg"></div>
                        </div>
                     </div>
                   </RevealOnScroll>
                 ))}
                 
                 <RevealOnScroll delay={400}>
                    <div className="mt-10 p-8 border border-dashed border-slate-200 rounded-[2rem] text-center">
                        <p className="text-slate-400 font-medium text-sm mb-4">Want more control? Check out our advanced API documentation.</p>
                        <button className="text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline">View Dev Docs</button>
                    </div>
                 </RevealOnScroll>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
