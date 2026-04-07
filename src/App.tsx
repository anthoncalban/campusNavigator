/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Info, MapPin, Layers, Users, Package, Armchair, Compass, Sparkles, ChevronRight, Building } from 'lucide-react';
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
  'MPH': 'Main Building',
  'MPH5': 'Main Building',
  'MFIELD': 'Main Building Field',
  'ISFIELD': 'IS Building Field',
  'PSBFIELD': 'Professionals School Building Field',
  'T.B.A.': 'To be announced',
  'TBA': 'To be announced',
  'B': 'Main Building B',
  'SHOP': 'Workshop/Shop Area',
};

// Specific room details and descriptions
const ROOM_DETAILS: Record<string, { name: string; description?: string; floor?: string }> = {
  'M101': { name: 'Computer Laboratory 1' },
  'M102': { name: 'Computer Laboratory 2' },
  'M103': { name: 'AutoCAD Room', description: 'Computer Laboratory' },
  'M104': { name: 'Mac Lab', description: 'Computer Laboratory' },
  'M105': { name: 'Computer Laboratory 5' },
  'M106': { name: 'Computer Laboratory 6' },
  'M107': { name: 'Computer Laboratory 7' },
  'M108': { name: 'Computer Laboratory 8' },
  'M109': { name: 'Computer Laboratory 9' },
  'M110': { name: 'Computer Laboratory 10' },
  'M111': { name: 'Computer Laboratory 11' },
  'M112': { name: 'NEU Bookstore' },
  'M113A': { name: 'Building Administration Office' },
  'M116A': { name: 'Property Office', description: 'Near MField' },
  'M117': { name: 'Biology Laboratory' },
  'M120': { name: 'DISD / New CSD Office', description: 'Digital Infrastructure & Service Department. This is the NEW location.' },
  'M121': { name: 'Old CSD Office', description: 'This is the OLD location. The office has moved to M120.' },
  'M124': { name: 'COA & Dean\'s Office', description: 'College of Engineering and Architecture' },
  'M128': { name: 'Engineering Laboratory Workshop', description: 'Engineering Facility' },
  'M132': { name: 'Surveying Laboratory', description: 'Engineering Facility' },
  'M133': { name: 'Civil Engineering Technology Laboratory', description: 'Engineering Facility' },
  'M134': { name: 'Fluid Mechanics & Hydraulics Laboratory', description: 'Engineering Facility' },
  'M240': { name: 'Nursing Arts Laboratory', floor: '2nd Floor' },
  'M226': { name: 'Short Stay Surgical Unit (SSSU)', floor: '2nd Floor' },
  'M241': { name: 'College of Nursing Faculty Room (CON)', floor: '2nd Floor' },
  'M228': { name: 'Procurement Office', floor: '2nd Floor' },
  'M232': { name: 'Physics Laboratory', floor: '2nd Floor' },
  'M231': { name: 'Auditing Department', floor: '2nd Floor' },
  'M233': { name: 'College Registrar\'s Office', description: 'Center part of Main Building', floor: '2nd Floor' },
  'M235': { name: 'Clinic', floor: '2nd Floor' },
  'M214': { name: 'Guidance and Counseling Center', floor: '2nd Floor' },
  'M216': { name: 'Registrar and Records Management Office', floor: '2nd Floor' },
  'M217': { name: 'Micro Biology Laboratory', floor: '2nd Floor' },
  'M210': { name: 'Industrial/Methods/Ergonomics Engineering Laboratory', floor: '2nd Floor' },
  'M209B': { name: 'National Service Training Program (NSTP Office)', floor: '2nd Floor' },
  'M208': { name: 'Information Office', floor: '2nd Floor' },
  'M207': { name: 'Office of International Students Affairs', floor: '2nd Floor' },
  'M206': { name: 'ECE Laboratory 3', floor: '2nd Floor' },
  'M243': { name: 'MPH/5', floor: '2nd Floor' },
  'M202': { name: 'Accounting Department', floor: '2nd Floor' },
  'M201': { name: 'Finance Department', floor: '2nd Floor' },
  'M308': { name: 'NEU Maintenance', floor: '3rd Floor' },
  'M316': { name: 'University Ministers Office', floor: '3rd Floor' },
  'M317': { name: 'Office of the Vice President for Administration', floor: '3rd Floor' },
  'M322': { name: 'NEU Multimedia Office (Photo Studio)', floor: '3rd Floor' },
  'M324A': { name: 'Psychology Laboratory A', floor: '3rd Floor' },
  'M329': { name: 'Students Consultation and Counseling Room', floor: '3rd Floor' },
  'M330': { name: 'Office of Secretary', floor: '3rd Floor' },
  'M431': { name: 'Astrophysics and Astrostatistics Laboratory', description: 'Telescope Maintenance and Optics Laboratory', floor: '4th Floor' },
  'M430': { name: 'Office of Student Discipline (OSD)', floor: '4th Floor' },
  'M432': { name: 'Chemistry Laboratory / Police Photography Laboratory', floor: '4th Floor' },
  'M427': { name: 'Crime Science Room', floor: '4th Floor' },
  'M422': { name: 'Forensic Ballistics Laboratory', floor: '4th Floor' },
  'M421': { name: 'Lie Detection and Interrogation Room', floor: '4th Floor' },
  'M420': { name: 'Questioned Documents and Dactyloscopy', floor: '4th Floor' },
  'M418': { name: 'College of Criminology', floor: '4th Floor' },
  'M417': { name: 'Criminology Student Society Office', floor: '4th Floor' },
  'M434': { name: 'Office of Student Affairs and Services (OSAS)', floor: '4th Floor' },
  'M415': { name: 'CICS Department', floor: '4th Floor' },
  'M328': { name: 'College of Communication (COC)', description: 'Temporarily located here. NEW location (Old location: nearby M101)', floor: '3rd Floor' },
  'SHOP5': { name: 'Construction Matls. and Testing Laboratory', description: 'Engineering Facility' },
};

// Special named locations
const SPECIAL_LOCATIONS: Record<string, { 
  code: string; 
  building: string; 
  floor: string; 
  name: string; 
  abbreviation: string; 
  description?: string;
  inventory?: string[];
  capacity?: string;
}> = {
  'MESS HALL': { code: 'MESS HALL', building: 'Main Building', floor: 'Ground Floor', name: 'NEU Main Canteen', abbreviation: 'M' },
  'CANTEEN': { code: 'CANTEEN', building: 'Main Building', floor: 'Ground Floor', name: 'NEU Mess Hall', abbreviation: 'M' },
  'ROTC': { code: 'ROTC OFFICE', building: 'Main Building', floor: 'Under Main Stage', name: 'ROTC Office', abbreviation: 'M', description: 'Located under the main building stage' },
  'BOOKSTORE': { code: 'M112', building: 'Main Building', floor: '1st Floor', name: 'NEU Bookstore', abbreviation: 'M' },
  'DISD': { code: 'M120', building: 'Main Building', floor: '1st Floor', name: 'Digital Infrastructure & Service Department', abbreviation: 'M' },
  'CSD': { code: 'M120', building: 'Main Building', floor: '1st Floor', name: 'New CSD Office', abbreviation: 'M', description: 'NEW location at M120' },
  'COA': { code: 'M124', building: 'Main Building', floor: '1st Floor', name: 'College of Engineering and Architecture', abbreviation: 'M' },
  'COC': { code: 'M328', building: 'Main Building', floor: '3rd Floor', name: 'College of Communication', abbreviation: 'M', description: 'NEW temporary location' },
  'BAO': { code: 'M113A', building: 'Main Building', floor: '1st Floor', name: 'Building Administration Office', abbreviation: 'M' },
  'BUILDING AD': { code: 'M113A', building: 'Main Building', floor: '1st Floor', name: 'Building Administration Office', abbreviation: 'M' },
  'ENGINEERING': { code: 'COA', building: 'Main Building', floor: 'Multiple', name: 'Engineering Facilities', abbreviation: 'M', description: 'Search results for Engineering' },
  'ADMISSION OF COLLEGES': { code: 'M228', building: 'Main Building', floor: '2nd Floor', name: 'Admission of Colleges', abbreviation: 'M', description: 'Nearby M228' },
  'ADMISSION SCHOLARSHIPS': { code: 'M233', building: 'Main Building', floor: '2nd Floor', name: 'Admission, Scholarships and Financial Assistance Office', abbreviation: 'M', description: 'Center part of Main Building' },
  'GYM': { code: 'M244', building: 'Main Building', floor: '2nd Floor', name: 'Gym', abbreviation: 'M', description: 'Nearby M244' },
  'SPORTS DEPARTMENT': { code: 'M306', building: 'Main Building', floor: '3rd Floor', name: 'Sports Department', abbreviation: 'M', description: 'Nearby M306' },
  'MULTIMEDIA ROOM B': { code: 'M320', building: 'Main Building', floor: '3rd Floor', name: 'Multimedia Room B / Office', abbreviation: 'M', description: 'In front of M320' },
  'CAS': { code: 'M327', building: 'Main Building', floor: '3rd Floor', name: 'College of Arts and Sciences Office', abbreviation: 'M', description: 'Nearby M327' },
  'PRESIDENT': { code: '3RD FLOOR', building: 'Main Building', floor: '3rd Floor', name: 'Office of the President', abbreviation: 'M' },
  'STUDENT LOUNGE': { code: '4TH FLOOR', building: 'Main Building', floor: '4th Floor', name: 'Student Lounge', abbreviation: 'M', description: 'Center part of Main Building' },
  'NEU BASKETBALL GYM': { code: '4TH FLOOR', building: 'Main Building', floor: '4th Floor', name: 'NEU Basketball Gym', abbreviation: 'M', inventory: ['Court', 'Bench'], capacity: '' },
  'BASKETBALL GYM': { code: '4TH FLOOR', building: 'Main Building', floor: '4th Floor', name: 'NEU Basketball Gym', abbreviation: 'M', inventory: ['Court', 'Bench'], capacity: '' },
  'SECRET GARDEN': { code: 'BESIDE MAIN', building: 'Main Building', floor: 'Ground', name: 'Secret Garden', abbreviation: 'M', description: 'Beside Main Building' },
};

interface ExpandedRoom {
  code: string;
  name: string;
  building: string;
  floor: string;
  room: string;
  abbreviation: string;
  capacity: string;
  inventory: string[];
  chairCount: number | null;
  description?: string;
}

export default function App() {
  const [input, setInput] = useState('');
  const [recent, setRecent] = useState<string[]>(['SOM201', 'B234', 'MPH5', 'T.B.A.', 'M120']);

  const results = useMemo((): ExpandedRoom[] => {
    if (!input.trim()) return [];

    const upperInput = input.trim().toUpperCase();
    const foundResults: ExpandedRoom[] = [];

    // Helper to build a room object
    const buildRoom = (code: string, prefix: string, digits: string, suffix: string, buildingName: string): ExpandedRoom => {
      const fullCode = code;
      const roomDetail = ROOM_DETAILS[fullCode] || ROOM_DETAILS[prefix + digits];
      
      let roomName = roomDetail ? roomDetail.name : `Room ${digits || suffix || code}`;
      let finalBuildingName = buildingName;
      
      // Special handling for trailing 'B' if not already in a 'B' building
      if (suffix === 'B' && prefix !== 'B') {
        finalBuildingName = `${finalBuildingName} (Building B)`;
      } else if (suffix && !roomDetail) {
        finalBuildingName = `${finalBuildingName} (Wing ${suffix})`;
      }

      // Floor logic
      let floor = 'N/A';
      if (roomDetail?.floor) {
        floor = roomDetail.floor;
      } else if (buildingName === 'University Hall') {
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
      let chairCount: number | null = 40 + (Math.floor(Math.random() * 21));

      if (roomDetail?.description) {
        inventory = [roomDetail.description, ...inventory];
      }

      if (buildingName === 'To be announced' || roomName.includes('Office') || roomName.includes('Department')) {
        capacity = '';
        inventory = roomDetail?.description ? [roomDetail.description] : [];
        chairCount = null;
      } else if (buildingName.includes('Field')) {
        capacity = '200+';
        inventory = ['Open Space', 'Goal Posts', 'Bleachers'];
        chairCount = null;
      } else if (buildingName.includes('Hall') || buildingName.includes('Canteen') || buildingName.includes('Mess Hall')) {
        capacity = buildingName === 'University Hall' ? '40-50' : '100-150';
        inventory = buildingName === 'University Hall' 
          ? ['Chairs', 'Whiteboard', 'Projector'] 
          : ['Folding Chairs', 'Sound System', 'Stage'];
        chairCount = null;
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
        code: code,
        name: roomName,
        building: finalBuildingName,
        floor: floor,
        room: digits || 'N/A',
        abbreviation: prefix,
        capacity,
        inventory,
        chairCount,
        description: roomDetail?.description
      };
    };

    // 1. Check special locations (keywords)
    for (const [key, loc] of Object.entries(SPECIAL_LOCATIONS)) {
      if (upperInput.includes(key) || key.includes(upperInput)) {
        foundResults.push({
          code: loc.code,
          name: loc.name,
          building: loc.building,
          floor: loc.floor,
          room: loc.code,
          abbreviation: loc.abbreviation,
          capacity: loc.capacity !== undefined ? loc.capacity : 'N/A',
          inventory: loc.inventory || (loc.description ? [loc.description] : []),
          chairCount: null,
          description: loc.description
        });
      }
    }

    // 2. Check room details (names and descriptions)
    for (const [code, detail] of Object.entries(ROOM_DETAILS)) {
      if (detail.name.toUpperCase().includes(upperInput) || detail.description?.toUpperCase().includes(upperInput)) {
        // Avoid duplicates from special locations
        if (!foundResults.some(r => r.code === code)) {
          const match = code.match(/^([A-Z.-]+)(\d*)([A-Z]*)$/);
          if (match) {
            const [_, prefix, digits, suffix] = match;
            const bName = BUILDING_LEGEND[prefix] || 'Main Building';
            foundResults.push(buildRoom(code, prefix, digits, suffix, bName));
          }
        }
      }
    }

    // 3. Check room code regex
    const match = upperInput.match(/^([A-Z.-]+)(\d*)([A-Z]*)$/);
    if (match) {
      let [_, prefix, digits, suffix] = match;
      let buildingName = BUILDING_LEGEND[prefix + digits] || BUILDING_LEGEND[prefix];
      
      if (buildingName) {
        const code = upperInput;
        if (!foundResults.some(r => r.code === code)) {
          foundResults.push(buildRoom(code, prefix, digits, suffix, buildingName));
        }
      }
    }

    // Deduplicate results by code
    return Array.from(new Map(foundResults.map(item => [item.code, item])).values());
  }, [input]);

  const expanded = results.length === 1 ? results[0] : null;

  return (
    <div className="min-h-screen flex flex-col items-center selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden bg-[#FDF8F1]">
      {/* Playful Background Decoration - Enhanced Vintage */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0],
            x: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#8B5E3C]/5 blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -30, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#D4A373]/5 blur-[100px]" 
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-[#E9D8A6]/5 blur-[120px]" />
      </div>

      <main className="w-full max-w-2xl px-4 py-6 md:px-6 md:py-20">
        {/* Header Section */}
        <header className="mb-6 md:mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            className="inline-flex items-center gap-3 mb-4 md:mb-8 px-4 py-2 md:px-5 md:py-2.5 bg-white/80 rounded-full shadow-xl shadow-amber-900/5 border border-amber-100 backdrop-blur-sm"
          >
            <div className="p-1.5 md:p-2 bg-[#8B5E3C] rounded-full">
              <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
            </div>
            <span className="text-[10px] md:text-sm font-extrabold uppercase tracking-[0.2em] text-[#8B5E3C]">NEU Campus Navigator</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            className="text-4xl md:text-7xl font-black tracking-tight text-[#4A3728] leading-[0.95]"
          >
            Find your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5E3C] via-[#A67C52] to-[#D4A373]">spot.</span>
          </motion.h1>
        </header>

        {/* Search Interface */}
        <section className="relative mb-8 md:mb-12 group">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -inset-2 bg-gradient-to-r from-[#8B5E3C] via-[#D4A373] to-[#E9D8A6] rounded-[32px] md:rounded-[40px] opacity-10 blur-2xl group-focus-within:opacity-20 transition-opacity" 
          />
          <div className="relative">
            <input
              type="text"
              placeholder="Where are we going? (e.g. SOM201, M328, Library)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-20 md:h-24 px-6 md:px-10 bg-white/90 rounded-[28px] md:rounded-[32px] shadow-2xl border-2 border-amber-50 focus:outline-none focus:border-[#8B5E3C] transition-all text-xl md:text-2xl font-bold placeholder:text-amber-200 text-[#4A3728] input-glow backdrop-blur-md"
              autoFocus
            />
            <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 md:w-14 md:h-14 bg-[#8B5E3C] rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-900/20"
              >
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </motion.button>
            </div>
          </div>
        </section>

        {/* Results Area */}
        <div className="min-h-[450px]">
          <AnimatePresence mode="wait">
            {results.length > 0 ? (
              expanded ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-6 gap-5"
                >
                  {/* Main Card */}
                  <div className="md:col-span-4 glass-card rounded-[24px] md:rounded-[40px] p-6 md:p-10 flex flex-col justify-between min-h-[220px] md:min-h-[320px] relative overflow-hidden group border border-amber-100 bg-white/60 backdrop-blur-md">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5E3C]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-[#8B5E3C]/10 transition-colors" />
                    
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-1.5 md:gap-2 mb-2 md:mb-6 px-2.5 py-0.5 md:px-3 md:py-1 bg-amber-50 rounded-full">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#8B5E3C] animate-pulse" />
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#8B5E3C]">Location Found</span>
                      </div>
                      <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-[#4A3728] mb-1 md:mb-4 leading-none">{expanded.code}</h2>
                      <p className="text-lg md:text-2xl text-[#8B5E3C] font-bold tracking-tight leading-tight">{expanded.name}</p>
                      <p className="text-sm md:text-base text-amber-800/60 font-medium uppercase tracking-widest mt-1">{expanded.building}</p>
                      {expanded.description && (
                        <p className="mt-4 text-sm md:text-base text-amber-800/60 font-medium italic">{expanded.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-6 md:mt-10 relative z-10">
                      <div className="px-4 py-2 md:px-6 md:py-3 bg-[#8B5E3C] text-white rounded-lg md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-900/20">
                        {expanded.abbreviation}
                      </div>
                      <div className="h-1.5 flex-1 bg-amber-100/50 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ x: "-100%" }}
                          animate={{ x: "0%" }}
                          className="h-full bg-[#8B5E3C]" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Info Bento Items */}
                  <div className="md:col-span-2 flex flex-col gap-3 md:gap-5">
                    {/* Mobile Compact View */}
                    <div className="flex flex-wrap gap-2 md:hidden">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-amber-100 shadow-sm">
                        <Layers className="w-3.5 h-3.5 text-[#8B5E3C]" />
                        <span className="text-[10px] font-black text-amber-800/60 uppercase tracking-tight">Lvl:</span>
                        <span className="text-xs font-black text-[#4A3728]">{expanded.floor}</span>
                      </div>
                      {expanded.capacity && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-amber-200/20 shadow-sm">
                          <Users className="w-3.5 h-3.5 text-[#A67C52]" />
                          <span className="text-[10px] font-black text-amber-800/60 uppercase tracking-tight">Cap:</span>
                          <span className="text-xs font-black text-[#4A3728]">{expanded.capacity}</span>
                        </div>
                      )}
                    </div>

                    {/* Desktop Bento View */}
                    <div className="hidden md:flex md:flex-col gap-5">
                      <motion.div 
                        whileHover={{ y: -5 }}
                        className="glass-card rounded-[40px] p-8 flex flex-col justify-between bg-gradient-to-br from-white to-amber-50/30 border border-amber-100"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-amber-100/50 flex items-center justify-center">
                          <Layers className="w-6 h-6 text-[#8B5E3C]" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-amber-800/40 mb-1">Level</p>
                          <p className="text-3xl font-black text-[#4A3728]">{expanded.floor}</p>
                        </div>
                      </motion.div>
                      {expanded.capacity && (
                        <motion.div 
                          whileHover={{ y: -5 }}
                          className="glass-card rounded-[40px] p-8 flex flex-col justify-between bg-gradient-to-br from-white to-amber-100/10 border border-amber-100"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-amber-100/50 flex items-center justify-center">
                            <Users className="w-6 h-6 text-[#A67C52]" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-800/40 mb-1">Capacity</p>
                            <p className="text-3xl font-black text-[#4A3728]">{expanded.capacity} pax</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Chairs & Inventory */}
                  <div className="md:col-span-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {expanded.chairCount !== null && (
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className="glass-card rounded-[40px] p-8 flex items-center gap-6 bg-gradient-to-r from-white to-amber-50/20 border border-amber-100"
                        >
                          <div className="w-16 h-16 rounded-3xl bg-amber-100/50 flex items-center justify-center">
                            <Armchair className="w-8 h-8 text-[#8B5E3C]" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-800/40 mb-1">Seating</p>
                            <p className="text-3xl font-black text-[#4A3728]">{expanded.chairCount} Chairs</p>
                          </div>
                        </motion.div>
                      )}
                      
                      {expanded.inventory.length > 0 && (
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className="glass-card rounded-[40px] p-8 flex flex-col gap-6 bg-gradient-to-r from-white to-amber-50/20 border border-amber-100"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-100/50 flex items-center justify-center">
                              <Package className="w-6 h-6 text-[#A67C52]" />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#4A3728]">Inventory</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {expanded.inventory.map((item, idx) => (
                              <span 
                                key={idx}
                                className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-amber-800/70 shadow-sm border border-amber-50"
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
                  <div className="md:col-span-6 bg-[#4A3728] rounded-[24px] md:rounded-[40px] p-6 md:p-10 flex flex-col gap-4 md:gap-6 text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B5E3C]/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px] group-hover:bg-[#8B5E3C]/30 transition-colors" />
                    
                    <div className="relative z-10 flex items-center gap-4 md:gap-6">
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-2xl bg-white/10 flex items-center justify-center">
                        <Info className="w-5 h-5 md:w-6 md:h-6 text-amber-200" />
                      </div>
                      <div>
                        <p className="text-[10px] text-amber-200/40 font-black uppercase tracking-widest mb-0.5 md:mb-1">Quick Legend</p>
                        <p className="text-sm md:text-xl font-bold">
                          <span className="text-amber-200 font-black">{expanded.abbreviation}</span> is {expanded.building}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 gap-4"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-6 bg-[#8B5E3C] rounded-full" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-amber-800/40">Found {results.length} results</h3>
                  </div>
                  {results.map((res) => (
                    <motion.button
                      key={res.code}
                      whileHover={{ x: 10 }}
                      onClick={() => setInput(res.code)}
                      className="w-full p-6 bg-white/80 rounded-[24px] border border-amber-50 shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between group backdrop-blur-sm"
                    >
                      <div>
                        <p className="text-2xl font-black text-[#4A3728] group-hover:text-[#8B5E3C] transition-colors">{res.code}</p>
                        <p className="text-sm font-bold text-[#8B5E3C]">{res.name}</p>
                        <p className="text-xs font-bold text-amber-800/60 uppercase tracking-widest">{res.building}</p>
                        {res.description && (
                          <p className="text-xs text-amber-800/40 italic mt-1">{res.description}</p>
                        )}
                      </div>
                      <div className="px-4 py-2 bg-amber-50/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#8B5E3C] group-hover:bg-[#8B5E3C] group-hover:text-white transition-colors">
                        {res.floor}
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )
            ) : input.trim() ? (
              <motion.div
                key="not-found"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-24 h-24 bg-amber-50 rounded-[40px] flex items-center justify-center mb-8 rotate-12">
                  <Search className="w-10 h-10 text-amber-200" />
                </div>
                <h3 className="text-3xl font-black text-[#4A3728] mb-4">Oops! No spot found.</h3>
                <p className="text-amber-800/60 max-w-xs text-lg font-medium">We couldn't find that room code. Double check the building abbreviation!</p>
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
                    <div className="w-1.5 h-5 md:w-2 md:h-6 bg-[#8B5E3C] rounded-full" />
                    <h3 className="text-[10px] md:text-sm font-black uppercase tracking-widest text-amber-800/40">Popular Spots</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
                    {recent.map((code) => (
                      <motion.button
                        key={code}
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setInput(code)}
                        className="group p-6 md:p-8 bg-white/80 rounded-[32px] md:rounded-[40px] border-2 border-transparent shadow-xl hover:shadow-2xl hover:border-amber-100 transition-all text-left relative overflow-hidden backdrop-blur-sm"
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-amber-100 transition-colors" />
                        <p className="text-2xl md:text-3xl font-black text-[#4A3728] group-hover:text-[#8B5E3C] transition-colors mb-1 md:mb-2 relative z-10">{code}</p>
                        <p className="text-[10px] text-amber-800/40 font-bold uppercase tracking-widest relative z-10">Jump →</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Visual Legend */}
                <div>
                  <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <div className="w-1.5 h-5 md:w-2 md:h-6 bg-[#A67C52] rounded-full" />
                    <h3 className="text-[10px] md:text-sm font-black uppercase tracking-widest text-amber-800/40">Building Directory</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
                    {Object.entries(BUILDING_LEGEND)
                      .filter(([abbr]) => ['M', 'PSB', 'SOM', 'IS'].includes(abbr))
                      .map(([abbr, name]) => (
                        <motion.div 
                          key={abbr} 
                          whileHover={{ scale: 1.05 }}
                          className="p-4 md:p-6 bg-white/60 rounded-2xl md:rounded-3xl border border-amber-50 hover:bg-white hover:shadow-lg transition-all backdrop-blur-sm"
                        >
                          <p className="text-base md:text-lg font-black text-[#4A3728] mb-0.5 md:mb-1">{abbr}</p>
                          <p className="text-[9px] md:text-[10px] text-amber-800/40 font-black uppercase truncate tracking-tighter">{name}</p>
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
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 rounded-full shadow-sm border border-amber-100 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-[#8B5E3C] animate-pulse" />
          <p className="text-[10px] font-black text-amber-800/40 uppercase tracking-[0.3em]">
            NEU Campus Navigator
          </p>
        </div>
      </footer>
    </div>
  );
}