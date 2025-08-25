import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  BarChart3, 
  Users,
  AlertTriangle,
  Zap,
  Droplets,
  Wind
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBasedLinks = () => {
    switch (user?.role) {
      case 'Admin':
        return [
          { name: 'Dashboard', href: '/admin', icon: BarChart3 },
          { name: 'User Management', href: '/admin/users', icon: Users },
          { name: 'Thresholds', href: '/admin/thresholds', icon: Settings },
          { name: 'Audit Logs', href: '/admin/logs', icon: AlertTriangle }
        ];
      case 'Facility Manager':
        return [
          { name: 'Dashboard', href: '/facility', icon: BarChart3 },
          { name: 'Alerts', href: '/facility/alerts', icon: AlertTriangle },
          { name: 'Reports', href: '/facility/reports', icon: BarChart3 }
        ];
      case 'Student':
      case 'Faculty':
        return [
          { name: 'Dashboard', href: '/student', icon: BarChart3 },
          { name: 'My Areas', href: '/student/areas', icon: User },
          { name: 'Recommendations', href: '/student/recommendations', icon: AlertTriangle }
        ];
      default:
        return [];
    }
  };

  const getResourceIcons = () => [
    { type: 'electricity', icon: Zap, color: 'text-yellow-500' },
    { type: 'water', icon: Droplets, color: 'text-blue-500' },
    { type: 'hvac', icon: Wind, color: 'text-green-500' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SCEROS</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {getRoleBasedLinks().map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <span>{user?.name}</span>
              <span className="text-gray-400">•</span>
              <span className="capitalize">{user?.role}</span>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:block">Profile</span>
                {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 border-t border-gray-200"
          >
            {getRoleBasedLinks().map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 