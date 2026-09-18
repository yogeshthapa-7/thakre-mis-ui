import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { renderToString } from "react-dom/server";
import { useTranslation } from "react-i18next";
import { DEPARTMENT_THEMES } from "../pages/gis-profile";

interface MarkerData {
  id: number;
  lat: number;
  lng: number;
  title: string;
  desc: string;
  color: string;
}

interface GisMapProps {
  activeDepartment: string;
  activeIcon?: React.ReactNode;
  mapView?: "osm" | "satellite";
  markers?: MarkerData[];
  onViewDetails?: (marker: MarkerData) => void;
  height?: string;
}

export const GisMap = ({
  activeDepartment,
  activeIcon,
  mapView = "osm",
  markers = [],
  onViewDetails,
  height = "450px",
}: GisMapProps) => {
  const { t } = useTranslation("map");
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  
  // Track layers separately in a dictionary instead of an isolated reference variable
  const baseLayersRef = useRef<{ osm: L.TileLayer; satellite: L.TileLayer } | null>(null);

  const tt = (key: string, fallback: string) => t(key, { defaultValue: fallback });

  // Map Initialization & Core Set-up
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([27.712, 85.025], 12);

    // Build the structural base layer definitions instantly on setup
    const osmLayer = L.tileLayer(`https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${import.meta.env.VITE_CARTO_API_KEY}`, {
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
      maxZoom: 20
    });

    const satelliteLayer = L.tileLayer("https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
      attribution: "&copy; Google Maps Imagery",
      maxZoom: 20
    });

    // Save definitions directly onto the instance mapping dictionary
    baseLayersRef.current = { osm: osmLayer, satellite: satelliteLayer };

    // Set the fallback layer straight into action at boot
    osmLayer.addTo(map);

    L.control.zoom({ position: "topright" }).addTo(map);
    layerGroupRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    // Delegate Popup Interaction Click Handlers
    map.on("popupopen", (e) => {
      const popupNode = e.popup.getElement();
      if (!popupNode) return;

      const viewDetailsBtn = popupNode.querySelector(".view-details-btn");
      if (viewDetailsBtn && onViewDetails) {
        viewDetailsBtn.addEventListener("click", () => {
          const id = parseInt(viewDetailsBtn.getAttribute("data-id") || "0", 10);
          const title = viewDetailsBtn.getAttribute("data-title") || "";
          const desc = viewDetailsBtn.getAttribute("data-desc") || "";
          const lat = parseFloat(viewDetailsBtn.getAttribute("data-lat") || "0");
          const lng = parseFloat(viewDetailsBtn.getAttribute("data-lng") || "0");
          const color = viewDetailsBtn.getAttribute("data-color") || "";

          onViewDetails({ id, title, desc, lat, lng, color });
          map.closePopup();
        });
      }
    });

    // Fetch and apply Thakre Boundary
    fetch("/data/thakre_boundary.geojson")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((geoJsonData) => {
        if (!mapRef.current) return;

        const boundaryLayer = L.geoJSON(geoJsonData, {
          filter: (feature) => feature.geometry?.type !== "Point",
          style: () => ({
            color: "#ea580c",
            weight: 2.5,
            opacity: 0.9,
            dashArray: "6, 6",
            fillColor: "#ea580c",
            fillOpacity: 0.03,
          }),
        }).addTo(mapRef.current);

        setTimeout(() => {
          if (!mapRef.current) return;
          mapRef.current.invalidateSize();
          mapRef.current.fitBounds(boundaryLayer.getBounds(), {
            padding: [30, 30],
            maxZoom: 19,
            animate: true,
          });
        }, 150);
      })
      .catch((err) => console.error("Error reading boundary geojson:", err));

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [onViewDetails]);

  // Handle Base Map Layer Updates Switch (OSM vs Satellite)
  useEffect(() => {
    const map = mapRef.current;
    const baseLayers = baseLayersRef.current;
    if (!map || !baseLayers) return;

    // Swap active canvas states via definitive switches
    if (mapView === "satellite") {
      map.removeLayer(baseLayers.osm);
      map.addLayer(baseLayers.satellite);
    } else {
      map.removeLayer(baseLayers.satellite);
      map.addLayer(baseLayers.osm);
    }
  }, [mapView]);

  // Render Pins/Markers Group Layers
  useEffect(() => {
    const layerGroup = layerGroupRef.current;
    if (!layerGroup || !mapRef.current) return;

    layerGroup.clearLayers();
    const iconHtml = activeIcon ? renderToString(activeIcon as React.ReactElement) : "";

    if (markers && markers.length > 0) {
      markers.forEach((markerInfo) => {
        const markerColor = markerInfo.color || DEPARTMENT_THEMES[activeDepartment] || "#ffffff";

        const pinIcon = L.divIcon({
          className: "custom-map-marker",
          html: `
            <div class="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white shadow-lg" 
                 style="background-color: ${markerColor};">
              <span class="text-white text-base">${iconHtml}</span>
            </div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const mapMarker = L.marker([markerInfo.lat, markerInfo.lng], { icon: pinIcon });
        const googleMapsUrl = `https://www.google.com/maps?q=${markerInfo.lat},${markerInfo.lng}`;

        const popupContent = `
          <div class="gov-gis-popup-container font-sans">
            <div class="flex gap-4 items-start">
              <div class="gov-gis-popup-qr-section flex flex-col items-center gap-1.5 shrink-0">
                <div class="qr-wrapper w-[80px] h-[80px] border border-slate-200 p-1 bg-white rounded-md">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    googleMapsUrl
                  )}" alt="${tt("drawer.scan_profile", "Scan Web Profile")}" class="w-full h-full object-contain" />
                </div>
                <span class="qr-subtext text-[11px] font-bold text-slate-500 tracking-wider">${tt(
                  "drawer.scan_profile",
                  "Scan Web Profile"
                )}</span>
              </div>
              
              <div class="gov-gis-popup-info-section flex-1 min-w-0 flex flex-col gap-1.5">
                <span class="facility-title text-base font-bold text-slate-900 block whitespace-normal break-words leading-snug mb-1">${
                  markerInfo.title
                }</span>
                
                <div class="info-row text-sm text-slate-600 flex items-start gap-1">
                  <span class="label font-medium text-slate-400 w-16 shrink-0">${tt("popup.status", "Status")}</span>
                  <span class="value text-emerald-600 font-bold flex-1 break-words whitespace-normal">: ${tt(
                    "popup.operational",
                    "Operational"
                  )}</span>
                </div>
                
                <div class="info-row text-sm text-slate-600 flex items-start gap-1">
                  <span class="label font-medium text-slate-400 w-16 shrink-0">${tt("popup.details", "Details")}</span>
                  <span class="value text-slate-700 font-medium flex-1 break-words whitespace-normal leading-tight">: ${
                    markerInfo.desc
                  }</span>
                </div>
                
                <div class="info-row text-sm text-slate-600 flex items-start gap-1">
                  <span class="label font-medium text-slate-400 w-16 shrink-0">${tt(
                    "popup.location",
                    "Location"
                  )}</span>
                  <span class="value text-slate-700 font-medium flex-1 break-words whitespace-normal">: ${markerInfo.lat.toFixed(
                    4
                  )}°, ${markerInfo.lng.toFixed(4)}°</span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-2 border-t border-slate-100 pt-3 mt-3 w-full">
              <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" 
                 class="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded flex items-center justify-center transition-colors no-underline">
                 ${tt("popup.view_map", "View Map ↗")}
              </a>

              <button 
                 class="view-details-btn flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded transition-colors"
                 data-id="${markerInfo.id}"
                 data-title="${markerInfo.title}"
                 data-desc="${markerInfo.desc}"
                 data-lat="${markerInfo.lat}"
                 data-lng="${markerInfo.lng}"
                 data-color="${markerColor}"
              >
                 ${tt("popup.view_details", "View Details")}
              </button>

              <button onclick="window.print()" class="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold py-2 rounded transition-colors">
                 ${tt("popup.print_details", "Print Details")}
              </button>
            </div>
          </div>`;

        mapMarker
          .addTo(layerGroup)
          .bindPopup(popupContent, { closeButton: false, offset: [0, -10], minWidth: 340 });
      });
    }
  }, [markers, activeDepartment, activeIcon, t]);

  return (
    <div
      className="w-full bg-[#111625] rounded-xl border border-slate-800/80 overflow-hidden relative shadow-inner"
      style={{ height }}
    >
      <style>{`
        .leaflet-popup-content-wrapper {
          padding: 0 !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          width: 440px !important;
          max-width: 90vw !important;
        }

        .leaflet-popup-content {
          margin: 0 !important;
          width: 100% !important;
          padding: 14px !important;
          box-sizing: border-box !important;
        }

        .gov-gis-popup-container {
          width: 100% !important;
          display: flex !important;
          flex-direction: column !important;
        }

        .gov-gis-popup-info-section .value {
          display: block !important;
          white-space: normal !important;
          word-break: break-word !important;
          overflow-wrap: break-word !important;
        }
      `}</style>

      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
};