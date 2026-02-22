import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Upload, Bell, LogOut, Menu, X, Shield } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/Logs', label: 'Logs', icon: FileText },
    { path: '/LogUpload', label: 'Upload', icon: Upload },
    { path: '/alerts', label: 'Alerts', icon: Bell },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-cyan-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <Shield className="w-6 h-6" />
            <span className="hidden sm:inline">AI Log Analyzer</span>
            <span className="sm:hidden">ALA</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(path)
                    ? 'bg-white text-blue-700 shadow-md'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {token ? (
              <>
                {user?.email && (
                  <span className="text-blue-100 text-sm">{user.email}</span>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-all"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-800 border-t border-blue-600 px-4 py-3 space-y-1">
          {navLinks.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(path)
                  ? 'bg-white text-blue-700'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}

          <div className="pt-2 border-t border-blue-600">
            {token ? (
              <>
                {user?.email && (
                  <p className="text-blue-200 text-xs px-4 py-1">{user.email}</p>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 rounded-lg text-sm font-medium w-full transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 rounded-lg text-sm font-medium w-full"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 rounded-lg text-sm font-medium w-full"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;