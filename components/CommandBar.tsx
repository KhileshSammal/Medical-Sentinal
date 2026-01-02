
import React, { useState, useEffect } from 'react';
import { Search, Command, Zap, FileText, Activity, Users, Shield, ShieldCheck, Eye } from 'lucide-react';

interface CommandBarProps {
  onAction: (action: string) => void;
}

const CommandBar: React.FC<CommandBarProps> = ({ onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!isOpen) return null;

  const commands = [
    { id: 'scan', label: 'Shred New Report', icon: Zap, shortcut: 'S' },
    { id: 'vision', label: 'Engage Diagnostic Vision', icon: Eye, shortcut: 'E' },
    { id: 'vault', label: 'Open Medical Vault', icon: FileText, shortcut: 'V' },
    { id: 'insurance', label: 'Insurance Portfolio', icon: ShieldCheck, shortcut: 'I' },
    { id: 'trends', label: 'Analyze Health Trends', icon: Activity, shortcut: 'T' },
    { id: 'family', label: 'Family Oversight', icon: Users, shortcut: 'F' },
    { id: 'privacy', label: 'Privacy Protocol', icon: Shield, shortcut: 'P' },
  ];

  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xl glass rounded-xl shadow-2xl overflow-hidden indigo-glow border-white/20 animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400" />
          <input 
            autoFocus
            className="bg-transparent w-full text-lg outline-none text-white placeholder:text-neutral-500"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded text-xs text-neutral-400 border border-white/10">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
        <div className="p-2 max-h-[300px] overflow-y-auto">
          {filtered.map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => {
                onAction(cmd.id);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition-colors group text-left"
            >
              <div className="flex items-center gap-3">
                <cmd.icon className="w-4 h-4 text-neutral-400 group-hover:text-indigo-400" />
                <span className="text-sm font-medium text-neutral-300">{cmd.label}</span>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">{cmd.shortcut}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-neutral-500 text-sm">No results for "{query}"</div>
          )}
        </div>
        <div className="p-3 bg-white/5 border-t border-white/10 flex justify-between items-center text-[10px] text-neutral-500 font-medium px-4">
          <span>Sovereign ID: ABHA-3401-2291</span>
          <div className="flex gap-4">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandBar;
