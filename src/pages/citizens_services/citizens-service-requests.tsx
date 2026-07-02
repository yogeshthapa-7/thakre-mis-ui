import React, { useState, useMemo } from 'react';
import { Select, Form, Input, Button, Upload, ConfigProvider, theme, message } from 'antd';
import { 
  UploadOutlined, 
  ThunderboltFilled, 
  PieChartOutlined,
  EnvironmentOutlined,
  ContainerOutlined,
  CheckCircleFilled,
  WarningFilled,
  InboxOutlined,
  LineChartOutlined,
  BarChartOutlined,
  BankOutlined
} from '@ant-design/icons';
// import SiteHeader from "../../islands/navigation/site-header";
import Highcharts from "highcharts";
import _HighchartsReact from "highcharts-react-official";

// Path mapping reference
import { GisMap } from '../../Components/gis-map-component-thakre';
import { GisMarkerDrawer } from '../../Components/gis/GisMarkerDrawer';
import { useTranslation } from 'react-i18next';

const HighchartsReact = (_HighchartsReact as any).default || _HighchartsReact;
const { Option } = Select;
const { TextArea } = Input;

interface UpdateTimeline {
  time: string;
  status: string;
  note: string;
}

interface UpdateItem {
  id: number;
  title: string;
  info: string;         
  time: string;         
  sub: string;          
  priority: 'High' | 'Medium' | 'Low';
  department: string;   
  assignedTo: string;   
  progress: number;
  timeline: UpdateTimeline[]; 
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

interface ServiceRequestFormValues {
  category: string;
  location: string;
  description: string;
  attachment?: any[];
  name: string;
  contactNumber: string;
  email: string;
}

const CitizensServiceRequests: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm<ServiceRequestFormValues>();
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerData | null>(null);

  const [selectedUpdate, setSelectedUpdate] = useState<UpdateItem | null>({
    id: 1, 
    title: 'Water Supply Mainline Leak', 
    info: 'Ward 3 – Thakre Central Branch', 
    time: '30 mins ago', 
    priority: 'High',
    department: 'Water Supply & Sanitation',
    assignedTo: 'Emergency Engineering Crew B',
    progress: 35,
    sub: 'A major pressure variance was logged on the 14-inch distribution mainline. Field agents confirmed a seam blowout causing localized street flooding.',
    timeline: [
      { time: '11:00 AM', status: 'Dispatched', note: 'Emergency Crew B dispatched with excavation equipment.' },
      { time: '10:45 AM', status: 'Approved', note: 'Dispatch log approved by Dept Supervisor.' },
      { time: '10:30 AM', status: 'Reported', note: 'Automated telemetry alert logged.' }
    ]
  });

  const [mapViewMode, setMapViewMode] = useState<"osm" | "satellite">("osm");

  const handleSubmit = (values: ServiceRequestFormValues) => {
    console.log('Service request submitted:', values);
    message.success('Your service request has been submitted successfully.');
    form.resetFields();
  };

  const recentUpdates: UpdateItem[] = useMemo(() => [
    { 
      id: 1, 
      title: 'Water Supply Mainline Leak', 
      info: 'Ward 3 – Thakre Central Branch', 
      time: '30 mins ago', 
      priority: 'High',
      department: 'Water Supply & Sanitation',
      assignedTo: 'Emergency Engineering Crew B',
      progress: 35,
      sub: 'A major pressure variance was logged on the 14-inch distribution mainline. Field agents confirmed a seam blowout causing localized street flooding and low pressure across 120 households.',
      timeline: [
        { time: '11:00 AM', status: 'Dispatched', note: 'Emergency Crew B dispatched with excavation equipment.' },
        { time: '10:45 AM', status: 'Approved', note: 'Dispatch log approved by Dept Supervisor.' },
        { time: '10:30 AM', status: 'Reported', note: 'Automated telemetry alert & 3 citizen complaints logged.' }
      ]
    },
    { 
      id: 2, 
      title: 'Pothole Restoration & Blacktopping', 
      info: 'Ward 4 – High School Road Corridor', 
      time: '1 hour ago', 
      priority: 'Medium',
      department: 'Infrastructure & Road Roads Dept',
      assignedTo: 'Municipal Asphalt Contractors Team 1',
      progress: 75,
      sub: 'Routine repair of road surfaces along school bus transport route. Sub-base compaction completed; currently applying the primary weather-seal coat.',
      timeline: [
        { time: '09:00 AM', status: 'In Progress', note: 'Asphalt application initialized.' },
        { time: 'Yesterday', status: 'Scheduled', note: 'Materials and traffic diversions staged.' }
      ]
    },
    { 
      id: 3, 
      title: 'Illegal Dumping Clear-out', 
      info: 'Ward 7 – Riverside Forest Reserve Boundary', 
      time: 'Yesterday', 
      priority: 'Low',
      department: 'Waste Management & Environment',
      assignedTo: 'Sanitation Division Crew A',
      progress: 100,
      sub: 'Cleared 4.2 metric tons of mixed solid household and industrial debris dumped unlawfully near the river conservation buffers. Installed warning placards.',
      timeline: [
        { time: '04:00 PM', status: 'Resolved', note: 'Site cleared completely, site photographs archived.' },
        { time: '01:00 PM', status: 'In Progress', note: 'Heavy loader and two haulers operating.' }
      ]
    },
    { 
      id: 4, 
      title: 'Street Light Maintenance Scheduled', 
      info: 'Ward 9 – Main Road Network Corridor', 
      time: 'Yesterday', 
      priority: 'Low',
      department: 'Infrastructure & Electrical Dept',
      assignedTo: 'Municipal Grid Maintenance Team C',
      progress: 0,
      sub: 'Street light maintenance work is scheduled for later due to severe heavy rainfall compromising safe overhead ladder and wiring conditions.',
      timeline: [
        { time: '02:30 PM', status: 'Deferred', note: 'Operations suspended and rescheduled due to heavy rain hazard.' },
        { time: '11:15 AM', status: 'Scheduled', note: 'Routine bulb replacement and junction check initialized.' }
      ]
    }
  ], []);

const mapMarkers: MapMarkerData[] = useMemo(() => {
    // Hardcoded raw coordinate points and colors
    const rawPoints = [
      { id: 1, lat: 27.72316720777188, lng: 85.0366795049296, color: "#3b82f6" },
      { id: 2, lat: 27.71982413312728, lng: 85.06551861573436, color: "#f59e0b" },
      { id: 3, lat: 27.730004995692788, lng: 85.09813427756107, color: "green" },
      { id: 4, lat: 27.754009831683323, lng: 85.12388348389224, color: "red" }
    ];

    // Dynamically build the marker definitions using the exact text from recentUpdates
    return rawPoints.map(point => {
      const correspondingIssue = recentUpdates.find(u => u.id === point.id);
      return {
        ...point,
        title: correspondingIssue?.title || "Incident Report",
        // This ensures the popup text on the map matches the description in the updates section
        desc: correspondingIssue?.sub || correspondingIssue?.info || ""
      };
    });
  }, [recentUpdates]);

const metricCards: MetricCardItem[] = useMemo(() => [
    { title: t('citizens_service.metrics.total_requests'), val: '328', desc: t('citizens_service.metrics.total_requests_desc'), icon: <ContainerOutlined className="text-blue-400 text-base" />, color: 'text-white' },
    { title: t('citizens_service.metrics.in_progress'), val: '92', desc: t('citizens_service.metrics.in_progress_desc'), icon: <ThunderboltFilled className="text-amber-500 text-base" />, color: 'text-amber-500' },
    { title: t('citizens_service.metrics.resolved'), val: '214', desc: t('citizens_service.metrics.resolved_desc'), icon: <CheckCircleFilled className="text-green-500 text-base" />, color: 'text-green-500' },
    { title: t('citizens_service.metrics.pending'), val: '22', desc: t('citizens_service.metrics.pending_desc'), icon: <WarningFilled className="text-red-500 text-base" />, color: 'text-red-500' }
  ], [t]);

  // HIGHCHARTS CONFIGURATIONS
  const pieChartOptions1 = useMemo(() => ({
    chart: { backgroundColor: 'transparent', type: 'pie', height: 200, spacing: [10, 10, 10, 10] },
    title: { text: null },
    legend: { enabled: true, itemStyle: { color: '#94a3b8', fontSize: '11px' }, layout: 'vertical' as const, align: 'right' as const, verticalAlign: 'middle' as const },
    plotOptions: { pie: { innerSize: '60%', borderWidth: 0, dataLabels: { enabled: false }, showInLegend: true } },
    series: [{
      name: 'Issues', colorByPoint: true, data: [
        { name: 'Roads: 25%', y: 25, color: '#f97316' },
        { name: 'Water: 20%', y: 20, color: '#3b82f6' },
        { name: 'Power: 20%', y: 20, color: '#1e3a8a' },
        { name: 'Waste: 35%', y: 35, color: '#22c55e' }
      ]
    }],
    credits: { enabled: false }
  }), []);

  const lineChartOptions = useMemo(() => ({
    chart: { backgroundColor: 'transparent', type: 'line', height: 200, spacing: [10, 10, 10, 10] },
    title: { text: null },
    xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr'], labels: { style: { color: '#64748b', fontSize: '11px' } }, borderWidth: 0 },
    yAxis: { title: { text: null }, gridLineColor: '#1e293b', labels: { style: { color: '#64748b', fontSize: '11px' } } },
    legend: { enabled: false },
    series: [{ name: 'Inflow Volume', data: [120, 185, 140, 210], color: '#f59e0b' }],
    credits: { enabled: false }
  }), []);

  const columnChartOptions = useMemo(() => ({
    chart: { backgroundColor: 'transparent', type: 'column', height: 200, spacing: [10, 10, 10, 10] },
    title: { text: null },
    xAxis: { categories: ['Roads', 'Water', 'Waste', 'Power'], labels: { style: { color: '#64748b', fontSize: '11px' } }, borderWidth: 0 },
    yAxis: { title: { text: null }, gridLineColor: '#1e293b', labels: { style: { color: '#64748b', fontSize: '11px' } } },
    legend: { enabled: false },
    plotOptions: { series: { borderRadius: 3 } },
    series: [{ name: 'Hours to Close', data: [48, 72, 24, 12], color: '#10b981' }],
    credits: { enabled: false }
  }), []);

  const pieChartOptions2 = useMemo(() => ({
    chart: { backgroundColor: 'transparent', type: 'pie', height: 200, spacing: [10, 10, 10, 10] },
    title: { text: null },
    legend: { enabled: true, itemStyle: { color: '#94a3b8', fontSize: '11px' }, layout: 'vertical' as const, align: 'right' as const, verticalAlign: 'middle' as const },
    plotOptions: { pie: { innerSize: '60%', borderWidth: 0, dataLabels: { enabled: false }, showInLegend: true } },
    series: [{
      name: 'Wards', colorByPoint: true, data: [
        { name: 'Ward 3: 15%', y: 15, color: '#ef4444' },
        { name: 'Ward 4: 20%', y: 20, color: '#3b82f6' },
        { name: 'Ward 7: 45%', y: 45, color: '#a855f7' },
        { name: 'Ward 9: 20%', y: 20, color: '#eab308' }
      ]
    }],
    credits: { enabled: false }
  }), []);

const handleMapIncidentSelect = (marker: MapMarkerData) => {
    setSelectedMarker(marker);

    // Looks for a match via ID first, falls back to matching by title if needed
    const matchedUpdate = recentUpdates.find(
      u => u.id === marker.id || u.title === marker.title
    );
    if (matchedUpdate) {
      setSelectedUpdate(matchedUpdate);
    }

    setDrawerVisible(true);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-200 antialiased selection:bg-blue-600/30 font-sans pb-12 text-base">
      {/* <SiteHeader /> */}
      
      {/* Set explicit global token scaling for Ant Design elements */}
      <ConfigProvider 
        theme={{ 
          algorithm: theme.darkAlgorithm,
          token: { fontSize: 13, controlHeight: 36 }
        }}
      >
        <div className="bg-[#0b111e] border-b border-slate-800/60 px-5 py-3 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 text-base font-semibold text-slate-300">
          <div className="flex items-center gap-3">
            <span className="text-blue-500 opacity-90 text-base"><BankOutlined /></span>
            <div>
              <p className="text-base font-bold text-slate-100 m-0">{t('citizens_service.title')}</p>
              <p className="text-sm text-slate-400 m-0">{t('citizens_service.subtitle')}</p>
            </div>
          </div>
        </div>

        <main className="p-5 max-w-[1700px] mx-auto space-y-6">
          
          {/* ROW 1: Map | Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* Map Box */}
            <div className="lg:col-span-8 bg-[#101726] border border-slate-800/80 rounded-xl p-4 shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800/60 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                    <span className="text-white animate-fade">{t('citizens_service.map.title')}</span>
                  </h3>
                </div>
                
                <div className="flex items-center gap-2 bg-[#070b12] p-1.5 rounded-lg border border-slate-800">
                  <button 
                    onClick={() => setMapViewMode("osm")} 
                    className={`text-sm font-semibold px-3 py-2 rounded transition-colors ${mapViewMode === 'osm' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    {t('citizens_service.map.osm_view')}
                  </button>
                  <button 
                    onClick={() => setMapViewMode("satellite")} 
                    className={`text-sm font-semibold px-3 py-2 rounded transition-colors ${mapViewMode === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    {t('citizens_service.map.satellite_view')}
                  </button>
                </div>
              </div>

              <div className="flex-grow">
                <GisMap 
                  activeDepartment="infrastructure"
                  activeIcon={<EnvironmentOutlined />}
                  mapView={mapViewMode}
                  markers={mapMarkers}
                  onViewDetails={handleMapIncidentSelect}
                  height="480px" 
                />
              </div>
            </div>

            {/* Metric Cards Stack */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-4">
              {metricCards.map((card, i) => (
                <div key={i} className="bg-[#101726] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-slate-700/60 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.7)] backdrop-blur-sm flex-grow">
                  <p className="text-sm font-semibold text-slate-400 flex items-center gap-2 pb-2 mb-2 border-b border-slate-800/60 -mx-4 px-4">
                    {card.icon} {card.title}
                  </p>
                  <h2 className={`text-2xl font-extrabold tracking-tight ${card.color}`}>{card.val}</h2>
                  <p className="text-sm text-slate-400 font-medium pt-2">{card.desc}</p>
                </div>
              ))}
            </div>

          </div>

          {/* ROW 2: Form | Updates Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* Submit Request Form */}
            <div className="lg:col-span-6 bg-[#101726] border border-slate-800/80 rounded-xl p-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-sm flex flex-col justify-between transition-all duration-300 hover:scale-[1.005] hover:border-slate-700/60">
              <div className="flex flex-col h-full justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold border-b border-slate-800/60 pb-2 mb-2 text-white tracking-wide flex items-center gap-2 m-0">
                    {t('citizens_service.form.title')}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-normal m-0">
                    {t('citizens_service.form.description')}
                  </p>
                </div>
                
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  className="flex-1 flex flex-col justify-between gap-4 py-2"
                >
                  <div className="grid gap-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                      <label className="text-sm font-semibold text-slate-300 pt-1">{t('citizens_service.form.category')}</label>
                      <div className="md:col-span-2">
                        <Form.Item
                          name="category"
                          initialValue="road"
                          rules={[{ required: true, message: 'Please select a service category.' }]}
                          className="mb-0"
                        >
                          <Select placeholder={t('citizens_service.form.category')} className="w-full">
                            <Option value="road">{t('citizens_service.filters.infrastructure')}</Option>
                            <Option value="water">{t('citizens_service.filters.water_supply')}</Option>
                            <Option value="waste">{t('citizens_service.filters.waste_management')}</Option>
                          </Select>
                        </Form.Item>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                      <label className="text-sm font-semibold text-slate-300 pt-1">{t('citizens_service.form.location')}</label>
                      <div className="md:col-span-2">
                        <Form.Item
                          name="location"
                          rules={[
                            { required: true, message: 'Please enter the location.' },
                            { min: 3, message: 'Location must be at least 3 characters.' }
                          ]}
                          className="mb-0"
                        >
                          <Input placeholder={t('citizens_service.form.location_placeholder')} className="bg-[#151f33] border-slate-700 text-white h-10 text-sm" />
                        </Form.Item>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start min-h-[90px]">
                      <label className="text-sm font-semibold text-slate-300 pt-1">{t('citizens_service.form.description_label')}</label>
                      <div className="md:col-span-2 h-full flex">
                        <Form.Item
                          name="description"
                          rules={[
                            { required: true, message: 'Please describe the issue.' },
                            { min: 10, message: 'Description must be at least 10 characters.' }
                          ]}
                          className="mb-0 w-full"
                        >
                          <TextArea
                            rows={4}
                            placeholder={t('citizens_service.form.description_placeholder')}
                            className="bg-[#151f33] border-slate-700 text-white text-sm resize-none flex-1 h-full min-h-full"
                          />
                        </Form.Item>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                      <label className="text-sm font-semibold text-slate-300 pt-1">{t('citizens_service.form.upload_image')}</label>
                      <div className="md:col-span-2">
                        <Form.Item name="attachment" valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList} className="mb-0">
                          <Upload maxCount={1} className="w-full block">
                            <Button
                              icon={<UploadOutlined className="text-blue-400 text-base" />}
                              className="w-full bg-[#151f33] hover:bg-[#1b273d] border border-dashed border-slate-700 text-slate-300 flex items-center justify-center gap-2 h-11 px-3 transition-colors rounded-lg text-sm"
                            >
                              <span>{t('citizens_service.form.upload_placeholder')}</span>
                            </Button>
                          </Upload>
                        </Form.Item>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                      <label className="text-sm font-semibold text-slate-300 pt-1">{t('citizens_service.form.your_name')}</label>
                      <div className="md:col-span-2">
                        <Form.Item
                          name="name"
                          rules={[
                            { required: true, message: 'Please enter your name.' },
                            { min: 2, message: 'Name must be at least 2 characters.' }
                          ]}
                          className="mb-0"
                        >
                          <Input placeholder={t('citizens_service.form.name_placeholder')} className="bg-[#151f33] border-slate-700 text-white h-10 text-sm" />
                        </Form.Item>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                      <label className="text-sm font-semibold text-slate-300 pt-1">{t('citizens_service.form.contact_number')}</label>
                      <div className="md:col-span-2">
                        <Form.Item
                          name="contactNumber"
                          rules={[
                            { required: true, message: 'Please enter your contact number.' },
                            {
                              pattern: /^[0-9]{10}$/,
                              message: 'Contact number must be 10 digits.'
                            }
                          ]}
                          className="mb-0"
                        >
                          <Input placeholder={t('citizens_service.form.contact_placeholder')} className="bg-[#151f33] border-slate-700 text-white h-10 text-sm" />
                        </Form.Item>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                      <label className="text-sm font-semibold text-slate-300 pt-1">{t('citizens_service.form.email_address')}</label>
                      <div className="md:col-span-2">
                        <Form.Item
                          name="email"
                          rules={[
                            { required: true, message: 'Please enter your email address.' },
                            { type: 'email', message: 'Please enter a valid email address.' }
                          ]}
                          className="mb-0"
                        >
                          <Input placeholder={t('citizens_service.form.email_placeholder')} className="bg-[#151f33] border-slate-700 text-white h-10 text-sm" />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button htmlType="submit" type="primary" className="w-full h-11 font-bold text-sm bg-gradient-to-b from-[#1e5bc6] to-[#123e91] border border-blue-500/20 rounded-lg shadow-lg hover:opacity-95 transition-all m-0">
                      {t('citizens_service.form.submit_request')}
                    </Button>
                  </div>
                </Form>
              </div>
            </div>

            {/* Updates Feed */}
            <div className="lg:col-span-6 flex flex-col gap-5 justify-between">
              
              <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-4 shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center border-b border-slate-800/60 pb-2 mb-3">
                    <h3 className="text-sm font-bold text-slate-200 tracking-wide">{t('citizens_service.feed.title')}</h3>
                    <span className="text-[11px] bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded-full font-mono font-bold">{recentUpdates.length} {t('citizens_service.feed.active_records')}</span>
                  </div>
                  
                  <div className="divide-y divide-slate-800/50 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                    {recentUpdates.map((item) => {
                      const wardLabel = item.info.split('–')[0].trim();
                      const wardBadgeColor = 
                        wardLabel.includes('Ward 3') ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        wardLabel.includes('Ward 4') ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                        wardLabel.includes('Ward 7') ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20';

                      return (
                        <div 
                          key={item.id} 
                          onClick={() => setSelectedUpdate(item)} 
                          className={`py-3 px-3 rounded-lg my-1 border transition-all duration-300 ease-out cursor-pointer flex items-start justify-between gap-3 origin-center transform ${
                            selectedUpdate?.id === item.id 
                              ? 'bg-blue-600/10 border-blue-500/50 z-10' 
                              : 'bg-transparent border-transparent hover:bg-slate-800/40 hover:scale-[1.005]'
                          }`}
                        >
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded border tracking-wider ${wardBadgeColor}`}>
                                {t(`citizens_service.filters.${item.priority.toLowerCase()}`)}
                              </span>
                              <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                            </div>
                            <p className="text-xs text-slate-400 pl-1">{item.info}</p>
                          </div>
                          <span className="text-[11px] text-slate-500 whitespace-nowrap pt-1 font-semibold">{item.time}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Enhanced Update Details */}
              <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-4 shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex-1 flex flex-col">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 pb-2 border-b border-slate-800/50">
                  {t('citizens_service.details.panel_title')}
                </h3>
                
                <div className="max-h-[320px] overflow-y-auto flex-1 custom-scrollbar pr-1">
                  {selectedUpdate ? (
                    <div className="bg-[#141d30] border border-slate-800/60 rounded-lg p-4 space-y-4">
                      
                      <div className="grid grid-cols-2 gap-y-2 gap-x-3 border-b border-slate-800/50 pb-3 text-xs">
                        <div>
                          <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-0.5">{t('citizens_service.details.responsible_department')}</span>
                          <span className="text-slate-200 font-semibold">{selectedUpdate.department}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-0.5">{t('citizens_service.details.assigned_resource')}</span>
                          <span className="text-slate-200 font-semibold">{selectedUpdate.assignedTo}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-1">{t('citizens_service.details.issue_assessment')}</span>
                        <p className="text-xs text-slate-300 leading-relaxed font-normal">{selectedUpdate.sub}</p>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1 tracking-wide">
                          <span>{t('citizens_service.details.resolution_target_steps')}</span>
                          <span className={selectedUpdate.progress === 100 ? "text-green-400" : "text-blue-400"}>
                            {selectedUpdate.progress}% Complete
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${selectedUpdate.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${selectedUpdate.progress}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-2">{t('citizens_service.details.activity_log')}</span>
                        <div className="space-y-3 border-l-2 border-slate-800 pl-3 ml-1 relative">
                          {selectedUpdate.timeline.map((log, index) => (
                            <div key={index} className="relative text-xs">
                              <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-[#141d30] border-2 border-blue-500" />
                              <div className="flex items-center gap-2 text-[11px]">
                                <span className="text-slate-500 font-mono font-bold">{log.time}</span>
                                <span className="text-blue-400 font-bold uppercase text-[9px] bg-blue-500/10 px-1 py-0.5 rounded">
                                  {log.status}
                                </span>
                              </div>
                              <p className="text-slate-300 text-xs mt-1 font-normal">{log.note}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="h-full min-h-[200px] flex flex-col items-center justify-center border border-dashed border-slate-800/60 rounded-lg text-slate-500">
                      <InboxOutlined className="text-2xl text-slate-600 mb-2" />
                      <p className="text-xs font-semibold">{t('citizens_service.feed.empty_state')}</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* ROW 3: Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            
            <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-4 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2 border-b border-slate-800/60 pb-2">
                <PieChartOutlined className="text-blue-400 text-base" /> {t('citizens_service.charts.category_allocation_title')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-6 bg-[#090e18]/40 p-1.5 rounded-lg border border-slate-800/40">
                  <HighchartsReact highcharts={Highcharts} options={pieChartOptions1} />
                </div>
                <div className="md:col-span-6 space-y-2">
                  <h5 className="text-sm font-bold text-slate-300">{t('citizens_service.charts.category_allocation_title')}</h5>
                  <p className="text-sm text-slate-400 leading-relaxed font-normal">
                    {t('citizens_service.charts.category_allocation_summary')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-4 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2 border-b border-slate-800/60 pb-2">
                <LineChartOutlined className="text-amber-500 text-base" /> {t('citizens_service.charts.monthly_inflow_title')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-6 bg-[#090e18]/40 p-1.5 rounded-lg border border-slate-800/40">
                  <HighchartsReact highcharts={Highcharts} options={lineChartOptions} />
                </div>
                <div className="md:col-span-6 space-y-2">
                  <h5 className="text-sm font-bold text-slate-300">{t('citizens_service.charts.monthly_inflow_title')}</h5>
                  <p className="text-sm text-slate-400 leading-relaxed font-normal">
                    {t('citizens_service.charts.monthly_inflow_summary')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-4 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2 border-b border-slate-800/60 pb-2">
                <BarChartOutlined className="text-green-500 text-base" /> {t('citizens_service.charts.turnaround_title')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-6 bg-[#090e18]/40 p-1.5 rounded-lg border border-slate-800/40">
                  <HighchartsReact highcharts={Highcharts} options={columnChartOptions} />
                </div>
                <div className="md:col-span-6 space-y-2">
                  <h5 className="text-sm font-bold text-slate-300">{t('citizens_service.charts.turnaround_title')}</h5>
                  <p className="text-sm text-slate-400 leading-relaxed font-normal">
                    {t('citizens_service.charts.turnaround_summary')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-4 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2 border-b border-slate-800/60 pb-2">
                <PieChartOutlined className="text-red-500 text-base" /> {t('citizens_service.charts.ward_performance_title')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-6 bg-[#090e18]/40 p-1.5 rounded-lg border border-slate-800/40">
                  <HighchartsReact highcharts={Highcharts} options={pieChartOptions2} />
                </div>
                <div className="md:col-span-6 space-y-2">
                  <h5 className="text-sm font-bold text-slate-300">{t('citizens_service.charts.ward_performance_title')}</h5>
                  <p className="text-sm text-slate-400 leading-relaxed font-normal">
                    {t('citizens_service.charts.ward_performance_summary')}
                  </p>
                </div>
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
    </div>
  );
};

export default CitizensServiceRequests;