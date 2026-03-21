import { motion } from 'framer-motion'
import { Play, Volume2, Mic, Music, Image, Film, SkipBack, SkipForward, Maximize2, Heart, Camera, Video } from 'lucide-react'

/**
 * Preview-only component — shows different layout templates for audio, video, and image moments.
 * Visit /#media-previews to view. Delete after choosing styles.
 */

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } }

/* ═══════════════════════════════════════════════════════════════
   SECTION 1: IMAGE LAYOUTS
   ═══════════════════════════════════════════════════════════════ */

function ImagePolaroid() {
  return (
    <motion.div {...fadeIn} className="bg-white rounded-2xl p-4 shadow-md border border-warmMid/10">
      <p className="text-[9px] text-gold font-sans uppercase tracking-widest mb-2">Image — Polaroid</p>
      <div className="bg-white p-3 pb-10 shadow-lg rounded-sm rotate-[-1deg] inline-block w-full">
        <div className="aspect-square bg-gradient-to-br from-gold/20 to-coral/20 rounded-sm flex items-center justify-center">
          <Camera className="w-10 h-10 text-warmDark/20" />
        </div>
        <p className="font-handwriting text-sm text-warmDark/70 text-center mt-3">Summer afternoon, 2026</p>
      </div>
    </motion.div>
  )
}

function ImageFullBleed() {
  return (
    <motion.div {...fadeIn} className="bg-white rounded-2xl overflow-hidden shadow-md border border-warmMid/10">
      <p className="text-[9px] text-gold font-sans uppercase tracking-widest px-4 pt-3 mb-2">Image — Full Bleed</p>
      <div className="relative aspect-[16/10] bg-gradient-to-br from-lavender/40 to-teal/30 flex items-center justify-center">
        <Image className="w-12 h-12 text-warmDark/15" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h4 className="font-serif text-white text-base font-bold">Golden Hour at the Lake</h4>
          <p className="font-sans text-white/70 text-xs mt-0.5">The light was perfect that evening</p>
        </div>
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
          <Heart className="w-4 h-4 text-white" />
        </button>
      </div>
    </motion.div>
  )
}

function ImageCarousel() {
  return (
    <motion.div {...fadeIn} className="bg-white rounded-2xl p-4 shadow-md border border-warmMid/10">
      <p className="text-[9px] text-gold font-sans uppercase tracking-widest mb-2">Image — Carousel</p>
      <h4 className="font-serif text-sm font-bold text-warmDark mb-2">Weekend Getaway</h4>
      <div className="flex gap-2 overflow-hidden">
        {['from-gold/20 to-coral/15', 'from-lavender/30 to-purple-200/30', 'from-teal/20 to-cyan-200/20'].map((g, i) => (
          <div key={i} className={`w-32 shrink-0 aspect-[3/4] rounded-xl bg-gradient-to-br ${g} flex items-center justify-center border border-white/40`}>
            <Camera className="w-6 h-6 text-warmDark/15" />
          </div>
        ))}
        <div className="w-32 shrink-0 aspect-[3/4] rounded-xl bg-warmMid/5 flex items-center justify-center border border-dashed border-warmMid/20">
          <span className="text-warmDark/30 text-xs font-sans">+5 more</span>
        </div>
      </div>
      <p className="font-sans text-xs text-warmDark/50 mt-2 italic">Swipe to see all photos</p>
    </motion.div>
  )
}

function ImageMasonry() {
  return (
    <motion.div {...fadeIn} className="bg-white rounded-2xl p-4 shadow-md border border-warmMid/10">
      <p className="text-[9px] text-gold font-sans uppercase tracking-widest mb-2">Image — Masonry Grid</p>
      <h4 className="font-serif text-sm font-bold text-warmDark mb-2">Photo Collage</h4>
      <div className="grid grid-cols-3 gap-1.5 auto-rows-[60px]">
        <div className="row-span-2 rounded-xl bg-gradient-to-br from-gold/25 to-coral/20 flex items-center justify-center"><Camera className="w-5 h-5 text-warmDark/15" /></div>
        <div className="rounded-xl bg-gradient-to-br from-lavender/35 to-purple-200/25 flex items-center justify-center"><Camera className="w-4 h-4 text-warmDark/15" /></div>
        <div className="rounded-xl bg-gradient-to-br from-teal/25 to-cyan-200/20 flex items-center justify-center"><Camera className="w-4 h-4 text-warmDark/15" /></div>
        <div className="col-span-2 rounded-xl bg-gradient-to-br from-rose-200/30 to-pink-200/25 flex items-center justify-center"><Camera className="w-5 h-5 text-warmDark/15" /></div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2: VIDEO LAYOUTS
   ═══════════════════════════════════════════════════════════════ */

function VideoInlinePlayer() {
  return (
    <motion.div {...fadeIn} className="bg-white rounded-2xl overflow-hidden shadow-md border border-warmMid/10">
      <p className="text-[9px] text-gold font-sans uppercase tracking-widest px-4 pt-3 mb-2">Video — Inline Player</p>
      <div className="relative aspect-video bg-gradient-to-br from-warmDark/90 to-warmDark flex items-center justify-center mx-4 rounded-xl overflow-hidden mb-3">
        <Film className="w-10 h-10 text-white/10 absolute" />
        {/* Play button overlay */}
        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
          <Play className="w-7 h-7 text-white ml-1" fill="white" />
        </div>
        {/* Duration badge */}
        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">2:34</span>
        {/* Fullscreen */}
        <button className="absolute top-2 right-2 w-6 h-6 rounded bg-black/30 flex items-center justify-center">
          <Maximize2 className="w-3 h-3 text-white" />
        </button>
      </div>
      <div className="px-4 pb-4">
        <h4 className="font-serif text-sm font-bold text-warmDark">Birthday Surprise</h4>
        <p className="font-sans text-xs text-warmDark/50 mt-0.5">The moment she walked in</p>
      </div>
    </motion.div>
  )
}

function VideoThumbnailCard() {
  return (
    <motion.div {...fadeIn} className="bg-white rounded-2xl p-4 shadow-md border border-warmMid/10">
      <p className="text-[9px] text-gold font-sans uppercase tracking-widest mb-2">Video — Thumbnail Card</p>
      <div className="flex gap-3 items-start">
        <div className="relative w-28 aspect-video rounded-xl bg-gradient-to-br from-warmDark/80 to-warmDark flex items-center justify-center shrink-0 overflow-hidden">
          <Film className="w-6 h-6 text-white/10 absolute" />
          <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center">
            <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
          </div>
          <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-mono px-1 py-0.5 rounded">1:15</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-serif text-sm font-bold text-warmDark">First Steps</h4>
          <p className="font-sans text-xs text-warmDark/50 mt-0.5 line-clamp-2">He finally did it! Walking across the room all by himself.</p>
          <div className="flex items-center gap-1.5 mt-2">
            <Video className="w-3 h-3 text-coral/60" />
            <span className="text-[10px] text-warmDark/35 font-sans">Video · 1:15</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function VideoStoryStyle() {
  return (
    <motion.div {...fadeIn} className="bg-white rounded-2xl overflow-hidden shadow-md border border-warmMid/10">
      <p className="text-[9px] text-gold font-sans uppercase tracking-widest px-4 pt-3 mb-2">Video — Story Style (Full Screen)</p>
      <div className="relative aspect-[9/14] max-h-[280px] bg-gradient-to-b from-warmDark/95 to-warmDark mx-4 mb-4 rounded-2xl overflow-hidden">
        <Film className="w-12 h-12 text-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        {/* Top gradient */}
        <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/40 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold to-coral flex items-center justify-center text-white text-[8px] font-bold">N</div>
            <span className="text-white text-xs font-semibold">Nikhil</span>
            <span className="text-white/50 text-[10px]">· 2h ago</span>
          </div>
          {/* Progress bar */}
          <div className="flex gap-1 mt-2">
            <div className="h-0.5 flex-1 rounded-full bg-white/80" />
            <div className="h-0.5 flex-1 rounded-full bg-white/25" />
            <div className="h-0.5 flex-1 rounded-full bg-white/25" />
          </div>
        </div>
        {/* Center play */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
          <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
        </div>
        {/* Bottom caption */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white text-xs">The sunset was unreal today 🌅</p>
        </div>
      </div>
    </motion.div>
  )
}

function VideoCinematic() {
  return (
    <motion.div {...fadeIn} className="bg-warmDark rounded-2xl overflow-hidden shadow-md">
      <p className="text-[9px] text-gold/70 font-sans uppercase tracking-widest px-4 pt-3 mb-2">Video — Cinematic</p>
      <div className="relative aspect-[2.35/1] bg-black flex items-center justify-center">
        <Film className="w-10 h-10 text-white/5 absolute" />
        {/* Letterbox bars */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-black" />
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-black" />
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
          <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
        </div>
      </div>
      {/* Controls bar */}
      <div className="px-4 py-3 flex items-center gap-3">
        <Play className="w-4 h-4 text-white/70" />
        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-gold to-coral rounded-full" />
        </div>
        <span className="text-white/50 text-[10px] font-mono">1:02 / 3:15</span>
        <Volume2 className="w-4 h-4 text-white/50" />
      </div>
      <div className="px-4 pb-4">
        <h4 className="font-serif text-sm font-bold text-white">Road Trip Montage</h4>
        <p className="font-sans text-xs text-white/40 mt-0.5">Three states in one weekend</p>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 3: AUDIO LAYOUTS
   ═══════════════════════════════════════════════════════════════ */

function AudioWaveform() {
  return (
    <motion.div {...fadeIn} className="bg-white rounded-2xl p-4 shadow-md border border-warmMid/10">
      <p className="text-[9px] text-gold font-sans uppercase tracking-widest mb-2">Audio — Waveform</p>
      <h4 className="font-serif text-sm font-bold text-warmDark mb-3">Voice Note from Mom</h4>
      <div className="bg-gradient-to-br from-warmWhite to-peach/20 rounded-xl p-3 border border-warmMid/10">
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-coral flex items-center justify-center shrink-0 shadow-md">
            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
          </button>
          <div className="flex-1">
            {/* Waveform bars */}
            <div className="flex items-center gap-[2px] h-8">
              {[3,5,8,12,7,15,10,18,6,14,9,16,4,11,13,8,17,5,12,7,15,9,6,14,10,8,13,5,11,7].map((h, i) => (
                <div key={i} className={`w-[3px] rounded-full ${i < 10 ? 'bg-gradient-to-t from-gold to-coral' : 'bg-warmMid/20'}`} style={{ height: `${h * 2}px` }} />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-warmDark/40 font-mono">0:23</span>
              <span className="text-[10px] text-warmDark/40 font-mono">1:45</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function AudioBubble() {
  return (
    <motion.div {...fadeIn} className="bg-white rounded-2xl p-4 shadow-md border border-warmMid/10">
      <p className="text-[9px] text-gold font-sans uppercase tracking-widest mb-2">Audio — Chat Bubble</p>
      <div className="flex gap-2.5 items-end">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-coral flex items-center justify-center text-white text-xs font-bold shrink-0">P</div>
        <div className="bg-gradient-to-br from-gold/10 to-coral/5 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%] border border-gold/15">
          <div className="flex items-center gap-2.5">
            <button className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
              <Play className="w-4 h-4 text-gold ml-0.5" fill="currentColor" />
            </button>
            {/* Mini waveform */}
            <div className="flex items-center gap-[2px] h-5 flex-1">
              {[4,7,3,9,5,11,6,8,4,10,7,5,12,6,9,3,8,5,7,4].map((h, i) => (
                <div key={i} className="w-[2px] rounded-full bg-gold/40" style={{ height: `${h * 1.5}px` }} />
              ))}
            </div>
            <span className="text-[10px] text-warmDark/40 font-mono shrink-0">0:32</span>
          </div>
          <p className="font-sans text-[11px] text-warmDark/50 mt-1.5">Priya · 3:42 PM</p>
        </div>
      </div>
    </motion.div>
  )
}

function AudioCard() {
  return (
    <motion.div {...fadeIn} className="bg-white rounded-2xl p-4 shadow-md border border-warmMid/10">
      <p className="text-[9px] text-gold font-sans uppercase tracking-widest mb-2">Audio — Music Card</p>
      <div className="bg-gradient-to-br from-warmDark to-warmDark/90 rounded-xl p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/30 to-coral/30 flex items-center justify-center shrink-0 shadow-inner">
          <Music className="w-7 h-7 text-gold/70" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-serif text-sm font-bold text-white truncate">Our Wedding Song</h4>
          <p className="font-sans text-xs text-white/40 truncate">Recorded at the reception</p>
          <div className="flex items-center gap-2 mt-2">
            <SkipBack className="w-3.5 h-3.5 text-white/40" />
            <button className="w-7 h-7 rounded-full bg-gold flex items-center justify-center">
              <Play className="w-3.5 h-3.5 text-white ml-0.5" fill="white" />
            </button>
            <SkipForward className="w-3.5 h-3.5 text-white/40" />
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden ml-1">
              <div className="h-full w-2/5 bg-gold rounded-full" />
            </div>
            <span className="text-white/30 text-[9px] font-mono">4:21</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function AudioVoiceMemo() {
  return (
    <motion.div {...fadeIn} className="bg-white rounded-2xl p-4 shadow-md border border-warmMid/10">
      <p className="text-[9px] text-gold font-sans uppercase tracking-widest mb-2">Audio — Voice Memo</p>
      <div className="border border-warmMid/10 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-coral/10 to-gold/10 px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral/20 to-coral/5 flex items-center justify-center">
            <Mic className="w-5 h-5 text-coral" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-serif text-sm font-bold text-warmDark">Grandpa's Story</h4>
            <p className="text-[10px] text-warmDark/40 font-sans">Recorded Dec 25, 2025 · 5:32</p>
          </div>
        </div>
        <div className="px-4 py-3 flex items-center gap-3">
          <button className="w-8 h-8 rounded-full bg-coral flex items-center justify-center shrink-0 shadow-sm">
            <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
          </button>
          <div className="flex-1">
            <div className="h-1.5 bg-warmMid/10 rounded-full overflow-hidden">
              <div className="h-full w-0 bg-gradient-to-r from-coral to-gold rounded-full" />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-warmDark/30 font-mono">0:00</span>
              <span className="text-[9px] text-warmDark/30 font-mono">5:32</span>
            </div>
          </div>
          <Volume2 className="w-4 h-4 text-warmDark/25" />
        </div>
        <div className="px-4 pb-3">
          <p className="font-sans text-xs text-warmDark/60 italic leading-relaxed">"Let me tell you about the time we drove all the way to Vizag in '78..."</p>
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 4: MIXED MEDIA LAYOUTS
   ═══════════════════════════════════════════════════════════════ */

function MixedMediaTimeline() {
  return (
    <motion.div {...fadeIn} className="bg-white rounded-2xl p-4 shadow-md border border-warmMid/10">
      <p className="text-[9px] text-gold font-sans uppercase tracking-widest mb-2">Mixed — Media Timeline</p>
      <h4 className="font-serif text-sm font-bold text-warmDark mb-3">Trip to Goa</h4>
      <div className="space-y-2">
        {/* Photo item */}
        <div className="flex items-center gap-2.5 bg-warmWhite/50 rounded-lg px-3 py-2 border border-warmMid/5">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/20 to-coral/15 flex items-center justify-center shrink-0"><Camera className="w-4 h-4 text-warmDark/20" /></div>
          <div className="flex-1 min-w-0"><p className="text-xs text-warmDark font-semibold truncate">Beach sunset</p><p className="text-[10px] text-warmDark/40">3 photos</p></div>
          <Image className="w-3.5 h-3.5 text-gold/50" />
        </div>
        {/* Video item */}
        <div className="flex items-center gap-2.5 bg-warmWhite/50 rounded-lg px-3 py-2 border border-warmMid/5">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warmDark/80 to-warmDark flex items-center justify-center shrink-0"><Play className="w-4 h-4 text-white/60 ml-0.5" /></div>
          <div className="flex-1 min-w-0"><p className="text-xs text-warmDark font-semibold truncate">Jet ski ride</p><p className="text-[10px] text-warmDark/40">0:45</p></div>
          <Film className="w-3.5 h-3.5 text-coral/50" />
        </div>
        {/* Audio item */}
        <div className="flex items-center gap-2.5 bg-warmWhite/50 rounded-lg px-3 py-2 border border-warmMid/5">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-coral/15 to-gold/10 flex items-center justify-center shrink-0"><Mic className="w-4 h-4 text-coral/50" /></div>
          <div className="flex-1 min-w-0"><p className="text-xs text-warmDark font-semibold truncate">Night market sounds</p><p className="text-[10px] text-warmDark/40">2:10</p></div>
          <Volume2 className="w-3.5 h-3.5 text-lavender" />
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PREVIEW PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function MediaPreviews() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-warmWhite to-peach/20 p-4 pb-24">
      <h1 className="font-serif text-xl font-bold text-warmDark text-center mb-1">Media Moment Templates</h1>
      <p className="font-sans text-xs text-warmDark/50 text-center mb-6">How audio, video & images can look in moments</p>

      <div className="max-w-md mx-auto space-y-8">
        {/* IMAGE SECTION */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-gold/15 flex items-center justify-center"><Camera className="w-3.5 h-3.5 text-gold" /></div>
            <h2 className="font-serif text-base font-bold text-warmDark">Image Layouts</h2>
          </div>
          <div className="space-y-4">
            <ImagePolaroid />
            <ImageFullBleed />
            <ImageCarousel />
            <ImageMasonry />
          </div>
        </div>

        {/* VIDEO SECTION */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-coral/15 flex items-center justify-center"><Film className="w-3.5 h-3.5 text-coral" /></div>
            <h2 className="font-serif text-base font-bold text-warmDark">Video Layouts</h2>
          </div>
          <div className="space-y-4">
            <VideoInlinePlayer />
            <VideoThumbnailCard />
            <VideoStoryStyle />
            <VideoCinematic />
          </div>
        </div>

        {/* AUDIO SECTION */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-lavender/30 flex items-center justify-center"><Mic className="w-3.5 h-3.5 text-purple-500" /></div>
            <h2 className="font-serif text-base font-bold text-warmDark">Audio Layouts</h2>
          </div>
          <div className="space-y-4">
            <AudioWaveform />
            <AudioBubble />
            <AudioCard />
            <AudioVoiceMemo />
          </div>
        </div>

        {/* MIXED SECTION */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-teal/15 flex items-center justify-center"><Plus className="w-3.5 h-3.5 text-teal-600" /></div>
            <h2 className="font-serif text-base font-bold text-warmDark">Mixed Media</h2>
          </div>
          <div className="space-y-4">
            <MixedMediaTimeline />
          </div>
        </div>
      </div>
    </div>
  )
}

function Plus(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
