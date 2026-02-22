import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, RefreshCw, ChevronLeft, ChevronRight, Calendar, AlertCircle, AlertTriangle, Info, Server, User, Globe, Clock, X, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LogsList = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [totalLogs, setTotalLogs] = useState(0);
  const [limit, setLimit] = useState(20);

  // Filters
  const [filters, setFilters] = useState({
    severity: '',
    ip: '',
    endpoint: '',
    user: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);

  // Fetch logs
  const fetchLogs = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString()
      });

      if (filters.severity) params.append('severity', filters.severity);
      if (filters.ip) params.append('ip', filters.ip);
      if (filters.endpoint) params.append('endpoint', filters.endpoint);
      if (filters.user) params.append('user', filters.user);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.search) params.append('search', filters.search);

      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/v1/logs?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Simulated API call - replace with actual endpoint
      // const response = await fetch(`/api/v1/logs?${params}`);
      // const data = await response.json();

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Demo data
      // const mockLogs = Array.from({ length: limit }, (_, i) => {
      //   const severities = ['INFO', 'WARNING', 'ERROR'];
      //   const endpoints = ['/api/users', '/api/orders', '/api/products', '/api/auth', '/api/payments'];
      //   const users = ['john@example.com', 'jane@example.com', 'admin@example.com', 'user@example.com'];
      //   const ips = ['192.168.1.1', '10.0.0.5', '172.16.0.10', '192.168.2.45'];
      //   const messages = [
      //     'Request processed successfully',
      //     'Database connection timeout',
      //     'Authentication failed - invalid credentials',
      //     'High memory usage detected',
      //     'API rate limit exceeded',
      //     'Payment processing failed',
      //     'User session expired',
      //     'Cache invalidation completed'
      //   ];

      //   const severity = filters.severity || severities[Math.floor(Math.random() * severities.length)];

      //   return {
      //     id: currentPage * limit + i + 1,
      //     timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      //     severity: severity,
      //     ip: filters.ip || ips[Math.floor(Math.random() * ips.length)],
      //     user: filters.user || users[Math.floor(Math.random() * users.length)],
      //     endpoint: filters.endpoint || endpoints[Math.floor(Math.random() * endpoints.length)],
      //     message: messages[Math.floor(Math.random() * messages.length)]
      //   };
      // });

      console.log("LOGS RESPONSE:", res.data); // add this

      setLogs(res.data.logs);
      setTotalLogs(res.data.totalLogs);
      setTotalPages(res.data.totalPages);

    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Count applied filters
  useEffect(() => {
    const count = Object.values(filters).filter(v => v !== '').length;
    setAppliedFiltersCount(count);
  }, [filters]);

  // Initial load
  useEffect(() => {
    fetchLogs();
  }, [currentPage, limit]);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1);
    fetchLogs();
    setShowFilters(false);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      severity: '',
      ip: '',
      endpoint: '',
      user: '',
      dateFrom: '',
      dateTo: '',
      search: ''
    });
    setCurrentPage(1);
  };

  // Clear single filter
  const clearSingleFilter = (key) => {
    setFilters(prev => ({
      ...prev,
      [key]: ''
    }));
  };

  // Get severity icon and color
  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'ERROR':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200'
        };
      case 'WARNING':
        return {
          icon: AlertTriangle,
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-200'
        };
      case 'INFO':
        return {
          icon: Info,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200'
        };
      default:
        return {
          icon: Info,
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200'
        };
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Export logs
  const handleExport = () => {
    alert('Exporting logs to CSV...');
  };

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Loading Logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-2">System Logs</h1>
          <p className="text-blue-600">View and filter all system logs</p>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                  className="w-full pl-10 pr-4 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-blue-50/50"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="relative px-4 py-2.5 bg-white text-blue-700 rounded-lg border-2 border-blue-200 hover:bg-blue-50 transition-all duration-200 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {appliedFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {appliedFiltersCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => fetchLogs(true)}
                disabled={refreshing}
                className="px-4 py-2.5 bg-white text-blue-700 rounded-lg border-2 border-blue-200 hover:bg-blue-50 transition-all duration-200 flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={handleExport}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center gap-2 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Applied Filters Tags */}
          {appliedFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-blue-100">
              {filters.severity && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Severity: {filters.severity}
                  <button onClick={() => clearSingleFilter('severity')} className="hover:bg-blue-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.ip && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  IP: {filters.ip}
                  <button onClick={() => clearSingleFilter('ip')} className="hover:bg-blue-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.endpoint && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Endpoint: {filters.endpoint}
                  <button onClick={() => clearSingleFilter('endpoint')} className="hover:bg-blue-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.user && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  User: {filters.user}
                  <button onClick={() => clearSingleFilter('user')} className="hover:bg-blue-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 mb-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4">Advanced Filters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Severity Filter */}
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">Severity</label>
                <select
                  value={filters.severity}
                  onChange={(e) => handleFilterChange('severity', e.target.value)}
                  className="w-full px-3 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-blue-50/50"
                >
                  <option value="">All Levels</option>
                  <option value="INFO">INFO</option>
                  <option value="WARNING">WARNING</option>
                  <option value="ERROR">ERROR</option>
                </select>
              </div>

              {/* IP Filter */}
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">IP Address</label>
                <input
                  type="text"
                  value={filters.ip}
                  onChange={(e) => handleFilterChange('ip', e.target.value)}
                  placeholder="e.g., 192.168.1.1"
                  className="w-full px-3 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-blue-50/50"
                />
              </div>

              {/* Endpoint Filter */}
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">Endpoint</label>
                <input
                  type="text"
                  value={filters.endpoint}
                  onChange={(e) => handleFilterChange('endpoint', e.target.value)}
                  placeholder="e.g., /api/users"
                  className="w-full px-3 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-blue-50/50"
                />
              </div>

              {/* User Filter */}
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">User</label>
                <input
                  type="text"
                  value={filters.user}
                  onChange={(e) => handleFilterChange('user', e.target.value)}
                  placeholder="e.g., user@example.com"
                  className="w-full px-3 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-blue-50/50"
                />
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">Date From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full px-3 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-blue-50/50"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">Date To</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full px-3 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-blue-50/50"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={applyFilters}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-medium shadow-md"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  clearFilters();
                  setShowFilters(false);
                }}
                className="px-6 py-2.5 bg-white text-blue-700 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Logs Table */}
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Timestamp
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Severity
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      IP Address
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      User
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4" />
                      Endpoint
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {logs.map((log) => {
                  const config = getSeverityConfig(log.severity);
                  const SeverityIcon = config.icon;

                  return (
                    <tr
                      key={log._id}
                      onClick={() => navigate(`/LogDetail/${log._id}`)}
                      className="hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                    >                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color} border ${config.border}`}>
                          <SeverityIcon className="w-3.5 h-3.5" />
                          {log.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">{log.ip}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">{log.endpoint}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{log.message}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-blue-100">
            {logs.map((log) => {
              const config = getSeverityConfig(log.severity);
              const SeverityIcon = config.icon;

              return (
                <div
                  key={log._id}
                  onClick={() => navigate(`/LogDetail/${log._id}`)}
                  className="p-4 hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color} border ${config.border}`}>
                      <SeverityIcon className="w-3.5 h-3.5" />
                      {log.severity}
                    </span>
                    <span className="text-xs text-gray-500">{formatTimestamp(log.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-800 mb-3">{log.message}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">IP:</span>
                      <span className="ml-1 text-gray-700 font-mono">{log.ip}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">User:</span>
                      <span className="ml-1 text-gray-700">{log.user}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Endpoint:</span>
                      <span className="ml-1 text-gray-700 font-mono">{log.endpoint}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-blue-700">
                Showing <span className="font-semibold">{(currentPage - 1) * limit + 1}</span> to{' '}
                <span className="font-semibold">{Math.min(currentPage * limit, totalLogs)}</span> of{' '}
                <span className="font-semibold">{totalLogs}</span> logs
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-white text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${currentPage === pageNum
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                          : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsList;