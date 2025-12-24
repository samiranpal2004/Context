
import React from 'react';
import { ExternalLink, Star, MoreVertical, Calendar, Tag } from 'lucide-react';
import { Memory } from '../../types';
import { INTENT_THEMES } from '../../constants';

interface MemoryCardProps {
  memory: Memory;
  onEdit?: (m: Memory) => void;
  onDelete?: (id: string) => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onEdit, onDelete }) => {
  const theme = INTENT_THEMES[memory.intent];
  const date = new Date(memory.capturedAt).toLocaleDateString();

  return (
    <div className="group bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 relative">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 overflow-hidden">
          {memory.favicon ? (
            <img src={memory.favicon} alt="" className="w-5 h-5 rounded flex-shrink-0" />
          ) : (
            <div className="w-5 h-5 bg-slate-100 rounded flex-shrink-0" />
          )}
          <h3 className="font-display font-bold text-lg text-slate-900 truncate pr-2 leading-tight group-hover:text-blue-600 transition-colors">
            {memory.title}
          </h3>
        </div>
        <button className="p-1.5 text-slate-300 hover:text-slate-500 transition-colors rounded-lg hover:bg-slate-50">
          <MoreVertical size={18} />
        </button>
      </div>

      <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-6 leading-relaxed h-10">
        {memory.summary}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${theme.color}`}>
          {theme.icon}
          {theme.label}
        </span>
        {memory.tags.slice(0, 2).map(tag => (
          <span key={tag} className="px-2.5 py-1 bg-slate-50 text-slate-500 border border-slate-100 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Tag size={10} />
            {tag}
          </span>
        ))}
        {memory.tags.length > 2 && (
          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest self-center ml-1">+{memory.tags.length - 2}</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-slate-100">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-amber-500">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-bold leading-none">{memory.importance}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <Calendar size={14} />
            <span className="text-[11px] leading-none uppercase tracking-wide">{date}</span>
          </div>
        </div>
        <a 
          href={memory.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2.5 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
        >
          <ExternalLink size={16} />
        </a>
      </div>
      
      {memory.similarity !== undefined && (
        <div className="absolute -top-2.5 -right-2.5 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-full font-display font-bold shadow-xl border border-slate-800 tracking-wider uppercase">
          {Math.round(memory.similarity * 100)}% Match
        </div>
      )}
    </div>
  );
};

export default MemoryCard;
