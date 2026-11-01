import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, quickDemoLogin, loading } = useAuth()
  const [email, setEmail] = useState('demo@company.com')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [infoMessage, setInfoMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfoMessage('')

    try {
      await login(email, password)
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please verify your credentials.')
    }
  }

  const handleDemoSignIn = async () => {
    setError('')
    setInfoMessage('')
    try {
      await quickDemoLogin()
    } catch (err) {
      setError(err.message || 'Demo sign in failed.')
    }
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    setInfoMessage('Demo mode: you can log in with any email and password (min 4 chars) or click "Quick Demo Sign-in".')
  }

  return (
    <div className="min-h-screen bg-[#f4f3f8] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Decorative background radial gradients */}
      <div
        className="absolute top-0 -left-20 w-96 h-96 rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, #e4d7fe 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 -right-20 w-96 h-96 rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, #f1ebfe 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white border border-[#eeebf5] shadow-sm mb-4">
            <span className="text-3xl font-extrabold text-[#743cee] tracking-tighter">m.</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#181925] tracking-tight">
            meeting minutes generator
          </h1>
          <p className="text-sm text-[#64687a] mt-2">
            AI-powered structured minutes, decisions, and action items.
          </p>
        </div>

        {/* Login Card */}
        <div className="card-white p-7 sm:p-9 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#181925]">Sign in to your workspace</h2>
            <span className="text-xs font-medium text-[#743cee] bg-[#f1ebfe] px-2.5 py-1 rounded-full">
              v1.0 Ready
            </span>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
              <svg className="h-4 w-4 text-red-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-[#5122b1] flex items-start gap-2.5">
              <svg className="h-4 w-4 text-[#743cee] shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>{infoMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#424656] uppercase tracking-wider mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf9fd] border border-[#e2dfec] text-sm text-[#181925] placeholder-[#969ba8] focus:outline-none focus:border-[#743cee] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#424656] uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-medium text-[#743cee] hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-[#faf9fd] border border-[#e2dfec] text-sm text-[#181925] placeholder-[#969ba8] focus:outline-none focus:border-[#743cee] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[#d1cbe4] text-[#743cee] focus:ring-[#743cee]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-[#64687a] select-none cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary-purple py-2.5 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#eeebf5]" />
            </div>
            <span className="relative bg-white px-3 text-xs text-[#969ba8] uppercase tracking-wider">
              Or quick access
            </span>
          </div>

          {/* Quick Demo Sign In Button */}
          <button
            type="button"
            onClick={handleDemoSignIn}
            disabled={loading}
            className="w-full btn-pill-light py-2.5 text-xs font-semibold text-[#5122b1] bg-[#f8f5fe] border-[#ded4f8] hover:bg-[#f1ebfe] flex items-center justify-center gap-2"
          >
            <span className="h-2 w-2 rounded-full bg-[#743cee]" />
            <span>Instant Demo Sign In (1-Click)</span>
          </button>
        </div>

        {/* Feature Highlights Footer */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-[#7e8494]">
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-[#743cee]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Gemini 3.5 Flash
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Zero Hallucinations
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Export Ready
          </span>
        </div>
      </div>
    </div>
  )
}

