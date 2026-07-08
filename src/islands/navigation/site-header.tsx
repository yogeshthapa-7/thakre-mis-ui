import { useState, useEffect } from "react";
import i18next from "i18next";
import { Button, Drawer, Dropdown, Layout } from "antd";
import { DownOutlined, MenuOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { NavbarLinkData } from "./navbar-links";
import styles from "./navbar-dropdown.module.css";
import { useTranslation } from "react-i18next";
import { APP_META_DATA } from "../../../config";
import React from "react";

// Import the raw module with an alias name first
import RawMarquee from "react-fast-marquee";

// Safely unpack the component for Vite, and cast to 'any' to stop TypeScript from complaining
const Marquee = ((RawMarquee as any).default || RawMarquee) as React.ComponentType<any>;
const { Header } = Layout;

export const SiteHeader = () => {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live Clock Hook - Updates every single second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Formatter to force execution on Nepal Timezone (Asia/Kathmandu)
  const formatNepalTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-NP", {
      timeZone: "Asia/Kathmandu",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);
  };

  const language = i18n.language?.startsWith("np") ? "np" : "en";
  const navText = (key: string) => t(key);

  // Helper to format text just in case translation fallback shows raw keys
  const formatLabel = (key: string) => {
    const translated = navText(key);
    if (translated === key) {
      // Strips 'tools.' prefix and replaces underscores for cleaner fallbacks
      const cleanKey = key.includes(".") ? key.split(".")[1] : key;
      return cleanKey.replace(/_/g, " ");
    }
    return translated;
  };

  const notices = [
  "१. राष्ट्रिय आयोजना बैंक व्यवस्थापन सूचना प्रणाली (NPBMIS) मा आयोजना प्रविष्टिका लागि म्याद थप सम्बन्धी जरुरी सूचना ।",
  "२. आर्थिक वर्ष २०८३/८४ का लागि योजना तथा कार्यक्रम प्रस्ताव पेश गर्ने सम्बन्धी सूचना ।",
  "३. सामाजिक सुरक्षा भत्ता प्राप्त गर्ने लाभग्राहीहरूको विवरण अद्यावधिक गर्ने सम्बन्धी जरुरी सूचना ।",
  "४. कर तिर्ने सम्बन्धी जरुरी सूचना ।",
  "५. जन्म, मृत्यु तथा विवाह दर्ता अद्यावधिक गर्ने सम्बन्धी सूचना ।",
];

  // Helper function to handle language toggle logic cleanly
  const toggleLanguage = () => {
    const nextLang = language === "np" ? "en" : "np";
    i18next.changeLanguage(nextLang);
    localStorage.setItem("language", nextLang);
  };

  return (
    <Header style={{ width: "100%", height: "auto", padding: 0, background: "#fff", lineHeight: "normal" }}>
      {/* 1. TOP BANNER */}
      <div 
        className="hidden lg:block"
        style={{
          background: "linear-gradient(90deg, #1e56a0 0%, #16427b 100%)",
          color: "#ffffff"
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6 py-3 grid grid-cols-12 items-center gap-4">
          
          {/* Left Block: Emblem & Titles */}
          <div className="col-span-4 flex items-center gap-4">
            <Link to="/" className="shrink-0">
              <img
                src="/nav_logo.png"
                alt="Government Emblem"
                style={{ objectFit: "contain" }}
                height="85"
                width="85"
              />
            </Link>
            <div className="flex flex-col" style={{ color: "#ffffff" }}>
              <span className="text-lg font-bold leading-tight tracking-wide m-0">
                {navText(APP_META_DATA.heading)}
              </span>
              <h1 className="text-lg font-bold leading-tight tracking-wide m-0" style={{ color: "#ffffff" }}>
                {navText(APP_META_DATA.title)}
              </h1>
              <span className="text-md font-medium opacity-100 mt-0.5">
                {navText(APP_META_DATA.subheading)}
              </span>
            </div>
          </div>

          {/* Center Block: Scrolling Important Notice Ticker */}
          <div className="col-span-5 flex items-center border-l border-r border-white/20 px-4 h-full">
            <span className="shrink-0 bg-amber-500 text-slate-900 font-bold text-xs uppercase px-2 py-1 rounded shadow-sm mr-2 z-10">
              {navText("Notice")}
            </span>
            <Marquee pauseOnHover speed={60}>
  {notices.map((notice, index) => (
    <React.Fragment key={index}>
      <span className="mx-4">{notice}</span>

      {index !== notices.length - 1 && (
        <span className="mx-4">|</span>
      )}
    </React.Fragment>
  ))}
</Marquee>
          </div>

          {/* Right Block: Live Date Widget & Flag */}
          <div className="col-span-3 flex items-center justify-end gap-3 text-right">
            <div className="flex flex-col text-[12px] font-medium tracking-wide" style={{ color: "#ffffff" }}>
              <div className="font-semibold">Date: {formatNepalTime(currentTime)}</div>
            </div>
            <img 
              src="https://giwmscdnone.gov.np/static/grapejs/img/Nepal-flag.gif" 
              alt="Animated Nepal Flag" 
              className="h-10 object-contain"
              style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.2))" }}
            />
          </div>
        </div>
      </div>

      {/* 2. BOTTOM NAVBAR (WHITE PORTION) */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
          
          {/* Mobile Brand Title */}
          <div className="lg:hidden flex items-center gap-2">
            <img src="/nav_logo.png" alt="Emblem" className="h-9 w-auto" />
            <span className="text-sm font-bold text-slate-800 tracking-tight">Thakre RM</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            {NavbarLinkData.map((item: any) =>
              item.children ? (
                <Dropdown
                  key={item.labelKey}
                  popupRender={(menu) => <div className={styles.govDropdown}>{menu}</div>}
                  menu={{
                    items: item.children.map((child: any) => ({
                      key: child.url,
                      label: (
                        <Link to={child.url} className="text-slate-700 font-medium text-[14px]">
                          {formatLabel(child.labelKey)}
                        </Link>
                      ),
                    })),
                  }}
                  trigger={["hover"]}
                >
                  <span className={`${styles.navLink} cursor-pointer flex items-center gap-1`}>
                    {formatLabel(item.labelKey)}
                    <DownOutlined className="text-[9px] opacity-70 mt-0.5" />
                  </span>
                </Dropdown>
              ) : item.url?.startsWith("http") ? (
                <a
                  key={item.labelKey}
                  href={item.url}
                  target={item.target || "_blank"}
                  rel="noopener noreferrer"
                  className={styles.navLink}
                >
                  {formatLabel(item.labelKey)}
                </a>
              ) : (
                <Link key={item.labelKey} to={item.url || "/"} className={styles.navLink}>
                  {formatLabel(item.labelKey)}
                </Link>
              )
            )}
          </div>

          {/* Right Action Items: Language Pill-style Toggle Container */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              type="button"
              className="relative w-20 h-8 flex items-center bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full p-1 cursor-pointer transition-all duration-300 select-none shadow-inner"
              title={language === "np" ? "Switch to English" : "नेपालीमा बदल्नुहोस्"}
            >
              {/* Sliding Background Highlight Pill */}
              <div
                className={`absolute top-0.5 bottom-0.5 w-[36px] bg-white rounded-full shadow-md border border-gray-200 transition-all duration-300 ease-in-out ${
                  language === "np" ? "left-0.5" : "left-[calc(100%-38px)]"
                }`}
              />
              
              {/* Text Layout Alignment Container */}
              <div className="absolute inset-0 flex justify-between items-center px-2.5 text-[10px] font-bold text-slate-600 pointer-events-none">
                <span className={language === "np" ? "text-blue-600 font-extrabold" : "opacity-60"}>नेपा</span>
                <span className={language === "en" ? "text-blue-600 font-extrabold" : "opacity-60"}>EN</span>
              </div>
            </button>
          </div>

          {/* Mobile Actions Container with Quick Toggle Pill */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              type="button"
              className="relative w-16 h-7 flex items-center bg-gray-100 border border-gray-300 rounded-full p-0.5 cursor-pointer transition-all duration-300 select-none"
            >
              <div
                className={`absolute top-0.5 bottom-0.5 w-[28px] bg-white rounded-full shadow border border-gray-200 transition-all duration-300 ease-in-out ${
                  language === "np" ? "left-0.5" : "left-[calc(100%-30px)]"
                }`}
              />
              <div className="absolute inset-0 flex justify-between items-center px-2 text-[9px] font-bold text-slate-600 pointer-events-none">
                <span className={language === "np" ? "text-blue-600 font-extrabold" : "opacity-50"}>नेपा</span>
                <span className={language === "en" ? "text-blue-600 font-extrabold" : "opacity-50"}>EN</span>
              </div>
            </button>

            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
              className="text-slate-800 text-lg"
            />
          </div>
        </div>
      </div>

      {/* 3. MOBILE DRAWER */}
      <Drawer
        title={navText("Menu")}
        placement="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        width={280}
        styles={{
          header: { borderBottom: "1px solid #e5e7eb" },
          body: { background: "#fafafa" },
        }}
      >
        <div className="flex flex-col gap-4">
          {NavbarLinkData.map((item: any) =>
            item.children ? (
              <div key={item.labelKey} className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setMobileDropdownOpen((prev) => !prev)}
                  className="flex items-center justify-between text-left font-semibold text-slate-800 text-sm tracking-wide w-full"
                >
                  <span>{formatLabel(item.labelKey)}</span>
                  <DownOutlined
                    className={`text-xs opacity-60 transition-transform duration-300 ${
                      mobileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`flex flex-col gap-2 overflow-hidden pl-3 border-l border-gray-200 transition-all duration-300 ${
                    mobileDropdownOpen ? "max-h-60 opacity-100 mt-1" : "max-h-0 opacity-0"
                  }`}
                >
                  {item.children.map((child: any) => (
                    <Link
                      key={child.url}
                      to={child.url}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-slate-600 hover:text-blue-600 text-sm py-1"
                    >
                      {formatLabel(child.labelKey)}
                    </Link>
                  ))}
                </div>
              </div>
            ) : item.url?.startsWith("http") ? (
              <a
                key={item.labelKey}
                href={item.url}
                target={item.target || "_blank"}
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="font-semibold text-slate-800 text-sm hover:text-blue-600 tracking-wide"
              >
                {formatLabel(item.labelKey)}
              </a>
            ) : (
              <Link
                key={item.labelKey}
                to={item.url || "/"}
                onClick={() => setMobileMenuOpen(false)}
                className="font-semibold text-slate-800 text-sm hover:text-blue-600 tracking-wide"
              >
                {formatLabel(item.labelKey)}
              </Link>
            )
          )}
        </div>
      </Drawer>
    </Header>
  );
};

export default SiteHeader;