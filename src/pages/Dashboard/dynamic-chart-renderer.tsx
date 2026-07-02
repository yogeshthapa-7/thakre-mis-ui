import { useState, useEffect } from "react";
import { Row, Col, Card, Typography } from "antd";
import { useParams } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReactModule from "highcharts-react-official";
import { BarChartOutlined } from "@ant-design/icons";
import {useTranslation} from "react-i18next";

const { Title, Paragraph, Text } = Typography;

const HighchartsReact = 
  (HighchartsReactModule as any).default || HighchartsReactModule;

export const DynamicChartRenderer = () => {
  const { section = "default" } = useParams();
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Shared responsive and sharp contrast configurations
  const chartResponsiveConfig: Highcharts.Options = {
    chart: {
      backgroundColor: "transparent",
      reflow: true,
      style: { fontFamily: "sans-serif" }
    },
    title: {
      style: { color: "#000000", fontWeight: "700", fontSize: "18px" }
    },
    subtitle: {
      style: { color: "#000000", fontSize: "13px", fontWeight: "500" }
    },
    xAxis: {
      labels: { style: { color: "#000000", fontWeight: "700", fontSize: "12px" } },
      title: { style: { color: "#000000", fontWeight: "700" } },
      lineColor: "#000000",
      tickColor: "#000000"
    },
    yAxis: {
      labels: { style: { color: "#000000", fontWeight: "700", fontSize: "12px" } },
      title: { style: { color: "#000000", fontWeight: "700" } },
      gridLineColor: "#cbd5e1"
    },
    legend: {
      itemStyle: { color: "#000000", fontWeight: "700", fontSize: "13px" },
      itemHoverStyle: { color: "#134074" }
    },
    tooltip: {
      style: { color: "#000000", fontWeight: "600" }
    },
    credits: { enabled: false },
    accessibility: { enabled: false }
  };

  // 1. CHART: Municipal Revenue Sources
  const revenueSourcesOptions: Highcharts.Options = {
    ...chartResponsiveConfig,
    chart: { ...chartResponsiveConfig.chart, type: "column" },
    title: { text: t("analytics_card1_title"), style: chartResponsiveConfig.title?.style },
    subtitle: { text: t("analytics_card1_subtitle"), style: chartResponsiveConfig.subtitle?.style },
    xAxis: { ...chartResponsiveConfig.xAxis, categories: ["Property Tax", "Business Licensing", "Central Grants", "Provincial Subsidy", "Service Fees"] },
    yAxis: {
      ...(Array.isArray(chartResponsiveConfig.yAxis) ? chartResponsiveConfig.yAxis[0] : chartResponsiveConfig.yAxis),
      title: { text: "Amount (NPR Millions)", style: Array.isArray(chartResponsiveConfig.yAxis) ? chartResponsiveConfig.yAxis[0]?.title?.style : chartResponsiveConfig.yAxis?.title?.style }
    },
    colors: ["#134074", "#10b981"],
    series: [
      { type: "column", name: "Projected Target", data: [45, 20, 120, 50, 15] },
      { type: "column", name: "Actual Collected", data: [41, 18, 120, 45, 11] }
    ]
  };

  // 2. CHART: Public Grievance Status
  const grievanceTrackingOptions: Highcharts.Options = {
    ...chartResponsiveConfig,
    chart: { ...chartResponsiveConfig.chart, type: "pie" },
    title: { text: t("analytics_card2_title"), style: chartResponsiveConfig.title?.style },
    subtitle: { text: t("analytics_card2_subtitle"), style: chartResponsiveConfig.subtitle?.style },
    colors: ["#134074", "#10b981", "#faad14"],
    tooltip: { pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>", style: chartResponsiveConfig.tooltip?.style },
    plotOptions: {
      pie: { 
        allowPointSelect: true, 
        cursor: "pointer", 
        dataLabels: { 
          enabled: true, 
          format: "<b>{point.name}</b>: {point.y}%",
          style: { color: "#000000", fontWeight: "700", textOutline: "none" }
        } 
      }
    },
    series: [{
      type: "pie",
      name: "Share",
      data: [
        { name: "Resolved Successfully", y: 74, sliced: true, selected: true },
        { name: "Under Active Investigation", y: 18 },
        { name: "Pending Review", y: 8 }
      ]
    }]
  };

  // 3. CHART: Infrastructure Project Timeline Completion
  const infrastructureProgressOptions: Highcharts.Options = {
    ...chartResponsiveConfig,
    chart: { ...chartResponsiveConfig.chart, type: "bar" },
    title: { text: t("analytics_card3_title"), style: chartResponsiveConfig.title?.style },
    subtitle: { text: t("analytics_card3_subtitle"), style: chartResponsiveConfig.subtitle?.style },
    xAxis: { ...chartResponsiveConfig.xAxis, categories: ["Ward 3 Road Paving", "Health Post Expansion", "Drinking Water Pipe Layout", "Administrative Building Fixes"] },
    yAxis: {
      ...(Array.isArray(chartResponsiveConfig.yAxis) ? chartResponsiveConfig.yAxis[0] : chartResponsiveConfig.yAxis),
      title: {
        text: "Completion Percentage (%)",
        style: Array.isArray(chartResponsiveConfig.yAxis) ? chartResponsiveConfig.yAxis[0]?.title?.style : chartResponsiveConfig.yAxis?.title?.style,
      },
      max: 100,
    },
    series: [{
      type: "bar",
      name: "Completion %",
      color: "#10b981",
      data: [90, 45, 75, 20]
    }]
  };

  // 4. CHART: Monthly Budget Expenditure Rate
  const budgetBurnOptions: Highcharts.Options = {
    ...chartResponsiveConfig,
    chart: { ...chartResponsiveConfig.chart, type: "area" },
    title: { text: t("analytics_card4_title"), style: chartResponsiveConfig.title?.style },
    subtitle: { text: t("analytics_card4_subtitle"), style: chartResponsiveConfig.subtitle?.style },
    xAxis: { ...chartResponsiveConfig.xAxis, categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
    yAxis: {
      ...(Array.isArray(chartResponsiveConfig.yAxis) ? chartResponsiveConfig.yAxis[0] : chartResponsiveConfig.yAxis),
      title: {
        text: "Spent (NPR Millions)",
        style: Array.isArray(chartResponsiveConfig.yAxis) ? chartResponsiveConfig.yAxis[0]?.title?.style : chartResponsiveConfig.yAxis?.title?.style,
      },
    },
    plotOptions: { area: { fillOpacity: 0.1 } },
    series: [{
      type: "area",
      name: "Capital Expended",
      data: [12, 19, 26, 32, 45, 58],
      color: "#134074"
    }]
  };

  return (
    <div style={{ width: "100%", padding: "20px 0" }}>
      {/* SECTION HEADER BLOCK - REVERTED BACK TO PREVIOUS ORIGINAL BRAND DESIGN COLOR */}
      <div style={{ marginBottom: "32px", paddingLeft: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <BarChartOutlined style={{ fontSize: "22px", color: "#134074" }} />
          <Title level={3} style={{ color: "#134074", fontWeight: 800, margin: 0 }}>
            {t('landing_analytics_title')}
          </Title>
        </div>
        <Paragraph style={{ color: "#64748b", marginTop: "6px", fontSize: "14px" }}>
         {t('landing_analytics_subtitle')}
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {/* REVENUE CHART */}
        <Col xs={24} lg={12}>
          <Card bordered={false} style={{ background: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", border: "1px solid #e2e8f0" }}>
            <div style={{ minHeight: "400px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {isMounted ? (
                <div style={{ width: "100%" }}><HighchartsReact highcharts={Highcharts} options={revenueSourcesOptions} /></div>
              ) : (
                <div style={{ color: "#000000", fontWeight: 600 }}>Loading Statistics Matrix...</div>
              )}
            </div>
            <div style={{ marginTop: "16px", background: "#f8fafc", padding: "12px 16px", borderRadius: "8px" }}>
              <Text style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.5" }}>
                <strong>Audit Note:</strong> Internal revenue lines are holding steady at 91% of original forecast matrices. Commercial license renewal periods next month are expected to clear remaining targets.
              </Text>
            </div>
          </Card>
        </Col>

        {/* CITIZEN GRIEVANCE CHART */}
        <Col xs={24} lg={12}>
          <Card bordered={false} style={{ background: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", border: "1px solid #e2e8f0" }}>
            <div style={{ minHeight: "400px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {isMounted ? (
                <div style={{ width: "100%" }}><HighchartsReact highcharts={Highcharts} options={grievanceTrackingOptions} /></div>
              ) : (
                <div style={{ color: "#000000", fontWeight: 600 }}>Loading Statistics Matrix...</div>
              )}
            </div>
            <div style={{ marginTop: "16px", background: "#f8fafc", padding: "12px 16px", borderRadius: "8px" }}>
              <Text style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.5" }}>
                <strong>Public Response Summary:</strong> Average turnaround latency for citizen infrastructure complaints dropped to 4.2 days following the deployment of our automated ticketing filters.
              </Text>
            </div>
          </Card>
        </Col>

        {section !== "kpi" && (
          <>
            {/* INFRASTRUCTURE PROGRESS CHART */}
            <Col xs={24} lg={12}>
              <Card bordered={false} style={{ background: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", border: "1px solid #e2e8f0" }}>
                <div style={{ minHeight: "400px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isMounted ? (
                    <div style={{ width: "100%" }}><HighchartsReact highcharts={Highcharts} options={infrastructureProgressOptions} /></div>
                  ) : (
                    <div style={{ color: "#000000", fontWeight: 600 }}>Loading Statistics Matrix...</div>
                  )}
                </div>
                <div style={{ marginTop: "16px", background: "#f8fafc", padding: "12px 16px", borderRadius: "8px" }}>
                  <Text style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.5" }}>
                    <strong>Contract Telemetry:</strong> Road paving structures are nearing formal closure hand-offs. Drinking water expansion schemes are pacing along pipeline timelines smoothly.
                  </Text>
                </div>
              </Card>
            </Col>

            {/* BUDGET EXPENDITURE CURVE */}
            <Col xs={24} lg={12}>
              <Card bordered={false} style={{ background: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", border: "1px solid #e2e8f0" }}>
                <div style={{ minHeight: "400px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isMounted ? (
                    <div style={{ width: "100%" }}><HighchartsReact highcharts={Highcharts} options={budgetBurnOptions} /></div>
                  ) : (
                    <div style={{ color: "#000000", fontWeight: 600 }}>Loading Statistics Matrix...</div>
                  )}
                </div>
                <div style={{ marginTop: "16px", background: "#f8fafc", padding: "12px 16px", borderRadius: "8px" }}>
                  <Text style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.5" }}>
                    <strong>Fiscal Curve:</strong> Balanced expenditure trend shows safe allocation deployment rhythms avoiding end-of-year capital spikes.
                  </Text>
                </div>
              </Card>
            </Col>
          </>
        )}
      </Row>
    </div>
  );
};