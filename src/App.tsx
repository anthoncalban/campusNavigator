/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Info, MapPin, Layers, Hash, BookOpen, Users, Package, Armchair } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Building mapping
const BUILDING_LEGEND: Record<string, string> = {
  'M': 'Main Building',
  'U': 'University Hall',
  'UH': 'University Hall',
  'UHALL': 'University Hall',
  'U-HALL': 'University Hall',
  'SOM': 'School of Management',
  'PSB': 'Professionals School Building',
  'IS': 'Integrated School',
  'MPH': 'Multi-Purpose Hall',
  'MPH5': 'Multi-Purpose Hall',
  'MFIELD': 'Main Building Field',
  'ISFIELD': 'IS Building Field',
  'PSBFIELD': 'Professionals School Building Field',
  'T.B.A.': 'To be announced',
  'TBA': 'To be announced',
  'B': 'Main Building B',
};

interface ExpandedRoom {
  code: string;
  building: string;
  floor: string;
  room: string;
  abbreviation: string;
  capacity: string;
  inventory: string[];
  chairCount: number | null;
}

export default function App() {
  const [input, setInput] = useState('');
  const [recent, setRecent] = useState<string[]>(['SOM201', 'B234', 'MPH5', 'T.B.A.']);

  const expanded = useMemo((): ExpandedRoom | null => {
    if (!input.trim()) return null;

    const upperInput = input.trim().toUpperCase();
    
    // Regex to split: Prefix (Letters/Dots/Hyphens) + Room Number (Digits) + optional Suffix (Letters)
    const match = upperInput.match(/^([A-Z.-]+)(\d*)([A-Z]*)$/);
    
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

    // Floor logic
    let floor = 'N/A';
    if (buildingName === 'University Hall') {
      floor = '5th Floor';
    } else if (digits) {
      const floorDigit = digits.charAt(0);
      let floorSuffix = 'th';
      if (floorDigit === '1') floorSuffix = 'st';
      else if (floorDigit === '2') floorSuffix = 'nd';
      else if (floorDigit === '3') floorSuffix = 'rd';
      floor = `${floorDigit}${floorSuffix} Floor`;
    }

    // Capacity and Inventory logic
    let capacity = '30-40';
    let inventory = ['Chairs', 'Whiteboard', 'Projector'];
    let chairCount: number | null = 40 + (Math.floor(Math.random() * 21)); // Default 40-60

    if (buildingName === 'To be announced') {
      capacity = '';
      inventory = [];
      chairCount = null;
    } else if (buildingName.includes('Field')) {
      capacity = '200+';
      inventory = ['Open Space', 'Goal Posts', 'Bleachers'];
      chairCount = null;
    } else if (buildingName.includes('Hall')) {
      // Covers both University Hall and Multi-Purpose Hall
      capacity = buildingName === 'University Hall' ? '40-50' : '100-150';
      inventory = buildingName === 'University Hall' 
        ? ['Chairs', 'Whiteboard', 'Projector'] 
        : ['Folding Chairs', 'Sound System', 'Stage'];
      chairCount = null; // User requested no chair count for these
    } else if (digits) {
      const roomNum = parseInt(digits);
      if (!isNaN(roomNum)) {
        const baseCap = 20 + (roomNum % 30);
        capacity = `${baseCap}`;
        inventory = ['Chairs', 'Whiteboard'];
        if (roomNum % 2 === 0) inventory.push('Projector');
        if (roomNum % 5 === 0) inventory.push('Air Conditioning');
        chairCount = 40 + (roomNum % 21);
      }
    }

    return {
      code: upperInput,
      building: buildingName,
      floor: floor,
      room: digits || 'N/A',
      abbreviation: prefix,
      capacity,
      inventory,
      chairCount
    };
  }, [input]);

  return (
    <div className="min-h-screen flex flex-col items-center selection:bg-brand-100 selection:text-brand-700 overflow-x-hidden">
      {/* Playful Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-brand-500/10 blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -45, 0],
            y: [0, 100, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-accent-pink/10 blur-[100px]" 
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-accent-cyan/5 blur-[120px]" />
      </div>

      <main className="w-full max-w-2xl px-4 py-6 md:px-6 md:py-20">
        {/* Header Section */}
        <header className="mb-6 md:mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            className="inline-flex items-center gap-3 mb-4 md:mb-8 px-4 py-2 md:px-5 md:py-2.5 bg-white rounded-full shadow-xl shadow-brand-500/10 border border-brand-100"
          >
            <div className="p-1.5 md:p-2 bg-brand-500 rounded-full">
              <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
            </div>
            <span className="text-[10px] md:text-sm font-extrabold uppercase tracking-[0.2em] text-brand-600">Campus Navigator</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            className="text-4xl md:text-7xl font-black tracking-tight text-slate-900 leading-[0.95]"
          >
            Find your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-brand-600 to-accent-pink">spot.</span>
          </motion.h1>
        </header>

        {/* Search Interface */}
        <section className="relative mb-8 md:mb-12 group">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -inset-2 bg-gradient-to-r from-brand-500 via-accent-pink to-accent-yellow rounded-[32px] md:rounded-[40px] opacity-20 blur-2xl group-focus-within:opacity-40 transition-opacity" 
          />
          <div className="relative">
            <input
              type="text"
              placeholder="Where are we going? (e.g. SOM201)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-20 md:h-24 px-6 md:px-10 bg-white/90 rounded-[28px] md:rounded-[32px] shadow-2xl border-2 border-white focus:outline-none focus:border-brand-500 transition-all text-xl md:text-2xl font-bold placeholder:text-slate-300 text-slate-900 input-glow backdrop-blur-md"
              autoFocus
            />
            <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 md:w-14 md:h-14 bg-brand-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30"
              >
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </motion.button>
            </div>
          </div>
        </section>

        {/* Results Area */}
        <div className="min-h-[450px]">
          <AnimatePresence mode="wait">
            {expanded ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-6 gap-5"
              >
                {/* Main Card */}
                <div className="md:col-span-4 glass-card rounded-[24px] md:rounded-[40px] p-6 md:p-10 flex flex-col justify-between min-h-[220px] md:min-h-[320px] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-brand-500/10 transition-colors" />
                  
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-1.5 md:gap-2 mb-2 md:mb-6 px-2.5 py-0.5 md:px-3 md:py-1 bg-brand-50 rounded-full">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-brand-500 animate-pulse" />
                      <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-brand-600">Location Found</span>
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 mb-1 md:mb-4 leading-none">{expanded.code}</h2>
                    <p className="text-lg md:text-2xl text-slate-500 font-bold tracking-tight leading-tight">{expanded.building}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-6 md:mt-10 relative z-10">
                    <div className="px-4 py-2 md:px-6 md:py-3 bg-brand-500 text-white rounded-lg md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-500/20">
                      {expanded.abbreviation}
                    </div>
                    <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        className="h-full bg-brand-500" 
                      />
                    </div>
                  </div>
                </div>

                {/* Info Bento Items & Chairs & Inventory - Redesigned for Mobile */}
                <div className="md:col-span-2 flex flex-col gap-3 md:gap-5">
                  {/* Mobile Compact View */}
                  <div className="flex flex-wrap gap-2 md:hidden">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-brand-100 shadow-sm">
                      <Layers className="w-3.5 h-3.5 text-brand-600" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Lvl:</span>
                      <span className="text-xs font-black text-slate-800">{expanded.floor}</span>
                    </div>
                    {expanded.capacity && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-accent-pink/20 shadow-sm">
                        <Users className="w-3.5 h-3.5 text-accent-pink" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Cap:</span>
                        <span className="text-xs font-black text-slate-800">{expanded.capacity}</span>
                      </div>
                    )}
                    {expanded.chairCount !== null && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-accent-yellow/20 shadow-sm">
                        <Armchair className="w-3.5 h-3.5 text-accent-yellow" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Chairs:</span>
                        <span className="text-xs font-black text-slate-800">{expanded.chairCount}</span>
                      </div>
                    )}
                  </div>

                  {/* Desktop Bento View */}
                  <div className="hidden md:flex md:flex-col gap-5">
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="glass-card rounded-[40px] p-8 flex flex-col justify-between bg-gradient-to-br from-white to-brand-50/30"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center">
                        <Layers className="w-6 h-6 text-brand-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Level</p>
                        <p className="text-3xl font-black text-slate-800">{expanded.floor}</p>
                      </div>
                    </motion.div>
                    {expanded.capacity && (
                      <motion.div 
                        whileHover={{ y: -5 }}
                        className="glass-card rounded-[40px] p-8 flex flex-col justify-between bg-gradient-to-br from-white to-accent-pink/5"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-accent-pink/10 flex items-center justify-center">
                          <Users className="w-6 h-6 text-accent-pink" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Capacity</p>
                          <p className="text-3xl font-black text-slate-800">{expanded.capacity} pax</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Chairs & Inventory - Desktop View & Mobile Inventory */}
                <div className="md:col-span-6">
                  {/* Mobile Inventory Only */}
                  <div className="md:hidden mb-4">
                    {expanded.inventory.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {expanded.inventory.map((item, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-slate-100/50 backdrop-blur-sm rounded-full text-[9px] font-bold text-slate-500 border border-slate-200/50"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Desktop Grid View */}
                  <div className="hidden md:grid md:grid-cols-2 gap-5">
                    {expanded.chairCount !== null && (
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="glass-card rounded-[40px] p-8 flex items-center gap-6 bg-gradient-to-r from-white to-accent-yellow/5"
                      >
                        <div className="w-16 h-16 rounded-3xl bg-accent-yellow/10 flex items-center justify-center">
                          <Armchair className="w-8 h-8 text-accent-yellow" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Seating</p>
                          <p className="text-3xl font-black text-slate-800">{expanded.chairCount} Chairs</p>
                        </div>
                      </motion.div>
                    )}
                    
                    {expanded.inventory.length > 0 && (
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="glass-card rounded-[40px] p-8 flex flex-col gap-6 bg-gradient-to-r from-white to-accent-cyan/5"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 flex items-center justify-center">
                            <Package className="w-6 h-6 text-accent-cyan" />
                          </div>
                          <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Inventory</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {expanded.inventory.map((item, idx) => (
                            <span 
                              key={idx}
                              className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-slate-600 shadow-sm border border-slate-100"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Legend Tip */}
                <div className="md:col-span-6 bg-slate-900 rounded-[24px] md:rounded-[40px] p-6 md:p-10 flex flex-col gap-4 md:gap-6 text-white overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px] group-hover:bg-brand-500/30 transition-colors" />
                  
                  <div className="relative z-10 flex items-center gap-4 md:gap-6">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-2xl bg-white/10 flex items-center justify-center">
                      <Info className="w-5 h-5 md:w-6 md:h-6 text-brand-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5 md:mb-1">Quick Legend</p>
                      <p className="text-sm md:text-xl font-bold">
                        <span className="text-brand-400 font-black">{expanded.abbreviation}</span> is {expanded.building}
                      </p>
                    </div>
                  </div>
                  
                  {expanded.abbreviation === 'B' && (
                    <div className="relative z-10 p-5 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        <span className="font-black text-brand-400 uppercase tracking-tighter mr-2">Note:</span> 
                        Codes starting with "B" (like {expanded.code}) refer to the <span className="text-white font-bold underline decoration-brand-400 underline-offset-4">Main Building B</span>.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : input.trim() ? (
              <motion.div
                key="not-found"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-24 h-24 bg-slate-100 rounded-[40px] flex items-center justify-center mb-8 rotate-12">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-4">Oops! No spot found.</h3>
                <p className="text-slate-500 max-w-xs text-lg font-medium">We couldn't find that room code. Double check the building abbreviation!</p>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-16"
              >
                {/* Quick Access */}
                <div>
                  <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <div className="w-1.5 h-5 md:w-2 md:h-6 bg-brand-500 rounded-full" />
                    <h3 className="text-[10px] md:text-sm font-black uppercase tracking-widest text-slate-400">Popular Spots</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
                    {recent.map((code) => (
                      <motion.button
                        key={code}
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setInput(code)}
                        className="group p-6 md:p-8 bg-white rounded-[32px] md:rounded-[40px] border-2 border-transparent shadow-xl hover:shadow-2xl hover:border-brand-100 transition-all text-left relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-brand-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-brand-100 transition-colors" />
                        <p className="text-2xl md:text-3xl font-black text-slate-800 group-hover:text-brand-600 transition-colors mb-1 md:mb-2 relative z-10">{code}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest relative z-10">Jump →</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Visual Legend */}
                <div>
                  <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <div className="w-1.5 h-5 md:w-2 md:h-6 bg-accent-pink rounded-full" />
                    <h3 className="text-[10px] md:text-sm font-black uppercase tracking-widest text-slate-400">Building Directory</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
                    {Object.entries(BUILDING_LEGEND)
                      .filter(([abbr]) => ['M', 'PSB', 'SOM', 'IS'].includes(abbr))
                      .map(([abbr, name]) => (
                        <motion.div 
                          key={abbr} 
                          whileHover={{ scale: 1.05 }}
                          className="p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all"
                        >
                          <p className="text-base md:text-lg font-black text-slate-800 mb-0.5 md:mb-1">{abbr}</p>
                          <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase truncate tracking-tighter">{name}</p>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-16 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm border border-slate-100">
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            Campus Navigator
          </p>
        </div>
      </footer>
    </div>
  );
}
