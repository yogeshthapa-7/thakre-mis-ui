import { useState } from "react";
import { Layout, Tooltip } from "antd";
import {
  BookOutlined,
  GlobalOutlined,
  PlusOutlined,
  EnvironmentOutlined,
  ApartmentOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BankOutlined,
  TeamOutlined,
  AuditOutlined,
  CompassOutlined,
  BorderOutlined,
  PictureOutlined
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
// import SiteHeader from "../islands/navigation/site-header";
import { GisMapRenderer } from "../Components/gis/gis-map-renderer";

const { Content } = Layout;

export const DEPARTMENT_THEMES: Record<string, string> = {
  health: "#50C878",
  education: "#3b82f6",
  environment: "#228B22",
  agriculture: "#808000",
  infrastructure: "#f97316",
  government_office: "red",
  social_service: "#d946ef",
  finance_and_revenue: "#333333",
};

const DEPARTMENTS = [
  { id: "health", icon: <PlusOutlined />, activeColor: "bg-[#1e293b] text-blue-400 border-l-4 border-blue-500 font-semibold" },
  { id: "education", icon: <BookOutlined />, activeColor: "bg-[#1e293b] text-blue-400 border-l-4 border-blue-500 font-semibold" },
  { id: "environment", icon: <EnvironmentOutlined />, activeColor: "bg-[#1e293b] text-green-400 border-l-4 border-green-500 font-semibold" },
  { id: "agriculture", icon: <GlobalOutlined />, activeColor: "bg-[#1e293b] text-yellow-500 border-l-4 border-yellow-500 font-semibold" },
  { id: "infrastructure", icon: <ApartmentOutlined />, activeColor: "bg-[#1e293b] text-orange-400 border-l-4 border-orange-500 font-semibold" },
  { id: "government_office", icon: <BankOutlined />, activeColor: "bg-[#1e293b] text-orange-400 border-l-4 border-orange-500 font-semibold" },
  { id: "social_service", icon: <TeamOutlined />, activeColor: "bg-[#1e293b] text-orange-400 border-l-4 border-orange-500 font-semibold" },
  { id: "finance_and_revenue", icon: <AuditOutlined />, activeColor: "bg-[#1e293b] text-orange-400 border-l-4 border-orange-500 font-semibold" },
];

const MAP_VIEWS = [
  { id: "osm", icon: <BorderOutlined /> },
  { id: "satellite", icon: <PictureOutlined /> }
];

export const GisProfilePage = () => {
  const { t } = useTranslation("map");
  const [activeDept, setActiveDept] = useState<string>("health");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mapView, setMapView] = useState<"osm" | "satellite">("osm");

  return (
    <div className="min-h-screen bg-[#0d111a] flex flex-col font-sans antialiased text-slate-200 selection:bg-blue-500/30">
      {/* <SiteHeader /> */}
      <div className="flex-1 flex overflow-hidden">
        
        <aside 
          className={`bg-[#0f1422] border-r border-slate-800/70 flex flex-col transition-all duration-300 relative shadow-2xl z-[1010] ${
            isCollapsed ? "w-[70px]" : "w-[290px]"
          }`}
        >
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-5 bg-[#161f30] border border-slate-700/80 hover:border-slate-500 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all text-slate-400 hover:text-white shadow-md z-50"
            title={t("sidebar.collapse_tooltip", "Toggle Sidebar")}
          >
            {isCollapsed ? <MenuUnfoldOutlined className="text-sm" /> : <MenuFoldOutlined className="text-sm" />}
          </button>

          <div className="p-4 flex items-center gap-3.5 border-b border-slate-800/50 bg-[#0b0e18]/40 min-h-[65px]">
            <GlobalOutlined className="text-blue-500 text-2xl animate-pulse shrink-0" />
            {!isCollapsed && (
              <span className="font-bold text-base tracking-wide bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent uppercase">
                {t("sidebar.title", "Department Operations")}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col custom-scrollbar space-y-8 py-2.5">
            
            {/* SECTION 1: DEPARTMENTS */}
            <nav className="flex flex-col gap-1 px-2">
              {DEPARTMENTS.map((dept) => {
                const isActive = activeDept === dept.id;
                return (
                  <Tooltip key={dept.id} title={isCollapsed ? t(`departments.${dept.id}`) : ""} placement="right">
                    <button
                      onClick={() => {
                        setActiveDept(dept.id);
                      }}
                      className={`w-full text-left py-2.5 px-3.5 rounded-xl transition-all duration-200 flex items-center gap-3.5 group relative overflow-hidden ${
                        isActive 
                          ? "bg-[#162235] text-white font-medium border-l-[3.5px]" 
                          : "text-slate-400 hover:bg-[#121927] hover:text-slate-200"
                      }`}
                      style={isActive ? { borderLeftColor: DEPARTMENT_THEMES[dept.id] } : {}}
                    >
                      <span 
                        className={`text-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}
                        style={{ color: isActive ? DEPARTMENT_THEMES[dept.id] : "#64748b" }}
                      >
                        {dept.icon}
                      </span>
                      {!isCollapsed && (
                        <span className="text-sm tracking-wide truncate">
                          {t(`departments.${dept.id}`)}
                        </span>
                      )}
                    </button>
                  </Tooltip>
                );
              })}
            </nav>

            {/* SECTION 2: BASE MAPS */}
            <div className="px-2 flex flex-col gap-2 mt-40">
              <div className="flex items-center gap-2.5 px-3.5 min-h-[20px]">
                <CompassOutlined className="text-blue-500 text-sm shrink-0" />
                {!isCollapsed && (
                  <span className="text-xs font-bold text-slate-500 tracking-widest uppercase truncate">
                    {t("sidebar.base_maps", "Base Maps")}
                  </span>
                )}
              </div>
              <hr className="border-slate-800/50 w-full mb-1 px-2" />
              
              <div className="flex flex-col gap-1">
                {MAP_VIEWS.map((view) => {
                  const isActive = mapView === view.id;
                  return (
                    <Tooltip key={view.id} title={isCollapsed ? t(`sidebar.${view.id}`) : ""} placement="right">
                      <button
                        onClick={() => setMapView(view.id as "osm" | "satellite")}
                        className={`w-full text-left py-2.5 px-3.5 rounded-xl transition-all duration-150 flex items-center gap-3.5 hover:bg-[#141b2a] group ${
                          isActive 
                            ? "bg-[#162235] text-white border-l-[3.5px] border-blue-500 font-medium" 
                            : "text-slate-400"
                        }`}
                      >
                        <span 
                          className={`text-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? "text-blue-400" : "text-slate-500"
                          }`}
                        >
                          {view.icon}
                        </span>
                        
                        {!isCollapsed && (
                          <span className="text-sm tracking-wide text-slate-300 truncate">
                            {t(`sidebar.${view.id}`)}
                          </span>
                        )}
                      </button>
                    </Tooltip>
                  );
                })}
              </div>
            </div>

          </div>
        </aside>

        {/* COMPONENT VIEW CANVAS FRAME */}
        <Content className="flex-1 flex flex-col overflow-hidden bg-[#121824]">
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            <GisMapRenderer
              activeDepartment={activeDept}
              activeIcon={DEPARTMENTS.find((d) => d.id === activeDept)?.icon}
              mapView={mapView}
            />
          </div>
        </Content>
      </div>
    </div>
  );
};

export default GisProfilePage;