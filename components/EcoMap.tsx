'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  UtensilsCrossed,
  Bike,
  TreePine,
  ExternalLink,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { GreenDestination } from '@/data/types';
import { mapLocationTranslations } from '@/data/translations';
import 'leaflet/dist/leaflet.css';

interface EcoMapProps {
  selectedLocation: string;
  onSelectLocation: (location: string) => void;
  currentLang?: 'vi' | 'en';
  destinations?: GreenDestination[];
  onSelectVenue?: (destination: GreenDestination) => void;
}

interface RegionTarget {
  id: string;
  name: string;
  nameEn: string;
  lat: number;
  lng: number;
  zoom: number;
  icon: string;
}

const REGION_TARGETS: RegionTarget[] = [
  {
    id: 'all',
    name: 'Toàn quốc',
    nameEn: 'National',
    lat: 16.0544,
    lng: 107.5847,
    zoom: 6,
    icon: '🌐',
  },
  {
    id: 'hoi-an',
    name: 'Hội An',
    nameEn: 'Hoi An',
    lat: 15.888,
    lng: 108.342,
    zoom: 14,
    icon: '🏮',
  },
  {
    id: 'da-lat',
    name: 'Đà Lạt',
    nameEn: 'Da Lat',
    lat: 11.892,
    lng: 108.44,
    zoom: 13,
    icon: '🌸',
  },
  {
    id: 'cuc-phuong',
    name: 'Cúc Phương',
    nameEn: 'Cuc Phuong',
    lat: 20.3167,
    lng: 105.6069,
    zoom: 13,
    icon: '🌲',
  },
  {
    id: 'ninh-binh',
    name: 'Ninh Bình',
    nameEn: 'Ninh Binh',
    lat: 20.354,
    lng: 105.864,
    zoom: 13,
    icon: '🪷',
  },
  {
    id: 'nam-cat-tien',
    name: 'Nam Cát Tiên',
    nameEn: 'Nam Cat Tien',
    lat: 11.423,
    lng: 107.431,
    zoom: 13,
    icon: '🦜',
  },
  {
    id: 'sa-pa',
    name: 'Sa Pa',
    nameEn: 'Sa Pa',
    lat: 22.253,
    lng: 103.905,
    zoom: 13,
    icon: '⛰️',
  },
];

export const EcoMap: React.FC<EcoMapProps> = ({
  selectedLocation,
  onSelectLocation,
  currentLang = 'vi',
  destinations = [],
  onSelectVenue,
}) => {
  const isEn = currentLang === 'en';
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const labelLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [mapMode, setMapMode] = useState<'street' | 'satellite'>('street');
  const [activeVenue, setActiveVenue] = useState<GreenDestination | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize Leaflet Map (Client Side only to prevent SSR issues)
  useEffect(() => {
    let isMounted = true;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return; // already initialized

      try {
        const leafletModule = await import('leaflet');
        const L = leafletModule.default || leafletModule;

        if (!isMounted || !mapContainerRef.current) return;

        // Determine initial center based on selectedLocation
        const q = selectedLocation.toLowerCase().trim();
        const initialRegion = REGION_TARGETS.find(
          (r) =>
            r.id === q ||
            r.name.toLowerCase().includes(q) ||
            r.nameEn.toLowerCase().includes(q)
        );

        // Create Leaflet Map Instance
        const map = L.map(mapContainerRef.current, {
          center: initialRegion ? [initialRegion.lat, initialRegion.lng] : [15.888, 108.342],
          zoom: initialRegion ? initialRegion.zoom : 14,
          zoomControl: false,
          attributionControl: false,
        });

        // Official OpenStreetMap Street Tile Layer (100% Free, No API Key, Full Vietnamese Street & River Detail)
        const streetTiles = L.tileLayer(
          'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 19,
          }
        );

        streetTiles.addTo(map);
        tileLayerRef.current = streetTiles;

        // Group layer for markers
        const markersGroup = L.layerGroup().addTo(map);
        markersLayerRef.current = markersGroup;
        mapInstanceRef.current = map;

        // Ensure tiles render cleanly across full container dimensions
        resizeTimer = setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 250);

        setIsMapReady(true);
      } catch (err) {
        console.warn('Leaflet map initialization error:', err);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (resizeTimer) clearTimeout(resizeTimer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // ignore cleanup error
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Toggle Map Tiles: Street (OpenStreetMap - No API Key) vs Satellite (Esri World Imagery + Labels)
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    import('leaflet').then((leafletModule) => {
      const L = leafletModule.default || leafletModule;
      const map = mapInstanceRef.current;
      if (!map) return;

      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
        tileLayerRef.current = null;
      }
      if (labelLayerRef.current) {
        map.removeLayer(labelLayerRef.current);
        labelLayerRef.current = null;
      }

      if (mapMode === 'satellite') {
        const satLayer = L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          {
            maxZoom: 19,
          }
        );
        const labelsOverlay = L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
          {
            maxZoom: 19,
          }
        );
        satLayer.addTo(map);
        labelsOverlay.addTo(map);
        tileLayerRef.current = satLayer;
        labelLayerRef.current = labelsOverlay;
      } else {
        const osmLayer = L.tileLayer(
          'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 19,
          }
        );
        osmLayer.addTo(map);
        tileLayerRef.current = osmLayer;
      }
    });
  }, [mapMode, isMapReady]);

  // Update Markers when destinations or language change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !isMapReady) return;

    import('leaflet').then((leafletModule) => {
      const L = leafletModule.default || leafletModule;
      const markersGroup = markersLayerRef.current;
      const map = mapInstanceRef.current;
      if (!markersGroup || !map) return;

      markersGroup.clearLayers();

      destinations.forEach((dest) => {
        if (!dest.lat || !dest.lng) return;

        const isMatchingLocation =
          selectedLocation === 'all' ||
          dest.location.toLowerCase().includes(selectedLocation.toLowerCase());

        // Category Icon & Color
        let categoryColor = '#10B981'; // default emerald
        let iconEmoji = '🌱';
        if (dest.category === 'hotel') {
          categoryColor = '#E11D48'; // Rose pink like Google Maps Hotel
          iconEmoji = '🏨';
        } else if (dest.category === 'food') {
          categoryColor = '#EA580C'; // Warm Orange
          iconEmoji = '🥗';
        } else if (dest.category === 'transport') {
          categoryColor = '#0284C7'; // Cyan Sky
          iconEmoji = '🚴';
        } else if (dest.category === 'activity') {
          categoryColor = '#16A34A'; // Forest Green
          iconEmoji = '🛶';
        } else if (dest.category === 'shopping') {
          categoryColor = '#9333EA'; // Purple
          iconEmoji = '🛍️';
        }

        const customHtml = `
          <div class="relative flex flex-col items-center cursor-pointer group" style="transform: translate3d(0,0,0);">
            <!-- Points Badge -->
            <div class="mb-1 rounded-full px-2 py-0.5 text-[10px] font-black text-white shadow-md flex items-center gap-0.5 border border-white/60 transition-transform group-hover:scale-110" style="background-color: ${categoryColor};">
              <span>+${dest.pointsReward}</span>
              <span class="text-[8px] opacity-90">CB</span>
            </div>
            <!-- Google Maps Style Teardrop Pin -->
            <div class="relative flex h-8 w-8 items-center justify-center rounded-full text-white shadow-lg border-2 border-white transition-transform group-hover:scale-110" style="background-color: ${categoryColor};">
              <span class="text-xs leading-none select-none">${iconEmoji}</span>
              ${
                isMatchingLocation
                  ? `<span class="absolute -inset-1 rounded-full border-2 border-amber-300 animate-ping opacity-60"></span>`
                  : ''
              }
            </div>
            <!-- Pin Pointer Triangle -->
            <div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px]" style="border-top-color: ${categoryColor};"></div>
          </div>
        `;

        const markerIcon = L.divIcon({
          className: 'custom-eco-pin',
          html: customHtml,
          iconSize: [64, 56],
          iconAnchor: [32, 54],
          popupAnchor: [0, -54],
        });

        const marker = L.marker([dest.lat, dest.lng], { icon: markerIcon });

        // Popup Content formatted like Google Maps business card
        const popupContent = document.createElement('div');
        popupContent.className = 'eco-leaflet-popup p-1 text-left min-w-[210px] max-w-[240px]';
        popupContent.innerHTML = `
          <div class="rounded-xl overflow-hidden mb-1.5 relative border border-slate-100">
            <img src="${dest.image}" alt="${dest.name}" class="h-20 w-full object-cover" />
            <span class="absolute top-1 right-1 rounded-md bg-emerald-600/90 text-white px-1.5 py-0.5 text-[8px] font-black uppercase shadow-xs">
              ${dest.greenBadge}
            </span>
          </div>
          <h4 class="text-xs font-black text-slate-900 leading-snug line-clamp-2">${dest.name}</h4>
          <p class="text-[10px] text-slate-500 mt-0.5">${dest.address || dest.location}</p>
          <div class="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between">
            <span class="rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-black">
              +${dest.pointsReward} CB
            </span>
            <span class="text-[10px] font-bold text-slate-700">${dest.priceEstimate || ''}</span>
          </div>
        `;

        // Click popup button action
        marker.bindPopup(popupContent, {
          closeButton: true,
          offset: [0, -48],
          className: 'eco-popup-wrapper',
        });

        marker.on('click', () => {
          setActiveVenue(dest);
        });

        marker.addTo(markersGroup);
      });
    });
  }, [destinations, selectedLocation, isMapReady, currentLang]);

  // Smooth FlyTo when selectedLocation changes (Search input or pill click)
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    const map = mapInstanceRef.current;
    const query = selectedLocation.toLowerCase().trim();

    const target = REGION_TARGETS.find(
      (r) =>
        r.id === query ||
        r.name.toLowerCase().includes(query) ||
        r.nameEn.toLowerCase().includes(query)
    );

    if (target) {
      map.flyTo([target.lat, target.lng], target.zoom, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    } else {
      // Find matching destination directly
      const foundDest = destinations.find(
        (d) =>
          d.location.toLowerCase().includes(query) ||
          d.name.toLowerCase().includes(query)
      );
      if (foundDest && foundDest.lat && foundDest.lng) {
        map.flyTo([foundDest.lat, foundDest.lng], 15, {
          duration: 1.2,
          easeLinearity: 0.25,
        });
        setActiveVenue(foundDest);
      }
    }
  }, [selectedLocation, isMapReady, destinations]);

  // Zoom Handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleRecenter = () => {
    onSelectLocation('all');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([16.0544, 107.5847], 6, {
        duration: 1.0,
      });
    }
  };

  return (
    <div className="rounded-3xl bg-white p-3.5 shadow-sm border border-emerald-950/5 text-left">
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-[#1E4D3E]">
            <MapPin size={14} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 leading-tight">
              {isEn ? 'Interactive Vietnam Eco-Map' : 'Bản đồ Điểm đến Xanh Việt Nam'}
            </h3>
            <p className="text-[9px] text-slate-400">
              {isEn ? 'Real street view & green partners' : 'Đường phố thực tế & đối tác chuẩn Xanh'}
            </p>
          </div>
        </div>

        {/* Region Badge & Satellite Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMapMode(mapMode === 'street' ? 'satellite' : 'street')}
            className={`flex items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-bold shadow-xs border transition-colors ${
              mapMode === 'satellite'
                ? 'bg-slate-900 text-amber-300 border-slate-700'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100'
            }`}
            title={isEn ? 'Toggle Satellite view' : 'Bật/Tắt chế độ Vệ tinh'}
          >
            <span>
              {mapMode === 'satellite'
                ? isEn
                  ? '🛰️ Satellite'
                  : '🛰️ Vệ tinh'
                : isEn
                ? '🗺️ Street'
                : '🗺️ Đường phố'}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Real Leaflet Map Viewport */}
      <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-slate-200 shadow-inner bg-slate-100 isolate z-0">
        {/* Leaflet DOM Node */}
        <div ref={mapContainerRef} className="h-full w-full z-10" />

        {/* Floating Controls: Recenter, Zoom +, Zoom - */}
        <div className="absolute top-2.5 right-2.5 z-[500] flex flex-col gap-1.5">
          <button
            onClick={handleRecenter}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/95 text-slate-700 shadow-md border border-slate-200 hover:bg-emerald-50 active:scale-95 transition-all"
            title={isEn ? 'Recenter to Vietnam' : 'Về toàn cảnh Việt Nam'}
          >
            <Navigation size={14} className="text-[#1E4D3E]" />
          </button>

          <button
            onClick={handleZoomIn}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/95 text-slate-700 shadow-md border border-slate-200 hover:bg-emerald-50 active:scale-95 transition-all"
            title={isEn ? 'Zoom in' : 'Phóng to'}
          >
            <Plus size={15} />
          </button>

          <button
            onClick={handleZoomOut}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/95 text-slate-700 shadow-md border border-slate-200 hover:bg-emerald-50 active:scale-95 transition-all"
            title={isEn ? 'Zoom out' : 'Thu nhỏ'}
          >
            <Minus size={15} />
          </button>
        </div>

        {/* Floating Location Spotlight Callout at Bottom-Left */}
        <div className="absolute bottom-2.5 left-2.5 z-[500] pointer-events-auto">
          <div className="rounded-xl bg-white/95 px-2.5 py-1 text-[10px] font-bold text-slate-800 shadow-md border border-slate-200 flex items-center gap-1.5 backdrop-blur-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {isEn ? 'Region: ' : 'Khu vực: '}
              <strong className="text-[#1E4D3E]">
                {selectedLocation === 'all'
                  ? isEn
                    ? 'All Vietnam'
                    : 'Toàn quốc'
                  : isEn
                  ? mapLocationTranslations[selectedLocation] || selectedLocation
                  : selectedLocation}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Quick Region Navigation Chips */}
      <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-left">
        {REGION_TARGETS.map((reg) => {
          const isSelected =
            reg.id === selectedLocation.toLowerCase() ||
            reg.name.toLowerCase() === selectedLocation.toLowerCase() ||
            (reg.id === 'all' && selectedLocation === 'all');

          return (
            <button
              key={reg.id}
              onClick={() => onSelectLocation(reg.id === 'all' ? 'all' : reg.name)}
              className={`flex shrink-0 items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold transition-all ${
                isSelected
                  ? 'bg-[#1E4D3E] text-white shadow-xs scale-102 ring-1 ring-emerald-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200/60'
              }`}
            >
              <span>{reg.icon}</span>
              <span>{isEn ? reg.nameEn : reg.name}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Active Selected Venue Spotlight Drawer */}
      {activeVenue && (
        <div className="mt-2.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/50 p-2.5 border border-emerald-200/80 flex items-center justify-between gap-2.5 animate-fadeIn">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={activeVenue.image}
              alt={activeVenue.name}
              className="h-11 w-11 shrink-0 rounded-xl object-cover border border-emerald-200 shadow-xs"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="rounded bg-emerald-600 px-1 py-0.2 text-[8px] font-bold uppercase text-white">
                  +{activeVenue.pointsReward} CB
                </span>
                <span className="text-[9px] font-semibold text-slate-500 truncate">
                  {activeVenue.categoryName} • {activeVenue.location}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                {activeVenue.name}
              </h4>
            </div>
          </div>

          {onSelectVenue && (
            <button
              onClick={() => onSelectVenue(activeVenue)}
              className="shrink-0 rounded-xl bg-[#1E4D3E] px-2.5 py-1.5 text-[10px] font-bold text-white shadow-xs hover:bg-[#16392E] active:scale-95 transition-all flex items-center gap-1"
            >
              <span>{isEn ? 'View & Book' : 'Đặt Dịch Vụ'}</span>
              <ChevronRight size={12} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
