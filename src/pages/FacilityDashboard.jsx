import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Droplets, 
  Wind, 
  AlertTriangle, 
  TrendingUp, 
  BarChart3,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { ResourceCard, AreaCard } from '../components/Card';
import { 
  UsageLineChart, 
  AreaComparisonChart, 
  CumulativeUsageChart,
  MetricChart 
} from '../components/Chart';
import Table, { columnRenderers } from '../components/Table';
import areasData from '../data/areas.json';
import alertsData from '../data/alerts.json';
import recommendationsData from '../data/recommendations.json';
import usageData from '../data/usage.json';

function FacilityDashboard() {
  const [areas, setAreas] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [campusUsage, setCampusUsage] = useState({ electricity: 0, water: 0, hvac: 0 });

  useEffect(() => {
    setAreas(areasData);
    setAlerts(alertsData);
    setRecommendations(recommendationsData);

    // Calculate total campus usage
    const totalUsage = areasData.reduce((total, area) => ({
      electricity: total.electricity + area.electricity,
      water: total.water + area.water,
      hvac: total.hvac + area.hvac
    }), { electricity: 0, water: 0, hvac: 0 });
    
    setCampusUsage(totalUsage);
  }, []);

  const getUsageTrend = (resourceType) => {
    // Mock trend calculation - in real app this would come from API
    return Math.random() > 0.5 ? Math.floor(Math.random() * 15) + 1 : -(Math.floor(Math.random() * 15) + 1);
  };

  const getStatusColor = (usage, threshold) => {
    const percentage = (usage / threshold) * 100;
    if (percentage >= 90) return 'high';
    if (percentage >= 75) return 'medium';
    if (percentage >= 50) return 'normal';
    return 'low';
  };

  const handleResolveAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'Resolved', resolvedAt: new Date().toISOString() }
        : alert
    ));
  };

  const alertColumns = [
    { key: 'area', label: 'Area', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'value', label: 'Value', sortable: true },
    { key: 'threshold', label: 'Threshold', sortable: true },
    { key: 'severity', label: 'Severity', sortable: true, render: columnRenderers.severity },
    { key: 'status', label: 'Status', sortable: true, render: columnRenderers.alertStatus },
    { key: 'timestamp', label: 'Time', sortable: true, render: columnRenderers.datetime },
    { key: 'assignedTo', label: 'Assigned To', sortable: true }
  ];

  const alertActions = [
    {
      label: 'Resolve',
      icon: <CheckCircle className="w-4 h-4" />,
      onClick: handleResolveAlert,
      variant: 'success'
    },
    {
      label: 'View Details',
      icon: <Eye className="w-4 h-4" />,
      onClick: (alert) => console.log('View alert:', alert)
    }
  ];

  const getChartData = () => {
    // Aggregate usage data for all areas
    const aggregatedData = usageData.reduce((acc, areaUsage) => {
      areaUsage.data.forEach((dayData, index) => {
        if (!acc[index]) {
          acc[index] = { date: dayData.date, electricity: 0, water: 0, hvac: 0 };
        }
        acc[index].electricity += dayData.electricity;
        acc[index].water += dayData.water;
        acc[index].hvac += dayData.hvac;
      });
      return acc;
    }, []);

    return aggregatedData;
  };

  const getAreaComparisonData = () => {
    return areas.map(area => ({
      name: area.name,
      electricity: area.electricity,
      water: area.water,
      hvac: area.hvac
    }));
  };

  const getResourceDistributionData = () => {
    return [
      { name: 'Electricity', value: campusUsage.electricity },
      { name: 'Water', value: campusUsage.water },
      { name: 'HVAC', value: campusUsage.hvac }
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Facility Management Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor campus-wide resource usage, manage alerts, and optimize energy consumption
          </p>
        </motion.div>

        {/* Campus Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <ResourceCard
            title="Total Campus Electricity"
            value={campusUsage.electricity}
            unit="kWh"
            icon={Zap}
            trend={getUsageTrend('electricity')}
            status={getStatusColor(campusUsage.electricity, 2000)}
          />
          <ResourceCard
            title="Total Campus Water"
            value={campusUsage.water}
            unit="L"
            icon={Droplets}
            trend={getUsageTrend('water')}
            status={getStatusColor(campusUsage.water, 1000)}
          />
          <ResourceCard
            title="Total Campus HVAC"
            value={campusUsage.hvac}
            unit="BTU"
            icon={Wind}
            trend={getUsageTrend('hvac')}
            status={getStatusColor(campusUsage.hvac, 600)}
          />
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Campus Usage Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
              Campus Usage Trends (7 Days)
            </h2>
            <UsageLineChart data={getChartData()} />
          </motion.div>

          {/* Area Comparison */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-primary-600" />
              Area Resource Comparison
            </h2>
            <AreaComparisonChart data={getAreaComparisonData()} />
          </motion.div>
        </div>

        {/* Areas Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary-600" />
              All Campus Areas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {areas.map((area) => (
                <AreaCard
                  key={area.id}
                  area={area}
                  onClick={() => console.log('View area:', area)}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Alerts Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-danger-600" />
                Alerts Management
              </h2>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-danger-600">
                    {alerts.filter(a => a.status === 'Unresolved').length}
                  </span> Unresolved
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-success-600">
                    {alerts.filter(a => a.status === 'Resolved').length}
                  </span> Resolved
                </div>
              </div>
            </div>
            <Table
              data={alerts}
              columns={alertColumns}
              actions={alertActions}
              pageSize={5}
            />
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
              Energy Optimization Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`status-badge ${
                      rec.priority === 'High' ? 'severity-high' : 
                      rec.priority === 'Medium' ? 'severity-medium' : 'severity-low'
                    }`}>
                      {rec.priority}
                    </span>
                    <span className="text-xs text-gray-500">{rec.category}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">{rec.area}</h4>
                  <p className="text-sm text-gray-600 mb-3">{rec.suggestion}</p>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Estimated Savings:</span>
                      <span className="font-medium text-success-600">{rec.estimatedSavings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Implementation Cost:</span>
                      <span className="font-medium">{rec.implementationCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`status-badge ${
                        rec.status === 'Approved' ? 'status-active' :
                        rec.status === 'In Progress' ? 'status-pending' : 'status-pending'
                      }`}>
                        {rec.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <MetricChart
            title="Areas Monitored"
            value={areas.length}
            unit=""
          />
          <MetricChart
            title="Active Alerts"
            value={alerts.filter(a => a.status === 'Unresolved').length}
            unit=""
            trend={5}
            trendDirection="up"
          />
          <MetricChart
            title="Recommendations"
            value={recommendations.length}
            unit=""
          />
          <MetricChart
            title="Avg. Efficiency"
            value={85}
            unit="%"
            trend={-2}
            trendDirection="down"
          />
        </motion.div>
      </div>
    </div>
  );
}

export default FacilityDashboard; 