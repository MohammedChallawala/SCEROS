import React from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '../utils/cn';

// Line Chart for usage trends
export function UsageLineChart({ data, className = '' }) {
  const colors = {
    electricity: '#f59e0b',
    water: '#3b82f6',
    hvac: '#10b981'
  };

  return (
    <div className={cn('w-full h-80', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="electricity" 
            stroke={colors.electricity} 
            strokeWidth={2}
            dot={{ fill: colors.electricity, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: colors.electricity, strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="water" 
            stroke={colors.water} 
            strokeWidth={2}
            dot={{ fill: colors.water, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: colors.water, strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="hvac" 
            stroke={colors.hvac} 
            strokeWidth={2}
            dot={{ fill: colors.hvac, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: colors.hvac, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Bar Chart for comparing areas
export function AreaComparisonChart({ data, className = '' }) {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className={cn('w-full h-80', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Bar dataKey="electricity" fill={colors[0]} radius={[4, 4, 0, 0]} />
          <Bar dataKey="water" fill={colors[1]} radius={[4, 4, 0, 0]} />
          <Bar dataKey="hvac" fill={colors[2]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Area Chart for cumulative usage
export function CumulativeUsageChart({ data, className = '' }) {
  const colors = {
    electricity: '#f59e0b',
    water: '#3b82f6',
    hvac: '#10b981'
  };

  return (
    <div className={cn('w-full h-80', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="electricity" 
            stackId="1"
            stroke={colors.electricity} 
            fill={colors.electricity}
            fillOpacity={0.6}
          />
          <Area 
            type="monotone" 
            dataKey="water" 
            stackId="1"
            stroke={colors.water} 
            fill={colors.water}
            fillOpacity={0.6}
          />
          <Area 
            type="monotone" 
            dataKey="hvac" 
            stackId="1"
            stroke={colors.hvac} 
            fill={colors.hvac}
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Pie Chart for resource distribution
export function ResourceDistributionChart({ data, className = '' }) {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className={cn('w-full h-80', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Simple Metric Chart
export function MetricChart({ 
  title, 
  value, 
  unit, 
  trend, 
  trendDirection = 'up',
  className = '' 
}) {
  const trendColor = trendDirection === 'up' ? 'text-success-600' : 'text-danger-600';
  const trendIcon = trendDirection === 'up' ? '↗' : '↘';

  return (
    <div className={cn('text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200', className)}>
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <div className="flex items-baseline justify-center space-x-1 mb-2">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {unit && <span className="text-lg text-gray-500">{unit}</span>}
      </div>
      {trend && (
        <div className={cn('text-sm font-medium', trendColor)}>
          {trendIcon} {trend}%
        </div>
      )}
    </div>
  );
}

export default UsageLineChart; 