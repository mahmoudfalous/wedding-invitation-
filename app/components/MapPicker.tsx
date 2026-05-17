'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { motion } from 'framer-motion';

// Fix default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  onClose: () => void;
}

function SearchField({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider({
      params: {
        'accept-language': 'ar,en',
        addressdetails: 1,
        limit: 8,
        countrycodes: 'eg'
      }
    });
    const searchControl = new (GeoSearchControl as any)({
      provider: provider,
      style: 'bar',
      showMarker: false,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: false,
      searchLabel: 'Search for venues, places or addresses...',
    });
    map.addControl(searchControl);

    const handleShowLocation = (e: any) => {
      if (e && e.location) {
        onLocationSelect(e.location.y, e.location.x);
        map.flyTo([e.location.y, e.location.x], 15);
      }
    };

    map.on('geosearch/showlocation', handleShowLocation);

    return () => {
      map.off('geosearch/showlocation', handleShowLocation);
      map.removeControl(searchControl);
    };
  }, [map, onLocationSelect]);
  return null;
}

function LocationMarker({ 
  position, 
  onLocationSelect 
}: { 
  position: {lat: number, lng: number} | null;
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  const map = useMapEvents({
    click(e: any) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    }
  });

  return position === null ? null : (
    <Marker position={[position.lat, position.lng]}></Marker>
  );
}

function CurrentLocationControl({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const map = useMap();
  const [loading, setLoading] = useState(false);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationSelect(latitude, longitude);
        map.flyTo([latitude, longitude], 15);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        alert("Unable to retrieve your location. Please check browser permissions.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="absolute bottom-6 right-4 z-[1000]">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleCurrentLocation();
        }}
        disabled={loading}
        className="bg-white p-3 rounded-full shadow-lg border border-[#f0e4dc] text-[#8a4b3b] hover:bg-[#fcf9f6] hover:scale-105 transition-all flex items-center justify-center disabled:opacity-50"
        title="Use My Location"
      >
        {loading ? (
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2m10-10h-2M4 12H2m15 0a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default function MapPicker({ onLocationSelect, onClose }: MapPickerProps) {
  const [tempLocation, setTempLocation] = useState<{lat: number, lng: number} | null>(null);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-3xl rounded-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[95vh] md:h-[700px] border-2 sm:border-4 border-[#f0e4dc]"
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 md:p-6 border-b border-[#f0e4dc] flex justify-between items-start sm:items-center bg-[#fcf9f6] gap-2">
          <div className="flex-1 pr-2 sm:pr-4">
            <h3 className="font-serif text-xl sm:text-2xl text-[#8a4b3b] font-medium italic truncate">Search & Pin Location</h3>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#8a6b52] mt-1 sm:line-clamp-1">Can't find your venue? Zoom in and tap directly on the map.</p>
          </div>
          <button 
            onClick={onClose} 
            type="button"
            className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Map Area */}
        <div className="flex-1 w-full relative z-0 isolate map-picker-container">
          <style>{`
            .leaflet-geosearch-bar {
              margin-top: 10px;
              width: calc(100% - 20px) !important;
              margin-left: 10px !important;
              max-width: 400px;
              z-index: 1000;
            }
            .leaflet-geosearch-bar form {
              border-radius: 9999px;
              overflow: hidden;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
              border: 2px solid #f0e4dc;
            }
            .leaflet-geosearch-bar form input {
              padding: 12px 16px;
              font-family: inherit;
              outline: none;
            }
            .leaflet-control-geosearch.bar .results {
               border-radius: 12px;
               margin-top: 8px;
               border: 1px solid #f0e4dc;
               box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            }
            .leaflet-control-geosearch.bar .results > * {
               padding: 12px 16px;
               font-family: inherit;
               font-size: 14px;
            }
            .leaflet-control-geosearch.bar .results > *:hover {
               background-color: #fcf9f6;
            }
          `}</style>
          <MapContainer 
            center={[30.0444, 31.2357]} // Cairo default
            zoom={12} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <SearchField onLocationSelect={(lat, lng) => setTempLocation({lat, lng})} />
            <LocationMarker 
              position={tempLocation} 
              onLocationSelect={(lat, lng) => setTempLocation({lat, lng})} 
            />
            <CurrentLocationControl onLocationSelect={(lat, lng) => setTempLocation({lat, lng})} />
          </MapContainer>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 md:p-6 border-t border-[#f0e4dc] bg-[#fcf9f6] flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-full border border-[#eadecc] text-[#8a6b52] text-xs sm:text-sm tracking-widest uppercase font-bold hover:bg-white transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!tempLocation}
            onClick={() => {
              if (tempLocation) {
                onLocationSelect(tempLocation.lat, tempLocation.lng);
                onClose();
              }
            }}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-full bg-[#8a4b3b] text-white text-xs sm:text-sm tracking-widest uppercase font-bold hover:bg-[#6e3b2e] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5"
          >
            Confirm Pin
          </button>
        </div>

      </motion.div>
    </div>
  );
}
