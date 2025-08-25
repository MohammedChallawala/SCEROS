import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Settings, 
  AlertTriangle, 
  BarChart3, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Shield,
  Activity,
  TrendingUp,
  Zap,
  Droplets,
  Wind
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { ResourceCard, AreaCard } from '../components/Card';
import { MetricChart, ResourceDistributionChart } from '../components/Chart';
import Table, { columnRenderers } from '../components/Table';
import areasData from '../data/areas.json';
import alertsData from '../data/alerts.json';
import usersData from '../data/users.json';
import usageData from '../data/usage.json';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [areas, setAreas] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalAreas: 0,
    activeAlerts: 0,
    totalUsage: { electricity: 0, water: 0, hvac: 0 }
  });
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    setUsers(usersData);
    setAreas(areasData);
    setAlerts(alertsData);

    // Calculate system metrics
    const totalUsage = areasData.reduce((total, area) => ({
      electricity: total.electricity + area.electricity,
      water: total.water + area.water,
      hvac: total.hvac + area.hvac
    }), { electricity: 0, water: 0, hvac: 0 });

    setSystemMetrics({
      totalUsers: usersData.length,
      activeUsers: usersData.filter(u => u.status === 'Active').length,
      totalAreas: areasData.length,
      activeAlerts: alertsData.filter(a => a.status === 'Unresolved').length,
      totalUsage
    });
  }, []);

  const handleDeleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const handleToggleUserStatus = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ));
  };

  const userColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: columnRenderers.status },
    { key: 'lastLogin', label: 'Last Login', sortable: true, render: columnRenderers.datetime },
    { key: 'assignedAreas', label: 'Areas', sortable: false, render: (areas) => (
      <span className="text-sm text-gray-600">{areas?.length || 0} areas</span>
    )}
  ];

  const userActions = [
    {
      label: 'View',
      icon: <Eye className="w-4 h-4" />,
      onClick: (user) => console.log('View user:', user)
    },
    {
      label: 'Edit',
      icon: <Edit className="w-4 h-4" />,
      onClick: (user) => console.log('Edit user:', user)
    },
    {
      label: 'Toggle Status',
      icon: <Activity className="w-4 h-4" />,
      onClick: handleToggleUserStatus
    },
    {
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: handleDeleteUser,
      variant: 'danger'
    }
  ];

  const getUsageTrend = (resourceType) => {
    // Mock trend calculation
    return Math.random() > 0.5 ? Math.floor(Math.random() * 15) + 1 : -(Math.floor(Math.random() * 15) + 1);
  };

  const getStatusColor = (usage, threshold) => {
    const percentage = (usage / threshold) * 100;
    if (percentage >= 90) return 'high';
    if (percentage >= 75) return 'medium';
    if (percentage >= 50) return 'normal';
    return 'low';
  };

  const getResourceDistributionData = () => {
    return [
      { name: 'Electricity', value: systemMetrics.totalUsage.electricity },
      { name: 'Water', value: systemMetrics.totalUsage.water },
      { name: 'HVAC', value: systemMetrics.totalUsage.hvac }
    ];
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ResourceCard
          title="Total Campus Electricity"
          value={systemMetrics.totalUsage.electricity}
          unit="kWh"
          icon={Zap}
          trend={getUsageTrend('electricity')}
          status={getStatusColor(systemMetrics.totalUsage.electricity, 2000)}
        />
        <ResourceCard
          title="Total Campus Water"
          value={systemMetrics.totalUsage.water}
          unit="L"
          icon={Droplets}
          trend={getUsageTrend('water')}
          status={getStatusColor(systemMetrics.totalUsage.water, 1000)}
        />
        <ResourceCard
          title="Total Campus HVAC"
          value={systemMetrics.totalUsage.hvac}
          unit="BTU"
          icon={Wind}
          trend={getUsageTrend('hvac')}
          status={getStatusColor(systemMetrics.totalUsage.hvac, 600)}
        />
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricChart
          title="Total Users"
          value={systemMetrics.totalUsers}
          unit=""
        />
        <MetricChart
          title="Active Users"
          value={systemMetrics.activeUsers}
          unit=""
          trend={Math.round((systemMetrics.activeUsers / systemMetrics.totalUsers) * 100)}
          trendDirection="up"
        />
        <MetricChart
          title="Areas Monitored"
          value={systemMetrics.totalAreas}
          unit=""
        />
        <MetricChart
          title="Active Alerts"
          value={systemMetrics.activeAlerts}
          unit=""
          trend={5}
          trendDirection="up"
        />
      </div>

      {/* Resource Distribution Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-primary-600" />
          Resource Distribution
        </h3>
        <ResourceDistributionChart data={getResourceDistributionData()} />
      </div>

      {/* Recent Areas */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-primary-600" />
          Campus Areas Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {areas.slice(0, 6).map((area) => (
            <AreaCard
              key={area.id}
              area={area}
              onClick={() => console.log('View area:', area)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>
      
      <Table
        data={users}
        columns={userColumns}
        actions={userActions}
        pageSize={10}
      />
    </div>
  );

  const renderThresholds = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Threshold Management</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map((area) => (
          <div key={area.id} className="card">
            <h4 className="font-medium text-gray-900 mb-4">{area.name}</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Electricity Threshold (kWh)
                </label>
                <input
                  type="number"
                  defaultValue={Math.round(area.electricity * 1.2)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Water Threshold (L)
                </label>
                <input
                  type="number"
                  defaultValue={Math.round(area.water * 1.2)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HVAC Threshold (BTU)
                </label>
                <input
                  type="number"
                  defaultValue={Math.round(area.hvac * 1.2)}
                  className="input-field"
                />
              </div>
              <button className="btn-primary w-full">Update Thresholds</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAuditLogs = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Audit Logs</h3>
      
      <div className="card">
        <div className="space-y-4">
          {[
            { action: 'User Login', user: 'john.smith@campus.edu', timestamp: '2024-01-15T10:30:00Z', ip: '192.168.1.100' },
            { action: 'Threshold Updated', user: 'admin@campus.edu', timestamp: '2024-01-15T09:15:00Z', ip: '192.168.1.1' },
            { action: 'Alert Resolved', user: 'mike.wilson@campus.edu', timestamp: '2024-01-15T08:45:00Z', ip: '192.168.1.50' },
            { action: 'User Created', user: 'admin@campus.edu', timestamp: '2024-01-15T08:00:00Z', ip: '192.168.1.1' },
            { action: 'System Backup', user: 'system', timestamp: '2024-01-15T07:00:00Z', ip: '192.168.1.1' }
          ].map((log, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{log.action}</div>
                <div className="text-sm text-gray-500">by {log.user}</div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <div>{new Date(log.timestamp).toLocaleString()}</div>
                <div>{log.ip}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
            Administrative Dashboard
          </h1>
          <p className="text-gray-600">
            Manage users, monitor system health, and configure thresholds
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'users', label: 'User Management', icon: Users },
                { id: 'thresholds', label: 'Thresholds', icon: Settings },
                { id: 'audit', label: 'Audit Logs', icon: Shield }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`
                      py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                      ${selectedTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedTab === 'overview' && renderOverview()}
          {selectedTab === 'users' && renderUserManagement()}
          {selectedTab === 'thresholds' && renderThresholds()}
          {selectedTab === 'audit' && renderAuditLogs()}
        </motion.div>
      </div>
    </div>
  );
}

export default AdminDashboard; 