/**
 * Register Page
 * =============
 * User registration with role selection.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { staggerContainer, staggerItem } from '../../design-system';

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: formData.role,
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-primary)',
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div variants={staggerItem} className="mb-6">
        <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Create account
        </h2>
        <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
          Join the workforce intelligence platform
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-xl flex items-center gap-3"
          style={{ background: 'var(--color-danger-bg)' }}
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name fields */}
        <motion.div variants={staggerItem} className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
              First Name
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={inputStyle}>
              <User className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
              <input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="John"
                required
                className="w-full bg-transparent border-none outline-none text-sm"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
              Last Name
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={inputStyle}>
              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Doe"
                required
                className="w-full bg-transparent border-none outline-none text-sm"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="mb-4">
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
            Email
          </label>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={inputStyle}>
            <Mail className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
              required
              className="w-full bg-transparent border-none outline-none text-sm"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="mb-4">
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
            Role
          </label>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={inputStyle}>
            <Shield className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-transparent border-none outline-none text-sm cursor-pointer"
              style={{ color: 'var(--text-primary)' }}
            >
              <option value="employee">Employee</option>
              <option value="hr_manager">HR Manager</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="mb-4">
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
            Password
          </label>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={inputStyle}>
            <Lock className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 8 characters"
              required
              minLength={8}
              className="w-full bg-transparent border-none outline-none text-sm"
              style={{ color: 'var(--text-primary)' }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ color: 'var(--text-tertiary)' }}>
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="mb-6">
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
            Confirm Password
          </label>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={inputStyle}>
            <Lock className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              required
              className="w-full bg-transparent border-none outline-none text-sm"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>
        </motion.div>

        <motion.div variants={staggerItem}>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm gradient-primary disabled:opacity-60"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </motion.div>
      </form>

      <motion.p variants={staggerItem} className="mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
        Already have an account?{' '}
        <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>
          Sign in
        </Link>
      </motion.p>
    </motion.div>
  );
}
