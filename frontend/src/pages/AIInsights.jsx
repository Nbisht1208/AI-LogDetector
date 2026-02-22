import React, { useState, useEffect } from 'react';
import { Brain, Shield, AlertTriangle, Zap, RefreshCw, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import axios from 'axios';

const AIInsights = () => {
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filesLoading, setFilesLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch uploaded files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/api/v1/logs/files',
          { headers }
        );
        setFiles(res.data);
      } catch (err) {
        console.error('Error fetching files:', err);
      } finally {
        setFilesLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const analyzeFile = async () => {
    if (!selectedFileId) return setError('Please select a file to analyze');
    setLoading(true);
    setError('');
    setResults(null);
    setExpandedIndex(null);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/logs/analyze/${selectedFileId}`,
        {},
        { headers }
      );
      setResults(res.data.ai);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const selectedFile = files.find(f => f._id === selectedFileId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-2">🤖 AI Insights</h1>
          <p className="text-blue-600">Select a log file and analyze with AI-powered threat detection</p>
        </div>

        {/* File Selection + Analyze */}
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 mb-8">
          <h2 className="text-lg font-bold text-blue-900 mb-4">Select Log File</h2>

          {filesLoading ? (
            <div className="flex items-center gap-3 text-blue-600">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Loading files...
            </div>
          ) : files.length === 0 ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700">
              ⚠️ No uploaded files found. Please upload a log file first.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Dropdown */}
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={selectedFileId}
                  onChange={(e) => {
                    setSelectedFileId(e.target.value);
                    setResults(null);
                    setError('');
                  }}
                  className="flex-1 px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50/50 text-gray-700"
                >
                  <option value="">-- Select a log file --</option>
                  {files.map(f => (
                    <option key={f._id} value={f._id}>
                      {f.originalName} — {new Date(f.createdAt).toLocaleString()}
                    </option>
                  ))}
                </select>

                <button
                  onClick={analyzeFile}
                  disabled={loading || !selectedFileId}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 sm:w-auto w-full"
                >
                  {loading ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Brain className="w-4 h-4" /> Analyze</>
                  )}
                </button>
              </div>

              {/* Selected file info */}
              {selectedFile && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">{selectedFile.originalName}</p>
                    <p className="text-xs text-blue-600">
                      {selectedFile.totalLines} lines • Status: {selectedFile.status} • Uploaded: {new Date(selectedFile.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="mt-3 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              ❌ {error}
            </p>
          )}
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6">

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium">Total Analyzed</h3>
                </div>
                <p className="text-3xl font-bold text-blue-900">{results.total_logs}</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium">Suspicious</h3>
                </div>
                <p className="text-3xl font-bold text-red-600">{results.suspicious_logs}</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium">Clean</h3>
                </div>
                <p className="text-3xl font-bold text-green-600">{results.clean_logs}</p>
              </div>
            </div>

            {/* Suspicious Logs */}
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
                <h2 className="text-lg font-bold text-white">🚨 Suspicious Logs</h2>
              </div>
              <div className="divide-y divide-blue-100">
                {results.results.filter(r => r.is_suspicious).length === 0 ? (
                  <div className="p-8 text-center">
                    <Shield className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-green-600 font-medium">No suspicious logs found! System is clean.</p>
                  </div>
                ) : (
                  results.results
                    .filter(r => r.is_suspicious)
                    .map((r, i) => (
                      <div key={i} className="p-6">
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            {r.ai_analysis?.severity && (
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(r.ai_analysis.severity)}`}>
                                {r.ai_analysis.severity}
                              </span>
                            )}
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-600 border border-purple-200">
                              {r.ai_analysis?.threat_type || r.detection_details?.attack_type || 'Anomaly'}
                            </span>
                            <span className="text-sm text-gray-700 font-mono">IP: {r.ip}</span>
                          </div>
                          {expandedIndex === i
                            ? <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            : <ChevronDown className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          }
                        </div>

                        <p className="text-gray-700 text-sm mt-2 truncate">{r.message}</p>

                        {expandedIndex === i && (
                          <div className="mt-4 space-y-3">
                            {r.ai_analysis?.explanation && (
                              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="text-xs font-semibold text-blue-700 mb-1">🤖 AI Explanation</p>
                                <p className="text-sm text-gray-700">{r.ai_analysis.explanation}</p>
                              </div>
                            )}
                            {r.ai_analysis?.recommended_action && (
                              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                                <p className="text-xs font-semibold text-amber-700 mb-1">⚡ Recommended Action</p>
                                <p className="text-sm text-gray-700">{r.ai_analysis.recommended_action}</p>
                              </div>
                            )}
                            <div className="grid grid-cols-3 gap-3 text-xs">
                              <div className="p-2 bg-gray-50 rounded border text-center">
                                <p className="text-gray-500 mb-1">ML Score</p>
                                <p className="font-mono font-bold">{r.detection_details?.ml_score?.toFixed(3)}</p>
                              </div>
                              <div className="p-2 bg-gray-50 rounded border text-center">
                                <p className="text-gray-500 mb-1">Rule Match</p>
                                <p className="font-bold text-lg">{r.detection_details?.rule_detected ? '✅' : '❌'}</p>
                              </div>
                              <div className="p-2 bg-gray-50 rounded border text-center">
                                <p className="text-gray-500 mb-1">Brute Force</p>
                                <p className="font-bold text-lg">{r.detection_details?.brute_force_detected ? '✅' : '❌'}</p>
                              </div>
                            </div>
                            {r.detection_details?.attack_type && (
                              <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                                <p className="text-xs font-semibold text-red-700">🎯 Attack Type: {r.detection_details.attack_type}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Clean Logs Summary */}
            {results.clean_logs > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="font-bold text-green-900">✅ {results.clean_logs} Clean Logs</h3>
                    <p className="text-sm text-green-600">These logs show no suspicious activity.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;