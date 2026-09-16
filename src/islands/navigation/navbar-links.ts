export const NavbarLinkData = [
  { labelKey: "Home", url: "/" },
  { labelKey: "Interactive_GIS_Map", url: "/gis-profile" }, // Moved to top-level link
  { 
    labelKey: "citizens_services", 
    children: [
      { labelKey: "tools.citizen_service_requests", url: "/citizens_services/citizens-service-requests" },
      { labelKey: "tools.development_project_tracker", url: "/citizens_services/development-project-tracker" },
    ],
  },
  { labelKey: "Data_Collection", target: "_blank", url: "https://thakre-dc.himalayankasturi.com.np/" },
];