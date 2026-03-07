import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

interface Props {
  onCreateClick: () => void
  onHomeClick: () => void
}

export default function FloatingNav({ onCreateClick, onHomeClick }: Props) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
    >
      <motion.button
        onClick={onCreateClick}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="relative"
      >
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-coral flex items-center justify-center shadow-lg animate-glow">
          <Plus className="w-7 h-7 text-white" />
        </div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/50 to-coral/50 blur-md -z-10" />
      </motion.button>
    </motion.div>
  )
}
