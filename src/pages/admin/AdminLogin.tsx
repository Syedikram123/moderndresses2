import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Sparkles, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@moderndresses.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid credentials. Please use the demo credentials below.');
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@moderndresses.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-boutique-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-charcoal-muted hover:text-charcoal mb-4">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Store</span>
        </Link>
        <img
          src="/logo321.png"
          alt="Modern Dresses Logo"
          className="h-12 w-auto mx-auto mb-3 object-contain"
        />
        <h2 className="font-editorial text-3xl font-bold tracking-wider text-charcoal">
          MODERN DRESSES
        </h2>
        <p className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold mt-1">
          Store Management Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Local Demo Disclaimer Notice (Requirement #31, #69) */}
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Local Demo Authentication</span>
          </div>
          <p className="text-amber-800 leading-relaxed">
            Data is stored locally in this browser via localStorage. Pre-filled demo credentials are provided below.
          </p>
        </div>

        <div className="bg-white py-8 px-6 sm:px-10 shadow-card rounded-3xl border border-boutique-200">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-subtle">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 text-xs bg-boutique-50 border border-boutique-200 rounded-xl text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-subtle">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 text-xs bg-boutique-50 border border-boutique-200 rounded-xl text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-charcoal hover:bg-gold-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>Sign In to Admin</span>
                <Sparkles className="w-4 h-4 text-gold-400" />
              </button>
            </div>
          </form>

          {/* Quick autofill helper */}
          <div className="mt-6 pt-5 border-t border-boutique-100 text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs text-gold-700 hover:text-gold-900 font-semibold"
            >
              Fill Demo Credentials (admin@moderndresses.com / admin123)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
