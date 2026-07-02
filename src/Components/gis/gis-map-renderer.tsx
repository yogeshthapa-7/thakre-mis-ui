import { useEffect, useRef, useMemo, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Highcharts from "highcharts";
import _HighchartsReact from "highcharts-react-official";
import { NotificationOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { DEPARTMENT_THEMES } from "../../pages/gis-profile";
import { renderToString } from "react-dom/server";
import { GisMarkerDrawer } from "./GisMarkerDrawer";

const HighchartsReact = (_HighchartsReact as any).default || _HighchartsReact;

interface Notice {
  ward: string;
  campaignName: string;
  leadPerson: string;
  role: string;
  details: string;
  status: "Active" | "Scheduled" | "Critical";
}

interface MarkerData {
  lat: number;
  lng: number;
  title: string;
  desc: string;
  color: string;
}

interface DepartmentData {
  title: string;
  scheduleTitle: string;
  schedules: { label: string; name: string; time: string; urgent: boolean }[];
  defaultAlertText: string;
  markers: MarkerData[];
  notices: Notice[];
  primaryChart: {
    type: "column" | "line" | "areaspline";
    title: string;
    yAxisLabel: string;
    seriesName: string;
    categories: string[];
    data: number[];
    wardData?: Record<string, number[]>;
    color: string;
    gradientTo: string;
    description: string;
  };
  secondaryChart: {
    type: "pie" | "spline" | "bar";
    title: string;
    seriesName: string;
    data: any[];
    wardData?: Record<string, any[]>;
    description: string;
  };
}

interface GisMapRendererProps {
  activeDepartment: string;
  activeIcon?: React.ReactNode;
  mapView?: "osm" | "satellite";
}

const DEPARTMENT_DATABASE: Record<string, DepartmentData> = {
  health: {
    title: "HEALTH - Public Checkup Routines",
    scheduleTitle: "Medical Deployment Rosters (Select a Ward to View Notices)",
    schedules: [
      { label: "Ward 4", name: "Vaccination Camp Alpha, Thakre Health Post", time: "Tomorrow", urgent: true },
      { label: "Ward 6", name: "Senior Citizen Wellness, Basic Health Post", time: "Oct 18", urgent: false },
      { label: "Ward 2", name: "Maternal Care Orientation, Tasarpu Health Post", time: "Oct 22", urgent: false }
    ],
    defaultAlertText: "Select an active ward deployment timeline from the Action Center grid to pull real-time campaign logs and medical officer manifests.",
    markers: [
      { lat: 27.725953979973074 , lng: 85.09840287266941, title: "Thakre Health Post (Ward 4)", desc: "Staff: 8 Active | Oxygen Supply: Normal | Outpatient Visits: 42 today", color: "#ef4444" },
      { lat: 27.716813834976467, lng: 85.06401042229213, title: "Tasarpu Health Post (Ward 2)", desc: "Vaccine Storage: 84% capacity | Cold Chain Stable | Staff: 5 Active",  color: "#ef4444" },
      { lat: 27.730473572599728, lng: 85.11838403328377, title: "Basic Health Post (Ward 6)", desc: "Maternal Checkups: 6 today | Pharmacy Stock: Adequate | Staff: 4 Active",  color: "#ef4444" }
    ],
    notices: [
      { ward: "Ward 4", campaignName: "Pediatric Booster Drive", leadPerson: "Dr. Sandeep Shrestha", role: "Chief Immunization Officer", details: "Administering critical Type-A pediatric boosters. Storage containers must be held strictly between 2°C and 8°C.", status: "Critical" },
      { ward: "Ward 4", campaignName: "Japanese Encephalitis Seminar", leadPerson: "Dr. Aarati Thapa", role: "Public Epidemiologist", details: "Community safety awareness briefing regarding seasonal mosquito-borne vector control configurations.", status: "Scheduled" },
      { ward: "Ward 6", campaignName: "Geriatric Mobility Check", leadPerson: "Dr. Ramesh Joshi", role: "Senior Physiotherapist", details: "Free structural joint and cardiovascular wellness checkups tailored specifically for older residents.", status: "Active" },
      { ward: "Ward 2", campaignName: "Prenatal Nutrition Circle", leadPerson: "Nurse Sita Kafle", role: "Maternal Health Lead", details: "Distribution of essential micro-nutrients and micro-nutrient charts to registered pregnant mothers.", status: "Active" }
    ],
    primaryChart: {
      type: "column",
      title: "Daily Patient Volume Analysis (By Ward Area)",
      yAxisLabel: "Patients Count",
      seriesName: "Outpatients Visited",
      categories: ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6", "Ward 7", "Ward 8", "Ward 9", "Ward 10", "Ward 11"],
      data: [35, 55, 22, 45, 38, 44, 20, 32, 28, 18, 24],
      wardData: {
        "Ward 2": [15, 95, 24, 30, 22, 19, 14, 25, 21, 10, 16],
        "Ward 4": [22, 31, 14, 115, 28, 35, 18, 20, 24, 12, 15],
        "Ward 6": [18, 24, 15, 29, 21, 88, 25, 19, 14, 11, 20]
      },
      color: "#ef4444",
      gradientTo: "rgba(239, 68, 68, 0.1)",
      description: "This bar chart logs real-time outpatient distribution across Thakre's administrative divisions. High peaks in Ward 2 and Ward 4 indicate higher medical resource demand, highlighting where additional staffing or medical supplies should be assigned."
    },
    secondaryChart: {
      type: "pie",
      title: "Medical Case Category Distribution Breakdown",
      seriesName: "Share",
      data: [
        { name: "General Checkup", y: 45, color: "#3b82f6" },
        { name: "Immunization Protocols", y: 30, color: "#ef4444" },
        { name: "Maternal Health Support", y: 15, color: "#10b981" },
        { name: "Emergency & Trauma Response", y: 10, color: "#f59e0b" }
      ],
      wardData: {
        "Ward 2": [
          { name: "General Checkup", y: 20, color: "#3b82f6" },
          { name: "Immunization Protocols", y: 15, color: "#ef4444" },
          { name: "Maternal Health Support", y: 60, color: "#10b981" },
          { name: "Emergency & Trauma Response", y: 5, color: "#f59e0b" }
        ],
        "Ward 4": [
          { name: "General Checkup", y: 15, color: "#3b82f6" },
          { name: "Immunization Protocols", y: 70, color: "#ef4444" },
          { name: "Maternal Health Support", y: 5, color: "#10b981" },
          { name: "Emergency & Trauma Response", y: 10, color: "#f59e0b" }
        ],
        "Ward 6": [
          { name: "General Checkup", y: 65, color: "#3b82f6" },
          { name: "Immunization Protocols", y: 15, color: "#ef4444" },
          { name: "Maternal Health Support", y: 10, color: "#10b981" },
          { name: "Emergency & Trauma Response", y: 10, color: "#f59e0b" }
        ]
      },
      description: "This structural pie chart breaks down current clinic use by case category. General and preventative immunization care account for 75% of local caseloads, establishing that primary community care infrastructure remains our highest long-term funding priority."
    }
  },
  education: {
    title: "EDUCATION - School Infrastructure Mapping",
    scheduleTitle: "Academic Inspection Audits (Select a Ward to View Notices)",
    schedules: [
      { label: "Ward 11", name: "Secondary School Resource Review", time: "09:30 AM", urgent: true },
      { label: "Ward 7", name: "Library Resource Assessment ", time: "Oct 21", urgent: false },
      { label: "Ward 7", name: "Science Lab Safety Review ", time: "Oct 21", urgent: false },
      { label: "Ward 2", name: "Computer Lab Utilization Study ", time: "Oct 21", urgent: false },
    ],
    defaultAlertText: "Select an active school audit schedule from the Action Center grid to pull real-time infrastructure metrics and inspection officer manifests.",
    markers: [
      { lat: 27.758595597105906, lng: 85.05126608197715, title: "Vadaurey school", desc: "Enrolled: 420 | Computer Lab: Operational | Library Books: 1,200+",  color: "#3b82f6" },
      { lat: 27.74735395791943, lng: 85.10568273748376, title: "Bal Jyoti Academy", desc: "Enrolled: 385 | Computer Lab: Needs Upgrade | Science Lab: Fully Equipped", color: "#3b82f6" },
      { lat: 27.74066918987721, lng: 85.08937490696916, title: "Shree Barahi School", desc: "Enrolled: 460 | Computer Lab: Operational | Smart Classes: 3 Active", color: "#3b82f6" },
      { lat: 27.72046046554605, lng: 85.06482733051035, title: "Shree Mahakali Secondary school", desc: "Enrolled: 512 | Computer Lab: Under Maintenance | Teacher Count: 28", color: "#3b82f6" },
    ],
    notices: [
      { ward: "Ward 11", campaignName: "Secondary School Resource Review", leadPerson: "Inspector Prakash Adhikari", role: "District Education Officer", details: "Evaluating classroom resources, teaching materials, and student support facilities for secondary level education.", status: "Critical" },
      { ward: "Ward 7", campaignName: "Library Resource Assessment", leadPerson: "Ms. Sunita Rimal", role: "Academic Resource Auditor", details: "Inspecting book collections, digital archives, and reading space utilization for effective student learning.", status: "Active" },
      { ward: "Ward 7", campaignName: "Science Lab Safety Review", leadPerson: "Mr. Ramesh Koirala", role: "Laboratory Safety Inspector", details: "Reviewing chemical storage, equipment calibration, and safety protocols in the school science laboratories.", status: "Active" },
      { ward: "Ward 2", campaignName: "Computer Lab Utilization Study", leadPerson: "Ms. Anjana Shrestha", role: "ICT Education Specialist", details: "Assessing computer hardware, software availability, and student access schedules for digital literacy programs.", status: "Active" },
    ],
    primaryChart: {
      type: "areaspline",
      title: "Average Student Attendance Rate Performance Trends",
      yAxisLabel: "Attendance Percentage (%)",
      seriesName: "Attendance Rate",
      categories: ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6", "Ward 7", "Ward 8", "Ward 9", "Ward 10", "Ward 11"],
      data: [62, 78, 45, 90, 88, 74, 50, 68, 82, 59, 71],
      wardData: {
        "Ward 2": [55, 94, 60, 72, 68, 80, 61, 70, 75, 64, 69],
        "Ward 9": [70, 76, 58, 80, 84, 72, 66, 74, 96, 68, 73]
      },
      color: "#3b82f6",
      gradientTo: "rgba(59, 130, 246, 0.1)",
      description: "This area timeline indexes structural classroom engagement. Sharp drops below the target 70% threshold (such as in Ward 3 and Ward 10) pinpoint geographical zones requiring active localized education support programs or transportation network interventions."
    },
    secondaryChart: {
      type: "spline",
      title: "Digital Infrastructure Readiness Growth Curve",
      seriesName: "Smart Classrooms Configured",
      data: [12, 19, 8, 25, 22, 14, 10, 18, 21, 9, 15],
      wardData: {
        "Ward 2": [5, 32, 10, 12, 15, 11, 8, 14, 18, 6, 12],
        "Ward 9": [14, 16, 9, 20, 18, 15, 11, 16, 38, 10, 14]
      },
      description: "This multi-point line monitor measures the operational readiness of high-tech digital classrooms across municipal wards. Wards reaching higher points confirm completed broadband connection rollouts, serving as milestones for the regional digital learning project."
    }
  },
  environment: {
    title: "ENVIRONMENT - Forestry & Catchment Protection",
    scheduleTitle: "Afforestation Campaigns (Select a Ward to View Notices)",
    schedules: [
      { label: "Ward 10", name: "Community Forest Survey", time: "In Progress", urgent: true },
      { label: "Ward 8", name: "Local road maintenance.", time: "Nov 02", urgent: false },
      { label: "Ward 11", name: "Community health awareness campaign.", time: "Nov 02", urgent: false }
    ],
    defaultAlertText: "Select an active environmental field task from the Action Center grid to pull real-time geo-hazard logs and ranger officer manifests.",
    markers: [
      { lat: 27.749233974952727, lng: 85.08162485720095, title: "PAARI BAN", desc: "Moisture Level: Optimal | Sensor Network Alive | Tree Density: 1,540/ha", color: "#22c55e" },
      { lat: 27.728519611421746, lng: 85.12082442903542, title: "Thakre Ward No. 8 Office", desc: "Moisture Level: Moderate | Sensor Network Alive | Waste Collection: 92% completed", color: "#22c55e" },
      { lat: 27.750248086365385, lng: 85.0668500235582, title: "Thakre Rural Municipality", desc: "Moisture Level: High | Sensor Network Stable | Air Quality Index: 42 (Good)",  color: "#22c55e" },
    ],
    notices: [
      { ward: "Ward 10", campaignName: "Community Forest Survey", leadPerson: "Ranger Binod Khadka", role: "Forestry Engineer", details: "Surveying forest coverage, biodiversity levels, and community usage patterns to strengthen conservation planning.", status: "Critical" },
      { ward: "Ward 8", campaignName: "Local Road Maintenance", leadPerson: "Ms. Kamala Baral", role: "Infrastructure Supervisor", details: "Overseeing gravel laying, drainage clearance, and minor repairs to improve rural road connectivity.", status: "Active" },
      { ward: "Ward 11", campaignName: "Community Health Awareness Campaign", leadPerson: "Dr. Sushil Thapa", role: "Public Health Coordinator", details: "Conducting awareness sessions on sanitation, nutrition, and preventive healthcare for local residents.", status: "Active" }
    ],
    primaryChart: {
      type: "areaspline",
      title: "Forest Canopy Density Index Growth Monitor",
      yAxisLabel: "Density Index Value",
      seriesName: "Canopy Index",
      categories: ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6", "Ward 7", "Ward 8", "Ward 9", "Ward 10", "Ward 11"],
      data: [20, 25, 28, 35, 40, 48, 52, 58, 60, 62, 65],
      wardData: {
        "Ward 5": [18, 22, 24, 30, 78, 42, 46, 50, 54, 58, 60],
        "Ward 11": [15, 20, 22, 28, 32, 40, 45, 52, 55, 58, 92]
      },
      color: "#10b981",
      gradientTo: "rgba(16, 185, 129, 0.1)",
      description: "This index chart maps healthy vegetative canopy cover based on satellite telemetry observations. Gradual upward slopes across divisions show successful community afforestation initiatives and sustainable forest management boundaries."
    },
    secondaryChart: {
      type: "bar",
      title: "Landslide Vulnerability Critical Points Mapping",
      seriesName: "Identified Risk Locations",
      data: [4, 2, 5, 1, 0, 3, 6, 2, 1, 4, 3],
      wardData: {
        "Ward 5": [2, 1, 3, 0, 0, 1, 4, 1, 0, 2, 2],
        "Ward 11": [5, 3, 6, 2, 1, 4, 8, 3, 2, 5, 9]
      },
      description: "This horizontal matrix lists the count of active, structurally unstable geological risk nodes by ward area. Wards displaying counts above 4 indicate immediate requirements for retaining walls, structural barriers, and focused preventative terrain monitoring."
    }
  },
  agriculture: {
    title: "AGRICULTURE - Subsidy & Crop Cycle Track",
    scheduleTitle: "Fertilizer & Seed Disbursals (Select a Ward)",
    schedules: [
      { label: "Ward 7", name: "Organic Fertilizer Allocation", time: "02:00 PM", urgent: false },
      { label: "Ward 8", name: "Irrigation Canal Inspection", time: "Oct 24", urgent: true },
      { label: "Ward 2", name: "Crop Rotation Planning", time: "Oct 24", urgent: true },
      { label: "Ward 11", name: "Seed Quality Verification", time: "Oct 24", urgent: true }
    ],
    defaultAlertText: "Select an active agricultural deployment from the grid to pull soil testing records, grain distribution catalogs, and technician logs.",
    markers: [
      { lat: 27.74067868526365, lng: 85.10038733584588, title: "Odale Krishi Farm", desc: "Stockpiled: 45 Metric Tons | Distribution Ready | Irrigation: Automated", color: "#eab308" },
      { lat: 27.73247409180016, lng: 85.11592269047193, title: "Mahankal Agro Farm", desc: "Stockpiled: 38 Metric Tons | Distribution Ongoing | Livestock: 120 Goats", color: "#eab308" },
      { lat: 27.749760943548615, lng: 85.0479018698566, title: "Kalika Agriculture Firm", desc: "Stockpiled: 52 Metric Tons | Distribution Pending | Crop Variety: Maize & Wheat", color: "#eab308" },
      { lat: 27.740493518889988, lng: 85.1269519342333, title: "Bagmati Goat Seeds Pvt. Ltd.", desc: "Stockpiled: 41 Metric Tons | Distribution Ready | Breeding Units: 8 Active", color: "#eab308" },
    ],
    notices: [
      { ward: "Ward 7", campaignName: "Urea Distribution Protocol", leadPerson: "Officer Hari Prasad", role: "Agri-Extension Specialist", details: "Overseeing government-subsidized fertilizer release to verified farming land ownership certificate holders.", status: "Active" },
      { ward: "Ward 8", campaignName: "Liming Treatment Campaign", leadPerson: "Ms. Deepa Pokhrel", role: "Soil Laboratory Analyst", details: "Distributing agricultural lime compounds to combat critical acidic saturation found in local vegetable fields.", status: "Critical" },
      { ward: "Ward 2", campaignName: "Irrigation Canal Inspection", leadPerson: "Engineer Sunil Thapa", role: "Water Resource Manager", details: "Checking water flow consistency and blockage points along the main irrigation canal network.", status: "Active" },
      { ward: "Ward 11", campaignName: "Seed Quality Verification", leadPerson: "Dr. Archana Shrestha", role: "Agronomist", details: "Sampling and testing seed batches for germination rates and varietal purity before distribution to farmers.", status: "Critical" }
    ],
    primaryChart: {
      type: "column",
      title: "Seasonal Crop Yield Metrics (Metric Tons)",
      yAxisLabel: "Yield Volume",
      seriesName: "Paddy Harvesting",
      categories: ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6", "Ward 7", "Ward 8", "Ward 9", "Ward 10", "Ward 11"],
      data: [40, 65, 80, 55, 42, 60, 95, 70, 48, 35, 50],
      wardData: {
        "Ward 3": [30, 45, 130, 40, 35, 50, 70, 55, 40, 25, 38],
        "Ward 7": [42, 55, 65, 48, 38, 52, 160, 60, 44, 30, 45]
      },
      color: "#eab308",
      gradientTo: "rgba(234, 179, 8, 0.1)",
      description: "Tracks crop production quantities across municipal sub-sectors. Sharp upward distributions in Ward 7 reveal enhanced farming practices, serving as a template for lower-performing zones."
    },
    secondaryChart: {
      type: "pie",
      title: "Distributed Subsidies Resource Allocation Share",
      seriesName: "Budget Share",
      data: [
        { name: "Organic Seeds", y: 50, color: "#eab308" },
        { name: "Irrigation Fuel", y: 25, color: "#3b82f6" },
        { name: "Mechanized Tillers", y: 25, color: "#10b981" }
      ],
      wardData: {
        "Ward 3": [
          { name: "Organic Seeds", y: 20, color: "#eab308" },
          { name: "Irrigation Fuel", y: 65, color: "#3b82f6" },
          { name: "Mechanized Tillers", y: 15, color: "#10b981" }
        ],
        "Ward 7": [
          { name: "Organic Seeds", y: 35, color: "#eab308" },
          { name: "Irrigation Fuel", y: 15, color: "#3b82f6" },
          { name: "Mechanized Tillers", y: 50, color: "#10b981" }
        ]
      },
      description: "Illustrates where agricultural investment capital is allocated, identifying that seedling acquisition currently claims half of total municipal grants."
    }
  },
  infrastructure: {
    title: "INFRASTRUCTURE - Thakre Road Connectivity & Grid Extension",
    scheduleTitle: "Civil Engineering Project Timelines (Select a Ward)",
    schedules: [
      { label: "Ward 7", name: "Naukila Pul Structural Check", time: "09:00 AM", urgent: true },
      { label: "Ward 8", name: "Mahesh River Bridge Load Test", time: "Oct 22", urgent: false },
      { label: "Ward 11", name: "Mahesh Khola Suspension Bridge Inspection", time: "Oct 25", urgent: false },
      { label: "Ward 9", name: "Manakamana Roda Dhunga Udhyog Power Audit", time: "Oct 25", urgent: false }
    ],
    defaultAlertText: "Select an active public work site node to monitor asphalt laying velocity, concrete structural blueprints, rural electrification grants, and municipal engineer logs.",
    markers: [
      { lat: 27.74599784433173, lng: 85.10167478323257, title: "Mahesh Khola Suspension Bridge Inspection", desc: "Inspection Phase: 100% | Structural Integrity Verified | Safety Clearance: Approved", color: "#f97316" },
      { lat: 27.748162736658763, lng: 85.08734105809208, title: "Mahesh River Bridge Load Test", desc: "Load Test: Completed | Feeder Active | Capacity Verified at 85%", color: "#f97316" },
      { lat: 27.747706973457404, lng: 85.08186935161866, title: "Naukila Pul Structural Check", desc: "Structural Review: Ongoing | Reinforcement Stable | Lighting System Operational", color: "#f97316" },
      { lat: 27.75136082387367, lng: 85.08186935161866, title: "Manakamana Roda Dhunga Udhyog Power Audit", desc: "Power Audit: Completed | Feeder Active | Industrial Output: 62 Tons/day", color: "#f97316" }
    ],
    notices: [
      { ward: "Ward 7", campaignName: "Naukila Pul Structural Check", leadPerson: "Er. Ramesh Thapa", role: "Structural Engineer", details: "Conducting reinforcement inspections, deck alignment checks, and safety compliance reviews for Naukila Pul.", status: "Active" },
      { ward: "Ward 8", campaignName: "Mahesh River Bridge Load Test", leadPerson: "Mr. Suresh Shrestha", role: "Bridge Load Inspector", details: "Performing load capacity tests, monitoring stress distribution, and verifying feeder synchronization.", status: "Critical" },
      { ward: "Ward 11", campaignName: "Mahesh Khola Suspension Bridge Inspection", leadPerson: "Er. Sunita Maharjan", role: "Structural Project Engineer", details: "Inspecting suspension cables, abutments, and flood resilience measures for Mahesh Khola Bridge.", status: "Scheduled" },
      { ward: "Ward 9", campaignName: "Manakamana Roda Dhunga Udhyog Power Audit", leadPerson: "Dr. Binod Khadka", role: "Industrial Energy Auditor", details: "Auditing transformer synchronization, feeder activity, and industrial energy output of the stone industry.", status: "Scheduled" }
    ],
    primaryChart: {
      type: "column",
      title: "Road Network Extension Progress (Kilometers Paved)",
      yAxisLabel: "Kilometers Completed",
      seriesName: "Asphalt Laid",
      categories: ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6", "Ward 7", "Ward 8", "Ward 9", "Ward 10", "Ward 11"],
      data: [2.4, 4.2, 1.8, 3.5, 0.8, 2.9, 5.1, 3.0, 1.5, 0.4, 2.1],
      wardData: {
        "Ward 2": [1.1, 9.8, 1.5, 2.2, 0.4, 1.9, 3.2, 2.0, 1.1, 0.2, 1.5],
        "Ward 5": [1.9, 2.5, 1.2, 2.8, 6.4, 2.1, 3.8, 2.4, 1.0, 0.3, 1.8],
        "Ward 6": [2.0, 3.1, 1.4, 2.9, 0.6, 8.5, 4.2, 2.8, 1.3, 0.4, 1.9]
      },
      color: "#f97316",
      gradientTo: "rgba(249, 115, 22, 0.1)",
      description: "Tracks total linear road blacktopping metrics across Thakre municipal sub-sectors. Significant milestones in Ward 7 reveal fast-tracked highway corridor linking projects, serving as a progress model."
    },
    secondaryChart: {
      type: "pie",
      title: "Municipal Infrastructure Budget Capital Share Allocation",
      seriesName: "Budget Share",
      data: [
        { name: "Highway Link Corridors", y: 45, color: "#f97316" },
        { name: "Rural Grid Electrification", y: 35, color: "#06b6d4" },
        { name: "Water Supply Mains", y: 20, color: "#64748b" }
      ],
      wardData: {
        "Ward 2": [
          { name: "Highway Link Corridors", y: 80, color: "#f97316" },
          { name: "Rural Grid Electrification", y: 10, border: "#06b6d4", color: "#06b6d4" },
          { name: "Water Supply Mains", y: 10, color: "#64748b" }
        ],
        "Ward 5": [
          { name: "Highway Link Corridors", y: 15, color: "#f97316" },
          { name: "Rural Grid Electrification", y: 75, color: "#06b6d4" },
          { name: "Water Supply Mains", y: 10, color: "#64748b" }
        ],
        "Ward 6": [
          { name: "Highway Link Corridors", y: 30, color: "#f97316" },
          { name: "Rural Grid Electrification", y: 20, color: "#06b6d4" },
          { name: "Water Supply Mains", y: 50, color: "#64748b" }
        ]
      },
      description: "Illustrates where civil development infrastructure capital is routed, confirming that link road asset management accounts for nearly half of Thakre's development funds."
    }
  },
  government_office: {
    title: "GOVERNMENT - Municipal Administration & Public Services",
    scheduleTitle: "Administrative Town Halls & Public Hearing Rosters (Select a Ward to View Notices)",
    schedules: [
      { label: "Ward 3", name: "Vital Registration Camp", time: "Tomorrow", urgent: true },
      { label: "Ward 4", name: "Land Revenue Orientation", time: "Oct 19", urgent: false },
      { label: "Ward 7", name: "Local Grievance Hearing", time: "Oct 21", urgent: true },
      { label: "Ward 8", name: "Social Security Distribution", time: "Oct 24", urgent: false },
      { label: "Ward 9", name: "Agricultural Subsidy Signup", time: "Oct 26", urgent: false },
      { label: "Ward 10", name: "Infrastructure Planning Meet", time: "Oct 30", urgent: true }
    ],
    defaultAlertText: "Select an active ward administrative timeline from the Action Center grid to pull real-time operational logs, local governance manifests, and public hearing minutes.",
    markers: [
      { lat: 27.722787318162062, lng: 85.03779530670305, title: "Thakre Ward 3 Office", desc: "Tokens: 14 Pending | Token System: Active | Staff: 5 Present | Service: Vital Registration & Planning Approval", color: "#f97316" },
      { lat: 27.718076576116292, lng: 85.06526112776929, title: "Thakre Ward 4 Office", desc: "Citizenship Verification: 8 today | Land Tax Records: Up to Date | Staff: 6 Present", color: "#f97316" },
      { lat: 27.728865394252292, lng: 85.09942174272047, title: "Thakre Ward 7 Office", desc: "Public Grievance Log: 3 open | Senior Allowances: 88% disbursed | Staff: 4 Present", color: "#f97316" },
      { lat: 27.73099264101068, lng: 85.12122273710361, title: "Thakre Ward 8 Office", desc: "Business Registrations: 5 processed today | Token Wait Time: 12 min | Staff: 5 Present", color: "#f97316" },
      { lat: 27.753933875558037, lng: 85.12276768890261, title: "Thakre Ward 9 Office", desc: "Farming Identification Drives: 11 active | System Status: Online | Staff: 4 Present", color: "#f97316" },
      { lat: 27.759250690421798, lng: 85.10680318040784, title: "Thakre Ward 10 Office", desc: "Local Road Project Review: 2 items active | Public Notice Board: Updated | Staff: 6 Present", color: "#f97316" }
    ],
    notices: [
      { ward: "Ward 3", campaignName: "National Identity Card Enrollment", leadPerson: "Niranjan Thapa", role: "Ward Secretary", details: "Biometric processing drive for newly eligible voters. Applicants must carry physical citizenship certificates.", status: "Critical" },
      { ward: "Ward 3", campaignName: "School Infrastructure Audit", leadPerson: "Maya Shrestha", role: "Education Coordinator", details: "Inspection of classrooms and computer labs for safety and digital readiness.", status: "Scheduled" },
      { ward: "Ward 3", campaignName: "Health Post Vaccination Drive", leadPerson: "Dr. Ramesh Karki", role: "Medical Officer", details: "Free immunization program for children under 5 years.", status: "Active" },
      { ward: "Ward 4", campaignName: "E-Governance Portal Training", leadPerson: "Sunita Rajbhandari", role: "IT Officer", details: "Public onboarding session explaining tracking features for digital land municipal tax clearances.", status: "Scheduled" },
      { ward: "Ward 4", campaignName: "Community Clean-Up Campaign", leadPerson: "Bishnu Lama", role: "Environment Officer", details: "Mobilization of youth groups for solid waste management.", status: "Active" },
      { ward: "Ward 4", campaignName: "Women’s Skill Development Workshop", leadPerson: "Saraswati Gurung", role: "Social Development Coordinator", details: "Training on tailoring and handicrafts for income generation.", status: "Scheduled" },
      { ward: "Ward 7", campaignName: "Community Ward Budget Planning", leadPerson: "Kiran Bahadur Karki", role: "Ward Chairperson", details: "Public assembly to collect community suggestions on infrastructural allocations and drinking water extensions.", status: "Active" },
      { ward: "Ward 7", campaignName: "Agricultural Seed Distribution", leadPerson: "Laxmi Tamang", role: "Agriculture Officer", details: "Distribution of improved maize and wheat seeds to farmers.", status: "Scheduled" },
      { ward: "Ward 7", campaignName: "Youth Sports Tournament", leadPerson: "Rajendra Thapa", role: "Sports Coordinator", details: "Ward-level football and volleyball competition for youth engagement.", status: "Active" },
      { ward: "Ward 8", campaignName: "Social Security Allowance Distribution", leadPerson: "Gita Giri", role: "Administrative Assistant", details: "Disbursement of monthly senior citizen and disability allowances via simplified fast-track service queues.", status: "Active" },
      { ward: "Ward 8", campaignName: "Drinking Water Pipeline Extension", leadPerson: "Hari Maya Lama", role: "Infrastructure Officer", details: "Expansion of pipelines to underserved households.", status: "Critical" },
      { ward: "Ward 8", campaignName: "Literacy Campaign", leadPerson: "Sushil KC", role: "Education Volunteer", details: "Adult literacy classes for marginalized communities.", status: "Scheduled" },
      { ward: "Ward 9", campaignName: "Small Business Registration Desk", leadPerson: "Dipendra Shrestha", role: "Revenue Officer", details: "On-site legal validation counter setup for commercial entities operating without a formal ward registration.", status: "Scheduled" },
      { ward: "Ward 9", campaignName: "Road Maintenance Program", leadPerson: "Manoj Khadka", role: "Infrastructure Supervisor", details: "Repair of damaged rural roads and culverts.", status: "Active" },
      { ward: "Ward 9", campaignName: "Health Awareness Seminar", leadPerson: "Dr. Anita Rai", role: "Health Officer", details: "Session on sanitation and preventive healthcare.", status: "Scheduled" },
      { ward: "Ward 10", campaignName: "Right-of-Way Dispute Settlement", leadPerson: "Hari Prasad Lekhak", role: "Legal Coordinator", details: "Arbitration meeting resolving spatial boundary disputes blocking the secondary road infrastructure network.", status: "Critical" },
      { ward: "Ward 10", campaignName: "Renewable Energy Promotion", leadPerson: "Keshav Thapa", role: "Energy Officer", details: "Awareness drive on solar panel installation subsidies.", status: "Scheduled" },
      { ward: "Ward 10", campaignName: "Community Health Camp", leadPerson: "Dr. Binita Shrestha", role: "Medical Coordinator", details: "Free check-up and medicine distribution for rural households.", status: "Active" }
    ],
    primaryChart: {
      type: "column",
      title: "Daily Administrative Token & Service Volume Analysis (By Ward Area)",
      yAxisLabel: "Service Deliveries Count",
      seriesName: "Applications Processed",
      categories: ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6", "Ward 7", "Ward 8", "Ward 9", "Ward 10", "Ward 11"],
      data: [28, 40, 65, 58, 30, 25, 72, 48, 42, 54, 31],
      wardData: {
        "Ward 3": [10, 12, 115, 22, 14, 18, 30, 15, 12, 20, 14],
        "Ward 4": [15, 18, 25, 98, 14, 20, 22, 19, 15, 14, 11],
        "Ward 7": [20, 24, 32, 18, 15, 12, 140, 28, 22, 19, 16],
        "Ward 8": [12, 14, 19, 21, 10, 11, 24, 105, 18, 15, 14],
        "Ward 9": [11, 16, 20, 14, 18, 15, 21, 25, 92, 22, 10],
        "Ward 10": [14, 11, 15, 19, 22, 14, 18, 20, 25, 110, 18]
      },
      color: "#f97316",
      gradientTo: "rgba(249, 115, 22, 0.1)",
      description: "This bar chart tracks daily administrative service outputs across local divisions. Pronistered spikes in Wards 3, 7, and 10 match targeted civic campaigns, outlining where digital terminal allocations should be prioritized."
    },
    secondaryChart: {
      type: "pie",
      title: "Administrative Ticket Distribution Breakdown",
      seriesName: "Share",
      data: [
        { name: "Vital Registrations (Birth/Death/Marriage)", y: 40, color: "#3b82f6" },
        { name: "Land Records & Tax Assessment", y: 25, color: "#f97316" },
        { name: "Social Security & Welfare Claims", y: 20, color: "#10b981" },
        { name: "Business Licensing & Permits", y: 15, color: "#a855f7" }
      ],
      wardData: {
        "Ward 3": [
          { name: "Vital Registrations (Birth/Death/Marriage)", y: 65, color: "#3b82f6" },
          { name: "Land Records & Tax Assessment", y: 15, color: "#f97316" },
          { name: "Social Security & Welfare Claims", y: 10, color: "#10b981" },
          { name: "Business Licensing & Permits", y: 10, color: "#a855f7" }
        ],
        "Ward 4": [
          { name: "Vital Registrations (Birth/Death/Marriage)", y: 20, color: "#3b82f6" },
          { name: "Land Records & Tax Assessment", y: 55, color: "#f97316" },
          { name: "Social Security & Welfare Claims", y: 15, color: "#10b981" },
          { name: "Business Licensing & Permits", y: 10, color: "#a855f7" }
        ],
        "Ward 7": [
          { name: "Vital Registrations (Birth/Death/Marriage)", y: 25, color: "#3b82f6" },
          { name: "Land Records & Tax Assessment", y: 20, color: "#f97316" },
          { name: "Social Security & Welfare Claims", y: 45, color: "#10b981" },
          { name: "Business Licensing & Permits", y: 10, color: "#a855f7" }
        ]
      },
      description: "This structural allocation chart evaluates the volume of public visits categorized by statutory service headers. General registrations and property taxes account for the majority of actions, driving municipal office resource scheduling."
    }
  },
  social_service: {
    title: "SOCIAL SERVICE - Community Development & Women's Empowerment",
    scheduleTitle: "Empowerment Workshops & Community Action Rosters (Select a Group to View Activity)",
    schedules: [
      { label: "Mahadevbesi", name: "Micro-Finance Literacy Drive", time: "Tomorrow", urgent: true },
      { label: "Tasarpu", name: "Maternal Health & Nutrition Camp", time: "Oct 20", urgent: false },
      { label: "Bhumesthan", name: "Handicrafts Marketing Workshop", time: "Oct 22", urgent: true },
      { label: "Kebalpur", name: "Organic Farming Subsidy Distribution", time: "Oct 25", urgent: false }
    ],
    defaultAlertText: "Select an active community group timeline from the Action Center grid to pull real-time field operation logs, community action manifests, and local assembly minutes.",
    markers: [
      { lat: 27.75456, lng: 85.06633, title: "Mahadevbesi Aama Samuha", desc: "Members: 42 Active | Micro-credit Savings: Up to Date | Lead Projects: Cooperative Tailoring Center", color: "#ec4899" },
      { lat: 27.75010, lng: 85.06870, title: "Tasarpu Aama Samuha", desc: "Members: 38 Active | Health Log: 12 Checkups Completed | Lead Projects: Community Kitchen & Literacy", color: "#ec4899" },
      { lat: 27.7266, lng: 85.06428, title: "Bhumesthan Mahila Samuha", desc: "Members: 51 Active | Small Scale Funding: 4 Approved | Lead Projects: Entrepreneurship Bootcamp", color: "#ec4899" },
      { lat: 27.75870, lng: 85.09450, title: "Kebalpur Mahila Samuha", desc: "Members: 47 Active | Agriculture Registry: 29 Listed | Lead Projects: Seed Banking & Distribution", color: "#ec4899" }
    ],
    notices: [
      { ward: "Mahadevbesi", campaignName: "Micro-Credit Bookkeeping Training", leadPerson: "Radha Thapa", role: "Samuha Chairperson", details: "Financial literacy class focusing on maintaining transparent ledger logs for internal group savings.", status: "Critical" },
      { ward: "Mahadevbesi", campaignName: "Sanitary Pad Distribution Drive", leadPerson: "Sita Shrestha", role: "Health Volunteer", details: "Awareness session and distribution of reusable sanitary products to local adolescent girls.", status: "Active" },
      { ward: "Tasarpu", campaignName: "Maternal Nutrition Orientation", leadPerson: "Dr. Geeta Adhikari", role: "Public Health Officer", details: "Interactive workshop for pregnant and lactating mothers on dietary improvements using locally available resources.", status: "Scheduled" },
      { ward: "Tasarpu", campaignName: "Adult Literacy Evening Classes", leadPerson: "Sunita Lama", role: "Education Coordinator", details: "Basic reading, writing, and functional digital literacy setup for elderly female members.", status: "Active" },
      { ward: "Bhumesthan", campaignName: "Handicrafts & Tailoring Expo Planning", leadPerson: "Kala Tamang", role: "Program Director", details: "Mobilization meeting to prepare handicraft products for the upcoming district-level MSME trade fair.", status: "Critical" },
      { ward: "Bhumesthan", campaignName: "Legal Awareness on Women's Rights", leadPerson: "Advocate Rajesh KC", role: "Legal Consultant", details: "Legal aid session outlining property rights, domestic violence protection laws, and municipal safety resources.", status: "Scheduled" },
      { ward: "Kebalpur", campaignName: "Organic Vegetable Farming Workshop", leadPerson: "Anil Sapkota", role: "Agriculture Extensionist", details: "Technical training on vermicomposting, organic pest control, and high-yield off-season vegetable farming.", status: "Active" },
      { ward: "Kebalpur", campaignName: "Community Seed Bank Initialization", leadPerson: "Parvati Gurung", role: "Samuha Secretary", details: "Collection and preservation tracking of native, climate-resilient crop seeds for local distribution.", status: "Scheduled" }
    ],
    primaryChart: {
      type: "column",
      title: "Monthly Community Participation & Program Attendance Analysis",
      yAxisLabel: "Active Participant Count",
      seriesName: "Members Engaged",
      categories: ["Mahadevbesi", "Tasarpu", "Bhumesthan", "Kebalpur"],
      data: [142, 118, 165, 134],
      wardData: {
        "Mahadevbesi": [45, 32, 40, 25],
        "Tasarpu": [30, 48, 20, 20],
        "Bhumesthan": [50, 25, 60, 30],
        "Kebalpur": [35, 22, 32, 45]
      },
      color: "#ec4899",
      gradientTo: "rgba(236, 72, 153, 0.1)",
      description: "This bar chart tracks individual program attendance across the four women's groups. Pronounced spikes reflect intensive localized training camps, demonstrating strong engagement in entrepreneurial and health-focused programs."
    },
    secondaryChart: {
      type: "pie",
      title: "Community Fund Resource Allocation Breakdown",
      seriesName: "Share",
      data: [
        { name: "Micro-Finance & Small Business Loans", y: 45, color: "#ec4899" },
        { name: "Health, Sanitation & Nutrition Initiatives", y: 25, color: "#06b6d4" },
        { name: "Skill Development & Vocational Training", y: 20, color: "#f59e0b" },
        { name: "Agricultural Equipment & Seed Banking", y: 10, color: "#10b981" }
      ],
      wardData: {
        "Mahadevbesi": [
          { name: "Micro-Finance & Small Business Loans", y: 60, color: "#ec4899" },
          { name: "Health, Sanitation & Nutrition Initiatives", y: 15, color: "#06b6d4" },
          { name: "Skill Development & Vocational Training", y: 15, color: "#f59e0b" },
          { name: "Agricultural Equipment & Seed Banking", y: 10, color: "#10b981" }
        ],
        "Bhumesthan": [
          { name: "Micro-Finance & Small Business Loans", y: 30, color: "#ec4899" },
          { name: "Health, Sanitation & Nutrition Initiatives", y: 20, color: "#06b6d4" },
          { name: "Skill Development & Vocational Training", y: 40, color: "#f59e0b" },
          { name: "Agricultural Equipment & Seed Banking", y: 10, color: "#10b981" }
        ]
      },
      description: "This allocation structure highlights how internal group funds and local grants are distributed. Financial empowerment via micro-loans and skill acquisition courses accounts for the vast majority of local investments."
    }
  },
  finance_and_revenue: {
    title: "FINANCE & REVENUE - District Fiscal Administration & Tax Services",
    scheduleTitle: "Revenue Planning Calendars, Audit Windows & Public Filing Deadlines",
    schedules: [
      { label: "LRO Dhading", name: "Land Valuation Revision Hearing", time: "Tomorrow", urgent: true },
      { label: "TSO Galchi", name: "Integrated Tax Filing & PAN Camp", time: "Oct 20", urgent: true },
      { label: "Survey Unit", name: "Digital Parcel Mapping Alignment", time: "Oct 22", urgent: false },
      { label: "DTCO Dhading", name: "Treasury Closing & Budget Review", time: "Oct 26", urgent: false },
      { label: "DCC Dhading", name: "Local Revenue Sharing Summit", time: "Oct 29", urgent: true }
    ],
    defaultAlertText: "Select an active district financial node or tracking timeline from the Action Center grid to pull real-time treasury logs, revenue settlement metrics, and tax collection summaries.",
    markers: [
      { lat: 27.75331, lng: 85.06442, title: "Municipal Revenue Section", desc: "Property Tax Collection: Open | Business Registration: Available | Revenue Counter: Active | Staff: 6 Present", color: "#1e3a8a" },
      { lat: 27.75692, lng: 85.05884, title: "Mahadevbesi Revenue Collection Center", desc: "House Tax Payments: 27 Today | Service Charges Collection: Ongoing | Citizen Queue: Moderate", color: "#1e3a8a" },
      { lat: 27.74855, lng: 85.07163, title: "Business Tax & Licensing Desk", desc: "New Business Licenses: 8 Issued | Renewal Requests: 15 Pending | Digital Payment: Available", color: "#1e3a8a" },
      { lat: 27.76148, lng: 85.05126, title: "Municipal Financial Service Center", desc: "Revenue Collection Status: Normal | Citizen Services: Active | Daily Transactions: 61", color: "#1e3a8a" },
      { lat: 27.74481, lng: 85.07952, title: "Land & Property Tax Help Desk", desc: "Property Record Verification | Tax Assessment Support | Citizen Assistance Counter", color: "#1e3a8a" }
    ],
    notices: [
      { ward: "LRO Dhading", campaignName: "Land Registry Digital Migration", leadPerson: "Ramesh Kumar Adhikari", role: "Chief Land Revenue Officer", details: "Upgrading physical land logs into the central NeLRiS digital portal at Land Revenue Office. Expect short service windows for land transfers.", status: "Critical" },
      { ward: "LRO Dhading", campaignName: "Missed Land Tax Amnesty Window", leadPerson: "Gita Poudel", role: "Section Officer", details: "Public hearing providing waiver allowances on historic compound interest penalties for long-overdue property taxes.", status: "Active" },
      { ward: "TSO Galchi", campaignName: "Business Income Tax (D1) Filing Support", leadPerson: "Hari Shrestha", role: "Tax Officer", details: "Helpdesk setup helping small commercial firms file annual tax returns directly into the IRD portal before deadline day at the Galchi Federal Office.", status: "Critical" },
      { ward: "TSO Galchi", campaignName: "Biometric PAN Registration Drive", leadPerson: "Sita Thapa", role: "IT Assistant", details: "Onsite instant issuance of Personal and Business Permanent Account Numbers for rural transport operators.", status: "Scheduled" },
      { ward: "Survey Unit", campaignName: "Choropleth Boundary Dispute Resolution", leadPerson: "Niranjan Rajbhandari", role: "Chief Survey Officer", details: "Joint land measurement assembly at the Malpot Survey/Measurement Unit addressing technical overlapping claims on agro-industrial sector borders.", status: "Active" },
      { ward: "DTCO Dhading", campaignName: "Treasury Single Account (TSA) Training", leadPerson: "Deepak Agrawal", role: "District Comptroller", details: "Capacity development program at DTCO Dhading for local level accounting staff on internal fiscal discipline and central ledger systems.", status: "Scheduled" },
      { ward: "DCC Dhading", campaignName: "Natural Resource Royalty Assessment", leadPerson: "Kiran Bahadur Lama", role: "Revenue Coordinator", details: "Reviewing operational extraction revenue shares from sand and stone mining allocations alongside local Palikas at the District Coordination Committee.", status: "Critical" }
    ],
    primaryChart: {
      type: "column",
      title: "Daily Administrative Token & Service Volume Analysis (By Fiscal Node)",
      yAxisLabel: "Service Deliveries Count",
      seriesName: "Applications Processed",
      categories: ["LRO Dhading", "TSO Galchi", "Survey Unit", "DTCO Dhading", "DCC Dhading"],
      data: [184, 142, 98, 56, 38],
      wardData: {
        "LRO Dhading": [120, 24, 30, 5, 5],
        "TSO Galchi": [15, 110, 8, 4, 5],
        "Survey Unit": [45, 12, 35, 3, 3]
      },
      color: "#1e3a8a",
      gradientTo: "rgba(30, 58, 138, 0.1)",
      description: "This bar chart tracks daily fiscal administrative volume across district facilities. Pronounced transaction spikes at the Land Revenue Office and TSO Galchi reflect cyclical tax seasons and ongoing property digital tracking workflows."
    },
    secondaryChart: {
      type: "pie",
      title: "Fiscal Transaction & Audit Request Breakdown",
      seriesName: "Share",
      data: [
        { name: "Property Land Registrations & Ownership Transfers", y: 42, color: "#1e3a8a" },
        { name: "Internal Revenue Collection & Income Tax Filings", y: 28, color: "#dc2626" },
        { name: "Geospatial Land Survey & Parcel Demarcations", y: 18, color: "#f59e0b" },
        { name: "Government Expenditure Disbursals & Inter-Local Audits", y: 12, color: "#10b981" }
      ],
      wardData: {
        "LRO Dhading": [
          { name: "Property Land Registrations & Ownership Transfers", y: 80, color: "#1e3a8a" },
          { name: "Internal Revenue Collection & Income Tax Filings", y: 20, color: "#dc2626" }
        ],
        "TSO Galchi": [
          { name: "Internal Revenue Collection & Income Tax Filings", y: 85, color: "#dc2626" },
          { name: "Property Land Registrations & Ownership Transfers", y: 15, color: "#1e3a8a" }
        ]
      },
      description: "This structural breakdown chart maps aggregate government business activity headers. Property conveyance operations combined with standard commercial tax tracking account for three quarters of district administrative volumes."
    }
  }
};

export const GisMapRenderer = ({ 
  activeDepartment,
  activeIcon,
  mapView = "osm",
}: GisMapRendererProps) => {
  const { t } = useTranslation("map");
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const tt = (key: string, fallback: string) => t(key, { defaultValue: fallback });

  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);

  const data = useMemo(() => {
    const base = DEPARTMENT_DATABASE[activeDepartment] || DEPARTMENT_DATABASE["health"];

    return {
      ...base,
      title: tt(`database.titles.${activeDepartment}`, base.title),
      scheduleTitle: tt(`database.schedules.${activeDepartment}`, base.scheduleTitle),
      defaultAlertText: tt(`department_default_alerts.${activeDepartment}`, base.defaultAlertText),
      primaryChart: {
        ...base.primaryChart,
        title: tt(`department_charts.${activeDepartment}.primary.title`, base.primaryChart.title),
        yAxisLabel: tt(`department_charts.${activeDepartment}.primary.yAxisLabel`, base.primaryChart.yAxisLabel),
        seriesName: tt(`department_charts.${activeDepartment}.primary.seriesName`, base.primaryChart.seriesName),
        description: tt(`department_charts.${activeDepartment}.primary.description`, base.primaryChart.description),
      },
      secondaryChart: {
        ...base.secondaryChart,
        title: tt(`department_charts.${activeDepartment}.secondary.title`, base.secondaryChart.title),
        seriesName: tt(`department_charts.${activeDepartment}.secondary.seriesName`, base.secondaryChart.seriesName),
        description: tt(`department_charts.${activeDepartment}.secondary.description`, base.secondaryChart.description),
      },
    };
  }, [activeDepartment, t]);

  useEffect(() => {
    setSelectedWard(null);
  }, [activeDepartment]);

  const filteredNotices = useMemo(() => {
    if (!selectedWard) return [];
    return data.notices.filter((n) => n.ward.toLowerCase() === selectedWard.toLowerCase());
  }, [selectedWard, data]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }

    const tileUrl =
      mapView === "satellite"
        ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    const attribution =
      mapView === "satellite"
        ? "Tiles &copy; Esri &mdash; Source: Esri"
        : "&copy; OpenStreetMap contributors &copy; CARTO";

    const newLayer = L.tileLayer(tileUrl, { attribution }).addTo(mapRef.current);
    tileLayerRef.current = newLayer;
  }, [mapView]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, { 
      zoomControl: false,
      attributionControl: false
    }).setView([27.712, 85.025], 12);

    const initialLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png").addTo(map);
    tileLayerRef.current = initialLayer;
    L.control.zoom({ position: "topright" }).addTo(map);

    layerGroupRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    map.on("popupopen", (e) => {
      const popupNode = e.popup.getElement();
      if (!popupNode) return;

      const viewDetailsBtn = popupNode.querySelector(".view-details-btn");
      if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener("click", () => {
          const title = viewDetailsBtn.getAttribute("data-title") || "";
          const desc = viewDetailsBtn.getAttribute("data-desc") || "";
          const lat = parseFloat(viewDetailsBtn.getAttribute("data-lat") || "0");
          const lng = parseFloat(viewDetailsBtn.getAttribute("data-lng") || "0");
          const color = viewDetailsBtn.getAttribute("data-color") || "";

          setSelectedMarker({ title, desc, lat, lng, color });
          setIsDrawerOpen(true);
          map.closePopup();
        });
      }
    });

    fetch("/data/thakre_boundary.geojson")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((geoJsonData) => {
        if (!mapRef.current) return;

        const boundaryLayer = L.geoJSON(geoJsonData, {
          filter: (feature) => feature.geometry?.type !== "Point",
          style: () => ({
            color: "#ea580c",       
            weight: 2.5,           
            opacity: 0.9,          
            dashArray: "6, 6",     
            fillColor: "#ea580c",  
            fillOpacity: 0.03      
          })
        }).addTo(mapRef.current);

        setTimeout(() => {
          if (!mapRef.current) return;
          mapRef.current.invalidateSize();
          mapRef.current.fitBounds(boundaryLayer.getBounds(), {
            padding: [30, 30],
            maxZoom: 19, 
            animate: true
          });
        }, 150);
      })
      .catch((err) => console.error("Error reading boundary geojson:", err));

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const layerGroup = layerGroupRef.current;
    if (!layerGroup || !mapRef.current) return;

    layerGroup.clearLayers();
    const activeMarkerColor = DEPARTMENT_THEMES[activeDepartment] || "#ffffff";
    const iconHtml = renderToString(activeIcon as React.ReactElement);

    if (data.markers && data.markers.length > 0) {
      data.markers.forEach((markerInfo) => {
        const pinIcon = L.divIcon({
          className: "custom-map-marker",
          html: `
            <div class="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white shadow-lg" 
                 style="background-color: ${activeMarkerColor};">
              <span class="text-white text-base">${iconHtml}</span>
            </div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        
        const mapMarker = L.marker([markerInfo.lat, markerInfo.lng], { icon: pinIcon });
        const googleMapsUrl = `https://www.google.com/maps?q=${markerInfo.lat},${markerInfo.lng}`;
        
        const popupContent = `
  <div class="gov-gis-popup-container flex flex-col gap-3 w-[340px] p-3.5 font-sans">
    <div class="flex gap-4 items-start">
      <div class="gov-gis-popup-qr-section flex flex-col items-center gap-1.5 shrink-0">
        <div class="qr-wrapper w-[80px] h-[80px] border border-slate-200 p-1 bg-white rounded-md">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(googleMapsUrl)}" alt="${tt("drawer.scan_profile", "Scan Web Profile")}" class="w-full h-full object-contain" />
        </div>
        <span class="qr-subtext text-[11px] font-bold text-slate-500 tracking-wider">${tt("drawer.scan_profile", "Scan Web Profile")}</span>
      </div>
      
      <div class="gov-gis-popup-info-section flex-1 min-w-0 flex flex-col gap-1.5">
        <span class="facility-title text-base font-bold text-slate-900 block truncate">${markerInfo.title}</span>
        
        <div class="info-row text-sm text-slate-600 flex gap-2">
          <span class="label font-medium text-slate-400 w-16 shrink-0">${tt("popup.status", "Status")}</span>
          <span class="value text-emerald-600 font-bold truncate">: ${tt("popup.operational", "Operational")}</span>
        </div>
        
        <div class="info-row text-sm text-slate-600 flex gap-2">
          <span class="label font-medium text-slate-400 w-16 shrink-0">${tt("popup.details", "Details")}</span>
          <span class="value text-slate-700 font-medium break-words leading-tight">: ${markerInfo.desc}</span>
        </div>
        
        <div class="info-row text-sm text-slate-600 flex gap-2">
          <span class="label font-medium text-slate-400 w-16 shrink-0">${tt("popup.location", "Location")}</span>
          <span class="value text-slate-700 font-medium truncate">: ${markerInfo.lat.toFixed(4)}°, ${markerInfo.lng.toFixed(4)}°</span>
        </div>
      </div>
    </div>
    
    <div class="flex items-center gap-2 border-t border-slate-100 pt-3 mt-1 w-full">
      <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" 
         class="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded flex items-center justify-center transition-colors no-underline">
         ${tt("popup.view_map", "View Map ↗")}
      </a>

      <button 
         class="view-details-btn flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded transition-colors"
         data-title="${markerInfo.title}"
         data-desc="${markerInfo.desc}"
         data-lat="${markerInfo.lat}"
         data-lng="${markerInfo.lng}"
         data-color="${activeMarkerColor}"
      >
         ${tt("popup.view_details", "View Details")}
      </button>

      <button onclick="window.print()" class="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold py-2 rounded transition-colors">
         ${tt("popup.print_details", "Print Details")}
      </button>
    </div>
  </div>`;

        mapMarker.addTo(layerGroup).bindPopup(popupContent, { closeButton: false, offset: [0, -10], minWidth: 340 });
      });
    }
  }, [data, activeDepartment, activeIcon]);

  const primaryChartOptions = useMemo(() => {
    const hasWardData = selectedWard && data.primaryChart.wardData && data.primaryChart.wardData[selectedWard];
    const baseData = hasWardData ? data.primaryChart.wardData![selectedWard] : data.primaryChart.data;
    const chartData = baseData.map((val, idx) => ({ y: val, color: selectedWard && data.primaryChart.categories[idx].toLowerCase() === selectedWard.toLowerCase() ? "#ffffff" : data.primaryChart.color }));
    return {
      chart: { type: data.primaryChart.type, backgroundColor: "transparent", height: 240, spacingBottom: 5, style: { fontFamily: "sans-serif" } },
      title: { text: selectedWard ? `${data.primaryChart.title} — Active: ${selectedWard}` : data.primaryChart.title, align: "left", style: { color: "#cbd5e1", fontSize: "14px", fontWeight: "600" } },
      xAxis: { categories: data.primaryChart.categories, labels: { style: { color: "#64748b", fontSize: "11px" } }, lineColor: "#334155", tickWidth: 0 },
      yAxis: { title: { text: data.primaryChart.yAxisLabel, style: { color: "#64748b", fontSize: "11px" } }, labels: { style: { color: "#475569", fontSize: "11px" } }, gridLineColor: "#1e293b", gridLineDashStyle: "Dash" as any },
      legend: { enabled: false }, credits: { enabled: false }, tooltip: { backgroundColor: "#1e293b", borderWidth: 1, borderColor: "#334155", style: { color: "#f8fafc", fontSize: "13px" }, shared: true },
      plotOptions: { column: { borderRadius: 4, borderWidth: 0, pointWidth: 20 }, areaspline: { color: data.primaryChart.color, fillColor: { linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 }, stops: [[0, data.primaryChart.color], [1, data.primaryChart.gradientTo]] }, lineWidth: 3, marker: { radius: 4 } } },
      series: [{ name: data.primaryChart.seriesName, data: chartData }]
    };
  }, [data, selectedWard]);

  const secondaryChartOptions = useMemo(() => {
    const hasWardData = selectedWard && data.secondaryChart.wardData && data.secondaryChart.wardData[selectedWard];
    const baseData = hasWardData ? data.secondaryChart.wardData![selectedWard] : data.secondaryChart.data;
    let chartData = [];
    if (data.secondaryChart.type !== "pie") {
      const categories = ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6", "Ward 7", "Ward 8", "Ward 9", "Ward 10", "Ward 11"];
      chartData = baseData.map((val: any, idx: number) => ({ y: typeof val === "object" ? val.y : val, color: selectedWard && categories[idx]?.toLowerCase() === selectedWard.toLowerCase() ? "#ffffff" : (val.color || "#10b981") }));
    } else {
      chartData = baseData.map((item: any) => ({ ...item, sliced: false }));
    }
    return {
      chart: { type: data.secondaryChart.type, backgroundColor: "transparent", height: 240, spacingBottom: 5, style: { fontFamily: "sans-serif" } },
      title: { text: selectedWard ? `${data.secondaryChart.title} (${selectedWard} Distribution)` : data.secondaryChart.title, align: "left", style: { color: "#cbd5e1", fontSize: "14px", fontWeight: "600" } },
      xAxis: data.secondaryChart.type !== "pie" ? { categories: ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6", "Ward 7", "Ward 8", "Ward 9", "Ward 10", "Ward 11"], labels: { style: { color: "#64748b", fontSize: "11px" } }, lineColor: "#334155" } : undefined,
      yAxis: { title: { text: null }, labels: { enabled: data.secondaryChart.type !== "pie" }, gridLineColor: "#1e293b" },
      legend: data.secondaryChart.type === "pie" ? { itemStyle: { color: "#94a3b8", fontSize: "12px" }, align: "right" as any, layout: "vertical" as any, verticalAlign: "middle" as any } : { enabled: false },
      credits: { enabled: false }, tooltip: { backgroundColor: "#1e293b", borderWidth: 1, borderColor: "#334155", style: { color: "#f8fafc", fontSize: "13px" } },
      plotOptions: { pie: { allowPointSelect: true, cursor: "pointer", dataLabels: { enabled: false }, showInLegend: true, borderWidth: 0 }, spline: { color: "#38bdf8", lineWidth: 3, marker: { radius: 4 } }, bar: { borderRadius: 3, borderWidth: 0, color: "#10b981", pointWidth: 14 } },
      series: [{ name: data.secondaryChart.seriesName, data: chartData }]
    };
  }, [data, selectedWard]);

  return (
    <div className="flex flex-col gap-6 w-full h-full pb-6 relative overflow-x-hidden">
      
      <div className="w-full flex flex-col gap-2 select-none">
        <div className="px-1">
          <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">{t("departments.interactive_gis_map", "Interactive GIS Map")}</span>
        </div>
        <div className="w-full h-[450px] bg-[#111625] rounded-xl border border-slate-800/80 overflow-hidden relative shadow-inner">
          <div ref={mapContainerRef} className="w-full h-full z-10" />
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 select-none">
        <div className="px-1">
          <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">{t("analytics_view.current_activities", "Current Activities")}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-[#1a2232] rounded-xl border border-slate-800/70 p-5 flex flex-col gap-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800/50 pb-2.5">
              <div className="flex items-center gap-2">
                {activeIcon && <span className="text-blue-400 text-base flex items-center justify-center filter drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]">{activeIcon}</span>}
                <span className="text-sm font-bold text-slate-200 tracking-wide uppercase">{t(`database.titles.${activeDepartment}`, data.title)}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t(`database.schedules.${activeDepartment}`, data.scheduleTitle)}</div>
              {data.schedules.map((sched, idx) => {
                const isSelected = selectedWard === sched.label;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedWard(sched.label)}
                    className={`w-full text-left p-3.5 rounded-lg border flex items-center justify-between transition-all duration-150 cursor-pointer ${
                      isSelected ? "bg-[#1e2d4a] border-blue-500/80 shadow-[0_0_12px_rgba(59,130,246,0.15)] text-white" : "bg-[#222c3f] border-slate-800/60 hover:bg-[#2a374e] hover:border-slate-700 text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-mono font-bold px-2 py-0.5 rounded border ${isSelected ? "bg-blue-600 text-white border-blue-400" : "bg-[#121824] text-slate-400 border-slate-800/60"}`}>{sched.label}</span>
                      <span className="text-sm font-medium tracking-wide">{sched.name}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${sched.urgent ? 'text-red-400 bg-red-500/10 border border-red-500/20' : 'text-slate-400 bg-slate-800'}`}>{sched.time}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-[#1a2232] rounded-xl border border-slate-800/70 p-5 flex flex-col shadow-lg justify-start min-h-[290px]">
            <div className="flex items-center justify-between border-b border-slate-800/50 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-orange-500 text-base flex items-center justify-center filter drop-shadow-[0_0_4px_rgba(234,88,12,0.5)]"><NotificationOutlined /></span>
                <span className="text-sm font-bold text-slate-200 tracking-wide uppercase">{t("analytics_view.public_notice_and_announcements", "Public Notice & Announcements")}</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">{selectedWard ? `${selectedWard} ${t("status.active", "Active")}` : t("status.awaiting_selection", "Awaiting Selection")}</span>
            </div>

            <div className="flex-1 flex flex-col gap-3 overflow-y-auto min-h-0 pr-1">
              {filteredNotices.length > 0 ? (
                filteredNotices.map((notice, idx) => {
                  const matchingSchedule = data?.schedules?.find(s => s.label === notice.ward);
                  const parentDate = matchingSchedule ? matchingSchedule.time : "Scheduled";

                  let displayTimeline = `${parentDate} • 10:00 AM`;
                  if (notice.status === 'Critical') {
                    displayTimeline = `${parentDate} • Immediate (09:00 AM)`;
                  } else if (notice.status === 'Active') {
                    displayTimeline = `Ongoing Today • Until 05:00 PM`;
                  } else if (idx % 2 === 1) {
                    displayTimeline = `${parentDate} • 01:30 PM`;
                  }

                  return (
                    <div key={idx} className="bg-[#222c3f] border border-slate-800/60 rounded-lg p-3.5 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-blue-400 tracking-wide">{notice.campaignName}</span>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                            <span className="text-blue-400/80">📅</span>
                            <span>Timeline: {displayTimeline}</span>
                          </div>
                        </div>
                        
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase shrink-0 ${
                          notice.status === 'Critical' 
                            ? 'text-red-400 bg-red-500/10 border border-red-500/20' 
                            : notice.status === 'Active' 
                              ? 'text-green-400 bg-green-500/10 border border-green-500/20' 
                              : 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
                        }`}>
                          {notice.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-slate-300 m-0 leading-relaxed">{notice.details}</p>
                      
                      <div className="flex items-center justify-between border-t border-slate-800/60 pt-2 mt-0.5">
                        <span className="text-sm text-slate-200 font-medium">{t("labels.lead", "Lead")}: <span className="text-slate-100 font-semibold">{notice.leadPerson}</span></span>
                        <span className="text-xs text-slate-500 italic font-medium">{notice.role}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800/60 rounded-lg bg-[#151d2a]/30">
                  <span className="text-xl Richmond text-slate-600 mb-1">📋</span>
                  <p className="text-sm text-slate-400 m-0 max-w-[80%] leading-relaxed">{selectedWard ? t("messages.no_notices", { ward: selectedWard, defaultValue: "No explicit notices or official workflows registered for {{ward}} within this division." }) : data.defaultAlertText}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <div className="px-1">
          <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">{t("headers.statistical_metrics", "Statistical Metrics Breakdown")}</span>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="bg-[#1a2232] rounded-xl border border-slate-800/70 p-5 shadow-lg flex flex-col justify-between gap-4">
            <div className="p-2 border border-slate-800/30 rounded-lg bg-[#141b28]/40">
              <HighchartsReact highcharts={Highcharts} options={primaryChartOptions} immutable={true} />
            </div>
            <div className="bg-[#151d2a] border border-slate-800/40 rounded-lg p-3.5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t("headers.analytical_insights", "Analytical Insights Summary")}</div>
              <p className="text-sm text-slate-400 m-0 leading-relaxed">{selectedWard ? t("messages.tracking_metrics", { ward: selectedWard, defaultValue: "Currently tracking targeted metrics for {{ward}}." }) : data.primaryChart.description}</p>
            </div>
          </div>
          <div className="bg-[#1a2232] rounded-xl border border-slate-800/70 p-5 shadow-lg flex flex-col justify-between gap-4">
            <div className="p-2 border border-slate-800/30 rounded-lg bg-[#141b28]/40">
              <HighchartsReact highcharts={Highcharts} options={secondaryChartOptions} immutable={true} />
            </div>
            <div className="bg-[#151d2a] border border-slate-800/40 rounded-lg p-3.5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t("headers.structural_overview", "Structural Overview Summary")}</div>
              <p className="text-sm text-slate-400 m-0 leading-relaxed">{data.secondaryChart.description}</p>
            </div>
          </div>
        </div>
      </div>

      <GisMarkerDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        marker={selectedMarker}
        activeDepartment={activeDepartment}
      />

    </div>
  );
};