'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Layers,
  Plus,
  Minus,
  Navigation,
  Compass,
  CheckCircle2,
  Sparkles,
  Building2,
  TreePine,
  ExternalLink
} from 'lucide-react';
import { GreenDestination } from '@/data/types';
import { mapLocationTranslations } from '@/data/translations';

interface EcoMapProps {
  selectedLocation: string;
  onSelectLocation: (location: string) => void;
  currentLang?: 'vi' | 'en';
  destinations?: GreenDestination[];
}

interface MapNode {
  id: string;
  name: string;
  nameEn: string;
  region: string;
  regionEn: string;
  x: number; // ViewBox percentage
  y: number; // ViewBox percentage
  count: number;
  highlightText: string;
  highlightTextEn: string;
  icon: string;
  zoomScale: number;
  panX: number; // in pixels
  panY: number; // in pixels
}

const MAP_NODES: MapNode[] = [
  {
    id: 'cuc-phuong',
    name: 'Cúc Phương',
    nameEn: 'Cuc Phuong',
    region: 'Ninh Bình',
    regionEn: 'Ninh Binh',
    x: 46,
    y: 22,
    count: 3,
    highlightText: 'Vườn Quốc Gia Cúc Phương • Rừng nguyên sinh',
    highlightTextEn: 'Cuc Phuong National Park • Ancient Forest',
    icon: '🌲',
    zoomScale: 1.85,
    panX: 40,
    panY: 80,
  },
  {
    id: 'ninh-binh',
    name: 'Ninh Bình',
    nameEn: 'Ninh Binh',
    region: 'Đồng bằng Bắc Bộ',
    regionEn: 'Northern Delta',
    x: 49,
    y: 26,
    count: 2,
    highlightText: 'Đầm Vân Long • Emeralda Eco Resort',
    highlightTextEn: 'Van Long Wetland • Emeralda Eco Resort',
    icon: '🪷',
    zoomScale: 1.85,
    panX: 20,
    panY: 65,
  },
  {
    id: 'hoi-an',
    name: 'Hội An',
    nameEn: 'Hoi An',
    region: 'Quảng Nam',
    regionEn: 'Quang Nam',
    x: 63,
    y: 47,
    count: 5,
    highlightText: 'Phố cổ di sản • Silk Sense • Rừng dừa Bảy Mẫu',
    highlightTextEn: 'Heritage Ancient Town • Silk Sense • Bay Mau Coconut',
    icon: '🏮',
    zoomScale: 2.1,
    panX: -45,
    panY: -10,
  },
  {
    id: 'da-lat',
    name: 'Đà Lạt',
    nameEn: 'Da Lat',
    region: 'Lâm Đồng',
    regionEn: 'Lam Dong',
    x: 68,
    y: 71,
    count: 4,
    highlightText: 'Hồ Tuyền Lâm • Terracotta • Cầu Đất Farm',
    highlightTextEn: 'Tuyen Lam Lake • Terracotta • Cau Dat Farm',
    icon: '🌸',
    zoomScale: 2.05,
    panX: -65,
    panY: -95,
  },
  {
    id: 'nam-cat-tien',
    name: 'Nam Cát Tiên',
    nameEn: 'Nam Cat Tien',
    region: 'Đồng Nai',
    regionEn: 'Dong Nai',
    x: 59,
    y: 80,
    count: 2,
    highlightText: 'VQG Nam Cát Tiên • Jungle Lodge & Thú đêm',
    highlightTextEn: 'Cat Tien NP • Jungle Lodge & Night Safari',
    icon: '🦜',
    zoomScale: 2.1,
    panX: -30,
    panY: -130,
  },
  {
    id: 'phu-quoc',
    name: 'Phú Quốc',
    nameEn: 'Phu Quoc',
    region: 'Kiên Giang',
    regionEn: 'Kien Giang',
    x: 37,
    y: 91,
    count: 2,
    highlightText: 'Khu bảo tồn biển sinh thái • Đảo Ngọc',
    highlightTextEn: 'Marine Protected Area • Pearl Island',
    icon: '🏝️',
    zoomScale: 2.15,
    panX: 55,
    panY: -170,
  },
];

export const EcoMap: React.FC<EcoMapProps> = ({
  selectedLocation,
  onSelectLocation,
  currentLang = 'vi',
  destinations = [],
}) => {
  const isEn = currentLang === 'en';
  const [mapMode, setMapMode] = useState<'terrain' | 'satellite'>('terrain');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [customPan, setCustomPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Find active node based on selectedLocation
  const activeNode = MAP_NODES.find((node) => {
    if (selectedLocation === 'all') return false;
    const q = selectedLocation.toLowerCase();
    return (
      node.name.toLowerCase().includes(q) ||
      node.nameEn.toLowerCase().includes(q) ||
      q.includes(node.name.toLowerCase()) ||
      q.includes(node.nameEn.toLowerCase())
    );
  });

  // Calculate transform when activeNode changes
  useEffect(() => {
    if (selectedLocation === 'all' || !activeNode) {
      setZoomLevel(1);
      setCustomPan({ x: 0, y: 0 });
    } else {
      setZoomLevel(activeNode.zoomScale);
      setCustomPan({ x: activeNode.panX, y: activeNode.panY });
    }
  }, [selectedLocation, activeNode]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.35, 2.8));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.35, 1));
    if (zoomLevel <= 1.35) {
      onSelectLocation('all');
    }
  };

  const handleReset = () => {
    onSelectLocation('all');
    setZoomLevel(1);
    setCustomPan({ x: 0, y: 0 });
  };

  return (
    <div className="rounded-3xl bg-white p-3.5 shadow-sm border border-emerald-950/5 relative text-left">
      {/* Map Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-[#1E4D3E]">
            <MapPin size={14} />
          </div>
          <h3 className="text-xs font-bold text-slate-800">
            {isEn ? 'Vietnam Green Destinations Map' : 'Bản đồ Điểm đến Xanh Việt Nam'}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200/60">
            {isEn ? 'Region:' : 'Khu vực:'}{' '}
            {selectedLocation === 'all'
              ? isEn
                ? 'National'
                : 'Toàn quốc'
              : isEn
              ? mapLocationTranslations[selectedLocation] || selectedLocation
              : selectedLocation}
          </span>
        </div>
      </div>

      {/* Realistic Map Canvas Container */}
      <div className="relative h-60 w-full overflow-hidden rounded-2xl border border-slate-200 shadow-inner select-none bg-slate-900">
        {/* Layer Toggle Button (Top Right) */}
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1">
          <button
            onClick={() => setMapMode(mapMode === 'terrain' ? 'satellite' : 'terrain')}
            className="flex items-center gap-1.5 rounded-xl bg-white/95 px-2.5 py-1 text-[10px] font-bold text-slate-800 shadow-md backdrop-blur-md hover:bg-white transition-all border border-slate-200/80 active:scale-95"
            title={isEn ? 'Switch Map Style' : 'Đổi chế độ bản đồ'}
          >
            <Layers size={12} className="text-emerald-700" />
            <span>{mapMode === 'terrain' ? (isEn ? '🛰️ Satellite' : '🛰️ Vệ tinh') : (isEn ? '🗺️ Terrain' : '🗺️ Địa hình')}</span>
          </button>
        </div>

        {/* Floating Zoom & Navigation Controls (Bottom Right) */}
        <div className="absolute bottom-2.5 right-2.5 z-20 flex flex-col gap-1.5">
          <div className="flex flex-col rounded-xl bg-white/95 shadow-md border border-slate-200/80 overflow-hidden backdrop-blur-md">
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-700 hover:bg-slate-100 transition-colors border-b border-slate-100 active:bg-slate-200"
              title={isEn ? 'Zoom In' : 'Phóng to'}
            >
              <Plus size={14} />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-700 hover:bg-slate-100 transition-colors active:bg-slate-200"
              title={isEn ? 'Zoom Out' : 'Thu nhỏ'}
            >
              <Minus size={14} />
            </button>
          </div>

          <button
            onClick={handleReset}
            className={`rounded-xl p-2 shadow-md transition-all border ${
              selectedLocation === 'all'
                ? 'bg-[#1E4D3E] text-white border-transparent'
                : 'bg-white/95 text-slate-700 hover:bg-white border-slate-200/80'
            }`}
            title={isEn ? 'Reset to National View' : 'Toàn cảnh Việt Nam'}
          >
            <Navigation size={13} className={selectedLocation === 'all' ? 'rotate-45' : ''} />
          </button>
        </div>

        {/* Map Canvas with Camera Transform (Fly-To Animation) */}
        <div
          className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out origin-center"
          style={{
            transform: `scale(${zoomLevel}) translate(${customPan.x}px, ${customPan.y}px)`,
          }}
        >
          {/* REALISTIC GEOGRAPHICAL MAP SVG */}
          <svg
            viewBox="0 0 400 450"
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Ocean Gradient - Terrain Mode */}
              <linearGradient id="oceanTerrain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#CBE5F7" />
                <stop offset="50%" stopColor="#B3DAF5" />
                <stop offset="100%" stopColor="#9BCDF0" />
              </linearGradient>

              {/* Ocean Gradient - Satellite Mode */}
              <linearGradient id="oceanSatellite" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0B1C2A" />
                <stop offset="50%" stopColor="#07131D" />
                <stop offset="100%" stopColor="#040C13" />
              </linearGradient>

              {/* Vietnam Land Gradient - Terrain Mode (Natural topography) */}
              <linearGradient id="vietnamTerrain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E2F0D9" />
                <stop offset="30%" stopColor="#C8E6C9" />
                <stop offset="65%" stopColor="#A5D6A7" />
                <stop offset="100%" stopColor="#C8E6C9" />
              </linearGradient>

              {/* Vietnam Land Gradient - Satellite Mode (Deep rainforest & bio-reserve) */}
              <linearGradient id="vietnamSatellite" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1B4D3E" />
                <stop offset="35%" stopColor="#0F382A" />
                <stop offset="70%" stopColor="#144333" />
                <stop offset="100%" stopColor="#0E3326" />
              </linearGradient>

              {/* Mountain/Relief Texture Pattern */}
              <pattern id="contourPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 0 10 Q 5 5 10 10 T 20 10" fill="none" stroke="#2E7D32" strokeWidth="0.4" opacity="0.25" />
                <path d="M 0 16 Q 5 12 10 16 T 20 16" fill="none" stroke="#2E7D32" strokeWidth="0.3" opacity="0.18" />
              </pattern>
            </defs>

            {/* 1. Sea & Ocean Background */}
            <rect
              width="400"
              height="450"
              fill={mapMode === 'terrain' ? 'url(#oceanTerrain)' : 'url(#oceanSatellite)'}
            />

            {/* Ocean Waves / Depth Shading */}
            <path
              d="M 120 0 Q 150 120 220 210 T 280 340 T 220 450 L 400 450 L 400 0 Z"
              fill={mapMode === 'terrain' ? '#92C6EE' : '#05111B'}
              opacity={mapMode === 'terrain' ? 0.35 : 0.6}
            />

            {/* 2. Neighboring Countries (Laos, Cambodia, China) for authentic geographic context */}
            {/* China (North) */}
            <path
              d="M 0 0 L 400 0 L 400 45 L 310 40 L 260 55 L 210 50 L 160 58 L 100 48 L 50 60 L 0 65 Z"
              fill={mapMode === 'terrain' ? '#EAE6DC' : '#15241F'}
              stroke={mapMode === 'terrain' ? '#D5CFBE' : '#1A332B'}
              strokeWidth="0.8"
              opacity="0.85"
            />
            {/* Laos & Cambodia (West of Vietnam) */}
            <path
              d="M 0 65 L 50 60 L 100 48 L 155 70 L 175 110 L 195 155 L 230 190 L 220 230 L 210 270 L 200 320 L 190 350 L 170 380 L 130 400 L 0 400 Z"
              fill={mapMode === 'terrain' ? '#EBE7DD' : '#13211B'}
              stroke={mapMode === 'terrain' ? '#D6D0C0' : '#182C24'}
              strokeWidth="0.8"
              opacity="0.85"
            />
            {/* Hainan Island (East) */}
            <path
              d="M 330 70 Q 370 75 365 110 Q 345 130 315 115 Q 310 85 330 70 Z"
              fill={mapMode === 'terrain' ? '#E5E0D5' : '#182A23'}
              stroke={mapMode === 'terrain' ? '#D0CABE' : '#22382F'}
              strokeWidth="0.8"
            />

            {/* 3. Authentic Vietnam S-Curve Landmass (Accurate Coastlines & Deltas) */}
            <path
              d="M 155 70 
                 Q 185 65 220 72 
                 Q 245 80 235 95 
                 Q 215 105 200 120 
                 Q 190 140 215 170 
                 Q 235 195 260 215 
                 Q 275 235 285 270 
                 Q 295 310 280 340 
                 Q 265 365 240 385 
                 Q 215 405 185 410 
                 Q 155 415 150 400 
                 Q 160 385 190 375 
                 Q 215 360 210 330 
                 Q 220 285 225 245 
                 Q 225 210 195 175 
                 Q 175 145 160 110 
                 Z"
              fill={mapMode === 'terrain' ? 'url(#vietnamTerrain)' : 'url(#vietnamSatellite)'}
              stroke={mapMode === 'terrain' ? '#2E7D32' : '#34D399'}
              strokeWidth="1.2"
              className="drop-shadow-sm"
            />

            {/* Topographic Contour overlay */}
            <rect
              x="150"
              y="60"
              width="150"
              height="350"
              fill="url(#contourPattern)"
              clipPath="url(#vietnamClip)"
              className="pointer-events-none"
            />

            {/* Red River & Mekong Delta Rivers */}
            <path
              d="M 175 80 Q 195 95 210 100"
              fill="none"
              stroke={mapMode === 'terrain' ? '#7FB3D5' : '#1E4D3E'}
              strokeWidth="1"
              opacity="0.8"
            />
            <path
              d="M 185 380 Q 210 390 235 395"
              fill="none"
              stroke={mapMode === 'terrain' ? '#7FB3D5' : '#1E4D3E'}
              strokeWidth="1.2"
              opacity="0.8"
            />

            {/* Offshore Islands (Phú Quốc, Côn Đảo, Hoàng Sa, Trường Sa) */}
            {/* Phú Quốc Island */}
            <path
              d="M 142 400 Q 152 398 150 412 Q 140 415 142 400 Z"
              fill={mapMode === 'terrain' ? '#A5D6A7' : '#144333'}
              stroke={mapMode === 'terrain' ? '#2E7D32' : '#34D399'}
              strokeWidth="0.8"
            />
            {/* Côn Đảo */}
            <circle cx="230" cy="425" r="2.5" fill={mapMode === 'terrain' ? '#A5D6A7' : '#34D399'} />
            {/* Hoàng Sa & Trường Sa Reefs indicator */}
            <circle cx="340" cy="200" r="2" fill={mapMode === 'terrain' ? '#81C784' : '#10B981'} opacity="0.7" />
            <circle cx="355" cy="210" r="1.5" fill={mapMode === 'terrain' ? '#81C784' : '#10B981'} opacity="0.7" />
            <circle cx="330" cy="310" r="2" fill={mapMode === 'terrain' ? '#81C784' : '#10B981'} opacity="0.7" />
            <circle cx="345" cy="325" r="1.5" fill={mapMode === 'terrain' ? '#81C784' : '#10B981'} opacity="0.7" />

            {/* Official Geographic Typography (Google Maps style) */}
            <text x="290" y="160" fill={mapMode === 'terrain' ? '#1E3A5F' : '#60A5FA'} fontSize="9" fontWeight="700" letterSpacing="2" opacity="0.7">
              {isEn ? 'EAST SEA' : 'BIỂN ĐÔNG'}
            </text>
            <text x="215" y="85" fill={mapMode === 'terrain' ? '#0F5132' : '#A7F3D0'} fontSize="7" fontWeight="bold">
              Hà Nội
            </text>
            <text x="220" y="380" fill={mapMode === 'terrain' ? '#0F5132' : '#A7F3D0'} fontSize="7" fontWeight="bold">
              TP. Hồ Chí Minh
            </text>
            <text x="325" y="100" fill={mapMode === 'terrain' ? '#6C757D' : '#94A3B8'} fontSize="6" opacity="0.7">
              {isEn ? 'Hainan (China)' : 'Hải Nam'}
            </text>
            <text x="75" y="140" fill={mapMode === 'terrain' ? '#6C757D' : '#94A3B8'} fontSize="7" opacity="0.6">
              {isEn ? 'Laos' : 'Lào'}
            </text>
            <text x="100" y="310" fill={mapMode === 'terrain' ? '#6C757D' : '#94A3B8'} fontSize="7" opacity="0.6">
              {isEn ? 'Cambodia' : 'Campuchia'}
            </text>
          </svg>

          {/* REALISTIC GOOGLE MAPS STYLE PINS (HTML OVERLAY) */}
          {MAP_NODES.map((node) => {
            const isSelected = activeNode?.id === node.id;
            const displayName = isEn ? node.nameEn : node.name;

            return (
              <div
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLocation(node.name);
                }}
                className="absolute -translate-x-1/2 -translate-y-full cursor-pointer z-10 transition-transform hover:scale-115 active:scale-95"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                }}
              >
                {/* Active Pulse Radar Wave */}
                {isSelected && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-amber-400 opacity-40 animate-ping pointer-events-none" />
                )}

                {/* Professional Google Maps Teardrop Pin */}
                <div className="relative flex flex-col items-center">
                  <div
                    className={`relative flex items-center gap-1 rounded-full px-2 py-0.8 shadow-lg transition-all border ${
                      isSelected
                        ? 'bg-[#1E4D3E] text-white ring-2 ring-amber-300 border-amber-300 scale-110'
                        : 'bg-white/95 text-slate-800 hover:bg-emerald-50 border-slate-200'
                    }`}
                  >
                    <span className="text-[11px]">{node.icon}</span>
                    <span className="text-[10px] font-extrabold tracking-tight whitespace-nowrap">
                      {displayName}
                    </span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isSelected ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'
                      }`}
                    />
                  </div>

                  {/* Marker Pin Point Arrow */}
                  <div
                    className={`h-2 w-2 -mt-1 rotate-45 border-r border-b ${
                      isSelected
                        ? 'bg-[#1E4D3E] border-amber-300'
                        : 'bg-white/95 border-slate-200'
                    }`}
                  />
                  <div className="h-1 w-3 rounded-full bg-black/30 blur-[1px] mt-0.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* ACTIVE LOCATION SPOTLIGHT CALLOUT (Floating bottom card matching mockup!) */}
        {activeNode && (
          <div className="absolute bottom-2 left-2 right-12 z-20 rounded-2xl bg-white/95 p-2.5 shadow-lg backdrop-blur-md border border-emerald-950/10 animate-fadeIn text-left flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 text-sm shadow-xs">
                {activeNode.icon}
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-black text-slate-900 leading-tight line-clamp-1">
                    {isEn ? activeNode.nameEn : activeNode.name}
                  </h4>
                  <span className="rounded-md bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800 shrink-0">
                    {activeNode.count} {isEn ? 'venues' : 'đối tác'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {isEn ? activeNode.highlightTextEn : activeNode.highlightText}
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectLocation(activeNode.name)}
              className="shrink-0 rounded-xl bg-[#1E4D3E] px-2.5 py-1.5 text-[10px] font-bold text-white shadow hover:bg-[#16392E] active:scale-95 transition-all"
            >
              {isEn ? 'Explore' : 'Khám phá'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
