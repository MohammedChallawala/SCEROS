import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

function Card({ 
  children, 
  className = '', 
  variant = 'default',
  onClick,
  hover = true,
  ...props 
}) {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200 p-6';
  const hoverClasses = hover ? 'hover:shadow-md transition-all duration-200 cursor-pointer' : '';
  
  const variants = {
    default: '',
    primary: 'border-primary-200 bg-primary-50',
    success: 'border-success-200 bg-success-50',
    warning: 'border-warning-200 bg-warning-50',
    danger: 'border-danger-200 bg-danger-50',
    info: 'border-blue-200 bg-blue-50'
  };

  const cardClasses = cn(
    baseClasses,
    hoverClasses,
    variants[variant],
    className
  );

  const CardComponent = onClick ? motion.div : 'div';
  const cardProps = onClick ? {
    onClick,
    whileHover: { y: -2 },
    whileTap: { scale: 0.98 }
  } : {};

  return (
    <CardComponent 
      className={cardClasses} 
      {...cardProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
}

// Resource Usage Card
export function ResourceCard({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend, 
  status = 'normal',
  className = '' 
}) {
  const statusColors = {
    normal: 'text-gray-600',
    low: 'text-success-600',
    medium: 'text-warning-600',
    high: 'text-danger-600'
  };

  const statusBgColors = {
    normal: 'bg-gray-100',
    low: 'bg-success-100',
    medium: 'bg-warning-100',
    high: 'bg-danger-100'
  };

  return (
    <Card className={cn('text-center', className)}>
      <div className="flex flex-col items-center space-y-3">
        {Icon && (
          <div className={cn('p-3 rounded-full', statusBgColors[status])}>
            <Icon className={cn('w-6 h-6', statusColors[status])} />
          </div>
        )}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <div className="flex items-baseline justify-center space-x-1">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            {unit && <span className="text-sm text-gray-500">{unit}</span>}
          </div>
          {trend && (
            <div className={cn(
              'text-xs mt-1',
              trend > 0 ? 'text-danger-600' : 'text-success-600'
            )}>
              {trend > 0 ? '+' : ''}{trend}% from yesterday
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// Area Summary Card
export function AreaCard({ 
  area, 
  onClick, 
  className = '' 
}) {
  const getStatusColor = (usage, threshold) => {
    const percentage = (usage / threshold) * 100;
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    if (percentage >= 50) return 'normal';
    return 'success';
  };

  return (
    <Card 
      onClick={onClick} 
      className={cn('cursor-pointer', className)}
      hover={true}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{area.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{area.type}</p>
          </div>
          <span className={cn(
            'status-badge',
            area.status === 'Active' ? 'status-active' : 'status-inactive'
          )}>
            {area.status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-yellow-600">{area.electricity}</div>
            <div className="text-xs text-gray-500">kWh</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">{area.water}</div>
            <div className="text-xs text-gray-500">L</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">{area.hvac}</div>
            <div className="text-xs text-gray-500">BTU</div>
          </div>
        </div>

        <div className="text-xs text-gray-400 text-right">
          Last updated: {new Date(area.lastUpdated).toLocaleTimeString()}
        </div>
      </div>
    </Card>
  );
}

export default Card; 