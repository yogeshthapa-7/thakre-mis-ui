import { useState } from "react";
import { Layout } from "antd";
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
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import SiteHeader from "../islands/navigation/site-header";
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

export const GisProfilePage = () => {
  const { t } = useTranslation("map");
  const [activeDept, setActiveDept] = useState<string>("health");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mapView, setMapView] = useState<"osm" | "satellite">("osm");

  return (
    <Layout className="min-h-screen bg-[#121824] text-slate-200 flex flex-col font-sans">
      <div className=" top-0 z-50 w-full shadow-md bg-[#A202FF] border-b border-slate-800/60">
        <SiteHeader />
      </div>

      <div className="flex-1 flex overflow-hidden h-[calc(100vh-64px)]">
       <aside
  className={`bg-[#111723] border-r border-slate-800/60 flex flex-col transition-all duration-300 ${
    isCollapsed ? "w-16" : "w-64"
  }`}
>
  {/* Sidebar Header */}
  <div className="h-14 border-b border-slate-800/60 flex items-center justify-between px-4 shrink-0">
    {!isCollapsed && (
      <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">
        {t("sidebar.title")}
      </span>
    )}
    <button
      onClick={() => setIsCollapsed(!isCollapsed)}
      title={t("sidebar.collapse_tooltip")}
      className={`text-slate-400 hover:text-blue-400 bg-slate-800/30 p-2 rounded-md border border-slate-800/80 transition-colors ${
        isCollapsed ? "ml-1" : "ml-auto"
      }`}
    >
      {isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    </button>
  </div>

  {/* Main Scrollable Content Wrapper */}
<div className="flex-1 overflow-y-auto flex flex-col">
  {/* Departments Navigation */}
  <nav className="py-1 flex flex-col gap-0.5">
    {DEPARTMENTS.map((dept) => {
      const isActive = activeDept === dept.id;
      return (
        <button
          key={dept.id}
          onClick={() => setActiveDept(dept.id)}
          title={isCollapsed ? t(`departments.${dept.id}`) : ""}
          className={`w-full text-left py-3.5 transition-all duration-150 flex items-center justify-between hover:bg-[#1c2436] px-5 ${
            isActive ? dept.activeColor : "text-slate-400"
          }`}
        >
          <div className="flex items-center gap-3.5 truncate">
            <span
              className="text-base flex items-center justify-center shrink-0"
              style={{ color: DEPARTMENT_THEMES[dept.id] }}
            >
              {dept.icon}
            </span>
            {!isCollapsed && (
              <span className="truncate tracking-wide text-slate-300">{t(`departments.${dept.id}`)}</span>
            )}
          </div>
        </button>
      );
    })}
  </nav>

 {/* Base Maps Selection - With Clean Divider Under Heading */}
{!isCollapsed && (
  <div className="px-5 flex flex-col gap-4 pb-6 mt-20">
    <div className="flex flex-col gap-2">
      {/* Group Title matching the exact sidebar header styling style */}
      <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">
        {t("sidebar.base_maps", "Base Maps")}
      </span>
      {/* Clean, subtle divider line */}
      <hr className="border-slate-800/60 w-full" />
    </div>
    
    <div className="flex flex-col gap-3.5 pl-0.5">
      <label className="flex items-center gap-4 text-slate-300 cursor-pointer hover:text-slate-100 transition-colors tracking-wide">
        <input
          type="radio"
          name="mapView"
          checked={mapView === "osm"}
          onChange={() => setMapView("osm")}
          className="accent-blue-500 w-4 h-4 cursor-pointer"
        />
        <span>{t("sidebar.osm", "OpenStreetMap")}</span>
      </label>
      
      <label className="flex items-center gap-4 text-slate-300 cursor-pointer hover:text-slate-100 transition-colors tracking-wide">
        <input
          type="radio"
          name="mapView"
          checked={mapView === "satellite"}
          onChange={() => setMapView("satellite")}
          className="accent-blue-500 w-4 h-4 cursor-pointer"
        />
        <span>{t("sidebar.satellite", "Satellite")}</span>
      </label>
    </div>
  </div>
)}
</div>
</aside>

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
    </Layout>
  );
};

export default GisProfilePage;
