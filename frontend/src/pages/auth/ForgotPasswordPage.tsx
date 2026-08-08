/**
 * Forgot Password Page
 * ====================
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { staggerContainer, staggerItem } from '../../design-system';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setIsLoading(false);
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'var(--color-success-bg)' }}>
          <CheckCircle className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Check your email</h2>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
          We've sent a password reset link to <strong>{email}</strong>
        </p>
        <Link to="/login" className="text-sm font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>
          ← Back to sign in
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div variants={staggerItem} className="mb-8">
        <Link to="/login" className="inline-flex items-center gap-1 text-sm font-medium mb-4 hover:underline" style={{ color: 'var(--color-primary)' }}>
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>
        <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Forgot password?</h2>
        <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
          Enter your email and we'll send you a reset link
        </p>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <motion.div variants={staggerItem} className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Email Address</label>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
            <Mail className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required
              className="w-full bg-transparent border-none outline-none text-sm" style={{ color: 'var(--text-primary)' }} />
          </div>
        </motion.div>

        <motion.div variants={staggerItem}>
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={isLoading}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-sm gradient-primary disabled:opacity-60">
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
}
