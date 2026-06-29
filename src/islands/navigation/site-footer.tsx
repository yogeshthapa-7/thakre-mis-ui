import { Layout, Typography, Row, Col, Space } from "antd";
import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { APP_META_DATA } from "../../../config";
import { useTranslation } from "react-i18next";

const { Footer } = Layout;
const { Title, Link: AntLink } = Typography;

export const SiteFooter = () => {
  const { t } = useTranslation("footer");
  const navText = (key: string) => t(key);

  return (
    <Footer
      style={{
        backgroundColor: "#0f172a", // Sophisticated Deep Navy Blue
        color: "rgba(255, 255, 255, 0.85)",
        padding: "60px 24px 30px 24px",
        borderTop: "4px solid #e67e22", // Professional Gold Accent Line
        fontSize: "14px",
      }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <Row gutter={[32, 40]} justify="space-between">
          
          {/* Column 1: Municipal Identity */}
          <Col xs={24} md={12} lg={8}>
            {/* Flex wrapper aligning texts next to the Emblem Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
              <img 
                src="/nav_logo.png" 
                alt="Nepal Government Emblem" 
                style={{ height: "70px", objectFit: "contain" }} 
              />
              
              {/* Dynamic Identity Block matching SiteHeader */}
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

            {/* Description text starting exactly from the left margin flush below the logo */}
            <p style={{ color: "rgba(255, 255, 255, 0.60)", textAlign: "justify", lineHeight: "1.6", fontSize: "13px", margin: 20 }}>
                          {t("Footer_Description")}

              </p>
          </Col>

          {/* Column 2: Useful Links / Portals */}
          <Col xs={24} sm={12} lg={5}>
            <Title level={5} style={{ color: "#ffffff", marginBottom: 20, fontSize: "15px", fontWeight: 600 }}>
                           {t("Useful_Links")}
            </Title>
            <Space direction="vertical" size="middle" style={{ display: "flex" }}>
              <AntLink 
                href="https://thakremun.gov.np/citizen-charter"
                target="_blank"
                rel="noopener noreferrer" 
                style={{ color: "rgba(255, 255, 255, 0.65)", display: "block" }}
              >
                {t("Citizens_Charter")}
              </AntLink>
              <AntLink 
                href="https://thakremun.gov.np/reports" 
                style={{ color: "rgba(255, 255, 255, 0.65)", display: "block" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("Annual_Reports")}
              </AntLink>
              <AntLink 
                href="https://thakremun.gov.np/budget-program"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "rgba(255, 255, 255, 0.65)", display: "block" }}
              >
              {t("Budget_and_Programs")}
              </AntLink>
              <AntLink 
                href="https://thakremun.gov.np/notices"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "rgba(255, 255, 255, 0.65)", display: "block" }}
              >
                {t("Notices_and_Announcements")}
              </AntLink>
            </Space>
          </Col>

          {/* Column 3: Government Portals */}
          <Col xs={24} sm={12} lg={5}>
            <Title level={5} style={{ color: "#ffffff", marginBottom: 20, fontSize: "15px", fontWeight: 600 }}>
              {t("External_Portals")}
            </Title>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
              <AntLink 
                href="https://nepal.gov.np" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: "rgba(255, 255, 255, 0.65)", display: "block" }}
              >
                {t("Nepal_Government_Portal")}
              </AntLink>
              <AntLink 
                href="https://mofaga.gov.np" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: "rgba(255, 255, 255, 0.65)", display: "block" }}
              >
                {t("MoFAGA")}
              </AntLink>
              <AntLink 
                href="https://bagmati.gov.np" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: "rgba(255, 255, 255, 0.65)", display: "block" }}
              >
              {t("Bagmati_Province_Portal")}
              </AntLink>
              <AntLink 
                href="https://donidcr.gov.np" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: "rgba(255, 255, 255, 0.65)", display: "block" }}
              >
                {t("National_ID_Civil_Registration")}
              </AntLink>
            </Space>
          </Col>

          {/* Column 4: Official Contact Details */}
          <Col xs={24} sm={12} lg={6}>
            <Title level={5} style={{ color: "#ffffff", marginBottom: 20, fontSize: "15px", fontWeight: 600 }}>
              {t("Contact_Information")}
            </Title>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <EnvironmentOutlined style={{ color: "#e67e22", marginTop: "4px" }} />
                <AntLink 
                  href="https://maps.google.com/?q=Thakre+Rural+Municipality+Mahadevbesi"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "rgba(255, 255, 255, 0.75)" }}
                >
                  थाक्रे गाउँ कार्यपालिका, धादिङ, नेपाल
                </AntLink>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <PhoneOutlined style={{ color: "#e67e22" }} />
                <AntLink href="tel:+97710410111" style={{ color: "rgba(255, 255, 255, 0.75)" }}>
                  +977-10-410111
                </AntLink>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <MailOutlined style={{ color: "#e67e22" }} />
                <AntLink href="mailto:info@thakremun.gov.np" style={{ color: "rgba(255, 255, 255, 0.75)" }}>
                  info@thakremun.gov.np
                </AntLink>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <GlobalOutlined style={{ color: "#e67e22" }} />
                <AntLink href="https://www.thakremun.gov.np" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255, 255, 255, 0.75)" }}>
                  www.thakremun.gov.np
                </AntLink>
              </div>
            </Space>
          </Col>
        </Row>

        {/* Centered Credit Link Area */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: "40px", paddingTop: "24px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <AntLink
            href="https://www.himalayankasturi.com.np"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#60a5fa", fontWeight: 500, fontSize: "13px" }}
            className="hover:text-blue-300 transition-colors duration-200"
          >
            {t("Powered_By")}
          </AntLink>
        </div>

      </div>
    </Footer>
  );
};

export default SiteFooter;