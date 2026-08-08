/**
 * Login Page
 * ==========
 * Enterprise login form with email/password, animated transitions, and demo credentials.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { staggerContainer, staggerItem } from '../../design-system';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Title */}
      <motion.div variants={staggerItem} className="mb-8">
        <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Welcome back
        </h2>
        <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
          Sign in to your workforce intelligence account
        </p>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl flex items-center gap-3"
          style={{
            background: 'var(--color-danger-bg)',
            border: '1px solid var(--color-danger-light)',
          }}
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <motion.div variants={staggerItem} className="mb-5">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Email Address
          </label>
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <Mail className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full bg-transparent border-none outline-none text-sm"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              Forgot password?
            </Link>
          </div>
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <Lock className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={6}
              className="w-full bg-transparent border-none outline-none text-sm"
              style={{ color: 'var(--text-primary)' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={staggerItem}>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm gradient-primary transition-opacity disabled:opacity-60"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </motion.div>
      </form>

      {/* Register Link */}
      <motion.p
        variants={staggerItem}
        className="mt-6 text-center text-sm"
        style={{ color: 'var(--text-secondary)' }}
      >
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-semibold hover:underline"
          style={{ color: 'var(--color-primary)' }}
        >
          Create one
        </Link>
      </motion.p>

      {/* Demo Credentials */}
      <motion.div variants={staggerItem} className="mt-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: 'var(--border-primary)' }} />
          <span className="text-xs font-medium px-2" style={{ color: 'var(--text-tertiary)' }}>
            Quick Demo Login
          </span>
          <div className="flex-1 h-px" style={{ background: 'var(--border-primary)' }} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Admin', email: 'admin@workforce.ai', password: 'Admin@123', color: '#2563EB' },
            { label: 'HR Manager', email: 'hr@workforce.ai', password: 'HRManager@123', color: '#4F46E5' },
            { label: 'Employee', email: 'demo@workforce.ai', password: 'Demo@123', color: '#10B981' },
          ].map((demo) => (
            <motion.button
              key={demo.label}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => fillDemo(demo.email, demo.password)}
              className="py-2.5 px-3 rounded-xl text-xs font-semibold transition-colors duration-200 border"
              style={{
                borderColor: demo.color + '40',
                color: demo.color,
                background: demo.color + '10',
              }}
            >
              {demo.label}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
