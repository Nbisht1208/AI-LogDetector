import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, AlertCircle, AlertTriangle, Info, Globe, User, Server, FileText, Code, Copy, CheckCircle, Download, Share2 } from 'lucide-react';

const LogDetail = () => {
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchLogDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/logs/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setLog(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogDetail();
  }, [id]);

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'ERROR':
        return { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', gradient: 'from-red-600 to-rose-600' };
      case 'WARNING':
        return { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', gradient: 'from-amber-600 to-orange-600' };
      case 'INFO':
        return { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', gradient: 'from-blue-600 to-cyan-600' };
      default:
        return { icon: Info, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', gradient: 'from-gray-600 to-gray-700' };
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return { full: 'N/A', relative: 'N/A' };
    const date = new Date(timestamp);
    return {
      full: date.toLocaleString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'
      }),
      relative: getRelativeTime(date)
    };
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  };

  const copyToClipboard = (text, field) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setCopiedField(field);
    setTimeout(() => { setCopied(false); setCopiedField(''); }, 2000);
  };

  const handleBack = () => navigate('/Logs');

  const handleDownload = () => {
    const content = JSON.stringify(log, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `log-${log._id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Loading Log Details...</p>
        </div>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Log Not Found</h2>
          <p className="text-blue-600 mb-6">The requested log entry could not be found.</p>
          <button onClick={handleBack} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-md">
            Back to Logs
          </button>
        </div>
      </div>
    );
  }

  const config = getSeverityConfig(log.severity);
  const SeverityIcon = config.icon;
  const timestamps = formatTimestamp(log.timestamp || log.createdAt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <button onClick={handleBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-200">
            <ArrowLeft className="w-4 h-4" />
            Back to Logs List
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-2">Log Details</h1>
              <p className="text-blue-600 font-mono text-sm">ID: {log._id}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleShare} className="px-4 py-2.5 bg-white text-blue-700 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button onClick={handleDownload} className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center gap-2 shadow-md">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Severity Banner */}
        <div className={`bg-gradient-to-r ${config.gradient} rounded-xl shadow-lg p-6 mb-6 text-white`}>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-lg backdrop-blur-sm">
              <SeverityIcon className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{log.severity || 'INFO'}</h2>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                  {timestamps.relative}
                </span>
              </div>
              <p className="text-white/90">{log.message}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Primary Details */}
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Primary Information
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                      <Clock className="w-4 h-4" />Timestamp
                    </div>
                    <p className="text-gray-900 font-mono text-sm">{timestamps.full}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                      <Globe className="w-4 h-4" />IP Address
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-900 font-mono text-sm">{log.ip || 'N/A'}</p>
                      {log.ip && (
                        <button onClick={() => copyToClipboard(log.ip, 'ip')} className="p-1 hover:bg-blue-50 rounded">
                          {copied && copiedField === 'ip' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-blue-600" />}
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                      <User className="w-4 h-4" />User
                    </div>
                    <p className="text-gray-900 text-sm">{log.user || 'N/A'}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                      <Server className="w-4 h-4" />Endpoint
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-900 font-mono text-sm">{log.endpoint || 'N/A'}</p>
                      {log.endpoint && (
                        <button onClick={() => copyToClipboard(log.endpoint, 'endpoint')} className="p-1 hover:bg-blue-50 rounded">
                          {copied && copiedField === 'endpoint' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-blue-600" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* File ID */}
                <div className="mt-4 pt-4 border-t border-blue-100">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                    <FileText className="w-4 h-4" />File ID
                  </div>
                  <p className="text-gray-900 font-mono text-sm">{log.fileId || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Raw Log */}
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code className="w-5 h-5" />Raw Log Line
                </h3>
                <button onClick={() => copyToClipboard(log.rawLine || log.message, 'raw')} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg">
                  {copied && copiedField === 'raw' ? <CheckCircle className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                </button>
              </div>
              <div className="p-6">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs sm:text-sm font-mono whitespace-pre-wrap break-words">
                  {log.rawLine || log.message || 'No raw log available'}
                </pre>
              </div>
            </div>
          </div>

          {/* Right Column — Log Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
              <div className="bg-blue-600 px-6 py-4">
                <h3 className="text-lg font-bold text-white">Log Info</h3>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { label: 'Severity', value: log.severity },
                  { label: 'IP', value: log.ip },
                  { label: 'User', value: log.user },
                  { label: 'Endpoint', value: log.endpoint },
                  { label: 'File ID', value: log.fileId },
                  { label: 'Created At', value: log.createdAt ? new Date(log.createdAt).toLocaleString() : null },
                ].map(({ label, value }) => (
                  value ? (
                    <div key={label} className="pb-3 border-b border-blue-100 last:border-0 last:pb-0">
                      <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">{label}</p>
                      <p className="text-sm text-gray-900 font-mono break-all">{value}</p>
                    </div>
                  ) : null
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LogDetail;