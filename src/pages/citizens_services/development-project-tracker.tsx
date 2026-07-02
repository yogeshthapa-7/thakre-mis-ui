import React, { useState, useMemo } from 'react';
import { Table, ConfigProvider, theme } from 'antd';
import { 
  PieChartOutlined,
  EnvironmentOutlined,
  ContainerOutlined,
  WarningFilled,
  InboxOutlined,
  LineChartOutlined,
  BarChartOutlined,
  DashboardOutlined,
  DollarCircleOutlined,
  BankOutlined
} from '@ant-design/icons';
// import SiteHeader from "../../islands/navigation/site-header";
import Highcharts from "highcharts";
import _HighchartsReact from "highcharts-react-official";
import { useTranslation } from "react-i18next";

// Path mapping reference
import { GisMap } from '../../Components/gis-map-component-thakre';
import { GisMarkerDrawer } from '../../Components/gis/GisMarkerDrawer';

const HighchartsReact = (_HighchartsReact as any).default || _HighchartsReact;

interface ProjectItem {
  id: number;
  name: string;
  ward: string;
  status: 'In Progress' | 'Delayed' | 'Completed';
  progress: number;
  budget: string;
  spent: string;
  endDate: string;
  contractor: string;
  desc: string;
}

interface MetricCardItem {
  title: string;
  val: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

interface MapMarkerData {
  id: number;
  lat: number;
  lng: number;
  title: string;
  desc: string;
  color: string;
}

const DevelopmentProjectTracker: React.FC = () => {
  const { t } = useTranslation();
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerData | null>(null);
  const developmentProjects: ProjectItem[] = useMemo(() => [
    { 
      id: 1, 
      name: 'Ward 4 Health Post Infrastructure Construction', 
      ward: 'Ward 4', 
      status: 'Delayed',
      progress: 45, 
      budget: '15,200,220',
      spent: '6,840,100',
      endDate: 'Dec 25, 2026',
      contractor: 'Thakre Civil Builders Pvt. Ltd.',
      desc: 'Structural masonry and brickwork framework phases are 100% complete. Internal electrical rough-ins and specialized cleanroom medical flooring layouts are currently deferred due to regional logistics variance.' 
    },
    { 
      id: 2, 
      name: 'Trishuli Corridor Link Road Upgrading & Reinforced Drainage', 
      ward: 'Ward 2', 
      status: 'In Progress',
      progress: 75, 
      budget: '69,000,000',
      spent: '51,750,000',
      endDate: 'Aug 14, 2026',
      contractor: 'Nepal Infrastructure Grading Corp.',
      desc: 'Sub-grade gravel bed compaction and aggregate stabilization tasks have concluded safely. Engineering assets are currently casting reinforced concrete side drain blocks alongside structural retaining walls.' 
    },
    { 
      id: 3, 
      name: 'Central Thakre Integrated Drinking Water Supply Pipeline', 
      ward: 'Ward 5', 
      status: 'In Progress',
      progress: 60, 
      budget: '19,500,000',
      spent: '11,700,000',
      endDate: 'Nov 30, 2026',
      contractor: 'Himalayan Hydro-Tech Utilities',
      desc: 'Main intake mountain reservoir container and filtering beds have been erected. Field layout technicians are laying down 4.2 kilometers of high-density distribution pipelines connecting residential clusters.' 
    },
    { 
      id: 4, 
      name: 'Municipal Multipurpose Community Center & Assembly Hall', 
      ward: 'Ward 3', 
      status: 'Delayed',
      progress: 20, 
      budget: '11,150,000',
      spent: '2,230,000',
      endDate: 'Feb 18, 2027',
      contractor: 'Dhading Co-operative Constructors',
      desc: 'Excavation, piling works, and reinforced foundation columns are currently suspended awaiting modified structural clearance layouts from the central municipal planning board.' 
    }
  ], []);

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(developmentProjects[0]);
  const [mapViewMode, setMapViewMode] = useState<"osm" | "satellite">("osm");

  const mapMarkers: MapMarkerData[] = useMemo(() => {
    const rawPoints = [
      { id: 1, lat: 27.71982413312728, lng: 85.06551861573436, color: "#ef4444" }, 
      { id: 2, lat: 27.70812411231234, lng: 85.02151861234567, color: "#3b82f6" }, 
      { id: 3, lat: 27.73216720777188, lng: 85.04667950492960, color: "#22c55e" }, 
      { id: 4, lat: 27.72316720777188, lng: 85.03667950492960, color: "#f59e0b" }  
    ];

    return rawPoints.map(point => {
      const project = developmentProjects.find(p => p.id === point.id);
      return {
        ...point,
        title: project?.name || t('citizens_service.dev_tracker.default_project_title'),
        desc: `${project?.ward} — ${t('citizens_service.dev_tracker.budget_label')}: NPR ${project?.budget} | ${t('citizens_service.dev_tracker.progress_label')}: ${project?.progress}%`
      };
    });
  }, [developmentProjects]);

const metricCards: MetricCardItem[] = useMemo(() => [
    { title: t('citizens_service.metrics.total_requests'), val: '28', desc: t('citizens_service.dev_tracker.metrics.active_projects_desc'), icon: <ContainerOutlined className="text-blue-400 text-lg" />, color: 'text-white' },
    { title: t('citizens_service.metrics.in_progress'), val: '14', desc: t('citizens_service.dev_tracker.metrics.active_sectors_desc'), icon: <DashboardOutlined className="text-amber-400 text-lg" />, color: 'text-amber-400' },
    { title: t('citizens_service.charts.monthly_inflow_title'), val: '65.2%', desc: t('citizens_service.dev_tracker.metrics.expenditure_ratio_desc'), icon: <DollarCircleOutlined className="text-green-400 text-lg" />, color: 'text-green-400' },
    { title: t('citizens_service.metrics.pending'), val: '4', desc: t('citizens_service.dev_tracker.metrics.delayed_projects_desc'), icon: <WarningFilled className="text-red-400 text-lg" />, color: 'text-red-400' }
  ], [t]);

  const handleMapProjectSelect = (marker: any) => {
    setSelectedMarker(marker);
    const matchedProject = developmentProjects.find(
      p => p.id === marker.id || p.name === marker.title
    );
    if (matchedProject) {
      setSelectedProject(matchedProject);
    }
    setDrawerVisible(true);
  };

  // HIGHCHARTS SPECIFICATIONS WITH LOGICAL DATA TRANSLATIONS
  const progressOverviewOptions = useMemo(() => ({
    chart: { backgroundColor: 'transparent', type: 'column', height: 240 },
    title: { text: null },
    xAxis: { categories: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 6', 'Ward 7'], labels: { style: { color: '#94a3b8', fontSize: '11px' } }, borderWidth: 0 },
    yAxis: { max: 100, title: { text: 'Completion %', style: { color: '#64748b' } }, gridLineColor: '#1e293b', labels: { style: { color: '#94a3b8' }, format: '{value}%' } },
    legend: { enabled: false },
    plotOptions: { series: { borderRadius: 4, colorByPoint: true } },
    series: [{ name: 'Average Progress', data: [90, 75, 20, 45, 60, 85, 30], colors: ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#f59e0b'] }],
    credits: { enabled: false }
  }), []);

const budgetPieOptions = useMemo(() => ({
    chart: { backgroundColor: 'transparent', type: 'pie', height: 240 },
    title: { 
      text: t('citizens_service.charts.category_allocation_title'), 
      align: 'center', 
      verticalAlign: 'middle', 
      x: -80, // Pulls the text left to align precisely over the pie circle
      y: 15, 
      style: { color: '#ffffff', fontSize: '13px', fontWeight: 'bold' } 
    },
    legend: { enabled: true, itemStyle: { color: '#94a3b8', fontSize: '11px' }, layout: 'vertical', align: 'right', verticalAlign: 'middle' },
    plotOptions: { pie: { innerSize: '75%', borderWidth: 0, dataLabels: { enabled: false }, showInLegend: true } },
    series: [{
      name: 'Treasury Balance', data: [
        { name: 'Disbursed Funds (65.2%)', y: 65.2, color: '#3b82f6' },
        { name: 'Unspent Reserves (34.8%)', y: 34.8, color: '#10b981' }
      ]
    }],
    credits: { enabled: false }
  }), []);

  const projectSummaryLineOptions = useMemo(() => ({
    chart: { backgroundColor: 'transparent', type: 'area', height: 240 },
    title: { text: null },
    xAxis: { categories: ['Q1 25', 'Q2 25', 'Q3 25', 'Q4 25', 'Q1 26', 'Q2 26'], labels: { style: { color: '#94a3b8', fontSize: '11px' } }, borderWidth: 0 },
    yAxis: { title: { text: 'Active Projects Count', style: { color: '#64748b' } }, gridLineColor: '#1e293b', labels: { style: { color: '#94a3b8' } } },
    legend: { enabled: false },
    plotOptions: { area: { fillOpacity: 0.08, lineColor: '#a855f7', marker: { enabled: true, radius: 4 } } },
    series: [{ name: 'Project Audits', data: [12, 16, 19, 22, 25, 28], color: '#a855f7' }],
    credits: { enabled: false }
  }), []);

  const sectorDistributionOptions = useMemo(() => ({
    chart: { backgroundColor: 'transparent', type: 'bar', height: 240 },
    title: { text: null },
    xAxis: { categories: ['Health Sector', 'Roadways', 'Water Systems', 'Civic Buildings'], labels: { style: { color: '#94a3b8', fontSize: '11px' } }, borderWidth: 0 },
    yAxis: { title: { text: 'Allocated Budget (Millions NPR)', style: { color: '#64748b' } }, gridLineColor: '#1e293b', labels: { style: { color: '#94a3b8' } } },
    legend: { enabled: false },
    series: [{ name: 'Budget Share', data: [15.2, 69.0, 19.5, 11.1], color: '#ec4899' }],
    credits: { enabled: false }
  }), []);

  const getStatusBadgeClasses = (status: string) => {
    if (status === 'Delayed') {
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
    if (status === 'Completed') {
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    }
    return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  };

  const getStatusKey = (status: string) => {
    if (status === 'Delayed') return 'delayed';
    if (status === 'Completed') return 'completed';
    return 'in_progress';
  };

  const columns = [
    {
      title: t('citizens_service.details.panel_title').toUpperCase(),
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="font-bold text-white text-xs tracking-wide">{text}</span>,
    },
    {
      title: t('citizens_service.form.location').toUpperCase(),
      dataIndex: 'ward',
      key: 'ward',
      width: '140px',
      render: (text: string) => <span className="text-slate-400 font-semibold text-xs">{text}</span>,
    },
    {
      title: t('citizens_service.metrics.in_progress').toUpperCase(),
      dataIndex: 'status',
      key: 'status',
      width: '160px',
        render: (status: string) => {
          const statusClass = getStatusBadgeClasses(status);
          const statusKey = getStatusKey(status);
          return (
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${statusClass}`}>
              {t(`citizens_service.status.${statusKey}`)}
            </span>
          );
        },
    },
    {
      title: t('citizens_service.charts.monthly_inflow_title').toUpperCase(),
      dataIndex: 'progress',
      key: 'progress',
      width: '240px',
      render: (progress: number) => (
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-500 ${progress > 70 ? 'bg-green-500' : progress > 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[11px] text-slate-300 font-mono font-bold w-10 text-right">{progress}%</span>
        </div>
      ),
    },
    {
      title: t('citizens_service.status.allocated_budget').toUpperCase(),
      dataIndex: 'budget',
      key: 'budget',
      width: '180px',
      render: (text: string) => <span className="text-slate-200 font-mono text-xs font-bold block text-right pr-4">{text}</span>,
    }
  ];

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-200 antialiased font-sans pb-16 text-base">
      {/* <SiteHeader /> */}
      
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm, token: { fontSize: 13, controlHeight: 36 } }}>
        <div className="bg-[#0b111e] border-b border-slate-800/60 px-5 py-3 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 text-base font-bold text-slate-300 tracking-wide">
          <div className="flex items-center gap-3">
            <span className="text-blue-500 opacity-90 text-lg"><BankOutlined /></span>
            <div>
              <p className="text-base font-bold text-slate-100 m-0">{t('citizens_service.title1')}</p>
            </div>
          </div>
        </div>

        <main className="p-5 max-w-[1750px] mx-auto space-y-4">
          
          {/* ROW 1: VERTICAL METRICS LAYOUT (LEFT) + GIS MAP CONTAINER (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* Left Hand Vertically Stacked Metric Indicators */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-3">
              {metricCards.map((card, i) => (
                <div key={i} className="bg-[#101726] border border-slate-800/80 rounded-xl p-3 flex flex-col justify-center shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:border-slate-700/60 hover:shadow-xl flex-1">
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5 mb-1.5">
                    <p className="text-sm font-semibold text-slate-400 flex items-center gap-2 m-0">
                      {card.icon} {card.title}
                    </p>
                  </div>
                  <h2 className={`text-2xl font-extrabold tracking-tight m-0 ${card.color}`}>{card.val}</h2>
                  <p className="text-sm text-slate-400 font-medium pt-2 m-0">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* Right Hand Strategic Localization GIS Map Frame */}
            <div className="lg:col-span-8 bg-[#101726] border border-slate-800/80 rounded-xl p-3 shadow-lg flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-slate-800/60 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2 m-0">
                    <EnvironmentOutlined className="text-orange-500 animate-pulse text-lg" /> {t('citizens_service.map.title')}
                  </h3>
                </div>
                <div className="flex items-center gap-2 bg-[#070b12] p-1 rounded-lg border border-slate-800">
                  <button onClick={() => setMapViewMode("osm")} className={`text-[11px] font-bold px-3 py-1.5 rounded transition-colors ${mapViewMode === 'osm' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>{t('citizens_service.map.osm_view')}</button>
                  <button onClick={() => setMapViewMode("satellite")} className={`text-[11px] font-bold px-3 py-1.5 rounded transition-colors ${mapViewMode === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>{t('citizens_service.map.satellite_view')}</button>
                </div>
              </div>

              <div className="flex-grow">
                <GisMap 
                  activeDepartment="infrastructure"
                  activeIcon={<EnvironmentOutlined />}
                  mapView={mapViewMode}
                  markers={mapMarkers}
                  onViewDetails={handleMapProjectSelect}
                  height="400px" 
                />
              </div>
            </div>

          </div>

          {/* ROW 2: PROFESSIONAL STRUCTURAL PROJECTS DATA REGISTRY REGION TABLE */}
          <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-3 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800/60 pb-2 mb-3">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 m-0 flex items-center gap-2">
                      <ContainerOutlined className="text-green-500 text-base" /> {t('citizens_service.dev_tracker.registry_title')}
                    </h4>
                    <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded-full font-mono font-bold">{t('citizens_service.dev_tracker.ledger_verified')}</span>
            </div>
            
            <div className="hidden md:block">
              <Table 
                dataSource={developmentProjects} 
                columns={columns} 
                rowKey="id" 
                pagination={false}
                className="custom-nested-table-design border border-slate-800/40 rounded-lg overflow-hidden"
                onRow={(record) => ({
                  onClick: () => setSelectedProject(record),
                  className: `cursor-pointer transition-all duration-150 ${selectedProject?.id === record.id ? 'bg-blue-600/10 hover:bg-blue-600/15' : 'hover:bg-slate-800/30'}`
                })}
              />
            </div>

            <div className="block md:hidden space-y-3">
              {developmentProjects.map((project) => {
                const statusClass = getStatusBadgeClasses(project.status);
                const statusKey = getStatusKey(project.status);

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${selectedProject?.id === project.id ? 'border-blue-500/50 bg-blue-600/10' : 'border-slate-800/70 bg-[#0b111e] hover:border-slate-700'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">{project.name}</p>
                        <p className="mt-1 text-xs text-slate-400">{project.ward}</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusClass}`}>
                        {t(`citizens_service.status.${statusKey}`)}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-400">
                      <span>Progress {project.progress}%</span>
                      <span className="font-mono text-slate-200">{project.budget}</span>
                    </div>

                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full transition-all duration-500 ${project.progress > 70 ? 'bg-green-500' : project.progress > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ROW 3: DETAILED FRAMEWORK DATA ASSESSMENT ASSIGNMENT SPECIFICATION SUMMARY */}
          <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 pb-2 border-b border-slate-800/50 m-0">
              {t('citizens_service.details.panel_title')}
            </h3>
            
            {selectedProject ? (
              <div className="bg-[#141d30] border border-slate-800/60 rounded-xl p-4 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800/50 pb-3">
                  <div>
                    <h4 className="text-lg font-extrabold text-white m-0 tracking-wide">{selectedProject.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 m-0 flex items-center gap-2">
                      <BankOutlined className="text-blue-400" /> Operational Ward Assignment Zone: <span className="text-slate-200 font-bold">{selectedProject.ward}</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-2 py-1.5 rounded-md">
                      EXPENDED: <span className="text-slate-200 font-bold">NPR {selectedProject.spent}</span>
                    </div>
                    <div className="text-[11px] font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold px-2 py-1.5 rounded-md">
                      TOTAL ALLOCATION: <span className="text-blue-300 font-bold">NPR {selectedProject.budget}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-2 space-y-2">
                    <span className="text-slate-500 block text-[11px] font-bold uppercase tracking-wider">Field Operations Summary & Milestone Assessment Log</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal bg-[#0b111e]/50 p-3 rounded-lg border border-slate-800/40">{selectedProject.desc}</p>
                  </div>
                  <div className="space-y-3 bg-[#0b111e]/40 p-3 rounded-lg border border-slate-800/40 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px] font-bold uppercase tracking-wider mb-0.5">Assigned Lead Contractor Corporation</span>
                      <span className="text-slate-200 font-bold tracking-wide">{selectedProject.contractor}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/50">
                      <div>
                        <span className="text-slate-500 block text-[11px] font-bold uppercase tracking-wider mb-0.5">Target Handover</span>
                        <span className="text-white font-bold">{selectedProject.endDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px] font-bold uppercase tracking-wider mb-0.5">Current Progress</span>
                        <span className="text-green-400 font-mono font-bold">{selectedProject.progress}% Completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[120px] flex flex-col items-center justify-center border border-dashed border-slate-800/60 rounded-xl text-slate-500">
                <InboxOutlined className="text-2xl mb-2" />
                <p className="text-xs">{t('citizens_service.feed.empty_state')}</p>
              </div>
            )}
          </div>

          {/* ROW 4: 2x2 FOUR HIGHCHARTS BALANCED ANALYTICS BLOCK GRID WITH FIXED SPECIFIC PROSE DESCRIPTIONS */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            
            {/* Chart 1 */}
            <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-4 shadow-lg flex flex-col justify-between">
              <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2 border-b border-slate-800/60 pb-2">
                    <BarChartOutlined className="text-blue-400 text-base" /> {t('citizens_service.charts.ward_performance_title')}
                  </h4>
                  <div className="bg-[#090e18]/40 p-1.5 rounded-lg border border-slate-800/40">
                    <HighchartsReact highcharts={Highcharts} options={progressOverviewOptions} />
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/40">
                  <h5 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{t('citizens_service.dev_tracker.ward_performance_metrics')}</h5>
                  <p className="text-sm text-slate-400 leading-relaxed font-normal m-0">{t('citizens_service.dev_tracker.ward_performance_summary')}</p>
                </div>
            </div>

            {/* Chart 2 */}
            <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-4 shadow-lg flex flex-col justify-between">
              <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2 border-b border-slate-800/60 pb-2">
                    <PieChartOutlined className="text-purple-400 text-base" /> {t('citizens_service.dev_tracker.treasury_allocation_title')}
                  </h4>
                  <div className="bg-[#090e18]/40 p-1.5 rounded-lg border border-slate-800/40">
                    <HighchartsReact highcharts={Highcharts} options={budgetPieOptions} />
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/40">
                  <h5 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{t('citizens_service.dev_tracker.treasury_summary_title')}</h5>
                  <p className="text-sm text-slate-400 leading-relaxed font-normal m-0">{t('citizens_service.dev_tracker.treasury_summary')}</p>
                </div>
            </div>

            {/* Chart 3 */}
            <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-4 shadow-lg flex flex-col justify-between">
              <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2 border-b border-slate-800/60 pb-2">
                    <LineChartOutlined className="text-amber-400 text-base" /> {t('citizens_service.dev_tracker.delivery_track_title')}
                  </h4>
                  <div className="bg-[#090e18]/40 p-1.5 rounded-lg border border-slate-800/40">
                    <HighchartsReact highcharts={Highcharts} options={projectSummaryLineOptions} />
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/40">
                  <h5 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{t('citizens_service.dev_tracker.delivery_track_subtitle')}</h5>
                  <p className="text-sm text-slate-400 leading-relaxed font-normal m-0">{t('citizens_service.dev_tracker.delivery_track_summary')}</p>
                </div>
            </div>

            {/* Chart 4 */}
            <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-4 shadow-lg flex flex-col justify-between">
              <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2 border-b border-slate-800/60 pb-2">
                    <BarChartOutlined className="text-pink-500 text-base" /> {t('citizens_service.dev_tracker.capital_resource_title')}
                  </h4>
                  <div className="bg-[#090e18]/40 p-1.5 rounded-lg border border-slate-800/40">
                    <HighchartsReact highcharts={Highcharts} options={sectorDistributionOptions} />
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/40">
                  <h5 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{t('citizens_service.dev_tracker.capital_resource_subtitle')}</h5>
                  <p className="text-sm text-slate-400 leading-relaxed font-normal m-0">{t('citizens_service.dev_tracker.capital_resource_summary')}</p>
                </div>
            </div>

          </div>

        </main>
        <GisMarkerDrawer
        isOpen={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        marker={selectedMarker}
        activeDepartment="infrastructure"
        />
      </ConfigProvider>

      {/* Complete CSS Overrides Injector */}
      <style>{`
        .custom-nested-table-design { width: 100%; overflow-x: auto; }
        .custom-nested-table-design .ant-table { background: transparent !important; color: #cbd5e1 !important; }
        .custom-nested-table-design .ant-table-container { overflow-x: auto; }
        .custom-nested-table-design .ant-table-content { overflow-x: auto; }
        .custom-nested-table-design .ant-table-thead > tr > th { background: #0b111e !important; color: #94a3b8 !important; font-size: 11px !important; text-transform: uppercase !important; font-weight: 800 !important; letter-spacing: 0.05em; border-bottom: 1px solid #1e293b !important; padding: 10px 12px !important; white-space: nowrap; }
        .custom-nested-table-design .ant-table-tbody > tr > td { border-bottom: 1px solid rgba(30, 41, 59, 0.4) !important; padding: 10px 12px !important; }
        .custom-nested-table-design .ant-table-tbody > tr.bg-blue-600\/10 > td { background: rgba(37, 99, 235, 0.12) !important; }

        @media (max-width: 768px) {
          .custom-nested-table-design .ant-table-thead > tr > th,
          .custom-nested-table-design .ant-table-tbody > tr > td {
            padding: 8px 10px !important;
            font-size: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DevelopmentProjectTracker;