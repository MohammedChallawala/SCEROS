import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { cn } from '../utils/cn';

function Table({ 
  data, 
  columns, 
  className = '',
  searchable = true,
  filterable = true,
  sortable = true,
  pagination = true,
  pageSize = 10,
  onRowClick,
  actions = []
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});

  // Filter data based on search term and filters
  const filteredData = useMemo(() => {
    let filtered = data.filter(item => {
      // Search filter
      if (searchTerm) {
        const searchMatch = Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (!searchMatch) return false;
      }

      // Column filters
      for (const [key, value] of Object.entries(filters)) {
        if (value && item[key] !== value) return false;
      }

      return true;
    });

    // Sort data
    if (sortConfig.key && sortable) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, filters, sortConfig, sortable]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (key) => {
    if (!sortable) return;
    
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className={cn('bg-white rounded-lg shadow-sm border border-gray-200', className)}>
      {/* Table Header with Search and Filters */}
      {(searchable || filterable) && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            {searchable && (
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Filters */}
            {filterable && (
              <div className="flex gap-2">
                {columns
                  .filter(col => col.filterable !== false)
                  .map(col => (
                    <select
                      key={col.key}
                      onChange={(e) => handleFilter(col.key, e.target.value)}
                      value={filters[col.key] || ''}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">{col.label}</option>
                      {col.filterOptions?.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ))}
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    sortable && col.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : '',
                    col.className
                  )}
                  onClick={() => sortable && col.sortable !== false && handleSort(col.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.label}</span>
                    {sortable && col.sortable !== false && getSortIcon(col.key)}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item, index) => (
              <motion.tr
                key={item.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'hover:bg-gray-50 transition-colors duration-150',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                    {col.render ? col.render(item[col.key], item) : (
                      <div className={cn('text-sm text-gray-900', col.className)}>
                        {item[col.key]}
                      </div>
                    )}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(item);
                          }}
                          className={cn(
                            'p-1 rounded-md transition-colors duration-150',
                            action.variant === 'danger' ? 'hover:bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-600'
                          )}
                          title={action.label}
                        >
                          {action.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'px-3 py-1 text-sm rounded-md',
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Predefined column renderers
export const columnRenderers = {
  status: (value) => (
    <span className={cn(
      'status-badge',
      value === 'Active' ? 'status-active' : 'status-inactive'
    )}>
      {value}
    </span>
  ),
  
  alertStatus: (value) => (
    <span className={cn(
      'status-badge',
      value === 'Resolved' ? 'status-resolved' : 'status-unresolved'
    )}>
      {value}
    </span>
  ),
  
  severity: (value) => (
    <span className={cn(
      'status-badge',
      value === 'High' ? 'severity-high' : 
      value === 'Medium' ? 'severity-medium' : 
      value === 'Low' ? 'severity-low' : 'severity-info'
    )}>
      {value}
    </span>
  ),
  
  priority: (value) => (
    <span className={cn(
      'status-badge',
      value === 'High' ? 'severity-high' : 
      value === 'Medium' ? 'severity-medium' : 
      'severity-low'
    )}>
      {value}
    </span>
  ),
  
  date: (value) => (
    <span className="text-sm text-gray-600">
      {new Date(value).toLocaleDateString()}
    </span>
  ),
  
  datetime: (value) => (
    <span className="text-sm text-gray-600">
      {new Date(value).toLocaleString()}
    </span>
  ),
  
  currency: (value) => (
    <span className="text-sm font-medium">
      ${parseFloat(value).toFixed(2)}
    </span>
  ),
  
  percentage: (value) => (
    <span className="text-sm font-medium">
      {parseFloat(value).toFixed(1)}%
    </span>
  )
};

export default Table; 