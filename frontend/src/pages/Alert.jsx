import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Trash2, RefreshCw, AlertCircle, Shield, Clock } from 'lucide-react';
import axios from 'axios';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, unresolved: 0 });
  const [filter, setFilter] = useState('all'); // all, unresolved, resolved
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const [alertRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/v1/alerts', { headers }),
        axios.get('http://localhost:5000/api/v1/alerts/stats', { headers })
      ]);
      setAlerts(alertRes.data.alerts);
      setStats({
        total: statsRes.data.total,
        unresolved: statsRes.data.unresolved
      });
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/v1/alerts/${id}/resolve`,
        {},
        { headers }
      );
      fetchAlerts();
    } catch (err) {
      console.error('Error resolving alert:', err);
    }
  };

  const deleteAlert = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/v1/alerts/${id}`,
        { headers }
      );
      fetchAlerts();
    } catch (err) {
      console.error('Error deleting alert:', err);
    }
  };

  useEffect(() => { fetchAlerts(); }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'unresolved') return !a.isResolved;
    if (filter === 'resolved') return a.isResolved;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Loading Alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-2">🔔 Alerts</h1>
            <p className="text-blue-600">AI-detected security threats and anomalies</p>
          </div>
          <button
            onClick={fetchAlerts}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-700 rounded-lg shadow-md border border-blue-200 hover:shadow-lg transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Total Alerts</h3>
            </div>
            <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Unresolved</h3>
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.unresolved}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Resolved</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.total - stats.unresolved}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'unresolved', 'resolved'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                  : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-blue-100">
              <Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-blue-900 mb-2">No Alerts Found</h3>
              <p className="text-blue-600">System is clean!</p>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <div
                key={alert._id}
                className={`bg-white rounded-xl shadow-lg border p-6 transition-all ${
                  alert.isResolved ? 'opacity-60 border-gray-200' : 'border-blue-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-600 border border-purple-200">
                        {alert.threatType || 'Unknown'}
                      </span>
                      {alert.isResolved && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 border border-green-200">
                          ✓ Resolved
                        </span>
                      )}
                    </div>

                    <p className="text-gray-800 font-medium mb-2">{alert.message}</p>

                    {alert.explanation && (
                      <p className="text-gray-600 text-sm mb-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        🤖 {alert.explanation}
                      </p>
                    )}

                    {alert.recommendedAction && (
                      <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
                        ⚡ <strong>Action:</strong> {alert.recommendedAction}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.createdAt).toLocaleString()}
                      </span>
                      {alert.ip && (
                        <span className="font-mono">IP: {alert.ip}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!alert.isResolved && (
                      <button
                        onClick={() => resolveAlert(alert._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Resolve
                      </button>
                    )}
                    <button
                      onClick={() => deleteAlert(alert._id)}
                      className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-all text-sm flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;