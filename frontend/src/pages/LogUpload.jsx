import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, File, CheckCircle, XCircle, AlertCircle, Loader, ArrowLeft, FileText, X } from 'lucide-react';

const LogUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, uploaded, parsing, success, error
  const [fileId, setFileId] = useState(null);
  const [parseProgress, setParseProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const fileInputRef = useRef(null);
  
  const allowedTypes = ['.log', '.txt', '.csv'];
  const maxFileSize = 50 * 1024 * 1024; // 50MB
  
  // Check file validity
  const token = sessionStorage.getItem('token');
  const isValidFile = (file) => {
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(extension)) {
      setErrorMessage(`Invalid file type. Only ${allowedTypes.join(', ')} files are allowed.`);
      return false;
    }
    if (file.size > maxFileSize) {
      setErrorMessage('File size exceeds 50MB limit.');
      return false;
    }
    return true;
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && isValidFile(file)) {
      setSelectedFile(file);
      setErrorMessage('');
      setUploadStatus('idle');
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && isValidFile(file)) {
      setSelectedFile(file);
      setErrorMessage('');
      setUploadStatus('idle');
    }
  };

  // Simulate file upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus('uploading');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Real API call
      const response = await axios.post('http://localhost:5000/api/v1/logs/upload', formData, {
      
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // your JWT later
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress);
        }
      });

      setFileId(response.data.fileId);
      setUploadStatus('uploaded');
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage(error.response?.data?.msg || 'Upload failed. Please try again.');
      console.error('Upload error:', error);
    }
  };

  // Parse uploaded file
  const handleParse = async () => {
    if (!fileId) return;

    setUploadStatus('parsing');
    setParseProgress(0);
    setErrorMessage('');

    try {
      
      // Start parsing
      await axios.post(`http://localhost:5000/api/v1/logs/parse/${fileId}`, {}, {
        headers: {
          'Authorization':  `Bearer ${token}`
        }
      });

      // Poll status
      const pollStatus = async () => {
        try {
          
          const response = await axios.get(`http://localhost:5000/api/v1/logs/file-status/${fileId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const status = response.data;
          setParseProgress(Math.round((status.parsedLines / status.totalLines || 0) * 100));

          if (status.status === 'completed') {
            setParsedData({
              totalLines: status.totalLines,
              errors: 342, // TODO: get from backend aggregation
              warnings: 1205,
              info: status.totalLines - 1547
            });
            setUploadStatus('success');
          } else if (status.status === 'parsing') {
            setTimeout(pollStatus, 1500);
          }
        } catch (error) {
          console.error('Status poll:', error);
        }
      };

      pollStatus();
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage(error.response?.data?.msg || 'Parsing failed. Please try again.');
    }
  };

  // Reset form
  const handleReset = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setParseProgress(0);
    setUploadStatus('idle');
    setFileId(null);
    setErrorMessage('');
    setParsedData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Navigate back to dashboard
  const handleBackToDashboard = () => {
    alert('Navigating to Dashboard...');
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-2">Upload Log Files</h1>
          <p className="text-blue-600">Upload and parse your log files (.log, .txt, .csv)</p>
        </div>

        {/* Main Upload Card */}
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden mb-6">
          <div className="p-6 sm:p-8">

            {/* Drag & Drop Area */}
            {uploadStatus === 'idle' && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-3 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all duration-300 ${isDragging
                    ? 'border-blue-500 bg-blue-50 scale-105'
                    : 'border-blue-300 bg-blue-50/50 hover:border-blue-400 hover:bg-blue-50'
                  }`}
              >
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-blue-100 rounded-full mb-4">
                    <Upload className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">
                    {isDragging ? 'Drop your file here' : 'Drag & Drop your log file'}
                  </h3>
                  <p className="text-blue-600 mb-4">or</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Browse Files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".log,.txt,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500 mt-4">
                    Supported formats: .log, .txt, .csv (Max 50MB)
                  </p>
                </div>
              </div>
            )}

            {/* Selected File Display */}
            {selectedFile && uploadStatus === 'idle' && (
              <div className="mt-6">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-blue-100 rounded">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-blue-900 truncate">{selectedFile.name}</p>
                      <p className="text-sm text-blue-600">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="ml-2 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleUpload}
                  className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Upload File
                </button>
              </div>
            )}

            {/* Upload Progress */}
            {uploadStatus === 'uploading' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Loader className="w-6 h-6 text-blue-600 animate-spin" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-900">Uploading file...</p>
                    <p className="text-sm text-blue-600">{selectedFile?.name}</p>
                  </div>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 h-3 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-center text-sm font-medium text-blue-600">{uploadProgress}%</p>
              </div>
            )}

            {/* Upload Success - Ready to Parse */}
            {uploadStatus === 'uploaded' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-green-900">Upload Complete!</p>
                    <p className="text-sm text-green-700">{selectedFile?.name}</p>
                  </div>
                </div>

                <button
                  onClick={handleParse}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <File className="w-5 h-5" />
                  Parse File
                </button>
              </div>
            )}

            {/* Parsing Progress */}
            {uploadStatus === 'parsing' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Loader className="w-6 h-6 text-cyan-600 animate-spin" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-900">Parsing file...</p>
                    <p className="text-sm text-blue-600">Analyzing log entries</p>
                  </div>
                </div>
                <div className="w-full bg-cyan-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${parseProgress}%` }}
                  ></div>
                </div>
                <p className="text-center text-sm font-medium text-cyan-600">Parsing {parseProgress}%</p>
              </div>
            )}

            {/* Success with Parsed Data */}
            {uploadStatus === 'success' && parsedData && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-green-900">Success! File Parsed Successfully</p>
                    <p className="text-sm text-green-700">{selectedFile?.name}</p>
                  </div>
                </div>

                {/* Parsed Data Summary */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-4">Parsed Data Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <p className="text-blue-100 text-sm mb-1">Total Lines</p>
                      <p className="text-2xl font-bold">{parsedData.totalLines.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <p className="text-blue-100 text-sm mb-1">Errors</p>
                      <p className="text-2xl font-bold text-red-200">{parsedData.errors.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <p className="text-blue-100 text-sm mb-1">Warnings</p>
                      <p className="text-2xl font-bold text-amber-200">{parsedData.warnings.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <p className="text-blue-100 text-sm mb-1">Info Logs</p>
                      <p className="text-2xl font-bold">{parsedData.info.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleBackToDashboard}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    View Dashboard
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-200 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200"
                  >
                    Upload Another
                  </button>
                </div>
              </div>
            )}

            {/* Error Display */}
            {uploadStatus === 'error' && errorMessage && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-red-900">Error</p>
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Error Message (validation) */}
            {errorMessage && uploadStatus === 'idle' && !selectedFile && (
              <div className="mt-4 flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-blue-900">Supported Formats</h3>
            </div>
            <p className="text-sm text-gray-600">.log, .txt, .csv files up to 50MB</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-cyan-100 rounded">
                <CheckCircle className="w-5 h-5 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-blue-900">Auto-Parse</h3>
            </div>
            <p className="text-sm text-gray-600">Automatic error & warning detection</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded">
                <Upload className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-blue-900">Fast Upload</h3>
            </div>
            <p className="text-sm text-gray-600">Quick processing & analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogUpload;