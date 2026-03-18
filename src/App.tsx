/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Info, MapPin, Layers, Hash, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Building mapping
const BUILDING_LEGEND: Record<string, string> = {
  'M': 'Main Building',
  'SOM': 'School of Management',
  'PSB': 'Professional Schools Building',
  'IS': 'IS',
  'MPH': 'Multi-Purpose Hall',
  'MPH5': 'Multi-Purpose Hall',
  'MFIELD': 'Main Building Field',
  'ISFIELD': 'IS Building Field',
  'PSBFIELD': 'Professionals School Building Field',
  'T.B.A.': 'To be announced',
  'B': 'Main Building B',
};

interface ExpandedRoom {
  code: string;
  building: string;
  floor: string;
  room: string;
  abbreviation: string;
}

export default function App() {
  const [input, setInput] = useState('');
  const [recent, setRecent] = useState<string[]>(['SOM201', 'B234', 'MPH5', 'T.B.A.']);

  const expanded = useMemo((): ExpandedRoom | null => {
    if (!input.trim()) return null;

    const upperInput = input.trim().toUpperCase();
    
    // Regex to split: Prefix (Letters/Dots) + Room Number (Digits) + optional Suffix (Letters)
    const match = upperInput.match(/^([A-Z.]+)(\d*)([A-Z]*)$/);
    
    if (!match) return null;

    let [_, prefix, digits, suffix] = match;
    
    // Check if the combination of prefix + digits exists in the legend (e.g., MPH5)
    let buildingName = BUILDING_LEGEND[prefix + digits];
    if (buildingName) {
      prefix = prefix + digits;
      digits = '';
    } else {
      buildingName = BUILDING_LEGEND[prefix];
    }

    if (!buildingName) return null;

    // Special handling for trailing 'B' if not already in a 'B' building
    if (suffix === 'B' && prefix !== 'B') {
      buildingName = `${buildingName} (Building B)`;
    } else if (suffix) {
      buildingName = `${buildingName} (Wing ${suffix})`;
    }

    // Floor logic (only if digits exist)
    let floor = 'N/A';
    if (digits) {
      const floorDigit = digits.charAt(0);
      let floorSuffix = 'th';
      if (floorDigit === '1') floorSuffix = 'st';
      else if (floorDigit === '2') floorSuffix = 'nd';
      else if (floorDigit === '3') floorSuffix = 'rd';
      floor = `${floorDigit}${floorSuffix} Floor`;
    }

    return {
      code: upperInput,
      building: buildingName,
      floor: floor,
      room: digits || 'N/A',
      abbreviation: prefix
    };
  }, [input]);

  return (
    <div className="min-h-screen flex flex-col items-center selection:bg-brand-100 selection:text-brand-700">
      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-brand-500/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      <main className="w-full max-w-2xl px-6 py-16 md:py-24">
        {/* Header Section */}
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="p-2.5 bg-brand-600 rounded-xl shadow-lg shadow-brand-600/20">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Room Navigator</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]"
          >
            Find your <span className="text-brand-600">way</span> <br />
            around campus.
          </motion.h1>
        </header>

        {/* Search Interface */}
        <section className="relative mb-12 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-emerald-600 rounded-[28px] opacity-0 group-focus-within:opacity-10 transition-opacity blur-xl" />
          <div className="relative">
            <input
              type="text"
              placeholder="Enter room code (e.g. SOM201)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-20 px-8 bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-200 focus:outline-none focus:border-brand-500 transition-all text-xl font-medium placeholder:text-slate-300 input-glow"
              autoFocus
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <kbd className="hidden sm:inline-flex h-7 items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 font-mono text-[10px] font-medium text-slate-400">
                <span className="text-xs">⌘</span>K
              </kbd>
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                <Search className="w-5 h-5" />
              </div>
            </div>
          </div>
        </section>

        {/* Results Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {expanded ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-6 gap-4"
              >
                {/* Main Card */}
                <div className="md:col-span-4 glass-card rounded-[32px] p-8 flex flex-col justify-between min-h-[280px]">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600">Location Identified</span>
                    </div>
                    <h2 className="text-7xl font-bold tracking-tighter text-slate-900 mb-2">{expanded.code}</h2>
                    <p className="text-lg text-slate-500 font-medium">{expanded.building}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-8">
                    <div className="px-4 py-2 bg-slate-100 rounded-full text-xs font-bold text-slate-600 uppercase tracking-wider">
                      {expanded.abbreviation}
                    </div>
                    <div className="h-px flex-1 bg-slate-100" />
                  </div>
                </div>

                {/* Info Bento Items */}
                <div className="md:col-span-2 flex flex-col gap-4">
                  <div className="flex-1 glass-card rounded-[32px] p-6 flex flex-col justify-between">
                    <Layers className="w-6 h-6 text-brand-600" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Level</p>
                      <p className="text-2xl font-bold text-slate-800">{expanded.floor}</p>
                    </div>
                  </div>
                  <div className="flex-1 glass-card rounded-[32px] p-6 flex flex-col justify-between">
                    <Hash className="w-6 h-6 text-brand-600" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Room</p>
                      <p className="text-2xl font-bold text-slate-800">{expanded.room}</p>
                    </div>
                  </div>
                </div>

                {/* Legend Tip */}
                <div className="md:col-span-6 bg-slate-900 rounded-[24px] p-6 flex flex-col gap-4 text-white overflow-hidden relative">
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Info className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Quick Legend</p>
                      <p className="text-sm font-medium">
                        <span className="text-brand-400 font-bold">{expanded.abbreviation}</span> stands for {expanded.building}
                      </p>
                    </div>
                  </div>
                  
                  {expanded.abbreviation === 'B' && (
                    <div className="relative z-10 p-3 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-xs text-slate-300">
                        <span className="font-bold text-brand-400">Note:</span> Codes starting with "B" (like {expanded.code}) refer to the <span className="text-white">Main Building B</span>.
                      </p>
                    </div>
                  )}
                  
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-500/20 rounded-full blur-2xl" />
                </div>
              </motion.div>
            ) : input.trim() ? (
              <motion.div
                key="not-found"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Code not recognized</h3>
                <p className="text-slate-500 max-w-xs">We couldn't find that room code. Please check the building abbreviation and try again.</p>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                {/* Quick Access */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-1 h-4 bg-brand-500 rounded-full" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Popular Searches</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {recent.map((code) => (
                      <button
                        key={code}
                        onClick={() => setInput(code)}
                        className="group p-6 bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-200 transition-all text-left"
                      >
                        <p className="text-2xl font-bold text-slate-800 group-hover:text-brand-600 transition-colors mb-1">{code}</p>
                        <p className="text-xs text-slate-400 font-medium">Click to expand</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visual Legend */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-1 h-4 bg-brand-500 rounded-full" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Building Directory</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Object.entries(BUILDING_LEGEND).map(([abbr, name]) => (
                      <div key={abbr} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-sm font-bold text-slate-800">{abbr}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase truncate">{name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-12 text-center">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-[0.2em]">
          Built for Freshmen • Room Navigation System
        </p>
      </footer>
    </div>
  );
}
