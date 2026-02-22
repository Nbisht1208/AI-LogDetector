import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  Loader,
  Shield,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "analyst",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);


  const roles = [
    { value: "analyst", label: "Analyst", description: "Can analyze and generate reports" },
    { value: "admin", label: "Admin", description: "Full system access" }
  ];


  // password strength calc
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  // handle inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (error) setError("");
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500";
    if (passwordStrength < 70) return "bg-amber-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 70) return "Medium";
    return "Strong";
  };

  // validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (formData.name.length < 2) {
      setError("Name must be at least 2 characters");
      return false;
    }
    if (!formData.email) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!formData.role) {
      setError("Please select a role");
      return false;
    }
    return true;
  };

  // Handle registration
  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "analyst",
        });
        setSuccess(false);
        setPasswordStrength(0);
      }, 3000);
    } catch (err) {
      if (err.response) {
        // Server responded with non-2xx
        console.log("Status:", err.response.status);
        console.log("Data:", err.response.data);
        setError(err.response.data?.message || "Registration failed.");
      } else if (err.request) {
        // No response received
        console.log("No response:", err.request);
        setError("Cannot reach server. Check backend / CORS.");
      } else {
        // Error setting up request
        console.log("Error message:", err.message);
        setError("Request setup failed.");
      }
      // setError("Registration failed. Email may already exist.");
      // console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleRegister();
    }
  };

  // Navigate back to login
  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <button
          onClick={handleBackToLogin}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>

        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-lg mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Create New Account
          </h1>
          <p className="text-blue-600">
            Admin registration - Create user accounts
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          <div className="p-8">
            {/* Success Message */}
            {success ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-900 mb-2">
                  Registration Successful!
                </h2>
                <p className="text-green-700 mb-6">
                  User account has been created successfully.
                </p>
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">Redirecting to login...</span>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Error Alert */}
                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-blue-900 mb-2"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-blue-50/50"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-blue-900 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-blue-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      placeholder="john@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-blue-50/50"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-blue-900 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-blue-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter password (min 8 characters)"
                      className="w-full pl-10 pr-12 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-blue-50/50"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400 hover:text-blue-600 transition-colors duration-200"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">
                          Password Strength
                        </span>
                        <span
                          className={`text-xs font-semibold ${passwordStrength < 40
                            ? "text-red-600"
                            : passwordStrength < 70
                              ? "text-amber-600"
                              : "text-green-600"
                            }`}
                        >
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-blue-900 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-blue-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-12 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-blue-50/50"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400 hover:text-blue-600 transition-colors duration-200"
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-3">
                    User Role
                  </label>
                  <div className="space-y-3">
                    {roles.map((role) => (
                      <label
                        key={role.value}
                        className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${formData.role === role.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-blue-200 bg-white hover:border-blue-300"
                          }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={formData.role === role.value}
                          onChange={handleChange}
                          className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                          disabled={loading}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-blue-900">
                            {role.label}
                          </div>
                          <div className="text-sm text-blue-600">
                            {role.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Register Button */}
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg shadow-md hover:shadow-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Create Account
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          {!success && (
            <div className="px-8 py-6 bg-blue-50 border-t border-blue-100">
              <p className="text-center text-sm text-blue-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-700 hover:text-blue-900 transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Admin Note */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <Shield className="w-4 h-4 text-amber-600" />
            <p className="text-xs text-amber-700 font-medium">
              Admin Access Required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
