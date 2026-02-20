import React, { useState, useEffect } from 'react';
import { AlertCircle, FileText, AlertTriangle, Bell, Upload, RefreshCw, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLogs: 0,
    errors: 0,
    warnings: 0,
    aiAlerts: 0
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      // Simulated API call - replace with actual endpoint
      // const response = await fetch('/api/logs/stats');
      // const data = await response.json();
      
      // Demo data
      const data = {
        totalLogs: 15847,
        errors: 342,
        warnings: 1205,
        aiAlerts: 23
      };
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch recent logs
  const fetchLogs = async () => {
    try {
      // Simulated API call - replace with actual endpoint
      // const response = await fetch('/api/logs?limit=10');
      // const data = await response.json();
      
      // Demo data
      const data = [
        { id: 1, timestamp: '2025-12-08 14:23:45', level: 'ERROR', message: 'Database connection timeout', source: 'api-service' },
        { id: 2, timestamp: '2025-12-08 14:22:30', level: 'WARNING', message: 'High memory usage detected', source: 'web-server' },
        { id: 3, timestamp: '2025-12-08 14:21:15', level: 'INFO', message: 'User authentication successful', source: 'auth-service' },
        { id: 4, timestamp: '2025-12-08 14:20:05', level: 'ERROR', message: 'Failed to process payment', source: 'payment-gateway' },
        { id: 5, timestamp: '2025-12-08 14:19:22', level: 'WARNING', message: 'API rate limit approaching', source: 'api-gateway' },
        { id: 6, timestamp: '2025-12-08 14:18:40', level: 'INFO', message: 'Backup completed successfully', source: 'backup-service' },
        { id: 7, timestamp: '2025-12-08 14:17:55', level: 'ERROR', message: 'File upload failed', source: 'storage-service' },
        { id: 8, timestamp: '2025-12-08 14:16:30', level: 'INFO', message: 'Cache cleared', source: 'cache-manager' },
        { id: 9, timestamp: '2025-12-08 14:15:10', level: 'WARNING', message: 'Slow query detected', source: 'database' },
        { id: 10, timestamp: '2025-12-08 14:14:05', level: 'INFO', message: 'Service health check passed', source: 'monitoring' }
      ];
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchLogs()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchStats(), fetchLogs()]);
    setRefreshing(false);
  };

  // Navigate to upload page
  const handleUpload = () => {
    // Replace with actual navigation
    alert('Redirecting to File Upload page...');
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'ERROR':
        return 'text-red-600 bg-red-50';
      case 'WARNING':
        return 'text-amber-600 bg-amber-50';
      case 'INFO':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-2">Log Analytics Dashboard</h1>
              <p className="text-blue-600">Real-time monitoring and insights</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-blue-200 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <Link
                to="/LogUpload"
                onClick={handleUpload}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg shadow-md hover:shadow-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
              >
                <Upload className="w-4 h-4" />
                Upload Log
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Logs</h3>
            <p className="text-3xl font-bold text-blue-900">{stats.totalLogs.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                {((stats.errors / stats.totalLogs) * 100).toFixed(1)}%
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Errors</h3>
            <p className="text-3xl font-bold text-red-600">{stats.errors.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                {((stats.warnings / stats.totalLogs) * 100).toFixed(1)}%
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Warnings</h3>
            <p className="text-3xl font-bold text-amber-600">{stats.warnings.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-cyan-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-100 rounded-lg">
                <Bell className="w-6 h-6 text-cyan-600" />
              </div>
              {stats.aiAlerts > 0 && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
              )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">AI Alerts</h3>
            <p className="text-3xl font-bold text-cyan-600">{stats.aiAlerts.toLocaleString()}</p>
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Activity className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">AI Insights</h3>
              <p className="text-blue-100 mb-4">
                System analysis shows increased error rate in payment-gateway service over the last hour. 
                Recommend investigating database connection pool settings.
              </p>
              <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200">
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Recent Logs Table */}
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="p-6 border-b border-blue-100">
            <h2 className="text-xl font-bold text-blue-900">Last 10 Logs</h2>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.timestamp}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">{log.message}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{log.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-blue-100">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-blue-50 transition-colors duration-150">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(log.level)}`}>
                    {log.level}
                  </span>
                  <span className="text-xs text-gray-500">{log.timestamp}</span>
                </div>
                <p className="text-sm text-gray-800 mb-2">{log.message}</p>
                <p className="text-xs text-gray-600 font-mono">{log.source}</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-blue-50 text-center">
            <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200">
              View All Logs →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;