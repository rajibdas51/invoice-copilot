import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  FileText,
  ArrowRight,
} from "lucide-react";
import { API_PATHS } from "../../utils/apiPaths.js";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosinstance.js";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../../utils/helper.js";

const INITIAL_FORM = { email: "", password: "" };
const INITIAL_ERRORS = { email: "", password: "" };

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  // Validate a single field and return the error string
  const validateField = (name, value) => {
    if (name === "email") return validateEmail(value);
    if (name === "password") return validatePassword(value);
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setServerError("");
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const isFormValid = () => {
    return !validateEmail(form.email) && !validatePassword(form.password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields touched and validate
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    setTouched({ email: true, password: true });
    setErrors({ email: emailError, password: passwordError });
    if (emailError || passwordError) return;

    setIsLoading(true);
    setServerError("");
    setSuccess("");

    try {
      const { data, status } = await axiosInstance.post(
        API_PATHS.AUTH.LOGIN,
        form,
      );
      if (status === 200) {
        const { token, ...userData } = data;
        setSuccess("Login successful! Redirecting...");
        login(userData, token);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Invalid credentials. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-md">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to Invoice Copilot
          </p>
        </div>

        {/* Google Login */}
        <a
          href={API_PATHS.AUTH.GOOGLE_LOGIN}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 mb-6"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-4 h-4"
          />
          Continue with Google
        </a>

        {/* Divider */}
        <div className="relative flex items-center mb-6">
          <div className="flex-grow border-t border-gray-200" />
          <span className="mx-3 text-xs text-gray-400 uppercase tracking-wide">
            or
          </span>
          <div className="flex-grow border-t border-gray-200" />
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg outline-none transition-all
                  focus:ring-2 focus:border-transparent
                  ${
                    errors.email && touched.email
                      ? "border-red-300 focus:ring-red-400"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
              />
            </div>
            {errors.email && touched.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-xs text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-lg outline-none transition-all
                  focus:ring-2 focus:border-transparent
                  ${
                    errors.password && touched.password
                      ? "border-red-300 focus:ring-red-400"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && touched.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Server Messages */}
          {serverError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-xs text-red-600">{serverError}</p>
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
              <p className="text-xs text-green-600">{success}</p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid()}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
              </>
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
