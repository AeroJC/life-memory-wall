import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageSquare, Bug, AlertTriangle, Lightbulb, CheckCircle2, Loader2 } from 'lucide-react'
import { api } from '../api'

const feedbackTypes = [
  { value: 'suggestion', label: 'Suggestion', icon: Lightbulb, color: 'from-gold/20 to-amber-100', activeColor: 'from-gold/40 to-amber-200', textColor: 'text-gold', borderColor: 'border-gold/40' },
  { value: 'bug', label: 'Bug', icon: Bug, color: 'from-coral/20 to-red-100', activeColor: 'from-coral/40 to-red-200', textColor: 'text-coral', borderColor: 'border-coral/40' },
  { value: 'complaint', label: 'Complaint', icon: AlertTriangle, color: 'from-amber-100 to-orange-100', activeColor: 'from-amber-200 to-orange-200', textColor: 'text-amber-700', borderColor: 'border-amber-400/40' },
] as const

type FeedbackType = 'suggestion' | 'bug' | 'complaint'

export default function FeedbackForm({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<FeedbackType>('suggestion')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!message.trim()) {
      setError('Please enter a message')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await api.submitFeedback({ type, message: message.trim() })
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send feedback')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-md bg-warmWhite rounded-2xl shadow-xl overflow-hidden"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/20 to-coral/20 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-gold" />
            </div>
            <h2 className="font-serif text-lg text-warmDark">Send feedback</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-warmMid/10 transition-colors">
            <X className="w-4 h-4 text-warmDark/50" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 pb-6 pt-4 flex flex-col items-center text-center gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <p className="font-serif text-warmDark text-lg">Thank you!</p>
              <p className="text-sm text-warmDark/60 font-sans">Your feedback has been sent. We appreciate you taking the time to help us improve.</p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold/80 to-coral/70 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all"
              >
                Done
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-6 pb-6">
              {/* Type selector */}
              <div className="flex gap-2 mb-4">
                {feedbackTypes.map((ft) => {
                  const Icon = ft.icon
                  const active = type === ft.value
                  return (
                    <button
                      key={ft.value}
                      onClick={() => setType(ft.value)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        active
                          ? `bg-gradient-to-br ${ft.activeColor} ${ft.borderColor} ${ft.textColor} shadow-sm`
                          : `bg-gradient-to-br ${ft.color} border-transparent text-warmDark/50 hover:text-warmDark/70`
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {ft.label}
                    </button>
                  )
                })}
              </div>

              {/* Message */}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind..."
                rows={5}
                maxLength={2000}
                className="w-full rounded-xl border border-warmMid/15 bg-white/70 px-4 py-3 text-sm text-warmDark placeholder:text-warmDark/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/40 resize-none font-sans"
              />
              <div className="flex justify-between items-center mt-1 mb-3">
                {error && <p className="text-xs text-coral font-sans">{error}</p>}
                <p className="text-xs text-warmDark/30 font-sans ml-auto">{message.length}/2000</p>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={submitting || !message.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-gold/80 to-coral/70 text-white font-medium text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send feedback'
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
