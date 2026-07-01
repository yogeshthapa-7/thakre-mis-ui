import React, { useState, useMemo } from 'react';
import { Select, Input, Button, Upload, ConfigProvider, theme } from 'antd';
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
  BarChartOutlined
} from '@ant-design/icons';
import SiteHeader from "../../islands/navigation/site-header";
import Highcharts from "highcharts";
import _HighchartsReact from "highcharts-react-official";

// Path mapping reference
import { GisMap } from '../../Components/gis-map-component-thakre';

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

const CitizensServiceRequests: React.FC = () => {
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
    { title: 'Total Requests', val: '328', desc: 'Total issues reported by citizens', icon: <ContainerOutlined className="text-blue-400 text-lg" />, color: 'text-white' },
    { title: 'Issues In Progress', val: '92', desc: 'Current issues being addressed', icon: <ThunderboltFilled className="text-amber-500 text-lg" />, color: 'text-amber-500' },
    { title: 'Resolved Cases', val: '214', desc: 'Successfully closed dispatches', icon: <CheckCircleFilled className="text-green-500 text-lg" />, color: 'text-green-500' },
    { title: 'Urgent Dispatches', val: '22', desc: 'High-priority emergency alerts', icon: <WarningFilled className="text-red-500 text-lg" />, color: 'text-red-500' }
  ], []);

  // HIGHCHARTS CONFIGURATIONS
  const pieChartOptions1 = useMemo(() => ({
    chart: { backgroundColor: 'transparent', type: 'pie', height: 200, spacing: [10, 10, 10, 10] },
    title: { text: null },
    legend: { enabled: true, itemStyle: { color: '#94a3b8', fontSize: '13px' }, layout: 'vertical' as const, align: 'right' as const, verticalAlign: 'middle' as const },
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
    xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr'], labels: { style: { color: '#64748b', fontSize: '12px' } }, borderWidth: 0 },
    yAxis: { title: { text: null }, gridLineColor: '#1e293b', labels: { style: { color: '#64748b', fontSize: '12px' } } },
    legend: { enabled: false },
    series: [{ name: 'Inflow Volume', data: [120, 185, 140, 210], color: '#f59e0b' }],
    credits: { enabled: false }
  }), []);

  const columnChartOptions = useMemo(() => ({
    chart: { backgroundColor: 'transparent', type: 'column', height: 200, spacing: [10, 10, 10, 10] },
    title: { text: null },
    xAxis: { categories: ['Roads', 'Water', 'Waste', 'Power'], labels: { style: { color: '#64748b', fontSize: '12px' } }, borderWidth: 0 },
    yAxis: { title: { text: null }, gridLineColor: '#1e293b', labels: { style: { color: '#64748b', fontSize: '12px' } } },
    legend: { enabled: false },
    plotOptions: { series: { borderRadius: 3 } },
    series: [{ name: 'Hours to Close', data: [48, 72, 24, 12], color: '#10b981' }],
    credits: { enabled: false }
  }), []);

  const pieChartOptions2 = useMemo(() => ({
    chart: { backgroundColor: 'transparent', type: 'pie', height: 200, spacing: [10, 10, 10, 10] },
    title: { text: null },
    legend: { enabled: true, itemStyle: { color: '#94a3b8', fontSize: '13px' }, layout: 'vertical' as const, align: 'right' as const, verticalAlign: 'middle' as const },
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

const handleMapIncidentSelect = (marker: any) => {
    // Looks for a match via ID first, falls back to matching by title if needed
    const matchedUpdate = recentUpdates.find(
      u => u.id === marker.id || u.title === marker.title
    );
    if (matchedUpdate) {
      setSelectedUpdate(matchedUpdate);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-200 antialiased selection:bg-blue-600/30 font-sans pb-12 text-base">
      <SiteHeader />
      
      {/* Set explicit global token scaling for Ant Design elements */}
      <ConfigProvider 
        theme={{ 
          algorithm: theme.darkAlgorithm,
          token: { fontSize: 14, controlHeight: 40 }
        }}
      >
        <div className="bg-[#0b111e] border-b border-slate-800/60 px-6 py-4 flex items-center gap-3 text-lg font-semibold text-slate-300">
          <span className="text-blue-500 opacity-90 text-lg">:::</span> Thakre Municipality Issue Management Portal
        </div>

        <main className="p-6 max-w-[1700px] mx-auto space-y-8">
          
          {/* ROW 1: Map | Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Map Box */}
            <div className="lg:col-span-8 bg-[#101726] border border-slate-800/80 rounded-xl p-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800/60 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                    <EnvironmentOutlined className="text-orange-500 animate-pulse text-lg" /> Interactive GIS Map for Thakre, Dhading[cite: 3]
                  </h3>
                </div>
                
                <div className="flex items-center gap-2 bg-[#070b12] p-1.5 rounded-lg border border-slate-800">
                  <button 
                    onClick={() => setMapViewMode("osm")} 
                    className={`text-xs font-bold px-3 py-1.5 rounded transition-colors ${mapViewMode === 'osm' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Vector Layout
                  </button>
                  <button 
                    onClick={() => setMapViewMode("satellite")} 
                    className={`text-xs font-bold px-3 py-1.5 rounded transition-colors ${mapViewMode === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Satellite Mesh
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
            <div className="lg:col-span-4 flex flex-col justify-between gap-5">
              {metricCards.map((card, i) => (
                <div key={i} className="bg-[#101726] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-slate-700/60 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.7)] backdrop-blur-sm flex-grow">
                  <p className="text-sm font-semibold text-slate-400 flex items-center gap-2 pb-2 mb-3 border-b border-slate-800/60 -mx-5 px-5">
                    {card.icon} {card.title}
                  </p>
                  <h2 className={`text-3xl font-extrabold tracking-tight ${card.color}`}>{card.val}</h2>
                  <p className="text-xs text-slate-500 font-semibold pt-1">{card.desc}</p>
                </div>
              ))}
            </div>

          </div>

          {/* ROW 2: Form | Updates Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Submit Request Form */}
            <div className="lg:col-span-6 bg-[#101726] border border-slate-800/80 rounded-xl p-6 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-sm flex flex-col justify-between transition-all duration-300 hover:scale-[1.005] hover:border-slate-700/60">
              <div className="flex flex-col h-full justify-between gap-5">
                <div>
                  <h3 className="text-lg font-bold border-b border-slate-800/60 pb-3 mb-3 text-white tracking-wide flex items-center gap-2 m-0">
                    Submit a New Issue
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal m-0">
                    Use this form to register infrastructure issues directly into our live dispatch log. Select an appropriate category, pin down your location coordinates or landmark details, and upload an optional asset photograph to help our municipal response teams review, prioritize, and clear the incident efficiently.[cite: 3]
                  </p>
                </div>
                
                <div className="flex-1 flex flex-col justify-between gap-5 py-2">
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <label className="text-sm font-bold text-slate-300">Issue Category</label>
                    <div className="col-span-2">
                      <Select defaultValue="road" className="w-full">
                        <Option value="road">Road Maintenance</Option>
                        <Option value="water">Water Supply</Option>
                        <Option value="waste">Waste Management</Option>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center">
                    <label className="text-sm font-bold text-slate-300">Location</label>
                    <div className="col-span-2">
                      <Input placeholder="Enter specific location" className="bg-[#151f33] border-slate-700 text-white h-10 text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-start flex-1 min-h-[100px]">
                    <label className="text-sm font-bold text-slate-300 pt-2">Description</label>
                    <div className="col-span-2 h-full flex">
                      <TextArea 
                        rows={4} 
                        placeholder="Describe the issue in detail (e.g. pressure drops, exact pipe dimensions, hazard levels)..." 
                        className="bg-[#151f33] border-slate-700 text-white text-sm resize-none flex-1 h-full min-h-full" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center">
                    <label className="text-sm font-bold text-slate-300">Upload Image</label>
                    <div className="col-span-2">
                      <Upload maxCount={1} className="w-full block">
                        <Button 
                          icon={<UploadOutlined className="text-blue-400 text-base" />} 
                          className="w-full bg-[#151f33] hover:bg-[#1b273d] border border-dashed border-slate-700 text-slate-300 flex items-center justify-center gap-2 h-12 px-4 transition-colors rounded-lg text-sm"
                        >
                          <span>Click or Drag Asset Photo Here</span>
                        </Button>
                      </Upload>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center">
                    <label className="text-sm font-bold text-slate-300">Your Name</label>
                    <div className="col-span-2">
                      <Input placeholder="Enter your full name" className="bg-[#151f33] border-slate-700 text-white h-10 text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center">
                    <label className="text-sm font-bold text-slate-300">Contact Number</label>
                    <div className="col-span-2">
                      <Input placeholder="Enter active phone contact" className="bg-[#151f33] border-slate-700 text-white h-10 text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center">
                    <label className="text-sm font-bold text-slate-300">Email Address</label>
                    <div className="col-span-2">
                      <Input placeholder="Enter email address" className="bg-[#151f33] border-slate-700 text-white h-10 text-sm" />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="primary" className="w-full h-11 font-bold text-sm bg-gradient-to-b from-[#1e5bc6] to-[#123e91] border border-blue-500/20 rounded-lg shadow-lg hover:opacity-95 transition-all m-0">
                    Submit Request
                  </Button>
                </div>
              </div>
            </div>

            {/* Updates Feed */}
            <div className="lg:col-span-6 flex flex-col gap-6 justify-between">
              
              <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center border-b border-slate-800/60 pb-3 mb-4">
                    <h3 className="text-base font-bold text-slate-200 tracking-wide">Live Issues Feed</h3>
                    <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full font-mono font-bold">{recentUpdates.length} Active Records</span>
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
                          className={`py-3.5 px-3.5 rounded-lg my-1.5 border transition-all duration-300 ease-out cursor-pointer flex items-start justify-between gap-4 origin-center transform ${
                            selectedUpdate?.id === item.id 
                              ? 'bg-blue-600/10 border-blue-500/50 z-10' 
                              : 'bg-transparent border-transparent hover:bg-slate-800/40 hover:scale-[1.005]'
                          }`}
                        >
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <span className={`text-xs uppercase font-extrabold px-2.5 py-0.5 rounded border tracking-wider ${wardBadgeColor}`}>
                                {wardLabel}
                              </span>
                              <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                            </div>
                            <p className="text-sm text-slate-400 pl-1">{item.info}</p>
                          </div>
                          <span className="text-xs text-slate-500 whitespace-nowrap pt-1 font-semibold">{item.time}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Enhanced Update Details */}
              <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex-1 flex flex-col">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 pb-3 border-b border-slate-800/50">
                  Issues Updates Details
                </h3>
                
                <div className="max-h-[320px] overflow-y-auto flex-1 custom-scrollbar pr-1">
                  {selectedUpdate ? (
                    <div className="bg-[#141d30] border border-slate-800/60 rounded-lg p-5 space-y-5">
                      
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-b border-slate-800/50 pb-4 text-sm">
                        <div>
                          <span className="text-slate-500 block text-xs font-bold uppercase tracking-wider mb-0.5">Responsible Department</span>
                          <span className="text-slate-200 font-semibold">{selectedUpdate.department}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-xs font-bold uppercase tracking-wider mb-0.5">Assigned Resource</span>
                          <span className="text-slate-200 font-semibold">{selectedUpdate.assignedTo}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-xs font-bold uppercase tracking-wider mb-1.5">Issue Assessment</span>
                        <p className="text-sm text-slate-300 leading-relaxed font-normal">{selectedUpdate.sub}</p>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5 tracking-wide">
                          <span>RESOLUTION TARGET STEPS</span>
                          <span className={selectedUpdate.progress === 100 ? "text-green-400" : "text-blue-400"}>
                            {selectedUpdate.progress}% Complete
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${selectedUpdate.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${selectedUpdate.progress}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-xs font-bold uppercase tracking-wider mb-3">Activity Transmission Log</span>
                        <div className="space-y-4 border-l-2 border-slate-800 pl-4 ml-1.5 relative">
                          {selectedUpdate.timeline.map((log, index) => (
                            <div key={index} className="relative text-sm">
                              <span className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-[#141d30] border-2 border-blue-500" />
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-slate-500 font-mono font-bold">{log.time}</span>
                                <span className="text-blue-400 font-bold uppercase text-[10px] bg-blue-500/10 px-1.5 py-0.5 rounded">
                                  {log.status}
                                </span>
                              </div>
                              <p className="text-slate-300 text-sm mt-1 font-normal">{log.note}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="h-full min-h-[200px] flex flex-col items-center justify-center border border-dashed border-slate-800/60 rounded-lg text-slate-500">
                      <InboxOutlined className="text-3xl text-slate-600 mb-2" />
                      <p className="text-sm font-semibold">Select an entry from the live dispatch streams to inspect deep details.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* ROW 3: Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2 border-b border-slate-800/60 pb-3">
                <PieChartOutlined className="text-blue-400 text-base" /> Category Allocation Distribution
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-6 bg-[#090e18]/40 p-2 rounded-lg border border-slate-800/40">
                  <HighchartsReact highcharts={Highcharts} options={pieChartOptions1} />
                </div>
                <div className="md:col-span-6 space-y-2">
                  <h5 className="text-sm font-bold text-slate-300">Context Analytics Summary</h5>
                  <p className="text-sm text-slate-400 leading-relaxed font-normal">
                    This analytics map profiles requests grouped by administrative sector. Waste collection routes account for the largest active volume across urban hubs.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2 border-b border-slate-800/60 pb-3">
                <LineChartOutlined className="text-amber-500 text-base" /> Monthly Incident Inflow Progression
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-6 bg-[#090e18]/40 p-2 rounded-lg border border-slate-800/40">
                  <HighchartsReact highcharts={Highcharts} options={lineChartOptions} />
                </div>
                <div className="md:col-span-6 space-y-2">
                  <h5 className="text-sm font-bold text-slate-300">Context Analytics Summary</h5>
                  <p className="text-sm text-slate-400 leading-relaxed font-normal">
                    Tracks historical inflow velocities across reporting intervals. Spikes observed relate directly to intensive structural updates.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2 border-b border-slate-800/60 pb-3">
                <BarChartOutlined className="text-green-500 text-base" /> Resolution Dispatch Turnaround Times
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-6 bg-[#090e18]/40 p-2 rounded-lg border border-slate-800/40">
                  <HighchartsReact highcharts={Highcharts} options={columnChartOptions} />
                </div>
                <div className="md:col-span-6 space-y-2">
                  <h5 className="text-sm font-bold text-slate-300">Context Analytics Summary</h5>
                  <p className="text-sm text-slate-400 leading-relaxed font-normal">
                    Measures efficiency output across operational vectors. Internal field logistics confirm waste clearings exhibit the fastest transition rate.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2 border-b border-slate-800/60 pb-3">
                <PieChartOutlined className="text-red-500 text-base" /> Ward Operations Performance Mapping
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-6 bg-[#090e18]/40 p-2 rounded-lg border border-slate-800/40">
                  <HighchartsReact highcharts={Highcharts} options={pieChartOptions2} />
                </div>
                <div className="md:col-span-6 space-y-2">
                  <h5 className="text-sm font-bold text-slate-300">Context Analytics Summary</h5>
                  <p className="text-sm text-slate-400 leading-relaxed font-normal">
                    Establishes local spatial concentration metrics for ongoing requests. Ward 3 and Ward 5 capture the majority of workloads.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </main>
      </ConfigProvider>
    </div>
  );
};

export default CitizensServiceRequests;