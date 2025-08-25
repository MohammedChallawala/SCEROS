import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Droplets, 
  Wind, 
  AlertTriangle, 
  TrendingUp, 
  Lightbulb,
  Calendar,
  Clock
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { ResourceCard, AreaCard } from '../components/Card';
import { UsageLineChart, MetricChart } from '../components/Chart';
import { useAuth } from '../contexts/AuthContext';
import areasData from '../data/areas.json';
import alertsData from '../data/alerts.json';
import recommendationsData from '../data/recommendations.json';
import usageData from '../data/usage.json';

function StudentDashboard() {
  const { user } = useAuth();
  const [userAreas, setUserAreas] = useState([]);
  const [userAlerts, setUserAlerts] = useState([]);
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [usageChartData, setUsageChartData] = useState([]);

  useEffect(() => {
    // Filter areas assigned to the current user
    const assignedAreas = areasData.filter(area => 
      user?.assignedAreas?.includes(area.id)
    );
    setUserAreas(assignedAreas);

    // Filter alerts for user's areas
    const areaAlerts = alertsData.filter(alert => 
      user?.assignedAreas?.includes(alert.areaId)
    );
    setUserAlerts(areaAlerts);

    // Filter recommendations for user's areas
    const areaRecommendations = recommendationsData.filter(rec => 
      user?.assignedAreas?.includes(rec.areaId)
    );
    setUserRecommendations(areaRecommendations);

    // Set default selected area
    if (assignedAreas.length > 0) {
      setSelectedArea(assignedAreas[0]);
      const areaUsage = usageData.find(usage => usage.areaId === assignedAreas[0].id);
      if (areaUsage) {
        setUsageChartData(areaUsage.data);
      }
    }
  }, [user]);

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
    const areaUsage = usageData.find(usage => usage.areaId === area.id);
    if (areaUsage) {
      setUsageChartData(areaUsage.data);
    }
  };

  const getTotalUsage = () => {
    if (!userAreas.length) return { electricity: 0, water: 0, hvac: 0 };
    
    return userAreas.reduce((total, area) => ({
      electricity: total.electricity + area.electricity,
      water: total.water + area.water,
      hvac: total.hvac + area.hvac
    }), { electricity: 0, water: 0, hvac: 0 });
  };

  const totalUsage = getTotalUsage();

  const getUsageTrend = (resourceType) => {
    if (!usageChartData.length || usageChartData.length < 2) return 0;
    
    const current = usageChartData[usageChartData.length - 1][resourceType];
    const previous = usageChartData[usageChartData.length - 2][resourceType];
    
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const getStatusColor = (usage, threshold) => {
    const percentage = (usage / threshold) * 100;
    if (percentage >= 90) return 'high';
    if (percentage >= 75) return 'medium';
    if (percentage >= 50) return 'normal';
    return 'low';
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
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Monitor your assigned areas and view energy-saving recommendations
          </p>
        </motion.div>

        {/* Resource Usage Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <ResourceCard
            title="Total Electricity"
            value={totalUsage.electricity}
            unit="kWh"
            icon={Zap}
            trend={getUsageTrend('electricity')}
            status={getStatusColor(totalUsage.electricity, 1000)}
          />
          <ResourceCard
            title="Total Water"
            value={totalUsage.water}
            unit="L"
            icon={Droplets}
            trend={getUsageTrend('water')}
            status={getStatusColor(totalUsage.water, 500)}
          />
          <ResourceCard
            title="Total HVAC"
            value={totalUsage.hvac}
            unit="BTU"
            icon={Wind}
            trend={getUsageTrend('hvac')}
            status={getStatusColor(totalUsage.hvac, 300)}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Assigned Areas */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="card mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                My Assigned Areas
              </h2>
              <div className="space-y-4">
                {userAreas.map((area) => (
                  <AreaCard
                    key={area.id}
                    area={area}
                    onClick={() => handleAreaSelect(area)}
                    className={selectedArea?.id === area.id ? 'ring-2 ring-primary-500' : ''}
                  />
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Areas Monitored</span>
                  <span className="font-semibold text-gray-900">{userAreas.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Alerts</span>
                  <span className="font-semibold text-danger-600">
                    {userAlerts.filter(alert => alert.status === 'Unresolved').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Recommendations</span>
                  <span className="font-semibold text-primary-600">{userRecommendations.length}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Charts and Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Usage Trend Chart */}
            {selectedArea && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                  Usage Trend - {selectedArea.name}
                </h2>
                <UsageLineChart data={usageChartData} />
              </div>
            )}

            {/* Alerts Section */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-danger-600" />
                Recent Alerts
              </h2>
              {userAlerts.length > 0 ? (
                <div className="space-y-3">
                  {userAlerts.slice(0, 3).map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`status-badge ${
                              alert.status === 'Resolved' ? 'status-resolved' : 'status-unresolved'
                            }`}>
                              {alert.status}
                            </span>
                            <span className={`status-badge ${
                              alert.severity === 'High' ? 'severity-high' : 
                              alert.severity === 'Medium' ? 'severity-medium' : 
                              alert.severity === 'Low' ? 'severity-low' : 'severity-info'
                            }`}>
                              {alert.severity}
                            </span>
                          </div>
                          <h4 className="font-medium text-gray-900">{alert.area}</h4>
                          <p className="text-sm text-gray-600">{alert.message}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(alert.timestamp).toLocaleString()}
                            </span>
                            <span>{alert.type}: {alert.value}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No alerts for your areas</p>
              )}
            </div>

            {/* Recommendations Section */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-warning-600" />
                Energy Saving Recommendations
              </h2>
              {userRecommendations.length > 0 ? (
                <div className="space-y-3">
                  {userRecommendations.slice(0, 3).map((rec) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`status-badge ${
                              rec.priority === 'High' ? 'severity-high' : 
                              rec.priority === 'Medium' ? 'severity-medium' : 'severity-low'
                            }`}>
                              {rec.priority} Priority
                            </span>
                            <span className="text-sm text-gray-500">{rec.category}</span>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{rec.area}</h4>
                          <p className="text-sm text-gray-600 mb-2">{rec.suggestion}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Estimated Savings: {rec.estimatedSavings}</span>
                            <span>Cost: {rec.implementationCost}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recommendations available</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard; 