import SiteHeader from "./islands/navigation/site-header";
import { App } from "antd";
import i18next from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import type { ReactNode } from "react";

import map_en from "./translations/en/map.json";
import navbar_en from "./translations/en/navbar.json";
import footer_en from "./translations/en/footer.json";
import common_en from "./translations/en/common.json";
import services_en from "./translations/en/services.json";

import navbar_np from "./translations/np/navbar.json";
import footer_np from "./translations/np/footer.json";
import common_np from "./translations/np/common.json";
import map_np from "./translations/np/map.json";
import services_np from "./translations/np/services.json";

interface RootProps {
  children: ReactNode;
}

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    interpolation: { escapeValue: false },
    lng: localStorage.getItem("language") || "np",
    fallbackLng: "np",
    defaultNS: "common",
    fallbackNS: ["common", "navbar", "footer", "map", "services"],
    resources: {
      en: {
        common: common_en,
        map: map_en,
        navbar: navbar_en,
        footer: footer_en,
        services: services_en,
      },
      np: {
        common: common_np,
        map: map_np,
        navbar: navbar_np,
        footer: footer_np,
        services: services_np,
      },
    },
  });

function Root({ children }: RootProps) {
  return (
    <>
      <I18nextProvider i18n={i18next}>
        <App>
          <SiteHeader />
          <div className="min-h-screen flex">
            <div className="flex-1 p-6 bg-gray-100">{children}</div>
          </div>
        </App>
      </I18nextProvider>
    </>
  );
}

export default Root;
