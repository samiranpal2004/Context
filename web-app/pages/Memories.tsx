
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Grid, List as ListIcon, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { apiService } from '../services/apiService';
import { Memory, Intent } from '../types';
import MemoryCard from '../components/memory/MemoryCard';

const Memories: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [activeIntent, setActiveIntent] = useState<Intent | 'all'>('all');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiService.getMemories();
        setMemories(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return memories.filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) || 
                            m.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchesIntent = activeIntent === 'all' || m.intent === activeIntent;
      return matchesSearch && matchesIntent;
    });
  }, [memories, search, activeIntent]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Knowledge Vault</h1>
          <p className="text-slate-500 font-medium">Browse and manage your digital memories.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Grid size={20} />
          </button>
          <button 
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <ListIcon size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Filter size={18} className="text-indigo-600" />
              <h3 className="font-bold text-slate-900">Filters</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Intent</label>
                <div className="flex flex-col gap-1">
                  {['all', ...Object.values(Intent)].map((i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIntent(i as any)}
                      className={`text-left px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                        activeIntent === i ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Importance</label>
                <input type="range" min="1" max="5" className="w-full accent-indigo-600" />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                  <span>1</span>
                  <span>5</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by title, tag, or content..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
            />
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">Loading memories...</div>
          ) : filtered.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No memories found</h3>
              <p className="text-slate-500">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className={view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
              {filtered.map(m => (
                <MemoryCard key={m.id} memory={m} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Memories;
