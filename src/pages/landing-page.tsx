import { Component, useEffect, type ReactNode } from "react";
import { Layout, Row, Col } from "antd";
import {
  TeamOutlined,
  HomeOutlined,
  HeartOutlined,
  DashboardOutlined,
  WalletOutlined,
  ProjectOutlined
} from "@ant-design/icons";
import "./landing-page.css"; 
import SiteHeader from "../islands/navigation/site-header";
import { DynamicChartRenderer } from "./Dashboard/dynamic-chart-renderer";
import SiteFooter from "../islands/navigation/site-footer";
import { APP_META_DATA } from "../../config";
import { useTranslation } from "react-i18next";

const { Content } = Layout;

class ChartSectionErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  override render() { return this.state.hasError ? null : this.props.children; }
}

export const LandingPage = () => {
  const { t } = useTranslation();
  const navText = (key: string) => t(key);

  // --- DYNAMIC DATA EXTRACTION LAYOUTS FROM CHART SCHEMAS ---
  
  // 1. Grievance Summary Metrics (Pie Chart Data)
  const grievanceData = [
    { name: "Resolved Successfully", y: 74 },
    { name: "Under Active Investigation", y: 18 },
    { name: "Pending Review", y: 8 }
  ];
  const resolvedRate = grievanceData.find(item => item.name === "Resolved Successfully")?.y || 0;

  // 2. Infrastructure Summary Metrics (Bar Chart Data)
  const infrastructureData = [90, 45, 75, 20]; // Completion rates
  const totalFunctionalTracks = infrastructureData.length;
  const averageCompletionRate = Math.round(
    infrastructureData.reduce((sum, val) => sum + val, 0) / totalFunctionalTracks
  );

  // 3. Revenue & Budget Summary Metrics (Column / Area Data)
  const projectedRevenueSeries = [45, 20, 120, 50, 15];
  const actualRevenueSeries = [41, 18, 120, 45, 11];
  const totalProjectedRevenue = projectedRevenueSeries.reduce((sum, val) => sum + val, 0);
  const totalActualRevenue = actualRevenueSeries.reduce((sum, val) => sum + val, 0);

  // 4. Budget Expenditure Path Metrics
  const monthlyExpenditureCurve = [12, 19, 26, 32, 45, 58];
  const totalSpentToDate = monthlyExpenditureCurve[monthlyExpenditureCurve.length - 1]; // Current peak burn

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <Layout className="layout">
      <div style={{ top: 0, zIndex: 1000, width: "100%", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)" }}>
        <SiteHeader />
      </div>
      
      <Content style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        
        {/* 1. HERO SECTION */}
        <div
          className="hero-section"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('/thakre_landing.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "calc(100vh - 86px)",
            position: "relative",
          }}
        >
          <div className="overlayNO"></div>
          <div
            style={{
              position: "absolute",
              bottom: "64px",
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "0 24px",
              color: "#ffffff",
              zIndex: 2,
            }}
          >
            <span style={{ fontSize: "35px", fontWeight: 700, letterSpacing: "0.15em", color: "white", textTransform: "uppercase", opacity: 0.9, marginBottom: "8px" }}>
              {navText(APP_META_DATA.heading)}
            </span>
            <h1 style={{ fontSize: "clamp(26px, 4.5vw, 48px)", fontWeight: 900, color: "white", textShadow: "0 4px 16px rgba(15,23,42,0.4)", margin: 0, letterSpacing: "-0.02em" }}>
              {navText(APP_META_DATA.title)}
            </h1>
            <span style={{ fontSize: "clamp(13px, 1.8vw, 18px)", fontWeight: 500, color: "white", marginTop: "12px" }}>
              {navText(APP_META_DATA.subheading)}
            </span>
          </div>
        </div>

        {/* 2. SPECIFIC COPIED GRID MODULE */}
        <div style={{ padding: "40px 24px" }}>
          <div className="gov-profile-container" data-reveal>
            <Row>
              
              {/* LEFT SIDE COLUMN: Header image block + Text Introduction */}
              <Col xs={24} md={11} className="intro-side">
                <div className="intro-hero-banner">
                  <div className="intro-hero-content">
                    <span style={{ fontFamily: "'Georgia', serif", fontSize: "24px", fontWeight: 700, color: "#b21f1f", display: "block" }}>
                      Welcome to
                    </span>
                    <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "28px", fontWeight: 800, color: "#134074", margin: "4px 0 8px 0", lineHeight: 1.2 }}>
                      Thakre Rural Municipality
                    </h2>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#134074", opacity: 0.85, letterSpacing: "0.05em" }}>
                      बागमती प्रदेश, धादिङ, नेपाल
                    </span>
                  </div>
                </div>

                <div className="intro-body-content">
                  <h3 className="underline-title">Introduction</h3>
                  <p style={{ fontSize: "14px", color: "#334155", lineHeight: "1.7", textAlign: "justify", marginTop: "16px", marginBottom: "24px" }}>
                    Thakre Rural Municipality is located in Dhading District of Bagmati Province, Nepal. Our municipality is dedicated to fostering sustainable development and improving the quality of life for our citizens. We focus on enhancing infrastructure, education, healthcare, and economic opportunities. Explore our site to stay informed about our initiatives, public services, and community programs working to build a prosperous and inclusive Thakre.
                  </p>
                  <button className="gov-btn-primary">Learn More</button>
                </div>
              </Col>

              {/* RIGHT SIDE COLUMN: Key Municipal Indicators Panel */}
              <Col xs={24} md={13} className="indicators-side">
                <h3 className="indicator-section-title">Key Municipal Indicators</h3>
                
                {/* 2x2 Square Cards Grid Connected to Live Chart Constants */}
                <Row gutter={[16, 16]}>
                  <Col xs={12}>
                    <div className="indicator-card-square">
                      <TeamOutlined className="indicator-card-icon" />
                      <span className="indicator-card-label">Grievance Resolution</span>
                      <h4 className="indicator-card-value highlighted">{resolvedRate}%</h4>
                      <span className="indicator-card-subtext">Successfully Settled</span>
                    </div>
                  </Col>
                  
                  <Col xs={12}>
                    <div className="indicator-card-square">
                      <HomeOutlined className="indicator-card-icon" />
                      <span className="indicator-card-label">Active Contracts</span>
                      <h4 className="indicator-card-value">{totalFunctionalTracks}</h4>
                      <span className="indicator-card-subtext">Monitored Ward Sites</span>
                    </div>
                  </Col>
                  
                  <Col xs={12}>
                    <div className="indicator-card-square">
                      <HeartOutlined className="indicator-card-icon" />
                      <span className="indicator-card-label">Avg Track Completion</span>
                      <h4 className="indicator-card-value">{averageCompletionRate}%</h4>
                      <span className="indicator-card-subtext">Infrastructure Pace</span>
                    </div>
                  </Col>
                  
                  <Col xs={12}>
                    <div className="indicator-card-square">
                      <DashboardOutlined className="indicator-card-icon" />
                      <span className="indicator-card-label">Revenue Target Met</span>
                      <h4 className="indicator-card-value">{Math.round((totalActualRevenue / totalProjectedRevenue) * 100)}%</h4>
                      <span className="indicator-card-subtext">Collection Efficiency</span>
                    </div>
                  </Col>
                </Row>

                {/* Bottom Horizontal Twin Bar Connected to Dynamic Revenue and Burn Outputs */}
                <div className="horizontal-metrics-bar">
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12}>
                      <div className="horizontal-metric-item">
                        <div className="horizontal-icon-wrapper">
                          <WalletOutlined />
                        </div>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: "#134074" }}>Internal Revenue</div>
                          <div style={{ fontSize: "16px", fontWeight: 800, color: "#334155" }}>NPR {totalActualRevenue} Million</div>
                        </div>
                      </div>
                    </Col>
                    
                    <Col xs={24} sm={12}>
                      <div className="horizontal-metric-item">
                        <div className="horizontal-icon-wrapper">
                          <ProjectOutlined />
                        </div>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: "#134074" }}>Quarter Capital Spent</div>
                          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                            <span style={{ fontSize: "20px", fontWeight: 800, color: "#334155", lineHeight: 1 }}>NPR {totalSpentToDate}M</span>
                            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 500 }}>Expended Trend</span>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>

            </Row>
          </div>
        </div>

        {/* 3. CHART LAYER */}
        <div style={{ margin: "40px 0 100px 0", padding: "0 24px", minHeight: "500px" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            <ChartSectionErrorBoundary>
              <DynamicChartRenderer />
            </ChartSectionErrorBoundary>
          </div>
        </div>
        
        <SiteFooter/>
      </Content>
    </Layout>
  );
};

export default LandingPage;