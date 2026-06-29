import { CloseOutlined, EnvironmentOutlined, InfoCircleOutlined, QrcodeOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface MarkerData {
  lat: number;
  lng: number;
  title: string;
  desc: string;
  color: string;
}

interface GisMarkerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  marker: MarkerData | null;
  activeDepartment: string;
}

export const GisMarkerDrawer = ({ isOpen, onClose, marker, activeDepartment }: GisMarkerDrawerProps) => {
  const { t } = useTranslation("map");

  return (
    <div 
      className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#111625] border-l border-slate-800 shadow-[2px_0px_30px_rgba(0,0,0,0.8)] z-[9999] transform transition-transform duration-300 flex flex-col ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#161d2d]">
        <div className="flex items-center gap-2.5">
          {/* <div 
            className="w-2 h-2 rounded-full shadow-md animate-pulse" 
            style={{ backgroundColor: marker?.color || "#3b82f6" }} 
          /> */}
          <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">{t("drawer.node_profile")}</span>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white bg-[#222c3f] hover:bg-slate-800 border border-slate-800/60 w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
        >
          <CloseOutlined className="text-xs" />
        </button>
      </div>

      {/* Drawer Content */}
      {marker ? (
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-white tracking-wide leading-snug m-0">
              {marker.title}
            </h3>
            {/* <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 
              Operational Status Active
            </span> */}
          </div>

          {/* QR Codes */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1a2232] border border-slate-800/60 p-4 rounded-xl flex flex-col items-center gap-2 text-center">
              <div className="w-24 h-24 bg-white p-1.5 rounded-lg border border-slate-700">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://www.google.com/maps?q=${marker.lat},${marker.lng}`)}`} 
                  alt={t("drawer.scan_profile")}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <QrcodeOutlined /> {t("google_map_qr")}
              </span>
            </div>

            <div className="bg-[#1a2232] border border-slate-800/60 p-4 rounded-xl flex flex-col items-center gap-2 text-center">
              <div className="w-24 h-24 bg-white p-1.5 rounded-lg border border-slate-700">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://example.com/gis-asset-profile/${encodeURIComponent(marker.title)}`)}`} 
                  alt={t("drawer.web_details_qr")}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <QrcodeOutlined /> {t("web_details_qr")}
              </span>
            </div>
          </div>

          {/* Meta Table */}
          <div className="flex flex-col border border-slate-800 rounded-xl overflow-hidden bg-[#161d2d]/50">
            <div className="p-3 bg-[#161d2d] border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <InfoCircleOutlined className="text-blue-400" /> {t("drawer.gis_metadata")}
            </div>
            
            <div className="flex flex-col divide-y divide-slate-800/60 font-sans text-xs">
              <div className="p-3.5 flex items-start gap-3">
                <span className="font-semibold text-slate-400 w-28 shrink-0">{t("drawer.building_designation")}</span>
                <span className="text-slate-200 font-medium">: {marker.title}</span>
              </div>
              <div className="p-3.5 flex items-start gap-3">
                <span className="font-semibold text-slate-400 w-28 shrink-0">{t("drawer.resource_category")}</span>
                <span className="text-slate-200 font-medium capitalize">: {activeDepartment} {t("drawer.services_node")}</span>
              </div>
              <div className="p-3.5 flex items-start gap-3">
                <span className="font-semibold text-slate-400 w-28 shrink-0">{t("drawer.description_details")}</span>
                <span className="text-slate-300 font-medium leading-relaxed">: {marker.desc}</span>
              </div>
              <div className="p-3.5 flex items-start gap-3">
                <span className="font-semibold text-slate-400 w-28 shrink-0">{t("drawer.geographic_layout")}</span>
                <span className="text-blue-400 font-mono tracking-tight flex items-center gap-1">
                  <EnvironmentOutlined className="text-xs" />: {marker.lat.toFixed(6)}°, {marker.lng.toFixed(6)}°
                </span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs">
           {t("drawer.no_node_selected")}
        </div>
      )}
    </div>
  );
};

// export default GisMarkerDrawer;
