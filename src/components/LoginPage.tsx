import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ArrowLeft, Mail, Phone, Eye, EyeOff, UserPlus } from 'lucide-react'
import { useStore } from '../store/useStore'
import { api, setToken } from '../api'
import { User } from '../types'
import ParticleBackground from './ParticleBackground'

type Screen = 'main' | 'email' | 'phone' | 'signup'
type EmailStep = 'enter' | 'password'
type PhoneStep = 'enter' | 'otp'

export default function LoginPage() {
  const login = useStore((s) => s.login)
  const fetchSpaces = useStore((s) => s.fetchSpaces)
  const [screen, setScreen] = useState<Screen>('main')
  const [allUsers, setAllUsers] = useState<User[]>([])

  useEffect(() => {
    api.getUsers().then(setAllUsers).catch(() => {})
  }, [])

  // Email flow
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailStep, setEmailStep] = useState<EmailStep>('enter')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)

  // Phone flow
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('enter')

  // Signup flow
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirm, setSignupConfirm] = useState('')
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [signupError, setSignupError] = useState('')

  const resetAll = () => {
    setScreen('main')
    setEmail('')
    setPassword('')
    setEmailStep('enter')
    setLoginError('')
    setPhone('')
    setOtp(['', '', '', '', '', ''])
    setPhoneStep('enter')
    setSignupName('')
    setSignupEmail('')
    setSignupPassword('')
    setSignupConfirm('')
    setSignupError('')
    setLoading(false)
  }

  const handleEmailNext = () => {
    if (!email.trim() || !email.includes('@')) return
    setLoginError('')
    setEmailStep('password')
  }

  const handleEmailLogin = async () => {
    if (!password.trim()) return
    setLoading(true)
    setLoginError('')
    try {
      await login({ email: email.trim().toLowerCase(), password })
    } catch (err: any) {
      setLoginError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async () => {
    setSignupError('')
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword) {
      setSignupError('All fields are required')
      return
    }
    if (!signupEmail.includes('@')) {
      setSignupError('Enter a valid email address')
      return
    }
    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters')
      return
    }
    if (signupPassword !== signupConfirm) {
      setSignupError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const result = await api.signup({ name: signupName.trim(), email: signupEmail.trim().toLowerCase(), password: signupPassword })
      setToken(result.token)
      useStore.setState({ isLoggedIn: true, currentUser: result.user, initialized: true })
      await fetchSpaces()
    } catch (err: any) {
      setSignupError(err.message || 'Sign up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = () => {
    if (phone.length < 10) return
    setPhoneStep('otp')
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus()
    if (value && index === 5 && newOtp.every((d) => d !== '')) {
      const matched = allUsers.find((u) => u.phone === phone.trim())
      setTimeout(() => login(matched ? { id: matched.id, name: matched.name, phone: matched.phone } : { phone }).catch(() => {}), 300)
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center relative overflow-hidden">
      <ParticleBackground />

      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-lavender/40 to-transparent blur-2xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ top: '10%', left: '10%' }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-peach/30 to-transparent blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{ bottom: '10%', right: '5%' }}
      />

      <div className="relative z-10 w-full max-w-sm px-6">
        <AnimatePresence mode="wait">

          {/* ===== MAIN SCREEN ===== */}
          {screen === 'main' && (
            <motion.div
              key="main"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
                <h1 className="font-serif text-5xl md:text-6xl font-bold text-warmDark mb-3 text-shadow-warm">Life Memory Wall</h1>
                <p className="font-handwriting text-2xl text-warmDark/60 mb-14">Your stories, beautifully preserved</p>
              </motion.div>

              <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <button
                  onClick={() => setScreen('signup')}
                  className="w-full rounded-2xl py-4 px-6 flex items-center justify-center gap-3 bg-gradient-to-r from-gold/80 to-coral/70 text-white hover:opacity-90 transition-all duration-300 group"
                >
                  <UserPlus className="w-5 h-5" />
                  <span className="font-sans">Create an account</span>
                </button>

                <button
                  onClick={() => setScreen('email')}
                  className="w-full glass rounded-2xl py-4 px-6 flex items-center justify-center gap-3 hover:bg-white/60 transition-all duration-500 group"
                >
                  <Mail className="w-5 h-5 text-warmDark/55" />
                  <span className="font-sans text-warmDark group-hover:text-warmDark/80">Sign in with Email</span>
                </button>

                <button
                  onClick={() => setScreen('phone')}
                  className="w-full glass rounded-2xl py-4 px-6 flex items-center justify-center gap-3 hover:bg-white/60 transition-all duration-500 group"
                >
                  <Phone className="w-5 h-5 text-warmDark/55" />
                  <span className="font-sans text-warmDark group-hover:text-warmDark/80">Sign in with Phone</span>
                </button>
              </motion.div>

              {/* Quick login for testing */}
              {allUsers.length > 0 && (
                <motion.div className="mt-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                  <p className="text-warmDark/35 text-xs mb-3 font-sans">Quick login (for testing)</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {allUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => login({ id: u.id, name: u.name, email: u.email }).catch(() => {})}
                        className="glass rounded-full px-4 py-2 text-sm text-warmDark/60 hover:text-warmDark hover:bg-white/60 transition-all flex items-center gap-2"
                      >
                        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-lavender/60 to-peach/60 flex items-center justify-center text-xs font-serif text-warmDark">
                          {u.name[0]}
                        </span>
                        {u.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.p className="mt-6 text-warmDark/35 text-xs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                Your memories are safe and private
              </motion.p>
            </motion.div>
          )}

          {/* ===== SIGNUP SCREEN ===== */}
          {screen === 'signup' && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <button onClick={resetAll} className="flex items-center gap-2 text-warmDark/50 hover:text-warmDark/70 mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </button>

              <h2 className="font-serif text-3xl text-warmDark mb-2">Create account</h2>
              <p className="font-handwriting text-lg text-warmDark/55 mb-8">Start preserving your memories</p>

              <div className="space-y-4">
                <div>
                  <label className="font-handwriting text-warmDark/50 text-base block mb-2">Your name</label>
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Jane Smith"
                    autoFocus
                    className="w-full bg-white/40 rounded-2xl px-5 py-4 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all border border-white/50"
                  />
                </div>

                <div>
                  <label className="font-handwriting text-warmDark/50 text-base block mb-2">Email address</label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white/40 rounded-2xl px-5 py-4 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all border border-white/50"
                  />
                </div>

                <div>
                  <label className="font-handwriting text-warmDark/50 text-base block mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-white/40 rounded-2xl px-5 py-4 pr-12 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all border border-white/50"
                    />
                    <button type="button" onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-warmDark/40 hover:text-warmDark/70 transition-colors">
                      {showSignupPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-handwriting text-warmDark/50 text-base block mb-2">Confirm password</label>
                  <input
                    type="password"
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
                    placeholder="Repeat your password"
                    className="w-full bg-white/40 rounded-2xl px-5 py-4 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all border border-white/50"
                  />
                </div>

                {signupError && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-coral font-sans bg-coral/10 rounded-xl px-4 py-2">
                    {signupError}
                  </motion.p>
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSignup}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold/80 to-coral/70 text-white font-serif text-lg disabled:opacity-60"
                >
                  {loading ? 'Creating account…' : 'Create account'}
                </motion.button>

                <button onClick={() => setScreen('email')} className="w-full text-center text-warmDark/45 text-sm hover:text-warmDark/70 transition-colors">
                  Already have an account? Sign in
                </button>
              </div>
            </motion.div>
          )}

          {/* ===== EMAIL SCREEN ===== */}
          {screen === 'email' && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <button onClick={resetAll} className="flex items-center gap-2 text-warmDark/50 hover:text-warmDark/70 mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </button>

              <h2 className="font-serif text-3xl text-warmDark mb-2">Welcome back</h2>
              <p className="font-handwriting text-lg text-warmDark/55 mb-8">
                {emailStep === 'enter' ? 'Enter your email to continue' : `Signing in as ${email}`}
              </p>

              <AnimatePresence mode="wait">
                {emailStep === 'enter' ? (
                  <motion.div key="email-input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <div>
                      <label className="font-handwriting text-warmDark/50 text-base block mb-2">Email address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleEmailNext()}
                        placeholder="you@example.com"
                        autoFocus
                        className="w-full bg-white/40 rounded-2xl px-5 py-4 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all border border-white/50"
                      />
                    </div>
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handleEmailNext}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold/80 to-coral/70 text-white font-serif text-lg">
                      Continue
                    </motion.button>
                    <button onClick={() => setScreen('signup')} className="w-full text-center text-warmDark/45 text-sm hover:text-warmDark/70 transition-colors">
                      No account? Create one
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="password-input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <div>
                      <label className="font-handwriting text-warmDark/50 text-base block mb-2">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setLoginError('') }}
                          onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
                          placeholder="Enter your password"
                          autoFocus
                          className={`w-full bg-white/40 rounded-2xl px-5 py-4 pr-12 text-warmDark font-sans outline-none transition-all border ${loginError ? 'border-coral/50 focus:ring-2 focus:ring-coral/30' : 'border-white/50 focus:ring-2 focus:ring-gold/30'}`}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-warmDark/40 hover:text-warmDark/70 transition-colors">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {loginError && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-coral font-sans bg-coral/10 rounded-xl px-4 py-2">
                        {loginError}
                      </motion.p>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleEmailLogin}
                      disabled={loading}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold/80 to-coral/70 text-white font-serif text-lg disabled:opacity-60"
                    >
                      {loading ? 'Signing in…' : 'Sign in'}
                    </motion.button>
                    <button onClick={() => { setEmailStep('enter'); setLoginError('') }}
                      className="w-full text-center text-warmDark/40 text-sm hover:text-warmDark/70 transition-colors">
                      Use a different email
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ===== PHONE SCREEN ===== */}
          {screen === 'phone' && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <button onClick={resetAll} className="flex items-center gap-2 text-warmDark/50 hover:text-warmDark/70 mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </button>

              <h2 className="font-serif text-3xl text-warmDark mb-2">
                {phoneStep === 'enter' ? 'Your phone number' : 'Enter the code'}
              </h2>
              <p className="font-handwriting text-lg text-warmDark/55 mb-8">
                {phoneStep === 'enter' ? "We'll send you a verification code" : `Sent to +91 ${phone}`}
              </p>

              <AnimatePresence mode="wait">
                {phoneStep === 'enter' ? (
                  <motion.div key="phone-input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <div>
                      <label className="font-handwriting text-warmDark/50 text-base block mb-2">Phone number</label>
                      <div className="flex gap-2">
                        <div className="bg-white/40 rounded-2xl px-4 py-4 text-warmDark font-sans border border-white/50 flex items-center text-sm">+91</div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                          placeholder="98765 43210"
                          autoFocus
                          className="flex-1 bg-white/40 rounded-2xl px-5 py-4 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all border border-white/50 tracking-wider"
                        />
                      </div>
                    </div>
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handleSendOtp}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold/80 to-coral/70 text-white font-serif text-lg">
                      Send OTP
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div key="otp-input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <div className="flex gap-3 justify-center">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          id={`otp-${i}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          autoFocus={i === 0}
                          className={`w-12 h-14 rounded-xl text-center text-xl font-serif outline-none transition-all border ${digit ? 'bg-white/60 border-gold/40 text-warmDark' : 'bg-white/30 border-white/50 text-warmDark/55'} focus:ring-2 focus:ring-gold/30 focus:border-gold/40`}
                        />
                      ))}
                    </div>
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        if (otp.every((d) => d !== '')) {
                          const matched = allUsers.find((u) => u.phone === phone.trim())
                          login(matched ? { id: matched.id, name: matched.name, phone: matched.phone } : { phone }).catch(() => {})
                        }
                      }}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold/80 to-coral/70 text-white font-serif text-lg">
                      Verify & Sign in
                    </motion.button>
                    <div className="text-center space-y-2">
                      <button onClick={() => { setOtp(['', '', '', '', '', '']) }}
                        className="text-gold/70 text-sm hover:text-gold transition-colors font-sans">Resend code</button>
                      <button onClick={() => { setPhoneStep('enter'); setOtp(['', '', '', '', '', '']) }}
                        className="block mx-auto text-warmDark/40 text-sm hover:text-warmDark/70 transition-colors">Change number</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
