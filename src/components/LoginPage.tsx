import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ArrowLeft, Mail, Eye, EyeOff, UserPlus, Camera, Heart, Lock, Users, Image, MessageCircle, KeyRound } from 'lucide-react'
import { useStore } from '../store/useStore'
import { api, setToken } from '../api'
import ParticleBackground from './ParticleBackground'
import { validatePassword } from '../utils/validation'

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

type Screen = 'main' | 'email' | 'signup' | 'verify' | 'forgot'
type EmailStep = 'enter' | 'password' | 'code'
type ForgotStep = 'email' | 'code' | 'newpass'
type SignupStep = 'email' | 'verify' | 'profile'

/* ─── Animated showcase: cycles through app scenes ─── */
const showcaseScenes = [
  {
    icon: Camera,
    label: 'Capture',
    cards: [
      { bg: 'from-peach/40 to-coral/20', title: 'Beach sunset', date: 'Mar 8, 2026', icon: Image },
      { bg: 'from-lavender/40 to-peach/20', title: 'Birthday party', date: 'Feb 14, 2026', icon: Heart },
      { bg: 'from-teal/20 to-lavender/30', title: 'Weekend hike', date: 'Jan 28, 2026', icon: Image },
    ],
    caption: 'Every moment, safely kept',
  },
  {
    icon: Users,
    label: 'Share',
    avatars: ['A', 'S', 'R', 'M'],
    caption: 'Only with your closest people',
  },
  {
    icon: Heart,
    label: 'Relive',
    memory: { title: 'One year ago today', subtitle: 'That road trip to the coast', date: 'Mar 12, 2025' },
    caption: 'Memories resurface beautifully',
  },
  {
    icon: Lock,
    label: 'Private',
    caption: 'No followers. No algorithms. Just your circle.',
  },
]

function LoginShowcase() {
  const [activeScene, setActiveScene] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveScene((prev) => (prev + 1) % showcaseScenes.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const scene = showcaseScenes[activeScene]

  return (
    <motion.div
      className="mb-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.7 }}
    >
      {/* Phone-like showcase frame */}
      <div className="relative mx-auto w-64 h-44 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/50 overflow-hidden shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScene}
            className="absolute inset-0 flex flex-col items-center justify-center px-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
          >
            {/* Scene: Timeline cards */}
            {scene.cards && (
              <div className="w-full space-y-1.5">
                {scene.cards.map((card, i) => (
                  <motion.div
                    key={card.title}
                    className={`flex items-center gap-2 bg-gradient-to-r ${card.bg} rounded-lg px-3 py-1.5`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.4 }}
                  >
                    <div className="w-7 h-7 rounded-md bg-white/50 flex items-center justify-center">
                      <card.icon className="w-3.5 h-3.5 text-warmDark/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-[11px] font-medium text-warmDark/70 truncate">{card.title}</p>
                      <p className="font-sans text-[9px] text-warmDark/40">{card.date}</p>
                    </div>
                    <Heart className="w-3 h-3 text-coral/50" />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Scene: Circle of avatars */}
            {scene.avatars && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex -space-x-2">
                  {scene.avatars.map((initial, i) => (
                    <motion.div
                      key={initial}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/60 to-coral/40 border-2 border-white flex items-center justify-center"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.12, duration: 0.3, type: 'spring' }}
                    >
                      <span className="font-sans text-xs font-semibold text-white">{initial}</span>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  className="flex items-center gap-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <MessageCircle className="w-3.5 h-3.5 text-warmDark/40" />
                  <p className="font-sans text-[10px] text-warmDark/40">4 people in this circle</p>
                </motion.div>
              </div>
            )}

            {/* Scene: Memory resurface */}
            {scene.memory && (
              <motion.div
                className="w-full bg-gradient-to-br from-lavender/30 to-peach/30 rounded-xl px-4 py-3 text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
              >
                <Heart className="w-5 h-5 text-coral/60 mx-auto mb-1.5" />
                <p className="font-handwriting text-base text-warmDark/60">{scene.memory.title}</p>
                <p className="font-sans text-[11px] text-warmDark/45 mt-0.5">{scene.memory.subtitle}</p>
                <p className="font-sans text-[9px] text-warmDark/30 mt-1">{scene.memory.date}</p>
              </motion.div>
            )}

            {/* Scene: Private & secure */}
            {!scene.cards && !scene.avatars && !scene.memory && (
              <motion.div
                className="flex flex-col items-center gap-2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal/30 to-lavender/30 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-warmDark/40" />
                </div>
                <p className="font-sans text-[11px] text-warmDark/50 text-center leading-snug px-2">
                  No followers. No algorithms.<br />Just your circle.
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Caption + scene indicator */}
      <div className="mt-3 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={scene.caption}
            className="font-handwriting text-base text-warmDark/50"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {scene.caption}
          </motion.p>
        </AnimatePresence>
        <div className="flex justify-center gap-1.5 mt-2">
          {showcaseScenes.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveScene(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === activeScene ? 'bg-gold/70 w-4' : 'bg-warmDark/15'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function LoginPage() {
  const login = useStore((s) => s.login)
  const loginWithCode = useStore((s) => s.loginWithCode)
  const fetchSpaces = useStore((s) => s.fetchSpaces)
  const [screen, setScreen] = useState<Screen>('main')

  // Email login flow
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailStep, setEmailStep] = useState<EmailStep>('enter')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginCode, setLoginCode] = useState('')
  const [codeSending, setCodeSending] = useState(false)

  // Signup flow
  const [signupStep, setSignupStep] = useState<SignupStep>('email')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupUserId, setSignupUserId] = useState('')
  const [signupName, setSignupName] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirm, setSignupConfirm] = useState('')
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [signupError, setSignupError] = useState('')

  // Verify flow (login-side: unverified email after login attempt)
  const [verifyUserId, setVerifyUserId] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [verifyError, setVerifyError] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMsg, setResendMsg] = useState('')

  // Forgot password flow
  const [forgotStep, setForgotStep] = useState<ForgotStep>('email')
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotCode, setForgotCode] = useState('')
  const [forgotNewPass, setForgotNewPass] = useState('')
  const [forgotConfirm, setForgotConfirm] = useState('')
  const [showForgotPass, setShowForgotPass] = useState(false)
  const [forgotError, setForgotError] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState(false)

  const resetAll = () => {
    setScreen('main')
    setEmail('')
    setPassword('')
    setEmailStep('enter')
    setLoginError('')
    setSignupStep('email')
    setSignupEmail('')
    setSignupUserId('')
    setSignupName('')
    setSignupPassword('')
    setSignupConfirm('')
    setSignupError('')
    setVerifyUserId('')
    setVerifyCode('')
    setVerifyError('')
    setResendMsg('')
    setForgotStep('email')
    setForgotEmail('')
    setForgotCode('')
    setForgotNewPass('')
    setForgotConfirm('')
    setForgotError('')
    setForgotSuccess(false)
    setLoading(false)
  }

  const goToVerify = (userId: string) => {
    setVerifyUserId(userId)
    setVerifyCode('')
    setVerifyError('')
    setResendMsg('')
    setScreen('verify')
  }

  // ── Login handlers ──────────────────────────────────────────
  const handleEmailNext = () => {
    if (!email.trim()) return
    if (!isValidEmail(email)) { setLoginError('Enter a valid email address (e.g. name@example.com)'); return }
    setLoginError('')
    setEmailStep('password')
  }

  const handleSendLoginCode = async () => {
    setCodeSending(true)
    setLoginError('')
    try {
      await api.sendLoginCode(email.trim().toLowerCase())
      setEmailStep('code')
      setLoginCode('')
    } catch (err: any) {
      if (err.noAccount) {
        setLoginError('__noAccount__')
      } else {
        setLoginError(err.message || 'Failed to send code')
      }
    } finally {
      setCodeSending(false)
    }
  }

  const handleCodeLogin = async () => {
    if (!loginCode.trim() || loginCode.length < 6) return
    setLoading(true)
    setLoginError('')
    try {
      await loginWithCode(email.trim().toLowerCase(), loginCode.trim())
    } catch (err: any) {
      setLoginError(err.message || 'Invalid code')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async () => {
    if (!password.trim()) return
    setLoading(true)
    setLoginError('')
    try {
      await login({ email: email.trim().toLowerCase(), password })
    } catch (err: any) {
      if (err.emailNotVerified && err.userId) {
        goToVerify(err.userId)
      } else if (err.incompleteSignup && err.userId) {
        setSignupUserId(err.userId)
        setSignupEmail(email.trim().toLowerCase())
        setSignupStep('profile')
        setScreen('signup')
      } else if (err.noAccount) {
        setLoginError('__noAccount__')
      } else {
        setLoginError(err.message || 'Invalid email or password')
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Signup handlers ─────────────────────────────────────────
  const handlePreSignup = async () => {
    setSignupError('')
    if (!signupEmail.trim()) return
    if (!isValidEmail(signupEmail)) { setSignupError('Enter a valid email address (e.g. name@example.com)'); return }
    setLoading(true)
    try {
      const result = await api.preSignup(signupEmail.trim().toLowerCase())
      setSignupUserId(result.userId)
      setVerifyCode('')
      setVerifyError('')
      setResendMsg('')
      setSignupStep('verify')
    } catch (err: any) {
      setSignupError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignupVerify = async () => {
    if (!verifyCode.trim() || verifyCode.length < 6) return
    setLoading(true)
    setVerifyError('')
    try {
      await api.verifyEmail(signupUserId, verifyCode.trim())
      setVerifyCode('')
      setSignupStep('profile')
    } catch (err: any) {
      setVerifyError(err.message || 'Invalid code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignupResend = async () => {
    setResendLoading(true)
    setResendMsg('')
    try {
      await api.sendVerification(signupUserId)
      setResendMsg('A new code has been sent to your email.')
    } catch {
      setResendMsg('Failed to resend. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  const handleCompleteSignup = async () => {
    setSignupError('')
    if (!signupName.trim()) { setSignupError('Name is required'); return }
    if (!signupPassword) { setSignupError('Password is required'); return }
    const pwErr = validatePassword(signupPassword)
    if (pwErr) { setSignupError(pwErr); return }
    if (signupPassword !== signupConfirm) { setSignupError('Passwords do not match'); return }
    setLoading(true)
    try {
      const result = await api.completeSignup(signupUserId, signupName.trim(), signupPassword)
      setToken(result.token)
      useStore.setState({ isLoggedIn: true, currentUser: result.user, initialized: true })
      await fetchSpaces()
    } catch (err: any) {
      setSignupError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Login verify handler (for unverified existing users) ────
  const handleVerify = async () => {
    if (!verifyCode.trim() || verifyCode.length < 6) return
    setLoading(true)
    setVerifyError('')
    try {
      const result = await api.verifyEmail(verifyUserId, verifyCode.trim())
      setToken(result.token)
      useStore.setState({ isLoggedIn: true, currentUser: result.user, initialized: true })
      await fetchSpaces()
    } catch (err: any) {
      setVerifyError(err.message || 'Invalid code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    setResendMsg('')
    try {
      await api.sendVerification(verifyUserId)
      setResendMsg('A new code has been sent to your email.')
    } catch {
      setResendMsg('Failed to resend. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  // ── Forgot password handlers ────────────────────────────────
  const handleForgotSend = async () => {
    if (!forgotEmail.trim()) return
    if (!isValidEmail(forgotEmail)) { setForgotError('Enter a valid email address (e.g. name@example.com)'); return }
    setLoading(true)
    setForgotError('')
    try {
      await api.forgotPassword(forgotEmail.trim().toLowerCase())
      setForgotStep('code')
    } catch (err: any) {
      setForgotError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotVerifyCode = () => {
    if (!forgotCode.trim() || forgotCode.length < 6) {
      setForgotError('Enter the 6-digit code from your email'); return
    }
    setForgotError('')
    setForgotStep('newpass')
  }

  const handleForgotReset = async () => {
    setForgotError('')
    const pwErr = validatePassword(forgotNewPass)
    if (pwErr) { setForgotError(pwErr); return }
    if (forgotNewPass !== forgotConfirm) {
      setForgotError('Passwords do not match'); return
    }
    setLoading(true)
    try {
      await api.resetPassword(forgotEmail.trim().toLowerCase(), forgotCode.trim(), forgotNewPass)
      setForgotSuccess(true)
    } catch (err: any) {
      setForgotError(err.message || 'Reset failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-white/40 rounded-2xl px-5 py-4 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all border border-white/50"
  const codeInputClass = "w-full bg-white/40 rounded-2xl px-5 py-4 text-warmDark font-mono text-center text-2xl tracking-[0.5em] outline-none focus:ring-2 focus:ring-gold/30 transition-all border border-white/50"

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center relative overflow-hidden">

      <ParticleBackground />

      {/* Logo — top left */}
      <div className="absolute top-8 left-8 z-20">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/80 to-coral/70 flex items-center justify-center shadow-lg">
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="14" stroke="white" strokeWidth="2.5" opacity="0.9" />
            <circle cx="20" cy="20" r="8" stroke="white" strokeWidth="2" opacity="0.7" />
            <circle cx="20" cy="20" r="3" fill="white" opacity="0.9" />
          </svg>
        </div>
      </div>

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
                <h1 className="font-serif text-5xl md:text-6xl font-bold text-warmDark mb-3 text-shadow-warm">My Inner Circle</h1>
                <p className="font-handwriting text-2xl text-warmDark/70 mb-6">Your stories, beautifully preserved</p>
              </motion.div>

              {/* ── MOTION SHOWCASE ── */}
              <LoginShowcase />

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
                  <Mail className="w-5 h-5 text-warmDark/70" />
                  <span className="font-sans text-warmDark group-hover:text-warmDark/80">Login with Email</span>
                </button>
              </motion.div>

              <motion.p className="mt-6 text-warmDark/70 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                Your memories are safe and private
              </motion.p>
            </motion.div>
          )}

          {/* ===== SIGNUP SCREEN (3 steps) ===== */}
          {screen === 'signup' && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <button
                onClick={() => {
                  if (signupStep === 'email') { resetAll(); return }
                  if (signupStep === 'verify') { setSignupStep('email'); setVerifyCode(''); setVerifyError(''); setResendMsg(''); return }
                  if (signupStep === 'profile') { setSignupStep('verify'); setSignupError(''); return }
                }}
                className="flex items-center gap-2 text-warmDark/70 hover:text-warmDark/70 mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </button>

              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-8">
                {(['email', 'verify', 'profile'] as SignupStep[]).map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      signupStep === step ? 'bg-gold w-6' :
                      (['email', 'verify', 'profile'].indexOf(signupStep) > i) ? 'bg-gold/60' : 'bg-warmDark/20'
                    }`} />
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* Step 1: Email */}
                {signupStep === 'email' && (
                  <motion.div key="s-email" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <h2 className="font-serif text-3xl text-warmDark mb-2">Create account</h2>
                    <p className="font-handwriting text-xl text-warmDark/75 mb-8">Start with your email address</p>

                    <div className="space-y-4">
                      <div>
                        <label className="font-handwriting text-warmDark/75 text-lg block mb-2">Email address</label>
                        <input
                          type="email" value={signupEmail}
                          onChange={(e) => { setSignupEmail(e.target.value); setSignupError('') }}
                          onKeyDown={(e) => e.key === 'Enter' && handlePreSignup()}
                          placeholder="you@example.com" autoFocus className={inputClass}
                        />
                      </div>

                      {signupError && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-coral font-sans bg-coral/10 rounded-xl px-4 py-2">
                          {signupError}
                        </motion.p>
                      )}

                      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        onClick={handlePreSignup} disabled={loading}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold/80 to-coral/70 text-white font-serif text-lg disabled:opacity-60">
                        {loading ? 'Sending code…' : 'Send verification code'}
                      </motion.button>

                      <button onClick={() => setScreen('email')} className="w-full text-center text-warmDark/75 text-sm hover:text-warmDark/70 transition-colors">
                        Already have an account? Sign in
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Verify email */}
                {signupStep === 'verify' && (
                  <motion.div key="s-verify" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <h2 className="font-serif text-3xl text-warmDark mb-2">Check your email</h2>
                    <p className="font-handwriting text-xl text-warmDark/75 mb-8">
                      We sent a 6-digit code to{' '}
                      <span className="text-warmDark/75">{signupEmail}</span>
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="font-handwriting text-warmDark/75 text-lg block mb-2">Verification code</label>
                        <input
                          type="text" inputMode="numeric" maxLength={6}
                          value={verifyCode}
                          onChange={(e) => { setVerifyCode(e.target.value.replace(/\D/g, '')); setVerifyError('') }}
                          onKeyDown={(e) => e.key === 'Enter' && handleSignupVerify()}
                          placeholder="000000" autoFocus className={codeInputClass}
                        />
                      </div>

                      {verifyError && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-coral font-sans bg-coral/10 rounded-xl px-4 py-2">
                          {verifyError}
                        </motion.p>
                      )}
                      {resendMsg && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-teal font-sans bg-teal/10 rounded-xl px-4 py-2">
                          {resendMsg}
                        </motion.p>
                      )}

                      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        onClick={handleSignupVerify} disabled={loading || verifyCode.length < 6}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold/80 to-coral/70 text-white font-serif text-lg disabled:opacity-60">
                        {loading ? 'Verifying…' : 'Verify email'}
                      </motion.button>

                      <button onClick={handleSignupResend} disabled={resendLoading}
                        className="w-full text-center text-warmDark/75 text-sm hover:text-warmDark/70 transition-colors disabled:opacity-50">
                        {resendLoading ? 'Sending…' : "Didn't receive it? Resend code"}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Name + Password */}
                {signupStep === 'profile' && (
                  <motion.div key="s-profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <h2 className="font-serif text-3xl text-warmDark mb-2">Almost there!</h2>
                    <p className="font-handwriting text-xl text-warmDark/75 mb-8">Set your name and password</p>

                    <div className="space-y-4">
                      <div>
                        <label className="font-handwriting text-warmDark/75 text-lg block mb-2">Your name</label>
                        <input type="text" value={signupName}
                          onChange={(e) => { setSignupName(e.target.value); setSignupError('') }}
                          placeholder="Jane Smith" autoFocus className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="font-handwriting text-warmDark/75 text-lg block mb-2">Password</label>
                        <div className="relative">
                          <input type={showSignupPassword ? 'text' : 'password'} value={signupPassword}
                            onChange={(e) => { setSignupPassword(e.target.value); setSignupError('') }}
                            placeholder="8+ chars, A-Z, 0-9, symbol"
                            className="w-full bg-white/40 rounded-2xl px-5 py-4 pr-12 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all border border-white/50" />
                          <button type="button" onClick={() => setShowSignupPassword(!showSignupPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-warmDark/70 hover:text-warmDark/80 transition-colors">
                            {showSignupPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="font-handwriting text-warmDark/75 text-lg block mb-2">Confirm password</label>
                        <input type="password" value={signupConfirm}
                          onChange={(e) => { setSignupConfirm(e.target.value); setSignupError('') }}
                          onKeyDown={(e) => e.key === 'Enter' && handleCompleteSignup()}
                          placeholder="Repeat your password" className={inputClass}
                        />
                      </div>

                      {signupError && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-coral font-sans bg-coral/10 rounded-xl px-4 py-2">
                          {signupError}
                        </motion.p>
                      )}

                      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        onClick={handleCompleteSignup} disabled={loading}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold/80 to-coral/70 text-white font-serif text-lg disabled:opacity-60">
                        {loading ? 'Creating account…' : 'Create account'}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ===== EMAIL LOGIN SCREEN ===== */}
          {screen === 'email' && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <button onClick={resetAll} className="flex items-center gap-2 text-warmDark/70 hover:text-warmDark/70 mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </button>

              <h2 className="font-serif text-3xl text-warmDark mb-2">Welcome back</h2>
              <p className="font-handwriting text-xl text-warmDark/75 mb-8">
                {emailStep === 'enter' ? 'Enter your email to continue' : emailStep === 'code' ? `Enter the code sent to ${email}` : `Signing in as ${email}`}
              </p>

              <AnimatePresence mode="wait">
                {emailStep === 'enter' ? (
                  <motion.div key="email-input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <div>
                      <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setLoginError('') }}
                        onKeyDown={(e) => e.key === 'Enter' && handleEmailNext()}
                        placeholder="you@example.com" autoFocus
                        className={`w-full bg-white/40 rounded-2xl px-5 py-4 text-warmDark font-sans outline-none transition-all border ${loginError ? 'border-coral/50 focus:ring-2 focus:ring-coral/30' : 'border-white/50 focus:ring-2 focus:ring-gold/30'}`} />
                    </div>
                    {loginError && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-coral font-sans bg-coral/10 rounded-xl px-4 py-2">
                        {loginError}
                      </motion.p>
                    )}
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handleEmailNext}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold/80 to-coral/70 text-white font-serif text-lg">
                      Continue
                    </motion.button>
                    <button onClick={() => setScreen('signup')} className="w-full text-center text-warmDark/75 text-sm hover:text-warmDark/70 transition-colors">
                      No account? Create one
                    </button>
                  </motion.div>
                ) : emailStep === 'password' ? (
                  <motion.div key="password-input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <div>
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
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-warmDark/70 hover:text-warmDark/80 transition-colors">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {loginError && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-coral font-sans bg-coral/10 rounded-xl px-4 py-2">
                        {loginError === '__noAccount__' ? (
                          <span>
                            No account found with this email.{' '}
                            <button onClick={() => { setScreen('signup'); setSignupEmail(email); setLoginError('') }}
                              className="underline font-medium hover:text-coral/70">
                              Sign up instead
                            </button>
                          </span>
                        ) : loginError}
                      </motion.div>
                    )}

                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      onClick={handleEmailLogin} disabled={loading}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold/80 to-coral/70 text-white font-serif text-lg disabled:opacity-60">
                      {loading ? 'Signing in…' : 'Sign in'}
                    </motion.button>

                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => { setForgotEmail(email); setForgotStep('email'); setScreen('forgot') }}
                        className="text-warmDark/70 text-sm hover:text-warmDark/70 transition-colors">
                        Forgot password?
                      </button>
                    </div>

                    <button onClick={handleSendLoginCode} disabled={codeSending}
                      className="w-full text-center text-warmDark/60 text-sm hover:text-warmDark/80 transition-colors disabled:opacity-50">
                      {codeSending ? 'Sending code…' : 'Sign in with code instead'}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="code-input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={loginCode}
                        onChange={(e) => { setLoginCode(e.target.value.replace(/\D/g, '')); setLoginError('') }}
                        onKeyDown={(e) => e.key === 'Enter' && handleCodeLogin()}
                        placeholder="000000"
                        autoFocus
                        className={`w-full bg-white/40 rounded-2xl px-5 py-4 text-warmDark font-sans text-center text-2xl tracking-[0.5em] outline-none transition-all border ${loginError ? 'border-coral/50 focus:ring-2 focus:ring-coral/30' : 'border-white/50 focus:ring-2 focus:ring-gold/30'}`}
                      />
                    </div>

                    {loginError && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-coral font-sans bg-coral/10 rounded-xl px-4 py-2">
                        {loginError === '__noAccount__' ? (
                          <span>
                            No account found with this email.{' '}
                            <button onClick={() => { setScreen('signup'); setSignupEmail(email); setLoginError('') }}
                              className="underline font-medium hover:text-coral/70">
                              Sign up instead
                            </button>
                          </span>
                        ) : loginError}
                      </motion.div>
                    )}

                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      onClick={handleCodeLogin} disabled={loading || loginCode.length < 6}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold/80 to-coral/70 text-white font-serif text-lg disabled:opacity-60">
                      {loading ? 'Verifying…' : 'Verify & sign in'}
                    </motion.button>

                    <div className="flex items-center justify-between">
                      <button onClick={() => { setEmailStep('password'); setLoginError(''); setLoginCode('') }}
                        className="text-warmDark/70 text-sm hover:text-warmDark/80 transition-colors">
                        Use password instead
                      </button>
                      <button onClick={handleSendLoginCode} disabled={codeSending}
                        className="text-warmDark/70 text-sm hover:text-warmDark/80 transition-colors disabled:opacity-50">
                        {codeSending ? 'Sending…' : 'Resend code'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ===== VERIFY EMAIL SCREEN (login-side only) ===== */}
          {screen === 'verify' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="font-serif text-3xl text-warmDark mb-2">Verify your email</h2>
              <p className="font-handwriting text-xl text-warmDark/75 mb-8">
                We sent a 6-digit code to your email. Enter it below.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="font-handwriting text-warmDark/75 text-lg block mb-2">Verification code</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={verifyCode}
                    onChange={(e) => { setVerifyCode(e.target.value.replace(/\D/g, '')); setVerifyError('') }}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                    placeholder="000000"
                    autoFocus
                    className={codeInputClass}
                  />
                </div>

                {verifyError && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-coral font-sans bg-coral/10 rounded-xl px-4 py-2">
                    {verifyError}
                  </motion.p>
                )}

                {resendMsg && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-teal font-sans bg-teal/10 rounded-xl px-4 py-2">
                    {resendMsg}
                  </motion.p>
                )}

                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  onClick={handleVerify} disabled={loading || verifyCode.length < 6}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold/80 to-coral/70 text-white font-serif text-lg disabled:opacity-60">
                  {loading ? 'Verifying…' : 'Verify email'}
                </motion.button>

                <button onClick={handleResend} disabled={resendLoading}
                  className="w-full text-center text-warmDark/75 text-sm hover:text-warmDark/70 transition-colors disabled:opacity-50">
                  {resendLoading ? 'Sending…' : "Didn't receive it? Resend code"}
                </button>
              </div>
            </motion.div>
          )}

          {/* ===== FORGOT PASSWORD SCREEN ===== */}
          {screen === 'forgot' && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <button onClick={() => { setScreen('email'); setEmailStep('password'); setForgotError('') }}
                className="flex items-center gap-2 text-warmDark/70 hover:text-warmDark/70 mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </button>

              <h2 className="font-serif text-3xl text-warmDark mb-2">Reset password</h2>

              <AnimatePresence mode="wait">
                {forgotStep === 'email' && (
                  <motion.div key="forgot-email" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <p className="font-handwriting text-xl text-warmDark/75 mb-6">Enter your email and we'll send a reset code.</p>
                    <div>
                      <label className="font-handwriting text-warmDark/75 text-lg block mb-2">Email address</label>
                      <input type="email" value={forgotEmail} onChange={(e) => { setForgotEmail(e.target.value); setForgotError('') }}
                        onKeyDown={(e) => e.key === 'Enter' && handleForgotSend()}
                        placeholder="you@example.com" autoFocus className={inputClass} />
                    </div>
                    {forgotError && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-coral font-sans bg-coral/10 rounded-xl px-4 py-2">
                        {forgotError}
                      </motion.p>
                    )}
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      onClick={handleForgotSend} disabled={loading}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold/80 to-coral/70 text-white font-serif text-lg disabled:opacity-60">
                      {loading ? 'Sending…' : 'Send reset code'}
                    </motion.button>
                  </motion.div>
                )}

                {forgotStep === 'code' && (
                  <motion.div key="forgot-code" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <p className="font-handwriting text-xl text-warmDark/75 mb-6">Check your email for the 6-digit code.</p>
                    <div>
                      <label className="font-handwriting text-warmDark/75 text-lg block mb-2">Reset code</label>
                      <input
                        type="text" inputMode="numeric" maxLength={6}
                        value={forgotCode}
                        onChange={(e) => { setForgotCode(e.target.value.replace(/\D/g, '')); setForgotError('') }}
                        onKeyDown={(e) => e.key === 'Enter' && handleForgotVerifyCode()}
                        placeholder="000000" autoFocus className={codeInputClass}
                      />
                    </div>
                    {forgotError && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-coral font-sans bg-coral/10 rounded-xl px-4 py-2">
                        {forgotError}
                      </motion.p>
                    )}
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      onClick={handleForgotVerifyCode} disabled={forgotCode.length < 6}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold/80 to-coral/70 text-white font-serif text-lg disabled:opacity-60">
                      Continue
                    </motion.button>
                    <button onClick={() => { setForgotStep('email'); setForgotCode('') }}
                      className="w-full text-center text-warmDark/70 text-sm hover:text-warmDark/70 transition-colors">
                      Use a different email
                    </button>
                  </motion.div>
                )}

                {forgotStep === 'newpass' && !forgotSuccess && (
                  <motion.div key="forgot-newpass" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <p className="font-handwriting text-xl text-warmDark/75 mb-6">Enter your new password.</p>
                    <div>
                      <label className="font-handwriting text-warmDark/75 text-lg block mb-2">New password</label>
                      <div className="relative">
                        <input type={showForgotPass ? 'text' : 'password'} value={forgotNewPass}
                          onChange={(e) => { setForgotNewPass(e.target.value); setForgotError('') }}
                          placeholder="8+ chars, A-Z, 0-9, symbol" autoFocus
                          className="w-full bg-white/40 rounded-2xl px-5 py-4 pr-12 text-warmDark font-sans outline-none focus:ring-2 focus:ring-gold/30 transition-all border border-white/50" />
                        <button type="button" onClick={() => setShowForgotPass(!showForgotPass)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-warmDark/70 hover:text-warmDark/80 transition-colors">
                          {showForgotPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="font-handwriting text-warmDark/75 text-lg block mb-2">Confirm password</label>
                      <input type="password" value={forgotConfirm}
                        onChange={(e) => { setForgotConfirm(e.target.value); setForgotError('') }}
                        onKeyDown={(e) => e.key === 'Enter' && handleForgotReset()}
                        placeholder="Repeat new password" className={inputClass} />
                    </div>
                    {forgotError && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-coral font-sans bg-coral/10 rounded-xl px-4 py-2">
                        {forgotError}
                      </motion.p>
                    )}
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      onClick={handleForgotReset} disabled={loading}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold/80 to-coral/70 text-white font-serif text-lg disabled:opacity-60">
                      {loading ? 'Saving…' : 'Set new password'}
                    </motion.button>
                  </motion.div>
                )}

                {forgotSuccess && (
                  <motion.div key="forgot-success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
                    <div className="text-5xl">🎉</div>
                    <p className="font-handwriting text-xl text-warmDark/70">Password updated successfully!</p>
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      onClick={() => { setScreen('email'); setEmailStep('password'); setForgotSuccess(false) }}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold/80 to-coral/70 text-white font-serif text-lg">
                      Sign in
                    </motion.button>
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
