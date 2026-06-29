import { useState, useEffect } from "react";
import i18next from "i18next";
import { Button, Drawer, Dropdown, Layout } from "antd";
import { DownOutlined, MenuOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { NavbarLinkData } from "./navbar-links";
import styles from "./navbar-dropdown.module.css";
import { useTranslation } from "react-i18next";
import { APP_META_DATA } from "../../../config";

const { Header } = Layout;

const SiteHeader = () => {
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

  // Helper to format text just in case translation fallback shows raw snake_case keys
  const formatLabel = (key: string) => {
    const translated = navText(key);
    return translated === key ? key.replace(/_/g, " ") : translated;
  };

  return (
    <Header style={{ width: "100%", height: "auto", padding: 0, background: "#fff", lineHeight: "normal" }}>
      {/* 1. TOP BANNER (FORCED DEEP BLUE VIA INLINE STYLE) */}
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
  <div className={styles.noticeTickerContainer}>
    <div className={`${styles.tickerWrapper} text-sm font-medium tracking-wide`} style={{ color: "#ffffff" }}>
      <span className="mx-4">१. राष्ट्रीय आयोजना बैंक व्यवस्थापन सूचना प्रणाली (NPBMIS) मा आयोजना प्रविष्टिका लागि म्याद थप सम्बन्धी जरुरी सूचना !</span>
      <span className="mx-4">|</span>
      <span className="mx-4">२. आर्थिक वर्ष २०८३/८४ का लागि योजना तथा कार्यक्रम प्रस्ताव पेश गर्ने सम्बन्धी सूचना !</span>
      <span className="mx-4">|</span>
      <span className="mx-4">३. सामाजिक सुरक्षा भत्ता प्राप्त गर्ने लाभग्राहीहरूको विवरण अद्यावधिक गर्ने सम्बन्धी जरुरी सूचना !</span>
    </div>
  </div>
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
          
          {/* Mobile Brand Title (Hidden on Desktop) */}
          <div className="lg:hidden flex items-center gap-2">
            <img src="/nav_logo.png" alt="Emblem" className="h-9 w-auto" />
            <span className="text-sm font-bold text-slate-800 tracking-tight">Thakre RM</span>
          </div>

          {/* Desktop Navigation Links Left Aligned */}
          <div className="hidden lg:flex items-center gap-6">
            {NavbarLinkData.map((item) =>
              item.children ? (
                <Dropdown
                  key={item.labelKey}
                  popupRender={(menu) => <div className={styles.govDropdown}>{menu}</div>}
                  menu={{
                    items: item.children.map((child) => ({
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
                  <span className={`${styles.navLink} cursor-pointer`}>
                    {formatLabel(item.labelKey)}
                    <DownOutlined className="text-[9px] opacity-70 mt-0.5" />
                  </span>
                </Dropdown>
              ) : (
                <Link
                  key={item.url}
                  to={item.url}
                  className={styles.navLink}
                >
                  {formatLabel(item.url ? item.labelKey : "")}
                </Link>
              )
            )}
          </div>

          {/* Right Action Items: Language Toggle */}
          <div className="hidden lg:flex items-center gap-4">
            <Dropdown
              menu={{
                items: [
                  { key: "np", label: "नेपाली" },
                  { key: "en", label: "English" },
                  
                ],
                onClick: ({ key }) => {
                  i18next.changeLanguage(key);
                  localStorage.setItem("language", key);
                },
              }}
              trigger={["click"]}
            >
              <Button
                type="text"
                className="flex items-center gap-1 border border-gray-200 hover:border-blue-400 rounded-full font-bold text-xs px-4 bg-white text-slate-700"
              >
                {language === "np" ? "NEP" : "ENG"}
                <DownOutlined className="text-[8px] opacity-60" />
              </Button>
            </Dropdown>
          </div>

          {/* Mobile Actions Container */}
          <div className="lg:hidden flex items-center gap-2">
            <Dropdown
              menu={{
                items: [
                  { key: "np", label: "नेपाली" },
                  { key: "en", label: "English" },
                  
                ],
                onClick: ({ key }) => {
                  i18next.changeLanguage(key);
                  localStorage.setItem("language", key);
                },
              }}
              trigger={["click"]}
            >
              <Button size="small" type="text" className="border border-gray-200 rounded-full font-bold text-xs">
                {language === "np" ? "ने" : "EN"}
              </Button>
            </Dropdown>
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
          {NavbarLinkData.map((item) =>
            item.children ? (
              <div key={item.labelKey} className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setMobileDropdownOpen((prev) => !prev)}
                  className="flex items-center justify-between text-left font-semibold text-slate-800 text-sm tracking-wide"
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
                    mobileDropdownOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
                  }`}
                >
                  {item.children.map((child) => (
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
            ) : (
              <Link
                key={item.url}
                to={item.url}
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