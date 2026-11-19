'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  MapPin,
  Plus,
  Minus,
  Navigation,
  ChevronRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { DestinationCategory, GreenDestination } from '@/data/types';
import { formatText, getDictionary, localizePrice, Lang } from '@/lib/i18n';
import 'leaflet/dist/leaflet.css';

interface EcoMapProps {
  selectedLocation: string;
  onSelectLocation: (location: string) => void;
  selectedCategory?: DestinationCategory;
  onSelectCategory?: (category: DestinationCategory) => void;
  currentLang?: Lang;
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
}

const REGION_TARGETS: RegionTarget[] = [
  {
    id: 'all',
    name: 'Toàn quốc',
    nameEn: 'National',
    lat: 16.3,
    lng: 107.2,
    zoom: 5,
  },
  {
    id: 'hoi-an',
    name: 'Hội An',
    nameEn: 'Hoi An',
    lat: 15.886,
    lng: 108.342,
    zoom: 13,
  },
  {
    id: 'da-lat',
    name: 'Đà Lạt',
    nameEn: 'Da Lat',
    lat: 11.942,
    lng: 108.442,
    zoom: 12,
  },
  {
    id: 'cuc-phuong',
    name: 'Cúc Phương',
    nameEn: 'Cuc Phuong',
    lat: 20.275,
    lng: 105.685,
    zoom: 12,
  },
  {
    id: 'ninh-binh',
    name: 'Ninh Bình',
    nameEn: 'Ninh Binh',
    lat: 20.255,
    lng: 105.925,
    zoom: 11,
  },
  {
    id: 'nam-cat-tien',
    name: 'Nam Cát Tiên',
    nameEn: 'Nam Cat Tien',
    lat: 11.415,
    lng: 107.405,
    zoom: 12,
  },
  {
    id: 'sa-pa',
    name: 'Sa Pa',
    nameEn: 'Sa Pa',
    lat: 22.332,
    lng: 103.852,
    zoom: 12,
  },
];

// Esri World Street Map: free, no API key required, clean cartography.
const MAP_TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
const MAP_TILE_OPTIONS = {
  maxZoom: 19,
  maxNativeZoom: 18,
  detectRetina: true,
  attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, OpenStreetMap contributors',
};

// Monochrome line icons (24x24, stroke) used inside map pins
const CATEGORY_ICON_SVG: Record<string, string> = {
  food: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  hotel: '<path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/>',
  transport: '<circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>',
  activity: '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/>',
  shopping: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  all: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
};

const CATEGORY_STYLE: Record<
  Exclude<DestinationCategory, 'all'>,
  { color: string }
> = {
  food: { color: '#EA580C' },
  hotel: { color: '#E11D48' },
  transport: { color: '#0284C7' },
  activity: { color: '#16A34A' },
  shopping: { color: '#9333EA' },
};

export const EcoMap: React.FC<EcoMapProps> = ({
  selectedLocation,
  onSelectLocation,
  selectedCategory = 'all',
  onSelectCategory,
  currentLang = 'vi',
  destinations = [],
  onSelectVenue,
}) => {
  const t = getDictionary(currentLang);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const labelLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const [mapMode, setMapMode] = useState<'street' | 'satellite'>('street');
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeVenue, setActiveVenue] = useState<GreenDestination | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const visibleDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      const matchesLocation =
        selectedLocation === 'all' ||
        dest.location.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || dest.category === selectedCategory;
      return matchesLocation && matchesCategory;
    });
  }, [destinations, selectedLocation, selectedCategory]);

  // Clear spotlight venue if filtered out
  useEffect(() => {
    if (
      activeVenue &&
      !visibleDestinations.some((d) => d.id === activeVenue.id)
    ) {
      setActiveVenue(null);
    }
  }, [activeVenue, visibleDestinations]);

  // Initialize Leaflet Map (Client Side only)
  useEffect(() => {
    let isMounted = true;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      try {
        const leafletModule = await import('leaflet');
        const L = leafletModule.default || leafletModule;

        if (!isMounted || !mapContainerRef.current) return;

        const q = selectedLocation.toLowerCase().trim();
        const initialRegion = REGION_TARGETS.find(
          (r) =>
            r.id === q ||
            r.name.toLowerCase().includes(q) ||
            r.nameEn.toLowerCase().includes(q)
        );

        const map = L.map(mapContainerRef.current, {
          center: initialRegion
            ? [initialRegion.lat, initialRegion.lng]
            : [15.886, 108.342],
          zoom: initialRegion ? initialRegion.zoom : 13,
          zoomControl: false,
          attributionControl: false,
        });

        const streetTiles = L.tileLayer(MAP_TILE_URL, MAP_TILE_OPTIONS);
        L.control.attribution({ prefix: false, position: 'bottomright' }).addTo(map);
        streetTiles.addTo(map);
        tileLayerRef.current = streetTiles;

        const markersGroup = L.layerGroup().addTo(map);
        markersLayerRef.current = markersGroup;
        mapInstanceRef.current = map;

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
        } catch {
          // ignore cleanup error
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Re-measure Leaflet viewport smoothly when expanding/collapsing map height
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize({ animate: true });
      }
    }, 220);
    return () => clearTimeout(timer);
  }, [isExpanded, isMapReady]);

  // Toggle Street vs Satellite Tiles
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
          { maxZoom: 19, attribution: 'Tiles &copy; Esri' }
        );
        const labelsOverlay = L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
          { maxZoom: 19 }
        );
        satLayer.addTo(map);
        labelsOverlay.addTo(map);
        tileLayerRef.current = satLayer;
        labelLayerRef.current = labelsOverlay;
      } else {
        const osmLayer = L.tileLayer(MAP_TILE_URL, MAP_TILE_OPTIONS);
        osmLayer.addTo(map);
        tileLayerRef.current = osmLayer;
      }
    });
  }, [mapMode, isMapReady]);

  // Render Markers:
  // - National mode ('all'): 6 Regional Eco-Hub cluster pins (clean, zero overlap)
  // - Regional mode: All filtered POI pins for that region
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !isMapReady) return;

    import('leaflet').then((leafletModule) => {
      const L = leafletModule.default || leafletModule;
      const markersGroup = markersLayerRef.current;
      const map = mapInstanceRef.current;
      if (!markersGroup || !map) return;

      markersGroup.clearLayers();

      if (selectedLocation === 'all') {
        // Render 6 Regional Hub Clusters
        REGION_TARGETS.filter((r) => r.id !== 'all').forEach((reg) => {
          const regionCount = visibleDestinations.filter(
            (d) => d.location.toLowerCase() === reg.name.toLowerCase()
          ).length;

          if (regionCount === 0) return;

          const displayRegionName = t.data.locations[reg.name] || reg.name;

          const hubHtml = `
            <div class="relative flex flex-col items-center cursor-pointer group">
              <div class="flex items-center gap-1 rounded-full bg-[#1E4D3E] px-2.5 py-1 text-[10px] font-black text-white shadow-lg border-2 border-white transition-transform group-hover:scale-110 whitespace-nowrap">
                <span>${displayRegionName}</span>
                <span class="rounded-full bg-emerald-400 text-[#0F2820] px-1.5 py-0.2 text-[9px] font-black">${regionCount}</span>
              </div>
              <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#1E4D3E]"></div>
            </div>
          `;

          const hubIcon = L.divIcon({
            className: 'custom-eco-hub',
            html: hubHtml,
            iconSize: [120, 34],
            iconAnchor: [60, 32],
          });

          const marker = L.marker([reg.lat, reg.lng], { icon: hubIcon });
          marker.on('click', () => {
            onSelectLocation(reg.name);
          });
          marker.addTo(markersGroup);
        });
        return;
      }

      // Regional Detail Mode: render all matching POI pins in this region
      visibleDestinations.forEach((dest) => {
        if (!dest.lat || !dest.lng) return;

        const style =
          dest.category !== 'all'
            ? CATEGORY_STYLE[dest.category]
            : { color: '#10B981' };

        const isSelectedPin = activeVenue?.id === dest.id;

        const iconSvg = CATEGORY_ICON_SVG[dest.category] || CATEGORY_ICON_SVG.all;
        const customHtml = `
          <div class="eco-pin ${isSelectedPin ? 'eco-pin--active' : ''}" style="--pin:${style.color};">
            ${isSelectedPin ? `<div class="eco-pin__badge">+${dest.pointsReward} CB</div>` : ''}
            <div class="eco-pin__dot">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${iconSvg}</svg>
            </div>
            <div class="eco-pin__tip"></div>
          </div>
        `;

        const markerIcon = L.divIcon({
          className: 'custom-eco-pin',
          html: customHtml,
          iconSize: [60, 56],
          iconAnchor: [30, 54],
          popupAnchor: [0, -50],
        });

        const marker = L.marker([dest.lat, dest.lng], { icon: markerIcon });

        const dTrans = t.data.destinations[dest.id];
        const popupName = dTrans?.name || dest.name;
        const popupBadge = dTrans?.badge || dest.greenBadge;
        const popupLoc = t.data.locations[dest.location] || dest.location;

        const popupContent = document.createElement('div');
        popupContent.className = 'eco-leaflet-popup p-1 text-left min-w-[215px] max-w-[245px]';
        popupContent.innerHTML = `
          <div class="rounded-xl overflow-hidden mb-1.5 relative border border-slate-100">
            <img src="${dest.image}" alt="${popupName}" class="h-20 w-full object-cover" />
            <span class="absolute top-1 right-1 rounded-md bg-emerald-700/90 text-white px-1.5 py-0.5 text-[8px] font-black shadow-xs">
              ${popupBadge}
            </span>
          </div>
          <h4 class="text-xs font-black text-slate-900 leading-snug line-clamp-2">${popupName}</h4>
          <p class="text-[10px] text-slate-500 mt-0.5 line-clamp-1">${dest.address || popupLoc}</p>
          <div class="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between gap-2">
            <span class="rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-black shrink-0">
              +${dest.pointsReward} CB
            </span>
            <span class="text-[10px] font-bold text-slate-700 truncate">${localizePrice(dest.priceEstimate, currentLang === 'vi') || ''}</span>
          </div>
        `;

        marker.bindPopup(popupContent, {
          closeButton: true,
          offset: [0, -44],
          className: 'eco-popup-wrapper',
        });

        marker.on('click', () => {
          setActiveVenue(dest);
        });

        marker.addTo(markersGroup);
      });
    });
  }, [
    visibleDestinations,
    selectedLocation,
    isMapReady,
    currentLang,
    activeVenue?.id,
    onSelectLocation,
    t.data.destinations,
    t.data.locations,
  ]);

  // Smooth FlyTo when selectedLocation changes
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
        duration: 1.0,
        easeLinearity: 0.25,
      });
    } else {
      const foundDest = destinations.find(
        (d) =>
          d.location.toLowerCase().includes(query) ||
          d.name.toLowerCase().includes(query)
      );
      if (foundDest && foundDest.lat && foundDest.lng) {
        map.flyTo([foundDest.lat, foundDest.lng], 14, {
          duration: 1.0,
          easeLinearity: 0.25,
        });
        setActiveVenue(foundDest);
      }
    }
  }, [selectedLocation, isMapReady, destinations]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleRecenter = () => {
    onSelectLocation('all');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([16.3, 107.2], 5, { duration: 1.0 });
    }
  };

  const legendItems: { id: Exclude<DestinationCategory, 'all'>; label: string }[] = [
    { id: 'food', label: t.data.destinationCategories.food },
    { id: 'hotel', label: t.data.destinationCategories.hotel },
    { id: 'transport', label: t.data.destinationCategories.transport },
    { id: 'activity', label: t.data.destinationCategories.activity },
    { id: 'shopping', label: t.data.destinationCategories.shopping },
  ];

  return (
    <div className="rounded-3xl bg-white p-3.5 shadow-sm border border-emerald-950/5 text-left">
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between mb-2.5 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-[#1E4D3E]">
            <MapPin size={14} />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-slate-900 leading-tight truncate">
              {t.map.title}
            </h3>
            <p className="text-[9px] text-slate-400 truncate">
              {t.map.subtitle}
            </p>
          </div>
        </div>

        {/* Satellite / Street Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setMapMode(mapMode === 'street' ? 'satellite' : 'street')}
            className={`flex items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-bold shadow-xs border transition-colors ${
              mapMode === 'satellite'
                ? 'bg-slate-900 text-amber-300 border-slate-700'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100'
            }`}
            title={mapMode === 'satellite' ? t.map.streetMode : t.map.satelliteMode}
          >
            <span>
              {mapMode === 'satellite' ? t.map.satelliteMode : t.map.streetMode}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Real Leaflet Map Viewport */}
      <div
        className={`relative w-full overflow-hidden rounded-2xl border border-slate-200 shadow-inner bg-slate-100 isolate z-0 transition-all duration-300 ${
          isExpanded ? 'h-[420px]' : 'h-64'
        }`}
      >
        <div ref={mapContainerRef} className="h-full w-full z-10" />

        {/* Floating Controls: Expand, Recenter, Zoom +, Zoom - */}
        <div className="absolute top-2.5 right-2.5 z-[500] flex flex-col gap-1.5">
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/95 text-slate-700 shadow-md border border-slate-200 hover:bg-emerald-50 active:scale-95 transition-all"
            title={isExpanded ? t.map.collapseMap : t.map.expandMap}
          >
            {isExpanded ? (
              <Minimize2 size={14} className="text-[#1E4D3E]" />
            ) : (
              <Maximize2 size={14} className="text-[#1E4D3E]" />
            )}
          </button>

          <button
            onClick={handleRecenter}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/95 text-slate-700 shadow-md border border-slate-200 hover:bg-emerald-50 active:scale-95 transition-all"
            title={t.map.recenterTitle}
          >
            <Navigation size={14} className="text-[#1E4D3E]" />
          </button>

          <button
            onClick={handleZoomIn}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/95 text-slate-700 shadow-md border border-slate-200 hover:bg-emerald-50 active:scale-95 transition-all"
            title={t.map.zoomInTitle}
          >
            <Plus size={15} />
          </button>

          <button
            onClick={handleZoomOut}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/95 text-slate-700 shadow-md border border-slate-200 hover:bg-emerald-50 active:scale-95 transition-all"
            title={t.map.zoomOutTitle}
          >
            <Minus size={15} />
          </button>
        </div>

        {/* Floating Location & Count Callout at Bottom-Left */}
        <div className="absolute bottom-2.5 left-2.5 z-[500] pointer-events-auto">
          <div className="rounded-xl bg-white/95 px-2.5 py-1 text-[10px] font-bold text-slate-800 shadow-md border border-slate-200 flex items-center gap-1.5 backdrop-blur-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {t.map.regionPrefix}
              <strong className="text-[#1E4D3E]">
                {selectedLocation === 'all'
                  ? t.map.allVietnam
                  : t.data.locations[selectedLocation] || selectedLocation}
              </strong>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-extrabold">
              {formatText(t.map.venuesCount, { count: visibleDestinations.length })}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Quick Region Navigation Chips (with live venue count) */}
      <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-left">
        {REGION_TARGETS.map((reg) => {
          const isSelected =
            reg.id === selectedLocation.toLowerCase() ||
            reg.name.toLowerCase() === selectedLocation.toLowerCase() ||
            (reg.id === 'all' && selectedLocation === 'all');

          const count =
            reg.id === 'all'
              ? destinations.filter(
                  (d) => selectedCategory === 'all' || d.category === selectedCategory
                ).length
              : destinations.filter(
                  (d) =>
                    d.location.toLowerCase() === reg.name.toLowerCase() &&
                    (selectedCategory === 'all' || d.category === selectedCategory)
                ).length;

          return (
            <button
              key={reg.id}
              onClick={() => onSelectLocation(reg.id === 'all' ? 'all' : reg.name)}
              className={`flex shrink-0 items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold transition-all ${
                isSelected
                  ? 'bg-[#1E4D3E] text-white shadow-xs ring-1 ring-emerald-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200/60'
              }`}
            >
              <span>
                {reg.id === 'all'
                  ? t.map.allVietnam
                  : t.data.locations[reg.name] || reg.name}
              </span>
              <span
                className={`ml-0.5 rounded-full px-1.5 text-[9px] font-extrabold ${
                  isSelected
                    ? 'bg-emerald-400/25 text-emerald-100'
                    : 'bg-white text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Interactive Color-Coded Legend (click to filter map pins by category) */}
      <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
        {legendItems.map((item) => {
          const style = CATEGORY_STYLE[item.id];
          const isCatActive = selectedCategory === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                onSelectCategory?.(isCatActive ? 'all' : item.id)
              }
              className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-all border ${
                isCatActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
              }`}
            >
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: style.color }}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 5. Active Selected Venue Spotlight Drawer */}
      {activeVenue &&
        (() => {
          const avTrans = t.data.destinations[activeVenue.id];
          const avName = avTrans?.name || activeVenue.name;
          const avCat =
            avTrans?.categoryName ||
            t.data.destinationCategories[activeVenue.category] ||
            activeVenue.categoryName;
          const avLoc = t.data.locations[activeVenue.location] || activeVenue.location;
          return (
            <div className="mt-2.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/50 p-2.5 border border-emerald-200/80 flex items-center justify-between gap-2.5 animate-fadeIn">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={activeVenue.image}
                  alt={avName}
                  className="h-11 w-11 shrink-0 rounded-xl object-cover border border-emerald-200 shadow-xs"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="rounded bg-emerald-600 px-1 py-0.2 text-[8px] font-bold uppercase text-white shrink-0">
                      +{activeVenue.pointsReward} CB
                    </span>
                    <span className="text-[9px] font-semibold text-slate-500 truncate">
                      {avCat} • {avLoc}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                    {avName}
                  </h4>
                  {activeVenue.priceEstimate && (
                    <p className="text-[10px] font-semibold text-emerald-700 truncate">
                      {localizePrice(activeVenue.priceEstimate, currentLang === 'vi')}
                    </p>
                  )}
                </div>
              </div>

              {onSelectVenue && (
                <button
                  onClick={() => onSelectVenue(activeVenue)}
                  className="shrink-0 rounded-xl bg-[#1E4D3E] px-2.5 py-1.5 text-[10px] font-bold text-white shadow-xs hover:bg-[#16392E] active:scale-95 transition-all flex items-center gap-1"
                >
                  <span>{t.map.viewAndBook}</span>
                  <ChevronRight size={12} />
                </button>
              )}
            </div>
          );
        })()}
    </div>
  );
};
