import React from 'react'

// === ACCENT PALETTES (for icon variations) ===
const accents = [
  { skin: '#e8d5c4', hair: '#3d2c1e', hairAlt: '#5a4030', cloth: '#f5f0ea', clothAlt: '#c9b8a0', accent: '#d4a574', bg: '#f5e6d3', dark: '#3d2c1e', green: '#7a9e7e' },
  { skin: '#e0d5e8', hair: '#5a4070', hairAlt: '#7b6890', cloth: '#f0eaf5', clothAlt: '#b8a5d0', accent: '#9b8bb0', bg: '#ebe0f0', dark: '#4a3060', green: '#7a8e9e' },
  { skin: '#f5ddd8', hair: '#8b5050', hairAlt: '#a06060', cloth: '#fff0ee', clothAlt: '#e8a5a0', accent: '#d48a85', bg: '#f5e0dd', dark: '#7a4040', green: '#8e9e7a' },
]

type IconProps = { accent?: number; className?: string }
function getA(accent: number = 0) { return accents[accent % accents.length] }


// === Icons from _icons_part1.tsx ===
function CatLoverIcon({ accent = 0 }: IconProps) {
  const a = getA(accent);
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <circle cx="60" cy="60" r="60" fill={a.bg} />

      {/* Small plant in bottom-left corner */}
      <rect x="12" y="90" width="6" height="14" rx="2" fill={a.green} opacity="0.7" />
      <ellipse cx="15" cy="88" rx="6" ry="4" fill={a.green} opacity="0.6" />
      <ellipse cx="10" cy="85" rx="4" ry="3" fill={a.green} opacity="0.5" />
      <ellipse cx="20" cy="86" rx="4" ry="3" fill={a.green} opacity="0.5" />
      <rect x="10" y="103" width="10" height="6" rx="2" fill={a.accent} opacity="0.5" />

      {/* Person body - sitting cross-legged */}
      {/* Legs crossed */}
      <path d="M40 92 Q50 100 60 95 Q70 100 80 92" stroke={a.cloth} strokeWidth="6" fill="none" />
      <path d="M38 88 Q48 98 58 90" stroke={a.clothAlt} strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M82 88 Q72 98 62 90" stroke={a.clothAlt} strokeWidth="8" fill="none" strokeLinecap="round" />

      {/* Cozy sweater body */}
      <path d="M42 60 C42 55 48 50 60 50 C72 50 78 55 78 60 L80 88 C80 90 76 92 60 92 C44 92 40 90 40 88 Z" fill={a.cloth} />
      {/* Sweater neckline detail */}
      <path d="M50 52 Q60 56 70 52" stroke={a.clothAlt} strokeWidth="1.5" fill="none" />
      {/* Sweater ribbing at bottom */}
      <path d="M42 85 L78 85" stroke={a.clothAlt} strokeWidth="1" opacity="0.4" />
      <path d="M42 87 L78 87" stroke={a.clothAlt} strokeWidth="1" opacity="0.4" />
      {/* Sweater texture lines */}
      <path d="M50 60 L50 82" stroke={a.clothAlt} strokeWidth="0.5" opacity="0.3" />
      <path d="M60 55 L60 82" stroke={a.clothAlt} strokeWidth="0.5" opacity="0.3" />
      <path d="M70 60 L70 82" stroke={a.clothAlt} strokeWidth="0.5" opacity="0.3" />

      {/* Arms holding cat */}
      <path d="M42 60 Q34 70 38 82" stroke={a.skin} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M78 60 Q86 70 82 82" stroke={a.skin} strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Sleeves */}
      <path d="M42 58 Q36 65 37 72" stroke={a.cloth} strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M78 58 Q84 65 83 72" stroke={a.cloth} strokeWidth="7" fill="none" strokeLinecap="round" />

      {/* Neck */}
      <rect x="56" y="44" width="8" height="8" rx="2" fill={a.skin} />

      {/* Face */}
      <circle cx="60" cy="38" r="14" fill={a.skin} />
      {/* Blush */}
      <circle cx="51" cy="40" r="3" fill={a.accent} opacity="0.3" />
      <circle cx="69" cy="40" r="3" fill={a.accent} opacity="0.3" />
      {/* Eyes behind glasses */}
      <circle cx="54" cy="36" r="1.5" fill={a.dark} />
      <circle cx="66" cy="36" r="1.5" fill={a.dark} />
      {/* Eye shine */}
      <circle cx="54.5" cy="35.5" r="0.5" fill="white" />
      <circle cx="66.5" cy="35.5" r="0.5" fill="white" />
      {/* Glasses */}
      <circle cx="54" cy="36" r="5" stroke={a.dark} strokeWidth="1.2" fill="none" />
      <circle cx="66" cy="36" r="5" stroke={a.dark} strokeWidth="1.2" fill="none" />
      <path d="M59 36 L61 36" stroke={a.dark} strokeWidth="1.2" />
      <path d="M49 35 L44 33" stroke={a.dark} strokeWidth="1.2" />
      <path d="M71 35 L76 33" stroke={a.dark} strokeWidth="1.2" />
      {/* Smile */}
      <path d="M56 42 Q60 45 64 42" stroke={a.dark} strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* Hair bun */}
      <circle cx="60" cy="20" r="8" fill={a.hair} />
      {/* Hair around face */}
      <path d="M46 32 Q46 22 52 20 Q56 18 60 18 Q64 18 68 20 Q74 22 74 32" fill={a.hair} />
      {/* Hair bun highlight */}
      <path d="M56 16 Q60 14 64 16" stroke={a.hairAlt} strokeWidth="1.5" fill="none" />
      {/* Side hair strands */}
      <path d="M47 33 Q45 38 46 42" stroke={a.hair} strokeWidth="2" fill="none" />
      <path d="M73 33 Q75 38 74 42" stroke={a.hair} strokeWidth="2" fill="none" />

      {/* Cat on lap */}
      {/* Cat body */}
      <ellipse cx="60" cy="80" rx="12" ry="8" fill={a.accent} />
      {/* Cat head */}
      <circle cx="52" cy="72" r="7" fill={a.accent} />
      {/* Cat ears */}
      <path d="M47 67 L45 60 L50 65 Z" fill={a.accent} />
      <path d="M57 67 L59 60 L54 65 Z" fill={a.accent} />
      {/* Cat inner ears */}
      <path d="M47.5 66 L46.5 62 L49 65 Z" fill={a.skin} opacity="0.5" />
      <path d="M56.5 66 L57.5 62 L55 65 Z" fill={a.skin} opacity="0.5" />
      {/* Cat eyes */}
      <ellipse cx="49" cy="72" rx="1.5" ry="2" fill={a.dark} />
      <ellipse cx="55" cy="72" rx="1.5" ry="2" fill={a.dark} />
      {/* Cat eye shine */}
      <circle cx="49.5" cy="71.5" r="0.6" fill="white" />
      <circle cx="55.5" cy="71.5" r="0.6" fill="white" />
      {/* Cat nose */}
      <path d="M51.5 74 L52 74.8 L52.5 74 Z" fill={a.dark} />
      {/* Cat whiskers */}
      <line x1="45" y1="73" x2="38" y2="71" stroke={a.dark} strokeWidth="0.6" />
      <line x1="45" y1="74.5" x2="37" y2="75" stroke={a.dark} strokeWidth="0.6" />
      <line x1="45" y1="76" x2="38" y2="78" stroke={a.dark} strokeWidth="0.6" />
      <line x1="59" y1="73" x2="64" y2="71" stroke={a.dark} strokeWidth="0.6" />
      <line x1="59" y1="74.5" x2="65" y2="75" stroke={a.dark} strokeWidth="0.6" />
      {/* Cat curled tail */}
      <path d="M72 78 Q80 75 82 70 Q84 65 80 63" stroke={a.accent} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Cat tail tip highlight */}
      <path d="M81 65 Q83 63 80 63" stroke={a.hairAlt} strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Cat stripes */}
      <path d="M55 78 Q58 76 61 78" stroke={a.dark} strokeWidth="0.8" opacity="0.3" />
      <path d="M58 82 Q61 80 64 82" stroke={a.dark} strokeWidth="0.8" opacity="0.3" />

      {/* Small hearts */}
      <path d="M88 30 C88 28 90 26 92 28 C94 26 96 28 96 30 C96 33 92 36 92 36 C92 36 88 33 88 30Z" fill={a.accent} opacity="0.4" />
      <path d="M24 55 C24 54 25 53 26 54 C27 53 28 54 28 55 C28 56.5 26 58 26 58 C26 58 24 56.5 24 55Z" fill={a.accent} opacity="0.3" />

      {/* Sparkles */}
      <path d="M95 50 L96 48 L97 50 L99 51 L97 52 L96 54 L95 52 L93 51 Z" fill={a.clothAlt} opacity="0.5" />
    </svg>
  );
}

function DogLoverIcon({ accent = 0 }: IconProps) {
  const a = getA(accent);
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <circle cx="60" cy="60" r="60" fill={a.bg} />

      {/* Ground line */}
      <ellipse cx="60" cy="105" rx="50" ry="4" fill={a.dark} opacity="0.08" />

      {/* Ball on ground */}
      <circle cx="88" cy="98" r="5" fill={a.accent} />
      <path d="M85 96 Q88 93 91 96" stroke="white" strokeWidth="0.8" opacity="0.5" />
      <circle cx="89" cy="96" r="1" fill="white" opacity="0.3" />

      {/* Person - kneeling */}
      {/* Back leg (kneeling) */}
      <path d="M50 90 Q45 95 42 100 L50 102 Q52 96 55 92" fill={a.clothAlt} />
      {/* Front leg (kneeling) */}
      <path d="M58 88 L62 96 Q60 102 55 102 L50 102 Q52 96 55 92" fill={a.clothAlt} />
      {/* Shoe */}
      <rect x="40" y="99" width="14" height="5" rx="2.5" fill={a.dark} />

      {/* Person body - casual jacket */}
      <path d="M40 56 C40 50 48 46 55 46 C62 46 70 50 70 56 L72 88 C72 90 65 92 55 92 C45 92 38 90 38 88 Z" fill={a.cloth} />
      {/* Jacket opening/zipper */}
      <line x1="55" y1="50" x2="55" y2="88" stroke={a.dark} strokeWidth="0.8" opacity="0.2" />
      {/* Jacket collar */}
      <path d="M48 48 L52 54 L55 50 L58 54 L62 48" stroke={a.clothAlt} strokeWidth="1.5" fill="none" />
      {/* Jacket pockets */}
      <path d="M43 72 L50 72 L50 78 L43 78" stroke={a.clothAlt} strokeWidth="0.8" fill="none" opacity="0.4" />
      <path d="M60 72 L67 72 L67 78 L60 78" stroke={a.clothAlt} strokeWidth="0.8" fill="none" opacity="0.4" />

      {/* Arm reaching toward dog */}
      <path d="M70 58 Q76 62 78 68" stroke={a.skin} strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Jacket sleeve */}
      <path d="M70 56 Q74 58 76 62" stroke={a.cloth} strokeWidth="7" fill="none" strokeLinecap="round" />
      {/* Hand */}
      <circle cx="78" cy="70" r="3" fill={a.skin} />

      {/* Other arm resting */}
      <path d="M40 58 Q35 68 38 78" stroke={a.skin} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M40 56 Q36 64 37 70" stroke={a.cloth} strokeWidth="7" fill="none" strokeLinecap="round" />

      {/* Neck */}
      <rect x="52" y="40" width="7" height="7" rx="2" fill={a.skin} />

      {/* Face */}
      <circle cx="55" cy="34" r="13" fill={a.skin} />
      {/* Blush */}
      <circle cx="48" cy="36" r="2.5" fill={a.accent} opacity="0.3" />
      <circle cx="62" cy="36" r="2.5" fill={a.accent} opacity="0.3" />
      {/* Eyes */}
      <circle cx="50" cy="32" r="1.5" fill={a.dark} />
      <circle cx="60" cy="32" r="1.5" fill={a.dark} />
      <circle cx="50.5" cy="31.5" r="0.5" fill="white" />
      <circle cx="60.5" cy="31.5" r="0.5" fill="white" />
      {/* Smile */}
      <path d="M52 37 Q55 40 58 37" stroke={a.dark} strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Nose */}
      <ellipse cx="55" cy="34.5" rx="1" ry="0.6" fill={a.dark} opacity="0.3" />

      {/* Short wavy hair */}
      <path d="M42 30 Q42 20 48 18 Q52 16 55 16 Q58 16 62 18 Q68 20 68 30" fill={a.hair} />
      {/* Wavy hair texture */}
      <path d="M43 26 Q46 22 50 24 Q54 22 58 24 Q62 22 66 26" stroke={a.hairAlt} strokeWidth="1.5" fill="none" />
      <path d="M44 22 Q48 18 52 20 Q56 18 60 20 Q64 18 67 22" stroke={a.hairAlt} strokeWidth="1" fill="none" />
      {/* Hair sides */}
      <path d="M42 30 Q41 34 42 36" stroke={a.hair} strokeWidth="2.5" fill="none" />
      <path d="M68 30 Q69 34 68 36" stroke={a.hair} strokeWidth="2.5" fill="none" />

      {/* Dog sitting beside person */}
      {/* Dog body */}
      <ellipse cx="90" cy="85" rx="10" ry="12" fill={a.clothAlt} />
      {/* Dog chest */}
      <ellipse cx="88" cy="82" rx="7" ry="8" fill={a.cloth} opacity="0.6" />
      {/* Dog head */}
      <circle cx="86" cy="68" r="9" fill={a.clothAlt} />
      {/* Dog snout */}
      <ellipse cx="82" cy="72" rx="5" ry="3.5" fill={a.cloth} opacity="0.7" />
      {/* Dog floppy ears */}
      <path d="M80 62 Q74 58 72 64 Q73 70 78 68" fill={a.hair} opacity="0.7" />
      <path d="M92 62 Q98 58 100 64 Q99 70 94 68" fill={a.hair} opacity="0.7" />
      {/* Dog eyes looking up */}
      <circle cx="83" cy="66" r="2" fill={a.dark} />
      <circle cx="89" cy="66" r="2" fill={a.dark} />
      <circle cx="83.5" cy="65.5" r="0.7" fill="white" />
      <circle cx="89.5" cy="65.5" r="0.7" fill="white" />
      {/* Dog nose */}
      <ellipse cx="81" cy="70" rx="2" ry="1.5" fill={a.dark} />
      {/* Dog nose shine */}
      <circle cx="80.5" cy="69.5" r="0.5" fill="white" opacity="0.3" />
      {/* Dog tongue out */}
      <path d="M83 73 Q84 77 82 78" stroke={a.accent} strokeWidth="2" fill={a.accent} strokeLinecap="round" opacity="0.7" />
      {/* Dog mouth line */}
      <path d="M80 73 Q83 74 86 73" stroke={a.dark} strokeWidth="0.6" fill="none" />
      {/* Dog collar */}
      <rect x="82" y="76" width="10" height="3" rx="1" fill={a.accent} />
      <circle cx="87" cy="79.5" r="1.2" fill={a.dark} opacity="0.5" />
      {/* Dog front legs */}
      <rect x="83" y="92" width="4" height="10" rx="2" fill={a.clothAlt} />
      <rect x="90" y="92" width="4" height="10" rx="2" fill={a.clothAlt} />
      {/* Dog paws */}
      <ellipse cx="85" cy="102" rx="3" ry="1.5" fill={a.hair} opacity="0.5" />
      <ellipse cx="92" cy="102" rx="3" ry="1.5" fill={a.hair} opacity="0.5" />
      {/* Dog wagging tail */}
      <path d="M100 80 Q106 72 108 65 Q109 62 107 60" stroke={a.clothAlt} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Tail motion lines */}
      <path d="M109 62 L112 60" stroke={a.dark} strokeWidth="0.5" opacity="0.2" />
      <path d="M109 65 L113 64" stroke={a.dark} strokeWidth="0.5" opacity="0.2" />

      {/* Hearts showing love */}
      <path d="M72 52 C72 50 74 48 76 50 C78 48 80 50 80 52 C80 55 76 58 76 58 C76 58 72 55 72 52Z" fill={a.accent} opacity="0.4" />
      <path d="M78 42 C78 41 79 40 80 41 C81 40 82 41 82 42 C82 43.5 80 45 80 45 C80 45 78 43.5 78 42Z" fill={a.accent} opacity="0.3" />

      {/* Grass tufts */}
      <path d="M15 102 Q16 97 17 102" stroke={a.green} strokeWidth="1" fill="none" />
      <path d="M18 102 Q20 96 22 102" stroke={a.green} strokeWidth="1" fill="none" />
      <path d="M30 104 Q32 99 34 104" stroke={a.green} strokeWidth="1" fill="none" />
    </svg>
  );
}

function BirdLoverIcon({ accent = 0 }: IconProps) {
  const a = getA(accent);
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <circle cx="60" cy="60" r="60" fill={a.bg} />

      {/* Person body */}
      <path d="M35 60 C35 52 42 46 55 46 C68 46 75 52 75 60 L78 105 C78 107 70 108 55 108 C40 108 32 107 32 105 Z" fill={a.cloth} />
      {/* Shirt detail - V-neck */}
      <path d="M48 48 L55 56 L62 48" stroke={a.clothAlt} strokeWidth="1.5" fill="none" />
      {/* Shirt texture */}
      <path d="M40 65 Q55 68 70 65" stroke={a.clothAlt} strokeWidth="0.5" opacity="0.3" />
      <path d="M38 75 Q55 78 72 75" stroke={a.clothAlt} strokeWidth="0.5" opacity="0.3" />

      {/* Arms */}
      <path d="M35 60 Q28 72 30 85" stroke={a.skin} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M35 58 Q30 66 30 74" stroke={a.cloth} strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M75 60 Q82 68 80 75" stroke={a.skin} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M75 58 Q80 64 80 70" stroke={a.cloth} strokeWidth="7" fill="none" strokeLinecap="round" />

      {/* Neck */}
      <rect x="51" y="39" width="8" height="9" rx="2" fill={a.skin} />

      {/* Face */}
      <circle cx="55" cy="32" r="14" fill={a.skin} />
      {/* Blush */}
      <circle cx="47" cy="34" r="2.5" fill={a.accent} opacity="0.3" />
      <circle cx="63" cy="34" r="2.5" fill={a.accent} opacity="0.3" />
      {/* Eyes */}
      <circle cx="50" cy="30" r="1.5" fill={a.dark} />
      <circle cx="60" cy="30" r="1.5" fill={a.dark} />
      <circle cx="50.5" cy="29.5" r="0.5" fill="white" />
      <circle cx="60.5" cy="29.5" r="0.5" fill="white" />
      {/* Eyelashes */}
      <path d="M48 28 L47 26" stroke={a.dark} strokeWidth="0.5" />
      <path d="M50 28 L50 26" stroke={a.dark} strokeWidth="0.5" />
      <path d="M58 28 L57 26" stroke={a.dark} strokeWidth="0.5" />
      <path d="M60 28 L60 26" stroke={a.dark} strokeWidth="0.5" />
      {/* Smile */}
      <path d="M52 36 Q55 39 58 36" stroke={a.dark} strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Nose */}
      <ellipse cx="55" cy="33" rx="0.8" ry="0.5" fill={a.dark} opacity="0.2" />

      {/* Earring on visible ear */}
      <circle cx="42" cy="34" r="1.5" fill={a.accent} />
      <circle cx="42" cy="37" r="1" fill={a.accent} opacity="0.7" />

      {/* Long flowing hair */}
      <path d="M41 26 Q41 16 48 14 Q52 12 55 12 Q58 12 62 14 Q69 16 69 26" fill={a.hair} />
      {/* Hair flowing down left side */}
      <path d="M41 26 Q39 32 38 42 Q37 52 35 58 Q34 62 32 65" stroke={a.hair} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M42 28 Q40 36 39 46 Q38 54 37 60" stroke={a.hair} strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Hair flowing down right side */}
      <path d="M69 26 Q71 32 72 42 Q73 50 75 56" stroke={a.hair} strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Hair highlights */}
      <path d="M44 18 Q50 14 56 16" stroke={a.hairAlt} strokeWidth="1.5" fill="none" />
      <path d="M58 15 Q64 17 66 22" stroke={a.hairAlt} strokeWidth="1" fill="none" />
      {/* Hair strand details */}
      <path d="M40 34 Q38 44 36 54" stroke={a.hairAlt} strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M70 30 Q72 40 74 48" stroke={a.hairAlt} strokeWidth="1" fill="none" opacity="0.5" />

      {/* Parrot on right shoulder */}
      {/* Parrot body */}
      <ellipse cx="80" cy="50" rx="7" ry="9" fill={a.green} />
      {/* Parrot belly */}
      <ellipse cx="80" cy="52" rx="5" ry="6" fill={a.accent} opacity="0.5" />
      {/* Parrot head */}
      <circle cx="82" cy="40" r="6" fill={a.green} />
      {/* Parrot head highlight */}
      <circle cx="84" cy="38" r="4" fill={a.accent} opacity="0.3" />
      {/* Parrot eye */}
      <circle cx="84" cy="39" r="2" fill="white" />
      <circle cx="84.5" cy="39" r="1.2" fill={a.dark} />
      <circle cx="85" cy="38.5" r="0.4" fill="white" />
      {/* Parrot curved beak */}
      <path d="M88 40 Q92 40 90 43 Q88 44 87 42" fill={a.clothAlt} />
      <path d="M88 41.5 L90 42" stroke={a.dark} strokeWidth="0.4" />
      {/* Parrot claw gripping shoulder */}
      <path d="M77 57 L76 60 M78 57 L77 60 M79 57 L79 60" stroke={a.dark} strokeWidth="1" strokeLinecap="round" />
      {/* Parrot tail feathers */}
      <path d="M76 58 Q70 68 68 75" stroke={a.green} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M78 58 Q74 68 73 74" stroke={a.accent} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M80 58 Q78 66 78 72" stroke={a.hair} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* Parrot wing detail */}
      <path d="M75 46 Q72 50 74 55" stroke={a.dark} strokeWidth="0.8" fill="none" opacity="0.3" />
      <path d="M77 47 Q74 51 76 56" stroke={a.dark} strokeWidth="0.8" fill="none" opacity="0.3" />

      {/* Floating feathers */}
      <path d="M95 25 Q98 22 100 25 Q98 28 95 25 M97.5 22 L97.5 28" stroke={a.green} strokeWidth="0.8" fill={a.green} opacity="0.4" />
      <path d="M20 45 Q22 42 24 45 Q22 48 20 45 M22 42 L22 48" stroke={a.accent} strokeWidth="0.8" fill={a.accent} opacity="0.35" />
      <path d="M90 70 Q92 67 94 70 Q92 73 90 70 M92 67 L92 73" stroke={a.green} strokeWidth="0.6" fill={a.green} opacity="0.3" />

      {/* Sparkles */}
      <path d="M15 25 L16 22 L17 25 L20 26 L17 27 L16 30 L15 27 L12 26 Z" fill={a.accent} opacity="0.4" />
      <path d="M100 55 L101 53 L102 55 L104 56 L102 57 L101 59 L100 57 L98 56 Z" fill={a.clothAlt} opacity="0.4" />
      <path d="M25 70 L25.5 68.5 L26 70 L27.5 70.5 L26 71 L25.5 72.5 L25 71 L23.5 70.5 Z" fill={a.accent} opacity="0.3" />
    </svg>
  );
}

// ─── KIDS ────────────────────────────────────────────────────────────────────

function BabyIcon({ accent = 0 }: IconProps) {
  const a = getA(accent);
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <circle cx="60" cy="60" r="60" fill={a.bg} />

      {/* Stars around */}
      <path d="M20 20 L21 16 L22 20 L26 21 L22 22 L21 26 L20 22 L16 21 Z" fill={a.accent} opacity="0.4" />
      <path d="M95 15 L96 12 L97 15 L100 16 L97 17 L96 20 L95 17 L92 16 Z" fill={a.clothAlt} opacity="0.35" />
      <path d="M100 40 L101 38 L102 40 L104 41 L102 42 L101 44 L100 42 L98 41 Z" fill={a.accent} opacity="0.3" />

      {/* Moon */}
      <path d="M18 38 Q22 30 30 32 Q24 34 22 40 Q20 46 24 50 Q16 46 18 38Z" fill={a.clothAlt} opacity="0.3" />

      {/* Blanket/swaddle */}
      <path d="M35 62 Q30 60 28 70 Q26 85 30 95 Q35 105 60 108 Q85 105 90 95 Q94 85 92 70 Q90 60 85 62 Z" fill={a.cloth} />
      {/* Swaddle fold lines */}
      <path d="M38 68 Q60 72 82 68" stroke={a.clothAlt} strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M35 78 Q60 82 85 78" stroke={a.clothAlt} strokeWidth="1" fill="none" opacity="0.3" />
      {/* Swaddle inner pattern */}
      <path d="M42 74 Q48 76 54 74" stroke={a.clothAlt} strokeWidth="0.8" fill="none" opacity="0.2" />
      <path d="M56 74 Q62 76 68 74" stroke={a.clothAlt} strokeWidth="0.8" fill="none" opacity="0.2" />
      <path d="M48 82 Q54 84 60 82" stroke={a.clothAlt} strokeWidth="0.8" fill="none" opacity="0.2" />

      {/* Onesie body (visible above swaddle) */}
      <path d="M45 56 C45 50 50 48 60 48 C70 48 75 50 75 56 L76 66 Q60 70 44 66 Z" fill={a.accent} opacity="0.4" />
      {/* Onesie snap buttons */}
      <circle cx="57" cy="54" r="1" fill={a.dark} opacity="0.15" />
      <circle cx="60" cy="54" r="1" fill={a.dark} opacity="0.15" />
      <circle cx="63" cy="54" r="1" fill={a.dark} opacity="0.15" />

      {/* Small arms reaching up */}
      <path d="M44 58 Q38 50 34 42" stroke={a.skin} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M76 58 Q82 50 86 42" stroke={a.skin} strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Tiny hands */}
      <circle cx="33" cy="41" r="3.5" fill={a.skin} />
      <circle cx="87" cy="41" r="3.5" fill={a.skin} />
      {/* Fingers hint */}
      <path d="M31 39 L29 37" stroke={a.skin} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M33 38 L32 36" stroke={a.skin} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M89 39 L91 37" stroke={a.skin} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M87 38 L88 36" stroke={a.skin} strokeWidth="1.5" strokeLinecap="round" />

      {/* Baby face - big round head */}
      <circle cx="60" cy="34" r="18" fill={a.skin} />

      {/* Blush cheeks */}
      <circle cx="48" cy="38" r="4" fill={a.accent} opacity="0.3" />
      <circle cx="72" cy="38" r="4" fill={a.accent} opacity="0.3" />

      {/* Big baby eyes */}
      <circle cx="53" cy="32" r="3" fill="white" />
      <circle cx="67" cy="32" r="3" fill="white" />
      <circle cx="54" cy="32" r="2" fill={a.dark} />
      <circle cx="68" cy="32" r="2" fill={a.dark} />
      <circle cx="54.5" cy="31" r="0.8" fill="white" />
      <circle cx="68.5" cy="31" r="0.8" fill="white" />

      {/* Tiny eyebrows */}
      <path d="M50 28 Q53 26.5 56 28" stroke={a.dark} strokeWidth="0.8" fill="none" opacity="0.3" />
      <path d="M64 28 Q67 26.5 70 28" stroke={a.dark} strokeWidth="0.8" fill="none" opacity="0.3" />

      {/* Tiny nose */}
      <ellipse cx="60" cy="35.5" rx="1.2" ry="0.8" fill={a.dark} opacity="0.15" />

      {/* Small smile */}
      <path d="M57 39 Q60 41 63 39" stroke={a.dark} strokeWidth="0.8" fill="none" strokeLinecap="round" />

      {/* Pacifier */}
      <circle cx="60" cy="42" r="3.5" fill={a.clothAlt} opacity="0.6" />
      <circle cx="60" cy="42" r="2" fill={a.accent} opacity="0.7" />
      <rect x="58.5" y="39" width="3" height="2" rx="1" fill={a.clothAlt} opacity="0.7" />

      {/* Wispy hair */}
      <path d="M50 18 Q55 12 60 16 Q65 12 70 18" stroke={a.hair} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M48 20 Q52 14 58 17" stroke={a.hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M62 17 Q68 14 72 20" stroke={a.hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M55 16 Q58 13 62 15" stroke={a.hairAlt} strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* More stars */}
      <path d="M15 60 L16 58 L17 60 L19 61 L17 62 L16 64 L15 62 L13 61 Z" fill={a.accent} opacity="0.25" />
      <path d="M90 75 L91 73 L92 75 L94 76 L92 77 L91 79 L90 77 L88 76 Z" fill={a.clothAlt} opacity="0.2" />
      <circle cx="105" cy="55" r="1.5" fill={a.accent} opacity="0.2" />
      <circle cx="10" cy="78" r="1" fill={a.accent} opacity="0.2" />

      {/* Tiny sparkle stars near baby */}
      <path d="M38 25 L38.5 23.5 L39 25 L40.5 25.5 L39 26 L38.5 27.5 L38 26 L36.5 25.5 Z" fill={a.accent} opacity="0.35" />
      <path d="M82 25 L82.5 23.5 L83 25 L84.5 25.5 L83 26 L82.5 27.5 L82 26 L80.5 25.5 Z" fill={a.clothAlt} opacity="0.3" />
    </svg>
  );
}

function LittleGirlIcon({ accent = 0 }: IconProps) {
  const a = getA(accent);
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <circle cx="60" cy="60" r="60" fill={a.bg} />

      {/* Ground */}
      <ellipse cx="60" cy="108" rx="50" ry="4" fill={a.dark} opacity="0.06" />

      {/* Flower on ground */}
      <line x1="82" y1="105" x2="82" y2="95" stroke={a.green} strokeWidth="1.5" />
      <ellipse cx="80" cy="98" rx="3" ry="1.5" fill={a.green} opacity="0.5" />
      <circle cx="82" cy="92" r="3" fill={a.accent} opacity="0.5" />
      <circle cx="82" cy="92" r="1.2" fill={a.clothAlt} opacity="0.7" />
      <circle cx="79.5" cy="91" r="2" fill={a.accent} opacity="0.4" />
      <circle cx="84.5" cy="91" r="2" fill={a.accent} opacity="0.4" />
      <circle cx="80" cy="93.5" r="2" fill={a.accent} opacity="0.4" />
      <circle cx="84" cy="93.5" r="2" fill={a.accent} opacity="0.4" />

      {/* Legs */}
      <rect x="52" y="88" width="5" height="14" rx="2" fill={a.skin} />
      <rect x="63" y="88" width="5" height="14" rx="2" fill={a.skin} />
      {/* Small shoes */}
      <ellipse cx="54" cy="103" rx="5" ry="3" fill={a.accent} />
      <ellipse cx="66" cy="103" rx="5" ry="3" fill={a.accent} />
      {/* Shoe straps */}
      <path d="M51 101 Q54 99 57 101" stroke={a.dark} strokeWidth="0.6" fill="none" opacity="0.3" />
      <path d="M63 101 Q66 99 69 101" stroke={a.dark} strokeWidth="0.6" fill="none" opacity="0.3" />

      {/* Dress - trapezoid body */}
      <path d="M48 56 L42 90 Q60 94 78 90 L72 56 Z" fill={a.cloth} />
      {/* Dress detail - waistband */}
      <path d="M47 62 Q60 64 73 62" stroke={a.clothAlt} strokeWidth="2" fill="none" />
      {/* Dress pattern - small dots */}
      <circle cx="52" cy="70" r="1" fill={a.clothAlt} opacity="0.3" />
      <circle cx="60" cy="72" r="1" fill={a.clothAlt} opacity="0.3" />
      <circle cx="68" cy="70" r="1" fill={a.clothAlt} opacity="0.3" />
      <circle cx="56" cy="78" r="1" fill={a.clothAlt} opacity="0.3" />
      <circle cx="64" cy="80" r="1" fill={a.clothAlt} opacity="0.3" />
      <circle cx="50" cy="84" r="1" fill={a.clothAlt} opacity="0.3" />
      <circle cx="58" cy="86" r="1" fill={a.clothAlt} opacity="0.3" />
      <circle cx="70" cy="84" r="1" fill={a.clothAlt} opacity="0.3" />
      {/* Dress hem ruffle */}
      <path d="M42 90 Q46 92 50 90 Q54 92 58 90 Q62 92 66 90 Q70 92 74 90 Q78 92 78 90" stroke={a.clothAlt} strokeWidth="1" fill="none" />

      {/* Arms */}
      <path d="M48 58 Q40 65 35 72" stroke={a.skin} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      {/* Sleeve puff */}
      <circle cx="48" cy="58" r="4" fill={a.cloth} />

      {/* Right arm holding teddy */}
      <path d="M72 58 Q78 65 80 70" stroke={a.skin} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <circle cx="72" cy="58" r="4" fill={a.cloth} />
      {/* Hand */}
      <circle cx="80" cy="71" r="2.5" fill={a.skin} />

      {/* Teddy bear */}
      {/* Teddy body */}
      <ellipse cx="86" cy="78" rx="5" ry="7" fill={a.clothAlt} />
      {/* Teddy head */}
      <circle cx="86" cy="68" r="5" fill={a.clothAlt} />
      {/* Teddy ears */}
      <circle cx="82" cy="64" r="2.5" fill={a.clothAlt} />
      <circle cx="90" cy="64" r="2.5" fill={a.clothAlt} />
      <circle cx="82" cy="64" r="1.2" fill={a.accent} opacity="0.4" />
      <circle cx="90" cy="64" r="1.2" fill={a.accent} opacity="0.4" />
      {/* Teddy face */}
      <circle cx="84" cy="67" r="1" fill={a.dark} />
      <circle cx="88" cy="67" r="1" fill={a.dark} />
      <ellipse cx="86" cy="69.5" rx="1.5" ry="1" fill={a.accent} opacity="0.5" />
      <circle cx="86" cy="69" r="0.6" fill={a.dark} />
      {/* Teddy arms */}
      <path d="M81 74 Q78 76 79 78" stroke={a.clothAlt} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M91 74 Q94 76 93 78" stroke={a.clothAlt} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Teddy legs */}
      <ellipse cx="84" cy="85" rx="2.5" ry="2" fill={a.clothAlt} />
      <ellipse cx="88" cy="85" rx="2.5" ry="2" fill={a.clothAlt} />

      {/* Neck */}
      <rect x="57" y="46" width="6" height="6" rx="2" fill={a.skin} />

      {/* Face */}
      <circle cx="60" cy="38" r="13" fill={a.skin} />
      {/* Rosy cheeks */}
      <circle cx="51" cy="40" r="3" fill={a.accent} opacity="0.35" />
      <circle cx="69" cy="40" r="3" fill={a.accent} opacity="0.35" />
      {/* Eyes */}
      <circle cx="55" cy="36" r="2" fill={a.dark} />
      <circle cx="65" cy="36" r="2" fill={a.dark} />
      <circle cx="55.5" cy="35.5" r="0.7" fill="white" />
      <circle cx="65.5" cy="35.5" r="0.7" fill="white" />
      {/* Eyelashes */}
      <path d="M53 34 L52 32.5" stroke={a.dark} strokeWidth="0.6" />
      <path d="M55 33.5 L55 32" stroke={a.dark} strokeWidth="0.6" />
      <path d="M63 34 L62 32.5" stroke={a.dark} strokeWidth="0.6" />
      <path d="M65 33.5 L65 32" stroke={a.dark} strokeWidth="0.6" />
      {/* Smile */}
      <path d="M56 42 Q60 45 64 42" stroke={a.dark} strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Nose */}
      <ellipse cx="60" cy="38.5" rx="0.8" ry="0.5" fill={a.dark} opacity="0.15" />

      {/* Hair - pigtails */}
      {/* Main hair */}
      <path d="M47 32 Q47 22 52 20 Q56 18 60 18 Q64 18 68 20 Q73 22 73 32" fill={a.hair} />
      {/* Bangs */}
      <path d="M48 28 Q52 24 56 28 Q60 24 64 28 Q68 24 72 28" stroke={a.hairAlt} strokeWidth="1.5" fill="none" />
      {/* Left pigtail */}
      <circle cx="44" cy="30" r="6" fill={a.hair} />
      <path d="M44 36 Q42 44 40 50 Q39 54 40 56" stroke={a.hair} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M43 38 Q41 46 40 52" stroke={a.hairAlt} strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* Left hair tie */}
      <circle cx="44" cy="34" r="2" fill={a.accent} />
      {/* Right pigtail */}
      <circle cx="76" cy="30" r="6" fill={a.hair} />
      <path d="M76 36 Q78 44 80 50 Q81 54 80 56" stroke={a.hair} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M77 38 Q79 46 80 52" stroke={a.hairAlt} strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* Right hair tie */}
      <circle cx="76" cy="34" r="2" fill={a.accent} />

      {/* Small hearts */}
      <path d="M22 50 C22 49 23 48 24 49 C25 48 26 49 26 50 C26 51.5 24 53 24 53 C24 53 22 51.5 22 50Z" fill={a.accent} opacity="0.3" />

      {/* Sparkle */}
      <path d="M100 30 L101 28 L102 30 L104 31 L102 32 L101 34 L100 32 L98 31 Z" fill={a.clothAlt} opacity="0.35" />
    </svg>
  );
}

function LittleBoyIcon({ accent = 0 }: IconProps) {
  const a = getA(accent);
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <circle cx="60" cy="60" r="60" fill={a.bg} />

      {/* Ground */}
      <ellipse cx="60" cy="108" rx="50" ry="4" fill={a.dark} opacity="0.06" />

      {/* Grass tufts */}
      <path d="M18 106 Q20 100 22 106" stroke={a.green} strokeWidth="1.2" fill="none" />
      <path d="M23 106 Q24 101 25 106" stroke={a.green} strokeWidth="1" fill="none" />
      <path d="M90 107 Q92 102 94 107" stroke={a.green} strokeWidth="1.2" fill="none" />
      <path d="M95 107 Q96 103 97 107" stroke={a.green} strokeWidth="1" fill="none" />
      <path d="M50 108 Q52 104 54 108" stroke={a.green} strokeWidth="1" fill="none" />

      {/* Legs */}
      <rect x="50" y="86" width="6" height="16" rx="2" fill={a.skin} />
      <rect x="64" y="86" width="6" height="16" rx="2" fill={a.skin} />

      {/* Scuff on knee */}
      <ellipse cx="67" cy="92" rx="2" ry="1.5" fill={a.accent} opacity="0.3" />
      <line x1="66" y1="91.5" x2="68" y2="92.5" stroke={a.dark} strokeWidth="0.5" opacity="0.2" />

      {/* Sneakers */}
      <path d="M47 100 Q48 97 52 97 L56 97 Q60 97 60 100 Q60 104 53 104 Q47 104 47 100Z" fill={a.dark} />
      <path d="M60 100 Q61 97 65 97 L69 97 Q73 97 73 100 Q73 104 66 104 Q60 104 60 100Z" fill={a.dark} />
      {/* Sneaker details */}
      <path d="M49 100 Q53 99 57 100" stroke="white" strokeWidth="0.8" opacity="0.3" />
      <path d="M62 100 Q66 99 70 100" stroke="white" strokeWidth="0.8" opacity="0.3" />
      <circle cx="57" cy="99" r="0.5" fill="white" opacity="0.4" />
      <circle cx="70" cy="99" r="0.5" fill="white" opacity="0.4" />

      {/* T-shirt visible under overalls */}
      <path d="M45 52 C45 48 50 44 60 44 C70 44 75 48 75 52 L76 70 Q60 72 44 70 Z" fill={a.accent} opacity="0.5" />
      {/* T-shirt sleeves */}
      <path d="M45 50 Q38 52 36 58" stroke={a.accent} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M75 50 Q82 52 84 58" stroke={a.accent} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.5" />

      {/* Overalls */}
      <path d="M46 58 L42 90 Q60 94 78 90 L74 58 Z" fill={a.cloth} />
      {/* Overall bib */}
      <path d="M50 54 L50 66 Q60 68 70 66 L70 54 Z" fill={a.cloth} />
      {/* Overall straps */}
      <path d="M50 54 L52 44 Q54 42 56 44" stroke={a.cloth} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M70 54 L68 44 Q66 42 64 44" stroke={a.cloth} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Overall buttons */}
      <circle cx="51" cy="56" r="1.5" fill={a.clothAlt} />
      <circle cx="69" cy="56" r="1.5" fill={a.clothAlt} />
      {/* Overall pocket */}
      <path d="M55 62 L65 62 L65 68 Q60 69 55 68 Z" stroke={a.clothAlt} strokeWidth="0.8" fill="none" opacity="0.4" />
      {/* Overall seams */}
      <line x1="60" y1="68" x2="60" y2="90" stroke={a.clothAlt} strokeWidth="0.6" opacity="0.3" />

      {/* Arms */}
      <path d="M45 52 Q38 60 34 68" stroke={a.skin} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      {/* Left hand */}
      <circle cx="33" cy="69" r="2.5" fill={a.skin} />

      {/* Right arm holding toy truck */}
      <path d="M75 52 Q80 58 82 64" stroke={a.skin} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <circle cx="82" cy="65" r="2.5" fill={a.skin} />

      {/* Toy truck */}
      {/* Truck body */}
      <rect x="84" y="60" width="14" height="8" rx="1.5" fill={a.accent} />
      {/* Truck cab */}
      <rect x="96" y="56" width="8" height="12" rx="1.5" fill={a.accent} />
      {/* Truck window */}
      <rect x="98" y="58" width="4" height="4" rx="1" fill={a.cloth} opacity="0.7" />
      {/* Truck wheels */}
      <circle cx="88" cy="69" r="2.5" fill={a.dark} />
      <circle cx="100" cy="69" r="2.5" fill={a.dark} />
      <circle cx="88" cy="69" r="1" fill={a.clothAlt} opacity="0.5" />
      <circle cx="100" cy="69" r="1" fill={a.clothAlt} opacity="0.5" />
      {/* Truck bed lines */}
      <line x1="86" y1="62" x2="86" y2="66" stroke={a.dark} strokeWidth="0.5" opacity="0.3" />
      <line x1="90" y1="62" x2="90" y2="66" stroke={a.dark} strokeWidth="0.5" opacity="0.3" />

      {/* Neck */}
      <rect x="57" y="38" width="6" height="6" rx="2" fill={a.skin} />

      {/* Face */}
      <circle cx="60" cy="32" r="13" fill={a.skin} />
      {/* Blush */}
      <circle cx="51" cy="34" r="2.5" fill={a.accent} opacity="0.3" />
      <circle cx="69" cy="34" r="2.5" fill={a.accent} opacity="0.3" />
      {/* Eyes */}
      <circle cx="55" cy="30" r="1.8" fill={a.dark} />
      <circle cx="65" cy="30" r="1.8" fill={a.dark} />
      <circle cx="55.5" cy="29.5" r="0.6" fill="white" />
      <circle cx="65.5" cy="29.5" r="0.6" fill="white" />
      {/* Big grin */}
      <path d="M54 36 Q60 40 66 36" stroke={a.dark} strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Nose */}
      <ellipse cx="60" cy="32.5" rx="1" ry="0.6" fill={a.dark} opacity="0.15" />

      {/* Messy spiky hair */}
      <path d="M47 26 Q47 18 52 16 Q56 14 60 14 Q64 14 68 16 Q73 18 73 26" fill={a.hair} />
      {/* Spiky top */}
      <path d="M48 20 L46 12 L52 18" fill={a.hair} />
      <path d="M52 18 L54 10 L58 17" fill={a.hair} />
      <path d="M56 17 L60 9 L64 17" fill={a.hair} />
      <path d="M62 17 L66 10 L68 18" fill={a.hair} />
      <path d="M68 18 L74 12 L72 20" fill={a.hair} />
      {/* Hair highlight streaks */}
      <path d="M50 16 L52 12" stroke={a.hairAlt} strokeWidth="1" opacity="0.6" />
      <path d="M58 14 L60 10" stroke={a.hairAlt} strokeWidth="1" opacity="0.6" />
      <path d="M66 14 L68 11" stroke={a.hairAlt} strokeWidth="1" opacity="0.6" />
      {/* Side hair */}
      <path d="M47 26 Q46 30 47 32" stroke={a.hair} strokeWidth="2" fill="none" />
      <path d="M73 26 Q74 30 73 32" stroke={a.hair} strokeWidth="2" fill="none" />

      {/* Small sparkle */}
      <path d="M28 30 L29 28 L30 30 L32 31 L30 32 L29 34 L28 32 L26 31 Z" fill={a.accent} opacity="0.3" />
    </svg>
  );
}

// ─── COLLEGE & SCHOOL ────────────────────────────────────────────────────────

function CollegeFriendsIcon({ accent = 0 }: IconProps) {
  const a = getA(accent);
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <circle cx="60" cy="60" r="60" fill={a.bg} />

      {/* Ground shadow */}
      <ellipse cx="60" cy="110" rx="52" ry="4" fill={a.dark} opacity="0.06" />

      {/* === Person 1 (left) - bun hair, hoodie === */}
      {/* Body */}
      <path d="M18 64 C18 58 24 54 32 54 C40 54 46 58 46 64 L48 108 Q32 110 16 108 Z" fill={a.cloth} />
      {/* Hoodie pouch pocket */}
      <path d="M22 82 Q32 84 42 82 L42 90 Q32 92 22 90 Z" stroke={a.clothAlt} strokeWidth="0.8" fill="none" opacity="0.3" />
      {/* Hoodie strings */}
      <line x1="29" y1="58" x2="28" y2="66" stroke={a.clothAlt} strokeWidth="0.8" opacity="0.4" />
      <line x1="35" y1="58" x2="36" y2="66" stroke={a.clothAlt} strokeWidth="0.8" opacity="0.4" />
      {/* Hoodie hood outline */}
      <path d="M24 56 Q32 52 40 56" stroke={a.clothAlt} strokeWidth="1.5" fill="none" />

      {/* Backpack (rectangle on back) */}
      <rect x="12" y="60" width="10" height="16" rx="3" fill={a.clothAlt} />
      <path d="M14 60 Q17 57 20 60" stroke={a.dark} strokeWidth="0.8" fill="none" opacity="0.3" />
      <rect x="15" y="64" width="4" height="2" rx="0.5" fill={a.dark} opacity="0.15" />

      {/* Arm */}
      <path d="M46 64 Q50 72 48 80" stroke={a.skin} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M46 62 Q48 68 48 72" stroke={a.cloth} strokeWidth="6" fill="none" strokeLinecap="round" />

      {/* Books under arm */}
      <rect x="46" y="74" width="8" height="2" rx="0.5" fill={a.accent} />
      <rect x="46" y="76.5" width="8" height="2" rx="0.5" fill={a.clothAlt} />
      <rect x="46" y="79" width="8" height="2" rx="0.5" fill={a.green} opacity="0.5" />

      {/* Neck */}
      <rect x="29" y="48" width="6" height="6" rx="2" fill={a.skin} />
      {/* Face */}
      <circle cx="32" cy="42" r="11" fill={a.skin} />
      {/* Features */}
      <circle cx="28" cy="40" r="1.2" fill={a.dark} />
      <circle cx="36" cy="40" r="1.2" fill={a.dark} />
      <circle cx="28.4" cy="39.6" r="0.4" fill="white" />
      <circle cx="36.4" cy="39.6" r="0.4" fill="white" />
      <path d="M29 45 Q32 47 35 45" stroke={a.dark} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <circle cx="26" cy="43" r="2" fill={a.accent} opacity="0.25" />
      <circle cx="38" cy="43" r="2" fill={a.accent} opacity="0.25" />

      {/* Bun hair */}
      <path d="M21 38 Q21 28 27 26 Q30 24 32 24 Q34 24 37 26 Q43 28 43 38" fill={a.hair} />
      <circle cx="32" cy="23" r="5" fill={a.hair} />
      <path d="M30 20 Q32 18 34 20" stroke={a.hairAlt} strokeWidth="1" fill="none" />

      {/* === Person 2 (center) - short hair, jacket, coffee === */}
      {/* Body */}
      <path d="M42 60 C42 54 50 50 60 50 C70 50 78 54 78 60 L80 108 Q60 112 40 108 Z" fill={a.accent} opacity="0.6" />
      {/* Jacket front */}
      <line x1="60" y1="54" x2="60" y2="106" stroke={a.dark} strokeWidth="0.5" opacity="0.15" />
      {/* Jacket collar */}
      <path d="M52 52 L56 58 L60 54 L64 58 L68 52" stroke={a.clothAlt} strokeWidth="1.2" fill="none" />

      {/* Arms */}
      <path d="M42 62 Q36 70 34 78" stroke={a.skin} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M42 60 Q38 66 36 72" stroke={a.accent} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.6" />

      {/* Right arm holding coffee */}
      <path d="M78 62 Q84 68 86 74" stroke={a.skin} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M78 60 Q82 64 84 68" stroke={a.accent} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* Hand */}
      <circle cx="86" cy="75" r="2.5" fill={a.skin} />

      {/* Coffee cup */}
      <rect x="83" y="72" width="7" height="10" rx="1.5" fill={a.cloth} />
      <rect x="82" y="72" width="9" height="2.5" rx="1" fill={a.clothAlt} />
      {/* Coffee cup sleeve */}
      <rect x="83.5" y="76" width="6" height="3" rx="0.5" fill={a.clothAlt} opacity="0.5" />
      {/* Steam */}
      <path d="M85 70 Q86 68 85 66" stroke={a.dark} strokeWidth="0.5" opacity="0.2" />
      <path d="M87 70 Q88 67 87 65" stroke={a.dark} strokeWidth="0.5" opacity="0.2" />
      <path d="M89 71 Q90 68 89 66" stroke={a.dark} strokeWidth="0.5" opacity="0.15" />

      {/* Neck */}
      <rect x="57" y="44" width="6" height="6" rx="2" fill={a.skin} />
      {/* Face */}
      <circle cx="60" cy="38" r="11" fill={a.skin} />
      {/* Features */}
      <circle cx="56" cy="36" r="1.2" fill={a.dark} />
      <circle cx="64" cy="36" r="1.2" fill={a.dark} />
      <circle cx="56.4" cy="35.6" r="0.4" fill="white" />
      <circle cx="64.4" cy="35.6" r="0.4" fill="white" />
      <path d="M57 42 Q60 44 63 42" stroke={a.dark} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <circle cx="53" cy="39" r="2" fill={a.accent} opacity="0.25" />
      <circle cx="67" cy="39" r="2" fill={a.accent} opacity="0.25" />

      {/* Short hair */}
      <path d="M49 34 Q49 26 54 24 Q57 22 60 22 Q63 22 66 24 Q71 26 71 34" fill={a.hair} />
      <path d="M50 30 Q54 26 58 28 Q62 26 66 28 Q70 26 70 30" stroke={a.hairAlt} strokeWidth="1" fill="none" />

      {/* === Person 3 (right) - ponytail, hoodie === */}
      {/* Body */}
      <path d="M72 64 C72 58 78 54 88 54 C98 54 104 58 104 64 L106 108 Q88 110 70 108 Z" fill={a.green} opacity="0.5" />
      {/* Hoodie detail */}
      <path d="M80 56 Q88 52 96 56" stroke={a.dark} strokeWidth="1" fill="none" opacity="0.2" />

      {/* Backpack */}
      <rect x="100" y="60" width="10" height="16" rx="3" fill={a.clothAlt} />
      <path d="M102 60 Q105 57 108 60" stroke={a.dark} strokeWidth="0.8" fill="none" opacity="0.3" />

      {/* Arm */}
      <path d="M72 66 Q68 74 70 82" stroke={a.skin} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M72 64 Q70 70 70 74" stroke={a.green} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.5" />

      {/* Neck */}
      <rect x="85" y="48" width="6" height="6" rx="2" fill={a.skin} />
      {/* Face */}
      <circle cx="88" cy="42" r="11" fill={a.skin} />
      {/* Features */}
      <circle cx="84" cy="40" r="1.2" fill={a.dark} />
      <circle cx="92" cy="40" r="1.2" fill={a.dark} />
      <circle cx="84.4" cy="39.6" r="0.4" fill="white" />
      <circle cx="92.4" cy="39.6" r="0.4" fill="white" />
      <path d="M85 45 Q88 47 91 45" stroke={a.dark} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <circle cx="82" cy="43" r="2" fill={a.accent} opacity="0.25" />
      <circle cx="94" cy="43" r="2" fill={a.accent} opacity="0.25" />

      {/* Ponytail hair */}
      <path d="M77 38 Q77 28 82 26 Q85 24 88 24 Q91 24 94 26 Q99 28 99 38" fill={a.hair} />
      {/* Ponytail flowing back */}
      <path d="M97 30 Q102 28 106 32 Q110 38 108 46 Q106 52 104 56" stroke={a.hair} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M98 32 Q102 30 105 34 Q108 40 106 48" stroke={a.hairAlt} strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* Hair tie */}
      <circle cx="98" cy="30" r="1.5" fill={a.accent} />

      {/* Sparkles between friends */}
      <path d="M50 18 L51 16 L52 18 L54 19 L52 20 L51 22 L50 20 L48 19 Z" fill={a.accent} opacity="0.35" />
      <path d="M70 14 L71 12 L72 14 L74 15 L72 16 L71 18 L70 16 L68 15 Z" fill={a.clothAlt} opacity="0.3" />

      {/* Heart */}
      <path d="M58 12 C58 10 60 8 62 10 C64 8 66 10 66 12 C66 15 62 18 62 18 C62 18 58 15 58 12Z" fill={a.accent} opacity="0.3" />
    </svg>
  );
}

function SchoolBuddiesIcon({ accent = 0 }: IconProps) {
  const a = getA(accent);
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <circle cx="60" cy="60" r="60" fill={a.bg} />

      {/* Ground */}
      <ellipse cx="60" cy="108" rx="50" ry="4" fill={a.dark} opacity="0.06" />

      {/* === Kid 1 (left) - with glasses === */}
      {/* Legs */}
      <rect x="30" y="90" width="5" height="14" rx="2" fill={a.skin} />
      <rect x="40" y="90" width="5" height="14" rx="2" fill={a.skin} />
      {/* Shoes */}
      <ellipse cx="32" cy="105" rx="5" ry="2.5" fill={a.dark} />
      <ellipse cx="43" cy="105" rx="5" ry="2.5" fill={a.dark} />

      {/* Body - shirt */}
      <path d="M25 58 C25 52 30 48 38 48 C46 48 51 52 51 58 L53 92 Q38 95 23 92 Z" fill={a.cloth} />
      {/* Shirt collar */}
      <path d="M32 50 L36 54 L38 50 L40 54 L44 50" stroke={a.clothAlt} strokeWidth="1" fill="none" />
      {/* Shirt pocket */}
      <rect x="28" y="60" width="6" height="5" rx="1" stroke={a.clothAlt} strokeWidth="0.6" fill="none" opacity="0.4" />
      {/* Pencil in pocket */}
      <line x1="30" y1="56" x2="31" y2="64" stroke={a.accent} strokeWidth="1" />
      <path d="M30 56 L29.5 54 L30.5 54 Z" fill={a.dark} opacity="0.4" />

      {/* School bag on back */}
      <rect x="16" y="54" width="12" height="20" rx="3" fill={a.accent} />
      <path d="M19 54 Q22 50 25 54" stroke={a.dark} strokeWidth="1" fill="none" opacity="0.3" />
      {/* Bag zipper */}
      <line x1="22" y1="58" x2="22" y2="66" stroke={a.dark} strokeWidth="0.6" opacity="0.3" />
      {/* Bag pocket */}
      <rect x="19" y="66" width="6" height="4" rx="1" stroke={a.dark} strokeWidth="0.5" fill="none" opacity="0.2" />
      {/* Bag strap */}
      <path d="M25 56 Q28 54 28 58" stroke={a.dark} strokeWidth="1.5" fill="none" opacity="0.3" />

      {/* Arms */}
      <path d="M51 58 Q56 66 54 76" stroke={a.skin} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M51 56 Q54 62 54 66" stroke={a.cloth} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M25 58 Q20 66 22 76" stroke={a.skin} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M25 56 Q22 62 22 66" stroke={a.cloth} strokeWidth="6" fill="none" strokeLinecap="round" />

      {/* Notebook in hand */}
      <rect x="52" y="72" width="8" height="10" rx="1" fill={a.cloth} />
      <line x1="54" y1="74" x2="58" y2="74" stroke={a.dark} strokeWidth="0.4" opacity="0.3" />
      <line x1="54" y1="76" x2="58" y2="76" stroke={a.dark} strokeWidth="0.4" opacity="0.3" />
      <line x1="54" y1="78" x2="57" y2="78" stroke={a.dark} strokeWidth="0.4" opacity="0.3" />
      {/* Spiral binding */}
      <circle cx="52.5" cy="74" r="0.5" fill={a.dark} opacity="0.3" />
      <circle cx="52.5" cy="76" r="0.5" fill={a.dark} opacity="0.3" />
      <circle cx="52.5" cy="78" r="0.5" fill={a.dark} opacity="0.3" />
      <circle cx="52.5" cy="80" r="0.5" fill={a.dark} opacity="0.3" />

      {/* Neck */}
      <rect x="35" y="42" width="6" height="6" rx="2" fill={a.skin} />
      {/* Face */}
      <circle cx="38" cy="34" r="12" fill={a.skin} />
      {/* Blush */}
      <circle cx="30" cy="36" r="2" fill={a.accent} opacity="0.3" />
      <circle cx="46" cy="36" r="2" fill={a.accent} opacity="0.3" />
      {/* Eyes */}
      <circle cx="33" cy="32" r="1.3" fill={a.dark} />
      <circle cx="43" cy="32" r="1.3" fill={a.dark} />
      <circle cx="33.4" cy="31.6" r="0.4" fill="white" />
      <circle cx="43.4" cy="31.6" r="0.4" fill="white" />
      {/* Glasses */}
      <circle cx="33" cy="32" r="4.5" stroke={a.dark} strokeWidth="1" fill="none" />
      <circle cx="43" cy="32" r="4.5" stroke={a.dark} strokeWidth="1" fill="none" />
      <path d="M37.5 32 L38.5 32" stroke={a.dark} strokeWidth="1" />
      <path d="M28.5 31 L26 29" stroke={a.dark} strokeWidth="1" />
      <path d="M47.5 31 L50 29" stroke={a.dark} strokeWidth="1" />
      {/* Smile */}
      <path d="M34 38 Q38 40 42 38" stroke={a.dark} strokeWidth="0.8" fill="none" strokeLinecap="round" />

      {/* Hair - neat short */}
      <path d="M26 30 Q26 20 32 18 Q36 16 38 16 Q40 16 44 18 Q50 20 50 30" fill={a.hair} />
      <path d="M27 26 Q32 22 38 24 Q44 22 49 26" stroke={a.hairAlt} strokeWidth="1" fill="none" />

      {/* === Kid 2 (right) - with cap === */}
      {/* Legs */}
      <rect x="72" y="90" width="5" height="14" rx="2" fill={a.skin} />
      <rect x="82" y="90" width="5" height="14" rx="2" fill={a.skin} />
      {/* Shoes */}
      <ellipse cx="74" cy="105" rx="5" ry="2.5" fill={a.accent} />
      <ellipse cx="85" cy="105" rx="5" ry="2.5" fill={a.accent} />

      {/* Body */}
      <path d="M67 58 C67 52 72 48 80 48 C88 48 93 52 93 58 L95 92 Q80 95 65 92 Z" fill={a.green} opacity="0.5" />
      {/* Shirt graphic - simple star */}
      <path d="M80 65 L81 62 L82 65 L85 66 L82 67 L81 70 L80 67 L77 66 Z" fill={a.cloth} opacity="0.4" />

      {/* School bag */}
      <rect x="92" y="54" width="12" height="20" rx="3" fill={a.clothAlt} />
      <path d="M95 54 Q98 50 101 54" stroke={a.dark} strokeWidth="1" fill="none" opacity="0.3" />
      {/* Bag pocket */}
      <rect x="95" y="62" width="6" height="4" rx="1" stroke={a.dark} strokeWidth="0.5" fill="none" opacity="0.2" />

      {/* Arms */}
      <path d="M67 60 Q62 68 64 78" stroke={a.skin} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M67 58 Q64 64 64 68" stroke={a.green} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M93 60 Q98 68 96 76" stroke={a.skin} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M93 58 Q96 64 96 68" stroke={a.green} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.5" />

      {/* Books in hand */}
      <rect x="62" y="74" width="6" height="8" rx="1" fill={a.accent} opacity="0.6" />
      <rect x="60" y="75" width="6" height="8" rx="1" fill={a.cloth} />

      {/* Pencils sticking out of bag */}
      <line x1="96" y1="52" x2="97" y2="48" stroke={a.accent} strokeWidth="1.2" />
      <line x1="99" y1="52" x2="100" y2="47" stroke={a.green} strokeWidth="1.2" opacity="0.6" />

      {/* Neck */}
      <rect x="77" y="42" width="6" height="6" rx="2" fill={a.skin} />
      {/* Face */}
      <circle cx="80" cy="34" r="12" fill={a.skin} />
      {/* Blush */}
      <circle cx="73" cy="36" r="2" fill={a.accent} opacity="0.3" />
      <circle cx="87" cy="36" r="2" fill={a.accent} opacity="0.3" />
      {/* Eyes */}
      <circle cx="76" cy="33" r="1.3" fill={a.dark} />
      <circle cx="84" cy="33" r="1.3" fill={a.dark} />
      <circle cx="76.4" cy="32.6" r="0.4" fill="white" />
      <circle cx="84.4" cy="32.6" r="0.4" fill="white" />
      {/* Big grin */}
      <path d="M76 38 Q80 41 84 38" stroke={a.dark} strokeWidth="0.8" fill="none" strokeLinecap="round" />

      {/* Hair under cap */}
      <path d="M68 32 Q68 24 74 22 Q78 20 80 20 Q82 20 86 22 Q92 24 92 32" fill={a.hair} />
      {/* Cap */}
      <path d="M68 28 Q68 20 80 18 Q92 20 92 28 L92 30 Q80 28 68 30 Z" fill={a.accent} />
      {/* Cap brim */}
      <path d="M90 28 Q98 26 102 28 Q98 30 90 30" fill={a.accent} />
      {/* Cap button */}
      <circle cx="80" cy="18" r="1.5" fill={a.dark} opacity="0.2" />
      {/* Cap detail line */}
      <path d="M72 26 Q80 24 88 26" stroke={a.dark} strokeWidth="0.5" opacity="0.15" />

      {/* Sparkles */}
      <path d="M58 20 L59 18 L60 20 L62 21 L60 22 L59 24 L58 22 L56 21 Z" fill={a.accent} opacity="0.3" />

      {/* Heart between them */}
      <path d="M56 42 C56 40 58 38 60 40 C62 38 64 40 64 42 C64 45 60 48 60 48 C60 48 56 45 56 42Z" fill={a.accent} opacity="0.25" />
    </svg>
  );
}

function StudyGroupIcon({ accent = 0 }: IconProps) {
  const a = getA(accent);
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <circle cx="60" cy="60" r="60" fill={a.bg} />

      {/* Lamp overhead */}
      <rect x="57" y="4" width="6" height="14" rx="1" fill={a.dark} opacity="0.2" />
      <path d="M48 18 L72 18 L68 28 L52 28 Z" fill={a.clothAlt} opacity="0.5" />
      {/* Light cone */}
      <path d="M52 28 L40 65 L80 65 L68 28 Z" fill={a.accent} opacity="0.06" />
      {/* Lamp bulb glow */}
      <circle cx="60" cy="24" r="3" fill={a.accent} opacity="0.3" />

      {/* Table */}
      <rect x="18" y="65" width="84" height="5" rx="2" fill={a.clothAlt} />
      {/* Table legs */}
      <rect x="22" y="70" width="4" height="25" rx="1" fill={a.clothAlt} opacity="0.7" />
      <rect x="94" y="70" width="4" height="25" rx="1" fill={a.clothAlt} opacity="0.7" />
      {/* Table surface shine */}
      <path d="M24 66 L96 66" stroke={a.cloth} strokeWidth="0.5" opacity="0.4" />

      {/* === Items on table === */}

      {/* Books stacked (left side) */}
      <rect x="24" y="58" width="12" height="3" rx="0.5" fill={a.accent} />
      <rect x="25" y="55" width="10" height="3" rx="0.5" fill={a.green} opacity="0.6" />
      <rect x="24" y="52" width="11" height="3" rx="0.5" fill={a.cloth} />

      {/* Laptop (center) */}
      <rect x="48" y="52" width="24" height="14" rx="2" fill={a.dark} opacity="0.7" />
      {/* Laptop screen */}
      <rect x="50" y="54" width="20" height="10" rx="1" fill={a.cloth} opacity="0.5" />
      {/* Screen glow */}
      <rect x="52" y="56" width="16" height="6" rx="0.5" fill={a.accent} opacity="0.15" />
      {/* Text lines on screen */}
      <line x1="53" y1="57" x2="63" y2="57" stroke={a.dark} strokeWidth="0.5" opacity="0.2" />
      <line x1="53" y1="59" x2="60" y2="59" stroke={a.dark} strokeWidth="0.5" opacity="0.2" />
      <line x1="53" y1="61" x2="65" y2="61" stroke={a.dark} strokeWidth="0.5" opacity="0.2" />
      {/* Laptop keyboard area hint */}
      <path d="M48 66 L72 66" stroke={a.dark} strokeWidth="0.3" opacity="0.2" />

      {/* Coffee cups on table */}
      <rect x="78" y="58" width="5" height="7" rx="1" fill={a.cloth} />
      <rect x="77" y="58" width="7" height="2" rx="0.5" fill={a.clothAlt} />
      {/* Steam */}
      <path d="M79 56 Q80 54 79 52" stroke={a.dark} strokeWidth="0.4" opacity="0.15" />
      <path d="M81 56 Q82 53 81 51" stroke={a.dark} strokeWidth="0.4" opacity="0.15" />

      <rect x="40" y="59" width="4" height="6" rx="1" fill={a.accent} opacity="0.5" />
      <rect x="39" y="59" width="6" height="1.5" rx="0.5" fill={a.clothAlt} />

      {/* Open notebook */}
      <rect x="86" y="56" width="10" height="8" rx="1" fill={a.cloth} />
      <line x1="91" y1="56" x2="91" y2="64" stroke={a.dark} strokeWidth="0.3" opacity="0.2" />
      <line x1="88" y1="58" x2="90" y2="58" stroke={a.dark} strokeWidth="0.3" opacity="0.2" />
      <line x1="88" y1="60" x2="90" y2="60" stroke={a.dark} strokeWidth="0.3" opacity="0.2" />
      {/* Pen */}
      <line x1="94" y1="55" x2="98" y2="60" stroke={a.accent} strokeWidth="1" strokeLinecap="round" />

      {/* === Person 1 (left) - sitting, resting chin on hand === */}
      {/* Body */}
      <path d="M14 68 C14 62 20 58 28 58 C36 58 40 62 40 68 L40 100 Q28 102 16 100 Z" fill={a.cloth} />

      {/* Arm on table, chin resting */}
      <path d="M36 62 Q40 58 42 54" stroke={a.skin} strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Hand under chin */}
      <circle cx="42" cy="53" r="2.5" fill={a.skin} />
      {/* Other arm on table */}
      <path d="M18 62 Q16 58 20 56" stroke={a.skin} strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* Neck */}
      <rect x="25" y="46" width="6" height="6" rx="2" fill={a.skin} />
      {/* Face */}
      <circle cx="28" cy="40" r="10" fill={a.skin} />
      {/* Features */}
      <circle cx="24" cy="38" r="1.2" fill={a.dark} />
      <circle cx="32" cy="38" r="1.2" fill={a.dark} />
      <circle cx="24.4" cy="37.6" r="0.4" fill="white" />
      <circle cx="32.4" cy="37.6" r="0.4" fill="white" />
      <path d="M25 43 Q28 45 31 43" stroke={a.dark} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <circle cx="22" cy="40" r="1.8" fill={a.accent} opacity="0.25" />
      <circle cx="34" cy="40" r="1.8" fill={a.accent} opacity="0.25" />
      {/* Sleepy/studying expression - slightly droopy eyes */}
      <path d="M22 36 L26 36" stroke={a.dark} strokeWidth="0.5" opacity="0.3" />
      <path d="M30 36 L34 36" stroke={a.dark} strokeWidth="0.5" opacity="0.3" />

      {/* Hair - wavy */}
      <path d="M18 36 Q18 26 24 24 Q26 22 28 22 Q30 22 32 24 Q38 26 38 36" fill={a.hair} />
      <path d="M19 32 Q22 28 26 30 Q30 28 34 30 Q37 28 37 32" stroke={a.hairAlt} strokeWidth="1" fill="none" />
      <path d="M18 36 Q17 40 18 44" stroke={a.hair} strokeWidth="2" fill="none" />
      <path d="M38 36 Q39 40 38 44" stroke={a.hair} strokeWidth="2" fill="none" />

      {/* === Person 2 (center) - looking at laptop === */}
      {/* Body */}
      <path d="M46 68 C46 62 52 58 60 58 C68 58 74 62 74 68 L74 100 Q60 102 46 100 Z" fill={a.accent} opacity="0.5" />
      {/* Collar */}
      <path d="M54 60 L58 64 L60 60 L62 64 L66 60" stroke={a.dark} strokeWidth="0.8" fill="none" opacity="0.2" />

      {/* Arms on table */}
      <path d="M48 62 Q46 58 48 54" stroke={a.skin} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M72 62 Q74 58 72 54" stroke={a.skin} strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Hands near laptop */}
      <circle cx="48" cy="53" r="2" fill={a.skin} />
      <circle cx="72" cy="53" r="2" fill={a.skin} />

      {/* Neck */}
      <rect x="57" y="46" width="6" height="6" rx="2" fill={a.skin} />
      {/* Face */}
      <circle cx="60" cy="40" r="10" fill={a.skin} />
      {/* Features */}
      <circle cx="56" cy="38" r="1.2" fill={a.dark} />
      <circle cx="64" cy="38" r="1.2" fill={a.dark} />
      <circle cx="56.4" cy="37.6" r="0.4" fill="white" />
      <circle cx="64.4" cy="37.6" r="0.4" fill="white" />
      <path d="M57 43 Q60 45 63 43" stroke={a.dark} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <circle cx="53" cy="40" r="1.8" fill={a.accent} opacity="0.25" />
      <circle cx="67" cy="40" r="1.8" fill={a.accent} opacity="0.25" />

      {/* Hair - short neat */}
      <path d="M50 36 Q50 26 55 24 Q58 22 60 22 Q62 22 65 24 Q70 26 70 36" fill={a.hair} />
      <path d="M51 30 Q56 26 60 28 Q64 26 69 30" stroke={a.hairAlt} strokeWidth="1" fill="none" />

      {/* === Person 3 (right) - writing in notebook === */}
      {/* Body */}
      <path d="M78 68 C78 62 84 58 92 58 C100 58 106 62 106 68 L106 100 Q92 102 78 100 Z" fill={a.green} opacity="0.4" />

      {/* Arms */}
      <path d="M82 62 Q80 58 82 54" stroke={a.skin} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M104 62 Q106 56 102 52" stroke={a.skin} strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Hand holding pen */}
      <circle cx="102" cy="52" r="2" fill={a.skin} />

      {/* Neck */}
      <rect x="89" y="46" width="6" height="6" rx="2" fill={a.skin} />
      {/* Face */}
      <circle cx="92" cy="40" r="10" fill={a.skin} />
      {/* Features */}
      <circle cx="88" cy="38" r="1.2" fill={a.dark} />
      <circle cx="96" cy="38" r="1.2" fill={a.dark} />
      <circle cx="88.4" cy="37.6" r="0.4" fill="white" />
      <circle cx="96.4" cy="37.6" r="0.4" fill="white" />
      <path d="M89 43 Q92 45 95 43" stroke={a.dark} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <circle cx="86" cy="40" r="1.8" fill={a.accent} opacity="0.25" />
      <circle cx="98" cy="40" r="1.8" fill={a.accent} opacity="0.25" />

      {/* Hair - bun */}
      <path d="M82 36 Q82 26 87 24 Q90 22 92 22 Q94 22 97 24 Q102 26 102 36" fill={a.hair} />
      <circle cx="92" cy="20" r="5" fill={a.hair} />
      <path d="M90 17 Q92 15 94 17" stroke={a.hairAlt} strokeWidth="1" fill="none" />

      {/* Sparkles near lamp */}
      <path d="M44 16 L45 14 L46 16 L48 17 L46 18 L45 20 L44 18 L42 17 Z" fill={a.accent} opacity="0.25" />
      <path d="M76 14 L77 12 L78 14 L80 15 L78 16 L77 18 L76 16 L74 15 Z" fill={a.clothAlt} opacity="0.2" />

      {/* Small thought bubbles / focus dots */}
      <circle cx="10" cy="50" r="1.5" fill={a.accent} opacity="0.15" />
      <circle cx="110" cy="48" r="1.5" fill={a.accent} opacity="0.15" />
    </svg>
  );
}


// === Icons from _icons_part2.tsx ===
function FriendsTrioIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>
      {/* Sparkles */}
      <path d="M20 30l2-5 2 5-5-2 5 0z" fill={a.accent} opacity="0.6"/>
      <path d="M95 25l1.5-4 1.5 4-4-1.5 4 0z" fill={a.accent} opacity="0.5"/>
      <path d="M75 20l1-3 1 3-3-1 3 0z" fill={a.hairAlt} opacity="0.4"/>
      <circle cx="105" cy="45" r="1.5" fill={a.accent} opacity="0.5"/>
      <circle cx="15" cy="50" r="1" fill={a.hairAlt} opacity="0.4"/>

      {/* Arms draped over shoulders - behind bodies */}
      <path d="M30 62 Q40 55 50 60" stroke={a.skin} strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M70 60 Q80 55 88 62" stroke={a.skin} strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M48 58 Q60 52 72 58" stroke={a.skin} strokeWidth="3" strokeLinecap="round" fill="none"/>

      {/* LEFT PERSON - shorter, hair bun, clothAlt top */}
      {/* Body/clothing */}
      <path d="M24 72 Q22 85 23 98 L37 98 Q38 85 36 72 Z" fill={a.clothAlt}/>
      {/* Shirt detail */}
      <path d="M27 75 L30 98" stroke={a.accent} strokeWidth="0.5" opacity="0.3"/>
      {/* Legs */}
      <rect x="25" y="94" width="5" height="12" rx="2" fill={a.dark}/>
      <rect x="32" y="94" width="5" height="12" rx="2" fill={a.dark}/>
      {/* Shoes */}
      <ellipse cx="27" cy="107" rx="4" ry="2" fill={a.hair}/>
      <ellipse cx="35" cy="107" rx="4" ry="2" fill={a.hair}/>
      {/* Neck */}
      <rect x="28" y="65" width="4" height="5" rx="1" fill={a.skin}/>
      {/* Face */}
      <circle cx="30" cy="58" r="9" fill={a.skin}/>
      {/* Eyes */}
      <circle cx="27" cy="57" r="1.2" fill={a.dark}/>
      <circle cx="33" cy="57" r="1.2" fill={a.dark}/>
      {/* Smile */}
      <path d="M27 61 Q30 64 33 61" stroke={a.dark} strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      {/* Blush */}
      <circle cx="25" cy="60" r="2" fill={a.accent} opacity="0.25"/>
      <circle cx="35" cy="60" r="2" fill={a.accent} opacity="0.25"/>
      {/* Hair bun */}
      <path d="M21 55 Q20 47 25 44 Q30 41 35 44 Q39 47 38 53" fill={a.hair}/>
      <circle cx="30" cy="43" r="5" fill={a.hair}/>
      {/* Bun on top */}
      <circle cx="32" cy="38" r="4" fill={a.hair}/>
      <path d="M29 38 Q32 34 35 38" stroke={a.dark} strokeWidth="0.5" opacity="0.3" fill="none"/>

      {/* CENTER PERSON - tallest, short hair, dark jacket */}
      {/* Body/jacket */}
      <path d="M48 65 Q46 80 47 98 L73 98 Q74 80 72 65 Z" fill={a.dark}/>
      {/* Jacket lapel detail */}
      <path d="M55 65 L52 78" stroke={a.cloth} strokeWidth="1" opacity="0.4"/>
      <path d="M65 65 L68 78" stroke={a.cloth} strokeWidth="1" opacity="0.4"/>
      {/* Shirt underneath */}
      <path d="M55 66 L60 80 L65 66" fill={a.cloth}/>
      {/* Legs */}
      <rect x="50" y="94" width="6" height="14" rx="2" fill={a.hairAlt}/>
      <rect x="64" y="94" width="6" height="14" rx="2" fill={a.hairAlt}/>
      {/* Shoes */}
      <ellipse cx="53" cy="109" rx="5" ry="2.5" fill={a.dark}/>
      <ellipse cx="67" cy="109" rx="5" ry="2.5" fill={a.dark}/>
      {/* Neck */}
      <rect x="57" y="57" width="6" height="6" rx="1.5" fill={a.skin}/>
      {/* Face */}
      <circle cx="60" cy="49" r="11" fill={a.skin}/>
      {/* Eyes */}
      <circle cx="56" cy="48" r="1.4" fill={a.dark}/>
      <circle cx="64" cy="48" r="1.4" fill={a.dark}/>
      {/* Eyebrows */}
      <path d="M54 45 L58 44" stroke={a.dark} strokeWidth="1" strokeLinecap="round"/>
      <path d="M62 44 L66 45" stroke={a.dark} strokeWidth="1" strokeLinecap="round"/>
      {/* Smile */}
      <path d="M56 53 Q60 57 64 53" stroke={a.dark} strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      {/* Short hair */}
      <path d="M49 47 Q48 38 54 35 Q60 32 66 35 Q72 38 71 47" fill={a.hairAlt}/>
      <path d="M50 44 Q50 40 55 37 Q60 35 65 37 Q70 40 70 44" fill={a.hairAlt}/>

      {/* RIGHT PERSON - medium height, ponytail, cloth sweater */}
      {/* Body/sweater */}
      <path d="M78 68 Q76 82 77 98 L93 98 Q94 82 92 68 Z" fill={a.cloth}/>
      {/* Sweater texture */}
      <path d="M80 72 L90 72" stroke={a.clothAlt} strokeWidth="0.6" opacity="0.5"/>
      <path d="M79 76 L91 76" stroke={a.clothAlt} strokeWidth="0.6" opacity="0.5"/>
      <path d="M79 80 L91 80" stroke={a.clothAlt} strokeWidth="0.6" opacity="0.5"/>
      {/* Legs */}
      <rect x="79" y="94" width="5" height="12" rx="2" fill={a.dark}/>
      <rect x="87" y="94" width="5" height="12" rx="2" fill={a.dark}/>
      {/* Shoes */}
      <ellipse cx="82" cy="107" rx="4" ry="2" fill={a.hairAlt}/>
      <ellipse cx="90" cy="107" rx="4" ry="2" fill={a.hairAlt}/>
      {/* Neck */}
      <rect x="83" y="62" width="4" height="5" rx="1" fill={a.skin}/>
      {/* Face */}
      <circle cx="85" cy="55" r="9.5" fill={a.skin}/>
      {/* Eyes */}
      <circle cx="82" cy="54" r="1.2" fill={a.dark}/>
      <circle cx="88" cy="54" r="1.2" fill={a.dark}/>
      {/* Smile */}
      <path d="M82 58 Q85 61 88 58" stroke={a.dark} strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      {/* Hair - main */}
      <path d="M76 52 Q75 44 80 41 Q85 38 90 41 Q95 44 94 52" fill={a.hair}/>
      {/* Ponytail */}
      <path d="M93 44 Q100 42 102 50 Q103 58 98 62" stroke={a.hair} strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M93 44 Q99 43 101 49 Q102 56 98 60" fill={a.hair}/>
      {/* Hair tie */}
      <circle cx="94" cy="44" r="1.5" fill={a.accent}/>

      {/* Peace sign from right person */}
      <path d="M93 48 L96 40" stroke={a.skin} strokeWidth="2" strokeLinecap="round"/>
      <path d="M93 48 L98 42" stroke={a.skin} strokeWidth="2" strokeLinecap="round"/>

      {/* More sparkles */}
      <circle cx="45" cy="35" r="1" fill={a.accent} opacity="0.6"/>
      <path d="M50 28l1-3 1 3-3-1 3 0z" fill={a.clothAlt} opacity="0.5"/>
    </svg>
  )
}

function FriendsGroupIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>

      {/* BACK ROW - two taller people */}

      {/* Back-left person - tall, wavy hair */}
      <path d="M30 62 Q28 78 29 100 L43 100 Q44 78 42 62 Z" fill={a.dark}/>
      <rect x="32" y="96" width="5" height="10" rx="2" fill={a.hairAlt}/>
      <rect x="38" y="96" width="5" height="10" rx="2" fill={a.hairAlt}/>
      <rect x="34" y="56" width="4" height="5" rx="1" fill={a.skin}/>
      <circle cx="36" cy="49" r="9" fill={a.skin}/>
      <circle cx="33" cy="48" r="1.2" fill={a.dark}/>
      <circle cx="39" cy="48" r="1.2" fill={a.dark}/>
      {/* Glasses */}
      <circle cx="33" cy="48" r="3" stroke={a.dark} strokeWidth="0.8" fill="none"/>
      <circle cx="39" cy="48" r="3" stroke={a.dark} strokeWidth="0.8" fill="none"/>
      <path d="M36 48 L36 48" stroke={a.dark} strokeWidth="0.8"/>
      <path d="M30 47 L30 47" stroke={a.dark} strokeWidth="0.8"/>
      <path d="M27 48 L30 48" stroke={a.dark} strokeWidth="0.8"/>
      <path d="M42 48 L45 48" stroke={a.dark} strokeWidth="0.8"/>
      <path d="M33 52 Q36 55 39 52" stroke={a.dark} strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      {/* Wavy hair */}
      <path d="M27 46 Q26 38 31 35 Q36 32 41 35 Q46 38 45 46" fill={a.hair}/>
      <path d="M27 42 Q25 38 28 35 Q31 33 34 34" stroke={a.hair} strokeWidth="2" fill="none"/>
      <path d="M38 34 Q41 33 44 35 Q46 38 45 42" stroke={a.hair} strokeWidth="2" fill="none"/>

      {/* Back-right person - tall, cap/beanie */}
      <path d="M72 62 Q70 78 71 100 L87 100 Q88 78 86 62 Z" fill={a.accent}/>
      {/* Hoodie pocket */}
      <path d="M75 80 Q79 82 83 80" stroke={a.dark} strokeWidth="0.6" fill="none" opacity="0.3"/>
      <rect x="74" y="96" width="5" height="10" rx="2" fill={a.dark}/>
      <rect x="81" y="96" width="5" height="10" rx="2" fill={a.dark}/>
      <rect x="77" y="56" width="4" height="5" rx="1" fill={a.skin}/>
      <circle cx="79" cy="49" r="9" fill={a.skin}/>
      <circle cx="76" cy="48" r="1.2" fill={a.dark}/>
      <circle cx="82" cy="48" r="1.2" fill={a.dark}/>
      {/* Earring */}
      <circle cx="88" cy="51" r="1" fill={a.accent}/>
      <circle cx="88" cy="53" r="0.7" fill={a.accent}/>
      <path d="M76 52 Q79 55 82 52" stroke={a.dark} strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      {/* Cap/beanie */}
      <path d="M69 46 Q68 38 74 35 Q79 33 84 35 Q90 38 89 46" fill={a.green}/>
      <rect x="69" y="44" width="20" height="3" rx="1" fill={a.green}/>
      <path d="M69 45 L89 45" stroke={a.dark} strokeWidth="0.5" opacity="0.2"/>

      {/* FRONT ROW - 3 shorter people */}

      {/* Front-left person */}
      <path d="M15 72 Q13 85 14 105 L28 105 Q29 85 27 72 Z" fill={a.cloth}/>
      <rect x="17" y="101" width="4" height="8" rx="1.5" fill={a.dark}/>
      <rect x="23" y="101" width="4" height="8" rx="1.5" fill={a.dark}/>
      <ellipse cx="19" cy="110" rx="3.5" ry="1.5" fill={a.hair}/>
      <ellipse cx="25" cy="110" rx="3.5" ry="1.5" fill={a.hair}/>
      <rect x="19" y="66" width="4" height="4" rx="1" fill={a.skin}/>
      <circle cx="21" cy="60" r="8" fill={a.skin}/>
      <circle cx="18.5" cy="59" r="1" fill={a.dark}/>
      <circle cx="23.5" cy="59" r="1" fill={a.dark}/>
      <path d="M19 63 Q21 65 23 63" stroke={a.dark} strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      {/* Short curly hair */}
      <path d="M13 57 Q12 50 16 47 Q21 44 26 47 Q30 50 29 57" fill={a.hairAlt}/>
      <circle cx="15" cy="51" r="2" fill={a.hairAlt}/>
      <circle cx="19" cy="48" r="2.5" fill={a.hairAlt}/>
      <circle cx="24" cy="48" r="2.5" fill={a.hairAlt}/>
      <circle cx="27" cy="51" r="2" fill={a.hairAlt}/>

      {/* Front-center person */}
      <path d="M46 72 Q44 85 45 105 L59 105 Q60 85 58 72 Z" fill={a.clothAlt}/>
      {/* Collar detail */}
      <path d="M49 72 L52 78 L55 72" fill={a.cloth}/>
      <rect x="48" y="101" width="4" height="8" rx="1.5" fill={a.dark}/>
      <rect x="54" y="101" width="4" height="8" rx="1.5" fill={a.dark}/>
      <ellipse cx="50" cy="110" rx="3.5" ry="1.5" fill={a.dark}/>
      <ellipse cx="56" cy="110" rx="3.5" ry="1.5" fill={a.dark}/>
      <rect x="50" y="66" width="4" height="4" rx="1" fill={a.skin}/>
      <circle cx="52" cy="60" r="8" fill={a.skin}/>
      <circle cx="49.5" cy="59" r="1" fill={a.dark}/>
      <circle cx="54.5" cy="59" r="1" fill={a.dark}/>
      <path d="M49 63 Q52 66 55 63" stroke={a.dark} strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      <circle cx="49" cy="61" r="1.5" fill={a.accent} opacity="0.2"/>
      <circle cx="55" cy="61" r="1.5" fill={a.accent} opacity="0.2"/>
      {/* Straight long hair */}
      <path d="M44 57 Q43 49 47 45 Q52 42 57 45 Q61 49 60 57" fill={a.hair}/>
      <path d="M44 55 Q43 65 44 72" stroke={a.hair} strokeWidth="3" strokeLinecap="round"/>
      <path d="M60 55 Q61 65 60 72" stroke={a.hair} strokeWidth="3" strokeLinecap="round"/>

      {/* Front-right person */}
      <path d="M88 72 Q86 85 87 105 L101 105 Q102 85 100 72 Z" fill={a.dark}/>
      <rect x="90" y="101" width="4" height="8" rx="1.5" fill={a.hairAlt}/>
      <rect x="96" y="101" width="4" height="8" rx="1.5" fill={a.hairAlt}/>
      <ellipse cx="92" cy="110" rx="3.5" ry="1.5" fill={a.accent}/>
      <ellipse cx="98" cy="110" rx="3.5" ry="1.5" fill={a.accent}/>
      <rect x="92" y="66" width="4" height="4" rx="1" fill={a.skin}/>
      <circle cx="94" cy="60" r="8" fill={a.skin}/>
      <circle cx="91.5" cy="59" r="1" fill={a.dark}/>
      <circle cx="96.5" cy="59" r="1" fill={a.dark}/>
      <path d="M92 63 Q94 65 96 63" stroke={a.dark} strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      {/* Spiky short hair */}
      <path d="M86 57 Q85 50 89 47 Q94 44 99 47 Q103 50 102 57" fill={a.accent}/>
      <path d="M88 48 L86 43" stroke={a.accent} strokeWidth="2" strokeLinecap="round"/>
      <path d="M94 46 L94 41" stroke={a.accent} strokeWidth="2" strokeLinecap="round"/>
      <path d="M100 48 L102 43" stroke={a.accent} strokeWidth="2" strokeLinecap="round"/>

      {/* Tiny "friends" text */}
      <text x="60" y="116" textAnchor="middle" fill={a.dark} fontSize="6" fontFamily="serif" fontStyle="italic" opacity="0.4">friends</text>
    </svg>
  )
}

function BoyGangIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>

      {/* BOY 1 - far left, arms crossed, hoodie */}
      {/* Body - hoodie */}
      <path d="M10 68 Q8 82 9 100 L27 100 Q28 82 26 68 Z" fill={a.dark}/>
      {/* Hood detail */}
      <path d="M12 68 Q18 65 24 68" stroke={a.cloth} strokeWidth="1" fill="none" opacity="0.4"/>
      {/* Crossed arms */}
      <path d="M12 78 Q18 76 24 78" stroke={a.skin} strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M14 80 Q18 78 22 80" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Legs - jeans */}
      <rect x="11" y="96" width="6" height="14" rx="2" fill={a.hairAlt}/>
      <rect x="19" y="96" width="6" height="14" rx="2" fill={a.hairAlt}/>
      {/* Sneakers */}
      <path d="M10 109 L17 109 Q19 109 19 107 L13 107 Q10 107 10 109Z" fill={a.cloth}/>
      <path d="M18 109 L26 109 Q28 109 28 107 L22 107 Q18 107 18 109Z" fill={a.cloth}/>
      <path d="M10 109 L19 109" stroke={a.dark} strokeWidth="0.5" opacity="0.3"/>
      <path d="M18 109 L28 109" stroke={a.dark} strokeWidth="0.5" opacity="0.3"/>
      {/* Neck */}
      <rect x="16" y="62" width="4" height="5" rx="1" fill={a.skin}/>
      {/* Face */}
      <circle cx="18" cy="55" r="9" fill={a.skin}/>
      <circle cx="15.5" cy="54" r="1.2" fill={a.dark}/>
      <circle cx="20.5" cy="54" r="1.2" fill={a.dark}/>
      {/* Eyebrows */}
      <path d="M14 51.5 L17 51" stroke={a.dark} strokeWidth="1" strokeLinecap="round"/>
      <path d="M19 51 L22 51.5" stroke={a.dark} strokeWidth="1" strokeLinecap="round"/>
      {/* Neutral mouth */}
      <path d="M16 58 L20 58" stroke={a.dark} strokeWidth="0.8" strokeLinecap="round"/>
      {/* Short hair */}
      <path d="M9 52 Q8 44 13 41 Q18 38 23 41 Q28 44 27 52" fill={a.hair}/>

      {/* BOY 2 - left-center, backwards cap, leaning on Boy 3 */}
      {/* Body - jacket */}
      <path d="M32 65 Q30 80 31 100 L49 100 Q50 80 48 65 Z" fill={a.clothAlt}/>
      {/* Zipper */}
      <path d="M40 65 L40 100" stroke={a.dark} strokeWidth="0.6" opacity="0.4"/>
      {/* Lean arm toward boy 3 */}
      <path d="M48 72 Q55 68 58 72" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Legs */}
      <rect x="33" y="96" width="6" height="14" rx="2" fill={a.dark}/>
      <rect x="42" y="96" width="6" height="14" rx="2" fill={a.dark}/>
      {/* Sneakers */}
      <path d="M32 109 L39 109 Q41 109 41 107 L35 107 Q32 107 32 109Z" fill={a.accent}/>
      <path d="M41 109 L49 109 Q51 109 51 107 L45 107 Q41 107 41 109Z" fill={a.accent}/>
      {/* Neck */}
      <rect x="38" y="58" width="4" height="5" rx="1" fill={a.skin}/>
      {/* Face */}
      <circle cx="40" cy="50" r="10" fill={a.skin}/>
      <circle cx="37" cy="49" r="1.3" fill={a.dark}/>
      <circle cx="43" cy="49" r="1.3" fill={a.dark}/>
      <path d="M37 53 Q40 56 43 53" stroke={a.dark} strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      {/* Backwards cap */}
      <path d="M30 47 Q29 40 35 37 Q40 35 45 37 Q51 40 50 47" fill={a.green}/>
      {/* Cap brim (backwards) */}
      <rect x="29" y="47" width="8" height="3" rx="1" fill={a.green}/>
      <path d="M35 38 L40 37 L45 38" stroke={a.dark} strokeWidth="0.5" opacity="0.2"/>

      {/* BOY 3 - right-center, hands in pockets */}
      {/* Body - hoodie */}
      <path d="M55 63 Q53 78 54 100 L72 100 Q73 78 71 63 Z" fill={a.cloth}/>
      {/* Hoodie strings */}
      <path d="M60 64 L59 70" stroke={a.dark} strokeWidth="0.5" opacity="0.5"/>
      <path d="M66 64 L67 70" stroke={a.dark} strokeWidth="0.5" opacity="0.5"/>
      {/* Hood */}
      <path d="M56 63 Q63 59 70 63" stroke={a.clothAlt} strokeWidth="1.5" fill="none"/>
      {/* Hands in pockets - arms going into body */}
      <path d="M56 82 Q54 80 55 78" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M70 82 Q72 80 71 78" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Pocket line */}
      <path d="M56 82 Q63 84 70 82" stroke={a.dark} strokeWidth="0.6" fill="none" opacity="0.3"/>
      {/* Legs */}
      <rect x="56" y="96" width="6" height="14" rx="2" fill={a.hairAlt}/>
      <rect x="65" y="96" width="6" height="14" rx="2" fill={a.hairAlt}/>
      {/* Sneakers */}
      <path d="M55 109 L62 109 Q64 109 64 107 L58 107 Q55 107 55 109Z" fill={a.dark}/>
      <path d="M64 109 L72 109 Q74 109 74 107 L68 107 Q64 107 64 109Z" fill={a.dark}/>
      <circle cx="58" cy="108" r="0.7" fill={a.cloth}/>
      <circle cx="70" cy="108" r="0.7" fill={a.cloth}/>
      {/* Neck */}
      <rect x="61" y="56" width="4" height="5" rx="1" fill={a.skin}/>
      {/* Face */}
      <circle cx="63" cy="48" r="10" fill={a.skin}/>
      <circle cx="60" cy="47" r="1.3" fill={a.dark}/>
      <circle cx="66" cy="47" r="1.3" fill={a.dark}/>
      <path d="M60 52 L66 52" stroke={a.dark} strokeWidth="0.8" strokeLinecap="round"/>
      {/* Short spiky hair */}
      <path d="M53 45 Q52 37 58 34 Q63 32 68 34 Q74 37 73 45" fill={a.hairAlt}/>
      <path d="M56 36 L54 31" stroke={a.hairAlt} strokeWidth="2" strokeLinecap="round"/>
      <path d="M63 34 L63 29" stroke={a.hairAlt} strokeWidth="2" strokeLinecap="round"/>
      <path d="M70 36 L72 31" stroke={a.hairAlt} strokeWidth="2" strokeLinecap="round"/>

      {/* BOY 4 - far right, casual stance */}
      {/* Body - t-shirt */}
      <path d="M80 66 Q78 80 79 100 L97 100 Q98 80 96 66 Z" fill={a.accent}/>
      {/* Shirt design */}
      <rect x="84" y="76" width="8" height="6" rx="1" fill={a.cloth} opacity="0.4"/>
      {/* Arms down */}
      <path d="M80 70 Q77 80 78 88" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M96 70 Q99 80 98 88" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Legs */}
      <rect x="81" y="96" width="6" height="14" rx="2" fill={a.dark}/>
      <rect x="90" y="96" width="6" height="14" rx="2" fill={a.dark}/>
      {/* Sneakers */}
      <path d="M80 109 L87 109 Q89 109 89 107 L83 107 Q80 107 80 109Z" fill={a.clothAlt}/>
      <path d="M89 109 L97 109 Q99 109 99 107 L93 107 Q89 107 89 109Z" fill={a.clothAlt}/>
      {/* Neck */}
      <rect x="86" y="59" width="4" height="5" rx="1" fill={a.skin}/>
      {/* Face */}
      <circle cx="88" cy="52" r="9.5" fill={a.skin}/>
      <circle cx="85.5" cy="51" r="1.2" fill={a.dark}/>
      <circle cx="90.5" cy="51" r="1.2" fill={a.dark}/>
      <path d="M85 55 Q88 58 91 55" stroke={a.dark} strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      {/* Buzzcut hair */}
      <path d="M79 49 Q78 41 83 38 Q88 36 93 38 Q98 41 97 49" fill={a.dark}/>
    </svg>
  )
}

function GirlGangIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>

      {/* Floating hearts and sparkles */}
      <path d="M18 28 C18 25 22 25 22 28 C22 31 18 34 18 34 C18 34 14 31 14 28 C14 25 18 25 18 28Z" fill={a.accent} opacity="0.4"/>
      <path d="M95 22 C95 20 98 20 98 22 C98 24 95 26 95 26 C95 26 92 24 92 22 C92 20 95 20 95 22Z" fill={a.hairAlt} opacity="0.3"/>
      <path d="M55 18l1-3 1 3-3-1 3 0z" fill={a.accent} opacity="0.5"/>
      <circle cx="78" cy="25" r="1" fill={a.accent} opacity="0.4"/>
      <path d="M38 22l1.5-4 1.5 4-4-1.5 4 0z" fill={a.hairAlt} opacity="0.4"/>

      {/* GIRL 1 - far left, long straight hair, dress */}
      {/* Dress */}
      <path d="M10 70 Q8 80 5 105 L30 105 Q27 80 25 70 Z" fill={a.accent}/>
      {/* Dress detail - waist */}
      <path d="M12 75 Q17 73 23 75" stroke={a.dark} strokeWidth="0.5" fill="none" opacity="0.3"/>
      {/* Legs */}
      <rect x="12" y="100" width="4" height="8" rx="1.5" fill={a.skin}/>
      <rect x="20" y="100" width="4" height="8" rx="1.5" fill={a.skin}/>
      {/* Shoes */}
      <ellipse cx="14" cy="109" rx="3.5" ry="1.5" fill={a.dark}/>
      <ellipse cx="22" cy="109" rx="3.5" ry="1.5" fill={a.dark}/>
      {/* Neck */}
      <rect x="15" y="64" width="4" height="4.5" rx="1" fill={a.skin}/>
      {/* Face */}
      <circle cx="17" cy="57" r="9" fill={a.skin}/>
      <circle cx="14.5" cy="56" r="1" fill={a.dark}/>
      <circle cx="19.5" cy="56" r="1" fill={a.dark}/>
      {/* Eyelashes */}
      <path d="M13.5 55 L12.5 54" stroke={a.dark} strokeWidth="0.4"/>
      <path d="M20.5 55 L21.5 54" stroke={a.dark} strokeWidth="0.4"/>
      <path d="M14 60 Q17 63 20 60" stroke={a.dark} strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      {/* Blush */}
      <circle cx="13" cy="59" r="1.5" fill={a.accent} opacity="0.25"/>
      <circle cx="21" cy="59" r="1.5" fill={a.accent} opacity="0.25"/>
      {/* Long straight hair */}
      <path d="M8 54 Q7 46 12 42 Q17 39 22 42 Q27 46 26 54" fill={a.hair}/>
      <path d="M8 52 Q7 65 8 78" stroke={a.hair} strokeWidth="4" strokeLinecap="round"/>
      <path d="M26 52 Q27 65 27 78" stroke={a.hair} strokeWidth="4" strokeLinecap="round"/>
      <path d="M10 52 Q9 62 10 72" stroke={a.hair} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M24 52 Q25 62 25 72" stroke={a.hair} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Earrings */}
      <circle cx="8" cy="58" r="1.2" fill={a.accent}/>

      {/* GIRL 2 - left-center, curly hair (wavy paths), skirt+top */}
      {/* Top */}
      <path d="M33 68 Q31 76 32 82 L48 82 Q49 76 47 68 Z" fill={a.cloth}/>
      {/* Skirt */}
      <path d="M30 82 Q29 92 27 105 L53 105 Q51 92 50 82 Z" fill={a.clothAlt}/>
      {/* Skirt pleats */}
      <path d="M35 82 L33 105" stroke={a.dark} strokeWidth="0.4" opacity="0.2"/>
      <path d="M40 82 L40 105" stroke={a.dark} strokeWidth="0.4" opacity="0.2"/>
      <path d="M45 82 L47 105" stroke={a.dark} strokeWidth="0.4" opacity="0.2"/>
      {/* Legs */}
      <rect x="34" y="100" width="4" height="8" rx="1.5" fill={a.skin}/>
      <rect x="42" y="100" width="4" height="8" rx="1.5" fill={a.skin}/>
      <ellipse cx="36" cy="109" rx="3.5" ry="1.5" fill={a.hairAlt}/>
      <ellipse cx="44" cy="109" rx="3.5" ry="1.5" fill={a.hairAlt}/>
      {/* Neck */}
      <rect x="38" y="62" width="4" height="4.5" rx="1" fill={a.skin}/>
      {/* Face */}
      <circle cx="40" cy="55" r="9" fill={a.skin}/>
      <circle cx="37.5" cy="54" r="1" fill={a.dark}/>
      <circle cx="42.5" cy="54" r="1" fill={a.dark}/>
      <path d="M37 58 Q40 61 43 58" stroke={a.dark} strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      <circle cx="36" cy="57" r="1.5" fill={a.accent} opacity="0.25"/>
      <circle cx="44" cy="57" r="1.5" fill={a.accent} opacity="0.25"/>
      {/* Curly hair - lots of wavy paths */}
      <path d="M31 52 Q30 44 35 40 Q40 37 45 40 Q50 44 49 52" fill={a.hairAlt}/>
      <circle cx="31" cy="48" r="3" fill={a.hairAlt}/>
      <circle cx="49" cy="48" r="3" fill={a.hairAlt}/>
      <circle cx="33" cy="53" r="2.5" fill={a.hairAlt}/>
      <circle cx="47" cy="53" r="2.5" fill={a.hairAlt}/>
      <circle cx="35" cy="43" r="2.5" fill={a.hairAlt}/>
      <circle cx="45" cy="43" r="2.5" fill={a.hairAlt}/>
      <circle cx="40" cy="40" r="3" fill={a.hairAlt}/>
      <circle cx="30" cy="55" r="2" fill={a.hairAlt}/>
      <circle cx="50" cy="55" r="2" fill={a.hairAlt}/>

      {/* GIRL 3 - right-center, bob cut, jeans+crop top, hair clip */}
      {/* Crop top */}
      <path d="M58 66 Q56 72 57 78 L73 78 Q74 72 72 66 Z" fill={a.dark}/>
      {/* Skin gap midriff */}
      <rect x="59" y="78" width="12" height="3" rx="1" fill={a.skin}/>
      {/* Jeans */}
      <path d="M57 81 Q56 90 56 105 L74 105 Q74 90 73 81 Z" fill={a.clothAlt}/>
      <path d="M65 81 L65 105" stroke={a.dark} strokeWidth="0.4" opacity="0.2"/>
      <rect x="59" y="100" width="5" height="8" rx="1.5" fill={a.clothAlt}/>
      <rect x="67" y="100" width="5" height="8" rx="1.5" fill={a.clothAlt}/>
      <ellipse cx="61" cy="109" rx="3.5" ry="1.5" fill={a.cloth}/>
      <ellipse cx="70" cy="109" rx="3.5" ry="1.5" fill={a.cloth}/>
      {/* Neck */}
      <rect x="63" y="60" width="4" height="4.5" rx="1" fill={a.skin}/>
      {/* Face */}
      <circle cx="65" cy="53" r="9" fill={a.skin}/>
      <circle cx="62.5" cy="52" r="1" fill={a.dark}/>
      <circle cx="67.5" cy="52" r="1" fill={a.dark}/>
      <path d="M63 56 Q65 58 67 56" stroke={a.dark} strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      {/* Bob cut hair */}
      <path d="M56 50 Q55 42 60 39 Q65 36 70 39 Q75 42 74 50" fill={a.hair}/>
      <path d="M56 48 Q55 55 56 62" stroke={a.hair} strokeWidth="4" strokeLinecap="round"/>
      <path d="M74 48 Q75 55 74 62" stroke={a.hair} strokeWidth="4" strokeLinecap="round"/>
      {/* Hair clip */}
      <rect x="72" y="44" width="4" height="2" rx="0.5" fill={a.accent}/>
      <circle cx="74" cy="45" r="1.5" fill={a.green}/>

      {/* GIRL 4 - far right, high ponytail, tallest */}
      {/* Top */}
      <path d="M83 65 Q81 78 82 100 L100 100 Q101 78 99 65 Z" fill={a.green}/>
      {/* Neckline */}
      <path d="M87 65 L91 70 L95 65" fill={a.skin} opacity="0.6"/>
      {/* Legs */}
      <rect x="84" y="96" width="5" height="12" rx="2" fill={a.dark}/>
      <rect x="93" y="96" width="5" height="12" rx="2" fill={a.dark}/>
      <ellipse cx="87" cy="109" rx="4" ry="1.5" fill={a.accent}/>
      <ellipse cx="96" cy="109" rx="4" ry="1.5" fill={a.accent}/>
      {/* Arms */}
      <path d="M83 70 Q79 78 80 85" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M99 70 Q103 78 102 85" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Neck */}
      <rect x="89" y="58" width="4" height="5" rx="1" fill={a.skin}/>
      {/* Face */}
      <circle cx="91" cy="50" r="10" fill={a.skin}/>
      <circle cx="88" cy="49" r="1.1" fill={a.dark}/>
      <circle cx="94" cy="49" r="1.1" fill={a.dark}/>
      <path d="M88 54 Q91 57 94 54" stroke={a.dark} strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      <circle cx="86" cy="52" r="1.5" fill={a.accent} opacity="0.25"/>
      <circle cx="96" cy="52" r="1.5" fill={a.accent} opacity="0.25"/>
      {/* High ponytail */}
      <path d="M81 47 Q80 39 86 36 Q91 34 96 36 Q102 39 101 47" fill={a.accent}/>
      {/* Ponytail going up then flowing */}
      <path d="M91 36 Q92 28 96 25 Q100 23 103 26 Q106 30 104 38 Q102 46 98 52" stroke={a.accent} strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      <path d="M91 36 Q93 30 96 27" stroke={a.accent} strokeWidth="3" strokeLinecap="round" fill="none"/>
      {/* Hair tie */}
      <circle cx="92" cy="35" r="1.5" fill={a.dark}/>
      {/* Hair flowing detail */}
      <path d="M100 30 Q105 35 103 42" stroke={a.accent} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>

      {/* More floating hearts between them */}
      <path d="M52 35 C52 33.5 54 33.5 54 35 C54 36.5 52 38 52 38 C52 38 50 36.5 50 35 C50 33.5 52 33.5 52 35Z" fill={a.accent} opacity="0.35"/>
      <path d="M74 30 C74 29 75.5 29 75.5 30 C75.5 31 74 32 74 32 C74 32 72.5 31 72.5 30 C72.5 29 74 29 74 30Z" fill={a.hair} opacity="0.3"/>
    </svg>
  )
}

function FriendsPoseIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>

      {/* Confetti/sparkle elements */}
      <rect x="15" y="20" width="3" height="6" rx="1" fill={a.accent} opacity="0.5" transform="rotate(30 16 23)"/>
      <rect x="100" y="18" width="2.5" height="5" rx="1" fill={a.hairAlt} opacity="0.5" transform="rotate(-20 101 20)"/>
      <circle cx="30" cy="15" r="1.5" fill={a.clothAlt} opacity="0.6"/>
      <circle cx="85" cy="12" r="1" fill={a.accent} opacity="0.5"/>
      <path d="M50 12l1.5-4 1.5 4-4-1.5 4 0z" fill={a.accent} opacity="0.5"/>
      <path d="M70 15l1-3 1 3-3-1 3 0z" fill={a.hairAlt} opacity="0.4"/>
      <rect x="108" y="35" width="2" height="4" rx="0.5" fill={a.green} opacity="0.4" transform="rotate(45 109 37)"/>
      <rect x="8" y="40" width="2" height="4" rx="0.5" fill={a.hair} opacity="0.4" transform="rotate(-30 9 42)"/>

      {/* Camera flash in corner */}
      <rect x="92" y="88" width="14" height="10" rx="2" fill={a.dark} opacity="0.6"/>
      <circle cx="99" cy="93" r="3.5" fill={a.hairAlt} opacity="0.5"/>
      <circle cx="99" cy="93" r="2" fill={a.cloth} opacity="0.4"/>
      {/* Flash lines */}
      <path d="M99 84 L99 87" stroke={a.accent} strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
      <path d="M93 88 L91 86" stroke={a.accent} strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
      <path d="M105 88 L107 86" stroke={a.accent} strokeWidth="1" strokeLinecap="round" opacity="0.6"/>

      {/* PERSON 1 - left, arms up, tilted */}
      {/* Body */}
      <path d="M14 70 Q12 82 13 102 L29 102 Q30 82 28 70 Z" fill={a.clothAlt} transform="rotate(-5 21 86)"/>
      {/* Arms up */}
      <path d="M14 72 Q8 58 10 45" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M28 72 Q34 58 32 45" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Hands */}
      <circle cx="10" cy="44" r="2" fill={a.skin}/>
      <circle cx="32" cy="44" r="2" fill={a.skin}/>
      {/* Legs */}
      <rect x="15" y="98" width="5" height="10" rx="2" fill={a.dark}/>
      <rect x="23" y="98" width="5" height="10" rx="2" fill={a.dark}/>
      <ellipse cx="17" cy="109" rx="4" ry="1.5" fill={a.hair}/>
      <ellipse cx="26" cy="109" rx="4" ry="1.5" fill={a.hair}/>
      {/* Neck */}
      <rect x="19" y="64" width="4" height="4" rx="1" fill={a.skin}/>
      {/* Face */}
      <circle cx="21" cy="57" r="9" fill={a.skin}/>
      <circle cx="18.5" cy="56" r="1.1" fill={a.dark}/>
      <circle cx="23.5" cy="56" r="1.1" fill={a.dark}/>
      {/* Big smile */}
      <path d="M17 60 Q21 65 25 60" stroke={a.dark} strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      <path d="M18 60 Q21 63 24 60" fill={a.cloth} opacity="0.5"/>
      {/* Hair - messy/wild */}
      <path d="M12 54 Q11 46 16 42 Q21 39 26 42 Q31 46 30 54" fill={a.hair}/>
      <path d="M14 44 L11 39" stroke={a.hair} strokeWidth="2" strokeLinecap="round"/>
      <path d="M28 44 L31 39" stroke={a.hair} strokeWidth="2" strokeLinecap="round"/>
      <path d="M21 41 L21 36" stroke={a.hair} strokeWidth="2" strokeLinecap="round"/>

      {/* PERSON 2 - center-left, peace sign, dynamic */}
      {/* Body */}
      <path d="M36 66 Q34 80 35 102 L53 102 Q54 80 52 66 Z" fill={a.dark}/>
      {/* Arms */}
      <path d="M36 70 Q30 65 28 60" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Peace sign hand */}
      <path d="M52 68 Q58 55 56 48" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M56 48 L54 40" stroke={a.skin} strokeWidth="2" strokeLinecap="round"/>
      <path d="M56 48 L58 40" stroke={a.skin} strokeWidth="2" strokeLinecap="round"/>
      {/* Legs */}
      <rect x="38" y="98" width="5" height="10" rx="2" fill={a.hairAlt}/>
      <rect x="47" y="98" width="5" height="10" rx="2" fill={a.hairAlt}/>
      <ellipse cx="40" cy="109" rx="4" ry="1.5" fill={a.dark}/>
      <ellipse cx="50" cy="109" rx="4" ry="1.5" fill={a.dark}/>
      {/* Neck */}
      <rect x="42" y="59" width="4" height="5" rx="1" fill={a.skin}/>
      {/* Face */}
      <circle cx="44" cy="51" r="10" fill={a.skin}/>
      <circle cx="41" cy="50" r="1.2" fill={a.dark}/>
      <circle cx="47" cy="50" r="1.2" fill={a.dark}/>
      {/* Big smile with teeth */}
      <path d="M40 54 Q44 59 48 54" stroke={a.dark} strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      <path d="M41 54 Q44 57 47 54" fill={a.cloth} opacity="0.5"/>
      {/* Ponytail hair */}
      <path d="M34 48 Q33 40 39 36 Q44 33 49 36 Q55 40 54 48" fill={a.hairAlt}/>
      <path d="M53 40 Q58 38 60 42 Q62 48 58 54" stroke={a.hairAlt} strokeWidth="3.5" strokeLinecap="round" fill="none"/>

      {/* PERSON 3 - center-right, jumping (elevated) */}
      {/* Body - slightly higher position */}
      <path d="M62 60 Q60 74 61 94 L79 94 Q80 74 78 60 Z" fill={a.accent}/>
      {/* Arms outstretched */}
      <path d="M62 64 Q56 58 52 56" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M78 64 Q84 58 88 56" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <circle cx="52" cy="55" r="2" fill={a.skin}/>
      <circle cx="88" cy="55" r="2" fill={a.skin}/>
      {/* Legs - spread apart (jumping) */}
      <path d="M64 90 Q62 96 58 102" stroke={a.dark} strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M76 90 Q78 96 82 102" stroke={a.dark} strokeWidth="5" strokeLinecap="round" fill="none"/>
      {/* Shoes slightly off ground */}
      <ellipse cx="57" cy="103" rx="4" ry="1.5" fill={a.clothAlt}/>
      <ellipse cx="83" cy="103" rx="4" ry="1.5" fill={a.clothAlt}/>
      {/* Shadow on ground showing jump */}
      <ellipse cx="70" cy="110" rx="8" ry="1.5" fill={a.dark} opacity="0.1"/>
      {/* Neck */}
      <rect x="68" y="53" width="4" height="5" rx="1" fill={a.skin}/>
      {/* Face */}
      <circle cx="70" cy="45" r="10" fill={a.skin}/>
      <circle cx="67" cy="44" r="1.2" fill={a.dark}/>
      <circle cx="73" cy="44" r="1.2" fill={a.dark}/>
      {/* Open mouth smile */}
      <ellipse cx="70" cy="49" rx="3" ry="2.5" fill={a.dark} opacity="0.7"/>
      <ellipse cx="70" cy="50" rx="2.5" ry="1.5" fill={a.accent} opacity="0.4"/>
      {/* Short wavy hair */}
      <path d="M60 42 Q59 34 65 30 Q70 27 75 30 Q81 34 80 42" fill={a.hair}/>
      <path d="M62 36 Q60 33 62 30" stroke={a.hair} strokeWidth="2" strokeLinecap="round"/>
      <path d="M78 36 Q80 33 78 30" stroke={a.hair} strokeWidth="2" strokeLinecap="round"/>

      {/* PERSON 4 - far right, arms up celebrating */}
      {/* Body */}
      <path d="M86 68 Q84 80 85 102 L101 102 Q102 80 100 68 Z" fill={a.cloth}/>
      {/* Collar */}
      <path d="M89 68 L93 73 L97 68" stroke={a.clothAlt} strokeWidth="0.8" fill="none"/>
      {/* Arms up */}
      <path d="M86 72 Q80 60 82 48" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M100 72 Q106 60 104 48" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <circle cx="82" cy="47" r="2" fill={a.skin}/>
      <circle cx="104" cy="47" r="2" fill={a.skin}/>
      {/* Legs */}
      <rect x="87" y="98" width="5" height="10" rx="2" fill={a.dark}/>
      <rect x="95" y="98" width="5" height="10" rx="2" fill={a.dark}/>
      <ellipse cx="90" cy="109" rx="4" ry="1.5" fill={a.accent}/>
      <ellipse cx="98" cy="109" rx="4" ry="1.5" fill={a.accent}/>
      {/* Neck */}
      <rect x="91" y="62" width="4" height="4" rx="1" fill={a.skin}/>
      {/* Face */}
      <circle cx="93" cy="55" r="9" fill={a.skin}/>
      <circle cx="90.5" cy="54" r="1.1" fill={a.dark}/>
      <circle cx="95.5" cy="54" r="1.1" fill={a.dark}/>
      {/* Big smile */}
      <path d="M90 58 Q93 62 96 58" stroke={a.dark} strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      {/* Braided hair */}
      <path d="M84 52 Q83 44 88 40 Q93 37 98 40 Q103 44 102 52" fill={a.accent}/>
      {/* Braids going down */}
      <path d="M85 50 Q84 58 83 66 Q82 72 83 78" stroke={a.accent} strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M101 50 Q102 58 103 66 Q104 72 103 78" stroke={a.accent} strokeWidth="3" strokeLinecap="round" fill="none"/>
      {/* Braid texture */}
      <path d="M84 54 L86 56 L84 58 L86 60 L84 62" stroke={a.dark} strokeWidth="0.4" fill="none" opacity="0.3"/>
      <path d="M102 54 L100 56 L102 58 L100 60 L102 62" stroke={a.dark} strokeWidth="0.4" fill="none" opacity="0.3"/>

      {/* More confetti */}
      <circle cx="40" cy="25" r="1.5" fill={a.green} opacity="0.5"/>
      <rect x="60" y="10" width="2" height="5" rx="0.5" fill={a.clothAlt} opacity="0.4" transform="rotate(15 61 12)"/>
    </svg>
  )
}

function HomiesIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>

      {/* Wall - vertical line on right */}
      <path d="M95 25 L95 110" stroke={a.dark} strokeWidth="1.5" opacity="0.15"/>
      <path d="M95 25 L110 25 L110 110 L95 110" fill={a.dark} opacity="0.05"/>

      {/* Ground line */}
      <path d="M5 108 L115 108" stroke={a.dark} strokeWidth="0.5" opacity="0.1"/>

      {/* PERSON 1 - standing casually, leaning against wall */}
      {/* Body - oversized hoodie */}
      <path d="M82 62 Q80 78 81 102 L97 102 Q98 78 96 62 Z" fill={a.clothAlt}/>
      {/* Hoodie details */}
      <path d="M85 62 Q89 59 93 62" stroke={a.dark} strokeWidth="0.8" fill="none" opacity="0.3"/>
      <path d="M87 63 L87 68" stroke={a.dark} strokeWidth="0.4" opacity="0.4"/>
      <path d="M91 63 L91 68" stroke={a.dark} strokeWidth="0.4" opacity="0.4"/>
      {/* Hoodie pocket */}
      <path d="M83 82 Q89 84 95 82" stroke={a.dark} strokeWidth="0.5" fill="none" opacity="0.25"/>
      {/* One arm leaning on wall, one arm relaxed */}
      <path d="M96 68 Q98 66 95 60" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M82 68 Q78 76 80 84" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Legs */}
      <rect x="83" y="98" width="5" height="10" rx="2" fill={a.dark}/>
      {/* Crossed leg */}
      <path d="M92 98 Q90 102 88 107" stroke={a.dark} strokeWidth="5" strokeLinecap="round" fill="none"/>
      {/* Sneakers */}
      <path d="M82 107 L88 107 Q90 107 90 105 L85 105 Q82 105 82 107Z" fill={a.cloth}/>
      <path d="M86 107 L92 107 Q94 107 94 105 L90 105 Q86 105 86 107Z" fill={a.cloth}/>
      {/* Neck */}
      <rect x="87" y="56" width="4" height="5" rx="1" fill={a.skin}/>
      {/* Face */}
      <circle cx="89" cy="49" r="9" fill={a.skin}/>
      <circle cx="86.5" cy="48" r="1.1" fill={a.dark}/>
      <circle cx="91.5" cy="48" r="1.1" fill={a.dark}/>
      {/* Neutral/chill expression */}
      <path d="M87 52 L91 52.5" stroke={a.dark} strokeWidth="0.8" strokeLinecap="round"/>
      {/* Short hair */}
      <path d="M80 46 Q79 38 84 35 Q89 32 94 35 Q99 38 98 46" fill={a.hair}/>

      {/* PERSON 2 - sitting on ground, holding phone */}
      {/* Body - oversized hoodie, seated */}
      <path d="M45 78 Q43 88 44 100 L62 100 Q63 88 61 78 Z" fill={a.dark}/>
      {/* Legs stretched out on ground */}
      <path d="M46 98 Q42 102 35 106" stroke={a.hairAlt} strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M60 98 Q56 102 50 106" stroke={a.hairAlt} strokeWidth="5" strokeLinecap="round" fill="none"/>
      {/* Shoes on ground */}
      <ellipse cx="34" cy="107" rx="4" ry="2" fill={a.accent}/>
      <ellipse cx="49" cy="107" rx="4" ry="2" fill={a.accent}/>
      {/* Arms */}
      <path d="M47 82 Q44 86 42 88" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M59 82 Q62 86 64 88" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Phone in hand */}
      <rect x="62" y="85" width="5" height="8" rx="1" fill={a.hairAlt}/>
      <rect x="63" y="86" width="3" height="5.5" rx="0.5" fill={a.cloth} opacity="0.6"/>
      {/* Neck */}
      <rect x="51" y="72" width="4" height="4.5" rx="1" fill={a.skin}/>
      {/* Face */}
      <circle cx="53" cy="66" r="8.5" fill={a.skin}/>
      <circle cx="50.5" cy="65" r="1" fill={a.dark}/>
      <circle cx="55.5" cy="65" r="1" fill={a.dark}/>
      {/* Very slight smile - chill */}
      <path d="M51 69 Q53 70 55 69" stroke={a.dark} strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      {/* Messy hair */}
      <path d="M45 63 Q44 55 49 52 Q53 49 58 52 Q62 55 61 63" fill={a.hairAlt}/>
      <path d="M47 54 L45 50" stroke={a.hairAlt} strokeWidth="2" strokeLinecap="round"/>
      <path d="M53 52 L54 48" stroke={a.hairAlt} strokeWidth="2" strokeLinecap="round"/>
      <path d="M59 54 L61 50" stroke={a.hairAlt} strokeWidth="2" strokeLinecap="round"/>

      {/* PERSON 3 - standing casually, left side */}
      {/* Body - loose jacket */}
      <path d="M12 65 Q10 80 11 102 L29 102 Q30 80 28 65 Z" fill={a.cloth}/>
      {/* Jacket opening */}
      <path d="M18 65 L17 90" stroke={a.dark} strokeWidth="0.5" opacity="0.3"/>
      <path d="M22 65 L23 90" stroke={a.dark} strokeWidth="0.5" opacity="0.3"/>
      {/* Undershirt */}
      <path d="M18 66 L20 80 L22 66" fill={a.accent} opacity="0.6"/>
      {/* Arms relaxed */}
      <path d="M12 68 Q8 78 10 88" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M28 68 Q32 78 30 88" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Casual hand gesture - one hand slightly up */}
      <circle cx="10" cy="88" r="2" fill={a.skin}/>
      <circle cx="30" cy="88" r="2" fill={a.skin}/>
      {/* Legs */}
      <rect x="13" y="98" width="5" height="10" rx="2" fill={a.dark}/>
      <rect x="22" y="98" width="5" height="10" rx="2" fill={a.dark}/>
      {/* Sneakers */}
      <path d="M12 107 L18 107 Q20 107 20 105 L15 105 Q12 105 12 107Z" fill={a.hairAlt}/>
      <path d="M21 107 L28 107 Q30 107 30 105 L25 105 Q21 105 21 107Z" fill={a.hairAlt}/>
      {/* Neck */}
      <rect x="18" y="59" width="4" height="4.5" rx="1" fill={a.skin}/>
      {/* Face */}
      <circle cx="20" cy="52" r="9" fill={a.skin}/>
      <circle cx="17.5" cy="51" r="1.1" fill={a.dark}/>
      <circle cx="22.5" cy="51" r="1.1" fill={a.dark}/>
      {/* Chill expression - slight smirk */}
      <path d="M18 55 Q21 56 23 55" stroke={a.dark} strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      {/* Eyebrows relaxed */}
      <path d="M16 48.5 L19 48" stroke={a.dark} strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M21 48 L24 48.5" stroke={a.dark} strokeWidth="0.8" strokeLinecap="round"/>
      {/* Longer hair on top */}
      <path d="M11 49 Q10 41 15 37 Q20 34 25 37 Q30 41 29 49" fill={a.accent}/>
      <path d="M12 44 Q11 40 14 38" stroke={a.accent} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M22 37 Q26 36 28 40" stroke={a.accent} strokeWidth="2" fill="none" strokeLinecap="round"/>

      {/* PERSON 4 - standing middle, very relaxed */}
      {/* Body - oversized tee */}
      <path d="M32 68 Q30 80 31 102 L47 102 Q48 80 46 68 Z" fill={a.green}/>
      {/* Shirt graphic */}
      <rect x="36" y="78" width="6" height="5" rx="1" fill={a.cloth} opacity="0.3"/>
      {/* One arm behind back, one arm at side */}
      <path d="M46 72 Q50 80 48 88" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Legs */}
      <rect x="33" y="98" width="5" height="10" rx="2" fill={a.dark}/>
      <rect x="41" y="98" width="5" height="10" rx="2" fill={a.dark}/>
      <path d="M32 107 L38 107 Q40 107 40 105 L35 105 Q32 105 32 107Z" fill={a.dark}/>
      <path d="M40 107 L47 107 Q49 107 49 105 L44 105 Q40 105 40 107Z" fill={a.dark}/>
      {/* Neck */}
      <rect x="37" y="62" width="4" height="4.5" rx="1" fill={a.skin}/>
      {/* Face */}
      <circle cx="39" cy="55" r="9" fill={a.skin}/>
      <circle cx="36.5" cy="54" r="1.1" fill={a.dark}/>
      <circle cx="41.5" cy="54" r="1.1" fill={a.dark}/>
      {/* Relaxed mouth */}
      <path d="M37 58 L41 58" stroke={a.dark} strokeWidth="0.8" strokeLinecap="round"/>
      {/* Beanie */}
      <path d="M30 52 Q29 44 34 40 Q39 37 44 40 Q49 44 48 52" fill={a.clothAlt}/>
      <rect x="30" y="50" width="18" height="3" rx="1" fill={a.clothAlt}/>
      <path d="M30 51 L48 51" stroke={a.dark} strokeWidth="0.4" opacity="0.2"/>
      <path d="M31 52 L47 52" stroke={a.dark} strokeWidth="0.4" opacity="0.15"/>
      {/* Beanie fold detail */}
      <path d="M39 38 L39 37" stroke={a.clothAlt} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}


// === Icons from _icons_part3.tsx ===
function CoupleRomanticIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="60" fill={a.bg} />
      {/* warmth lines */}
      <path d="M25 40 Q28 38 30 40" stroke={a.accent} strokeWidth="1.2" opacity="0.3" strokeLinecap="round" />
      <path d="M90 38 Q93 36 95 39" stroke={a.accent} strokeWidth="1.2" opacity="0.3" strokeLinecap="round" />
      <path d="M20 55 Q23 53 25 56" stroke={a.accent} strokeWidth="1.2" opacity="0.3" strokeLinecap="round" />
      <path d="M95 52 Q98 50 100 53" stroke={a.accent} strokeWidth="1.2" opacity="0.3" strokeLinecap="round" />
      {/* Person 1 - left, head tilting right */}
      {/* body / dress */}
      <path d="M30 72 Q32 62 40 60 L50 60 Q52 62 52 72 L52 100 L30 100 Z" fill={a.cloth} />
      <path d="M34 72 L34 100" stroke={a.clothAlt} strokeWidth="0.8" opacity="0.4" />
      {/* neck */}
      <rect x="38" y="48" width="6" height="8" rx="2" fill={a.skin} />
      {/* head tilting right */}
      <ellipse cx="41" cy="42" rx="10" ry="11" fill={a.skin} transform="rotate(8 41 42)" />
      {/* hair bun */}
      <ellipse cx="41" cy="32" rx="11" ry="8" fill={a.hair} />
      <circle cx="41" cy="26" r="5" fill={a.hair} />
      {/* face */}
      <circle cx="38" cy="41" r="1" fill={a.dark} />
      <circle cx="44" cy="40" r="1" fill={a.dark} />
      <path d="M39 45 Q41 47 43 45" stroke={a.accent} strokeWidth="0.8" strokeLinecap="round" fill="none" />
      {/* arm reaching toward partner */}
      <path d="M50 68 Q55 66 58 68" stroke={a.skin} strokeWidth="4" strokeLinecap="round" />

      {/* Person 2 - right, head tilting left */}
      {/* body / jacket */}
      <path d="M68 72 Q70 62 75 60 L85 60 Q90 62 90 72 L90 100 L68 100 Z" fill={a.dark} />
      <path d="M79 60 L79 100" stroke={a.cloth} strokeWidth="0.6" opacity="0.3" />
      {/* neck */}
      <rect x="76" y="48" width="6" height="8" rx="2" fill={a.skin} />
      {/* head tilting left */}
      <ellipse cx="79" cy="42" rx="10" ry="11" fill={a.skin} transform="rotate(-8 79 42)" />
      {/* short hair */}
      <ellipse cx="79" cy="34" rx="11" ry="7" fill={a.hairAlt} />
      <path d="M68 38 Q68 30 79 28 Q90 30 90 38" fill={a.hairAlt} />
      {/* face */}
      <circle cx="76" cy="41" r="1" fill={a.dark} />
      <circle cx="82" cy="41" r="1" fill={a.dark} />
      <path d="M77 45 Q79 47 81 45" stroke={a.accent} strokeWidth="0.8" strokeLinecap="round" fill="none" />
      {/* arm reaching toward partner */}
      <path d="M68 68 Q63 66 60 68" stroke={a.skin} strokeWidth="4" strokeLinecap="round" />

      {/* hands touching */}
      <ellipse cx="59" cy="68" rx="3.5" ry="2.5" fill={a.skin} />

      {/* heart between them */}
      <path d="M58 30 C58 27 54 25 54 28 C54 31 58 34 58 34 C58 34 62 31 62 28 C62 25 58 27 58 30 Z" fill={a.accent} opacity="0.8" />
    </svg>
  )
}

function CoupleHugIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="60" fill={a.bg} />
      {/* Back person - taller, dark sweater */}
      {/* body */}
      <path d="M42 70 Q44 58 55 55 L68 55 Q72 58 72 70 L72 105 L42 105 Z" fill={a.dark} />
      {/* sweater neckline */}
      <path d="M52 57 Q57 60 62 57" stroke={a.cloth} strokeWidth="0.8" opacity="0.5" fill="none" />
      {/* neck */}
      <rect x="54" y="44" width="6" height="8" rx="2" fill={a.skin} />
      {/* head */}
      <ellipse cx="57" cy="37" rx="11" ry="12" fill={a.skin} />
      {/* short hair */}
      <path d="M46 34 Q46 22 57 20 Q68 22 68 34 L68 30 Q68 24 57 23 Q46 24 46 30 Z" fill={a.hairAlt} />
      <ellipse cx="57" cy="27" rx="12" ry="7" fill={a.hairAlt} />
      {/* face - looking right */}
      <circle cx="54" cy="36" r="1" fill={a.dark} />
      <circle cx="61" cy="36" r="1" fill={a.dark} />
      <path d="M55 40 Q57 42 60 40" stroke={a.accent} strokeWidth="0.8" strokeLinecap="round" fill="none" />
      {/* arm wrapping around front person */}
      <path d="M42 65 Q36 68 34 75 Q33 80 38 82 Q42 83 46 80" stroke={a.skin} strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M72 65 Q78 68 80 75 Q81 80 76 82 Q72 83 68 80" stroke={a.skin} strokeWidth="4.5" strokeLinecap="round" fill="none" />

      {/* Front person - shorter, cream top, hair bun with stick */}
      {/* body */}
      <path d="M40 78 Q42 68 50 65 L64 65 Q68 68 68 78 L68 105 L40 105 Z" fill={a.cloth} />
      <path d="M48 68 Q54 72 60 68" stroke={a.clothAlt} strokeWidth="0.7" fill="none" opacity="0.5" />
      {/* neck */}
      <rect x="52" y="54" width="5.5" height="7" rx="2" fill={a.skin} />
      {/* head */}
      <ellipse cx="55" cy="48" rx="10" ry="11" fill={a.skin} />
      {/* hair bun */}
      <ellipse cx="55" cy="39" rx="10.5" ry="6.5" fill={a.hair} />
      <circle cx="55" cy="33" r="5.5" fill={a.hair} />
      {/* bun stick */}
      <line x1="50" y1="30" x2="60" y2="36" stroke={a.clothAlt} strokeWidth="1.2" strokeLinecap="round" />
      {/* face - looking right */}
      <circle cx="52" cy="47" r="1" fill={a.dark} />
      <circle cx="58" cy="47" r="1" fill={a.dark} />
      <path d="M53 51 Q55 53 57 51" stroke={a.accent} strokeWidth="0.8" strokeLinecap="round" fill="none" />
      {/* cheek blush */}
      <circle cx="49" cy="49" r="2" fill={a.accent} opacity="0.25" />
      <circle cx="61" cy="49" r="2" fill={a.accent} opacity="0.25" />

      {/* small plant in corner */}
      <line x1="95" y1="105" x2="95" y2="90" stroke={a.green} strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="90" cy="90" rx="4" ry="3" fill={a.green} opacity="0.7" />
      <ellipse cx="99" cy="92" rx="3.5" ry="2.5" fill={a.green} opacity="0.6" />
      <ellipse cx="95" cy="87" rx="3" ry="2.5" fill={a.green} opacity="0.8" />
    </svg>
  )
}

function FamilyOneKidIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="60" fill={a.bg} />

      {/* Left parent - long hair, dress */}
      <path d="M15 75 Q17 63 25 60 L37 60 Q40 63 40 75 L40 105 L15 105 Z" fill={a.cloth} />
      <rect x="25" y="49" width="5.5" height="7" rx="2" fill={a.skin} />
      <ellipse cx="28" cy="42" rx="10" ry="11" fill={a.skin} />
      {/* long hair */}
      <ellipse cx="28" cy="34" rx="11" ry="7" fill={a.hair} />
      <path d="M17 38 Q17 30 28 28 Q18 35 18 50" fill={a.hair} />
      <path d="M39 38 Q39 30 28 28 Q38 35 38 50" fill={a.hair} />
      {/* face */}
      <circle cx="25" cy="41" r="1" fill={a.dark} />
      <circle cx="31" cy="41" r="1" fill={a.dark} />
      <path d="M26 45 Q28 47 30 45" stroke={a.accent} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* arm down toward child */}
      <path d="M38 68 Q42 72 48 78" stroke={a.skin} strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* Right parent - short hair, jacket */}
      <path d="M80 75 Q82 63 88 60 L98 60 Q102 63 102 75 L102 105 L80 105 Z" fill={a.clothAlt} />
      <path d="M91 60 L91 105" stroke={a.dark} strokeWidth="0.6" opacity="0.3" />
      <rect x="88" y="49" width="5.5" height="7" rx="2" fill={a.skin} />
      <ellipse cx="91" cy="42" rx="10" ry="11" fill={a.skin} />
      <path d="M81 38 Q81 26 91 24 Q101 26 101 38" fill={a.hairAlt} />
      <ellipse cx="91" cy="30" rx="11" ry="7" fill={a.hairAlt} />
      {/* face */}
      <circle cx="88" cy="41" r="1" fill={a.dark} />
      <circle cx="94" cy="41" r="1" fill={a.dark} />
      <path d="M89 45 Q91 47 93 45" stroke={a.accent} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* arm down toward child */}
      <path d="M82 68 Q78 72 72 78" stroke={a.skin} strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* Child in center - smaller */}
      <path d="M50 88 Q52 80 57 78 L63 78 Q68 80 68 88 L68 105 L50 105 Z" fill={a.cloth} />
      <rect x="57" y="70" width="4.5" height="5.5" rx="1.5" fill={a.skin} />
      <ellipse cx="60" cy="65" rx="8" ry="9" fill={a.skin} />
      <ellipse cx="60" cy="58" rx="8.5" ry="5.5" fill={a.hair} />
      {/* child face */}
      <circle cx="57" cy="64" r="0.9" fill={a.dark} />
      <circle cx="63" cy="64" r="0.9" fill={a.dark} />
      <path d="M58 67 Q60 69 62 67" stroke={a.accent} strokeWidth="0.7" fill="none" strokeLinecap="round" />
      {/* child hands connecting to parents */}
      <path d="M50 83 Q47 80 48 78" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M68 83 Q71 80 72 78" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* heart above child */}
      <path d="M60 50 C60 47 56 45 56 48 C56 51 60 54 60 54 C60 54 64 51 64 48 C64 45 60 47 60 50 Z" fill={a.accent} opacity="0.7" />
    </svg>
  )
}

function FamilyTwoKidsIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="60" fill={a.bg} />

      {/* Left parent - long hair, dress */}
      <path d="M8 74 Q10 62 18 59 L30 59 Q34 62 34 74 L34 108 L8 108 Z" fill={a.cloth} />
      <rect x="20" y="48" width="5.5" height="7" rx="2" fill={a.skin} />
      <ellipse cx="23" cy="41" rx="9.5" ry="10.5" fill={a.skin} />
      <ellipse cx="23" cy="33" rx="10.5" ry="6.5" fill={a.hair} />
      <path d="M13 37 Q13 29 23 27 Q14 34 14 48" fill={a.hair} />
      <path d="M33 37 Q33 29 23 27 Q32 34 32 48" fill={a.hair} />
      <circle cx="20" cy="40" r="0.9" fill={a.dark} />
      <circle cx="26" cy="40" r="0.9" fill={a.dark} />
      <path d="M21 44 Q23 46 25 44" stroke={a.accent} strokeWidth="0.7" fill="none" strokeLinecap="round" />
      {/* hand on older child's shoulder */}
      <path d="M34 70 Q38 72 42 74" stroke={a.skin} strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Right parent - short hair, jacket */}
      <path d="M86 74 Q88 62 94 59 L104 59 Q108 62 108 74 L108 108 L86 108 Z" fill={a.clothAlt} />
      <rect x="96" y="48" width="5.5" height="7" rx="2" fill={a.skin} />
      <ellipse cx="99" cy="41" rx="9.5" ry="10.5" fill={a.skin} />
      <path d="M89 36 Q89 25 99 23 Q109 25 109 36" fill={a.hairAlt} />
      <ellipse cx="99" cy="29" rx="10.5" ry="6.5" fill={a.hairAlt} />
      <circle cx="96" cy="40" r="0.9" fill={a.dark} />
      <circle cx="102" cy="40" r="0.9" fill={a.dark} />
      <path d="M97 44 Q99 46 101 44" stroke={a.accent} strokeWidth="0.7" fill="none" strokeLinecap="round" />

      {/* Older kid - medium height */}
      <path d="M40 84 Q42 76 47 74 L55 74 Q58 76 58 84 L58 108 L40 108 Z" fill={a.clothAlt} />
      <rect x="48" y="66" width="4.5" height="5.5" rx="1.5" fill={a.skin} />
      <ellipse cx="50" cy="60" rx="8" ry="9" fill={a.skin} />
      {/* ponytail hair */}
      <ellipse cx="50" cy="53" rx="8.5" ry="5.5" fill={a.hairAlt} />
      <path d="M57 53 Q62 55 63 62" stroke={a.hairAlt} strokeWidth="3" strokeLinecap="round" />
      <circle cx="47" cy="59" r="0.8" fill={a.dark} />
      <circle cx="53" cy="59" r="0.8" fill={a.dark} />
      <path d="M48 63 Q50 65 52 63" stroke={a.accent} strokeWidth="0.7" fill="none" strokeLinecap="round" />

      {/* Younger kid - shorter, with teddy */}
      <path d="M62 90 Q64 84 68 82 L76 82 Q78 84 78 90 L78 108 L62 108 Z" fill={a.cloth} />
      <rect x="69" y="75" width="4" height="5" rx="1.5" fill={a.skin} />
      <ellipse cx="71" cy="69" rx="7" ry="8" fill={a.skin} />
      <ellipse cx="71" cy="63" rx="7.5" ry="5" fill={a.hair} />
      <circle cx="68" cy="68" r="0.7" fill={a.dark} />
      <circle cx="74" cy="68" r="0.7" fill={a.dark} />
      <path d="M69 72 Q71 73.5 73 72" stroke={a.accent} strokeWidth="0.6" fill="none" strokeLinecap="round" />
      {/* teddy bear held by younger kid */}
      <circle cx="82" cy="90" r="4" fill={a.clothAlt} />
      <circle cx="82" cy="86" r="2.8" fill={a.clothAlt} />
      <circle cx="80" cy="84.5" r="1.2" fill={a.clothAlt} />
      <circle cx="84" cy="84.5" r="1.2" fill={a.clothAlt} />
      <circle cx="81" cy="85.5" r="0.5" fill={a.dark} />
      <circle cx="83" cy="85.5" r="0.5" fill={a.dark} />
      {/* kid arm to teddy */}
      <path d="M78 88 Q80 88 82 88" stroke={a.skin} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function CoupleWalkIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="60" fill={a.bg} />

      {/* background - simple street lamp */}
      <rect x="96" y="20" width="2" height="80" rx="1" fill={a.dark} opacity="0.2" />
      <ellipse cx="97" cy="20" rx="6" ry="3" fill={a.dark} opacity="0.15" />
      <circle cx="97" cy="18" r="2.5" fill={a.accent} opacity="0.2" />
      {/* background tree */}
      <rect x="14" y="50" width="2.5" height="50" rx="1" fill={a.dark} opacity="0.15" />
      <ellipse cx="15" cy="44" rx="8" ry="10" fill={a.green} opacity="0.25" />

      {/* ground path */}
      <path d="M0 100 Q60 95 120 100" stroke={a.dark} strokeWidth="1" opacity="0.2" fill="none" />

      {/* Person 1 - left, slightly angled, with scarf */}
      {/* body angled */}
      <path d="M30 72 Q33 62 38 60 L48 60 Q50 63 49 72 L47 100 L28 100 Z" fill={a.cloth} />
      {/* legs walking */}
      <path d="M32 95 L28 108" stroke={a.dark} strokeWidth="3" strokeLinecap="round" />
      <path d="M44 95 L48 108" stroke={a.dark} strokeWidth="3" strokeLinecap="round" />
      {/* neck */}
      <rect x="37" y="49" width="5.5" height="7" rx="2" fill={a.skin} />
      {/* head */}
      <ellipse cx="40" cy="42" rx="9.5" ry="10.5" fill={a.skin} />
      {/* long hair */}
      <ellipse cx="40" cy="34" rx="10.5" ry="6.5" fill={a.hair} />
      <path d="M30 37 Q30 30 40 28 Q31 35 31 48" fill={a.hair} />
      <path d="M50 37 Q50 30 40 28 Q49 35 49 45" fill={a.hair} />
      {/* face */}
      <circle cx="37" cy="41" r="0.9" fill={a.dark} />
      <circle cx="43" cy="41" r="0.9" fill={a.dark} />
      <path d="M38 45 Q40 46.5 42 45" stroke={a.accent} strokeWidth="0.7" fill="none" strokeLinecap="round" />
      {/* scarf flowing */}
      <path d="M35 55 Q32 52 28 54 Q24 56 22 52" stroke={a.accent} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M35 55 Q36 58 33 60" stroke={a.accent} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* arm toward partner */}
      <path d="M49 66 Q54 65 58 66" stroke={a.skin} strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* Person 2 - right, slightly angled, jacket */}
      <path d="M64 72 Q67 62 73 60 L83 60 Q86 63 85 72 L83 100 L62 100 Z" fill={a.dark} />
      {/* jacket lapel detail */}
      <path d="M73 60 L76 66 L79 60" stroke={a.cloth} strokeWidth="0.7" opacity="0.4" fill="none" />
      {/* legs walking */}
      <path d="M68 95 L72 108" stroke={a.dark} strokeWidth="3" strokeLinecap="round" />
      <path d="M80 95 L76 108" stroke={a.dark} strokeWidth="3" strokeLinecap="round" />
      {/* neck */}
      <rect x="73" y="49" width="5.5" height="7" rx="2" fill={a.skin} />
      {/* head */}
      <ellipse cx="76" cy="42" rx="9.5" ry="10.5" fill={a.skin} />
      {/* short hair */}
      <path d="M66 37 Q66 26 76 24 Q86 26 86 37" fill={a.hairAlt} />
      <ellipse cx="76" cy="30" rx="10.5" ry="7" fill={a.hairAlt} />
      {/* face */}
      <circle cx="73" cy="41" r="0.9" fill={a.dark} />
      <circle cx="79" cy="41" r="0.9" fill={a.dark} />
      <path d="M74 45 Q76 46.5 78 45" stroke={a.accent} strokeWidth="0.7" fill="none" strokeLinecap="round" />
      {/* arm toward partner */}
      <path d="M64 66 Q60 65 58 66" stroke={a.skin} strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* clasped hands */}
      <ellipse cx="58" cy="66" rx="3" ry="2.5" fill={a.skin} />
    </svg>
  )
}

/* ─── Siblings ─── */

function SiblingsCuteIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="60" fill={a.bg} />

      {/* Taller sibling - left, ponytail */}
      <path d="M28 74 Q30 64 36 61 L48 61 Q52 64 52 74 L52 108 L28 108 Z" fill={a.cloth} />
      <rect x="38" y="50" width="5.5" height="7" rx="2" fill={a.skin} />
      <ellipse cx="41" cy="43" rx="10" ry="11" fill={a.skin} />
      {/* ponytail */}
      <ellipse cx="41" cy="35" rx="10.5" ry="6" fill={a.hair} />
      <path d="M50 35 Q56 38 57 48 Q58 52 56 55" stroke={a.hair} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      {/* face */}
      <circle cx="38" cy="42" r="1" fill={a.dark} />
      <circle cx="44" cy="42" r="1" fill={a.dark} />
      <path d="M39 46 Q41 48 43 46" stroke={a.accent} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* cheek */}
      <circle cx="35" cy="44" r="1.8" fill={a.accent} opacity="0.2" />
      {/* arm around shorter sibling's shoulder */}
      <path d="M52 68 Q58 64 66 66 Q70 67 72 70" stroke={a.skin} strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* Shorter sibling - right, short hair, looking up */}
      <path d="M62 82 Q64 74 69 72 L79 72 Q82 74 82 82 L82 108 L62 108 Z" fill={a.clothAlt} />
      <rect x="71" y="63" width="4.5" height="6" rx="1.5" fill={a.skin} />
      <ellipse cx="73" cy="56" rx="9" ry="10" fill={a.skin} />
      {/* short hair */}
      <ellipse cx="73" cy="49" rx="9.5" ry="5.5" fill={a.hairAlt} />
      <path d="M64 52 Q64 44 73 42 Q82 44 82 52" fill={a.hairAlt} />
      {/* face looking up */}
      <circle cx="70" cy="54" r="0.9" fill={a.dark} />
      <circle cx="76" cy="54" r="0.9" fill={a.dark} />
      <path d="M71 58 Q73 60 75 58" stroke={a.accent} strokeWidth="0.7" fill="none" strokeLinecap="round" />
      {/* cheek */}
      <circle cx="67" cy="57" r="1.5" fill={a.accent} opacity="0.2" />

      {/* sparkles/hearts between them */}
      <path d="M56 38 C56 36 53 35 53 37 C53 39 56 41 56 41 C56 41 59 39 59 37 C59 35 56 36 56 38 Z" fill={a.accent} opacity="0.5" />
      <circle cx="62" cy="44" r="1.2" fill={a.accent} opacity="0.4" />
      <circle cx="50" cy="34" r="1" fill={a.accent} opacity="0.3" />
    </svg>
  )
}

function SiblingsFightIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="60" fill={a.bg} />

      {/* Chaser - left, running right */}
      <path d="M18 72 Q20 64 26 62 L36 62 Q40 64 38 72 L36 100 L16 100 Z" fill={a.cloth} transform="rotate(-8 27 80)" />
      {/* running legs */}
      <path d="M20 95 L14 108" stroke={a.dark} strokeWidth="2.8" strokeLinecap="round" />
      <path d="M34 92 L42 105" stroke={a.dark} strokeWidth="2.8" strokeLinecap="round" />
      <rect x="27" y="52" width="5" height="6" rx="2" fill={a.skin} />
      <ellipse cx="30" cy="45" rx="9" ry="10" fill={a.skin} />
      <ellipse cx="30" cy="38" rx="9.5" ry="5.5" fill={a.hair} />
      <path d="M21 41 Q21 34 30 32 Q22 38 22 46" fill={a.hair} />
      {/* face - determined */}
      <circle cx="28" cy="44" r="0.9" fill={a.dark} />
      <circle cx="34" cy="44" r="0.9" fill={a.dark} />
      <path d="M29 48 L33 48" stroke={a.dark} strokeWidth="0.8" strokeLinecap="round" />
      {/* eyebrows angled */}
      <path d="M26 42 L29 41" stroke={a.dark} strokeWidth="0.7" strokeLinecap="round" />
      <path d="M33 41 L36 42" stroke={a.dark} strokeWidth="0.7" strokeLinecap="round" />
      {/* arms extended forward */}
      <path d="M38 66 Q44 62 50 60" stroke={a.skin} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M36 70 Q42 68 48 65" stroke={a.skin} strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Runner - right, looking back */}
      <path d="M76 72 Q78 64 84 62 L94 62 Q96 64 95 72 L93 100 L74 100 Z" fill={a.clothAlt} transform="rotate(6 85 80)" />
      {/* running legs */}
      <path d="M78 95 L84 108" stroke={a.dark} strokeWidth="2.8" strokeLinecap="round" />
      <path d="M92 92 L86 108" stroke={a.dark} strokeWidth="2.8" strokeLinecap="round" />
      <rect x="83" y="52" width="5" height="6" rx="2" fill={a.skin} />
      <ellipse cx="86" cy="45" rx="9" ry="10" fill={a.skin} />
      <ellipse cx="86" cy="38" rx="9.5" ry="5.5" fill={a.hairAlt} />
      <path d="M95 41 Q95 34 86 32 Q94 38 94 46" fill={a.hairAlt} />
      {/* face - looking back, playful */}
      <circle cx="83" cy="44" r="0.9" fill={a.dark} />
      <circle cx="89" cy="44" r="0.9" fill={a.dark} />
      <path d="M84 48 Q86 50 88 48" stroke={a.accent} strokeWidth="0.8" fill="none" strokeLinecap="round" />

      {/* motion lines */}
      <path d="M70 55 L66 55" stroke={a.dark} strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
      <path d="M72 60 L67 60" stroke={a.dark} strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
      <path d="M71 65 L66 65" stroke={a.dark} strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />

      {/* lightning bolt between them (fun rivalry) */}
      <path d="M56 40 L59 46 L55 46 L58 52" stroke={a.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* toy on ground */}
      <rect x="55" y="98" width="8" height="5" rx="1.5" fill={a.clothAlt} />
      <circle cx="59" cy="96" r="2.5" fill={a.accent} opacity="0.5" />
    </svg>
  )
}

function BrotherSisterIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="60" fill={a.bg} />

      {/* Boy - left side, short messy hair, t-shirt + shorts, sneakers */}
      {/* shorts */}
      <path d="M28 82 L28 95 L36 95 L38 82 Z" fill={a.dark} />
      <path d="M38 82 L40 95 L48 95 L48 82 Z" fill={a.dark} />
      {/* t-shirt */}
      <path d="M26 68 Q28 60 34 58 L44 58 Q48 60 48 68 L48 84 L26 84 Z" fill={a.clothAlt} />
      {/* t-shirt sleeves */}
      <path d="M26 62 Q22 63 20 68" stroke={a.clothAlt} strokeWidth="4" strokeLinecap="round" />
      <path d="M48 62 Q52 63 54 68" stroke={a.clothAlt} strokeWidth="4" strokeLinecap="round" />
      {/* sneakers */}
      <ellipse cx="32" cy="98" rx="5" ry="2.5" fill={a.cloth} />
      <ellipse cx="44" cy="98" rx="5" ry="2.5" fill={a.cloth} />
      <path d="M29 97 L35 97" stroke={a.dark} strokeWidth="0.5" opacity="0.3" />
      <path d="M41 97 L47 97" stroke={a.dark} strokeWidth="0.5" opacity="0.3" />
      {/* legs */}
      <rect x="30" y="95" width="4" height="3" rx="1" fill={a.skin} />
      <rect x="42" y="95" width="4" height="3" rx="1" fill={a.skin} />
      {/* neck */}
      <rect x="34" y="48" width="5.5" height="6" rx="2" fill={a.skin} />
      {/* head */}
      <ellipse cx="37" cy="41" rx="10" ry="11" fill={a.skin} />
      {/* messy short hair */}
      <path d="M27 37 Q27 26 37 24 Q47 26 47 37" fill={a.hairAlt} />
      <path d="M28 34 Q30 28 37 26 Q44 28 46 34" fill={a.hairAlt} />
      <path d="M30 30 L28 26" stroke={a.hairAlt} strokeWidth="2" strokeLinecap="round" />
      <path d="M37 28 L38 24" stroke={a.hairAlt} strokeWidth="2" strokeLinecap="round" />
      <path d="M44 30 L46 27" stroke={a.hairAlt} strokeWidth="2" strokeLinecap="round" />
      {/* face */}
      <circle cx="34" cy="40" r="1" fill={a.dark} />
      <circle cx="40" cy="40" r="1" fill={a.dark} />
      <path d="M35 44 Q37 46 39 44" stroke={a.accent} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* arm link toward sister */}
      <path d="M48 72 Q52 70 56 72" stroke={a.skin} strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Girl - right side, long hair with bow, dress, shoes */}
      {/* dress */}
      <path d="M60 68 Q62 60 68 58 L78 58 Q82 60 82 68 L85 100 L55 100 Z" fill={a.cloth} />
      <path d="M65 68 Q70 72 75 68" stroke={a.clothAlt} strokeWidth="0.7" fill="none" opacity="0.5" />
      {/* dress hem detail */}
      <path d="M57 98 Q62 95 67 98 Q72 95 77 98 Q82 95 85 98" stroke={a.clothAlt} strokeWidth="0.8" fill="none" opacity="0.4" />
      {/* shoes */}
      <ellipse cx="63" cy="103" rx="4.5" ry="2" fill={a.dark} />
      <ellipse cx="77" cy="103" rx="4.5" ry="2" fill={a.dark} />
      {/* legs */}
      <rect x="61" y="99" width="3.5" height="3" rx="1" fill={a.skin} />
      <rect x="75" y="99" width="3.5" height="3" rx="1" fill={a.skin} />
      {/* neck */}
      <rect x="67" y="48" width="5.5" height="6" rx="2" fill={a.skin} />
      {/* head */}
      <ellipse cx="70" cy="41" rx="10" ry="11" fill={a.skin} />
      {/* long hair */}
      <ellipse cx="70" cy="34" rx="11" ry="6.5" fill={a.hair} />
      <path d="M59 38 Q59 30 70 28 Q60 35 60 52" fill={a.hair} />
      <path d="M81 38 Q81 30 70 28 Q80 35 80 52" fill={a.hair} />
      {/* bow/ribbon */}
      <circle cx="78" cy="32" r="2" fill={a.accent} />
      <path d="M76 32 Q74 29 72 32" fill={a.accent} />
      <path d="M80 32 Q82 29 84 32" fill={a.accent} />
      {/* face */}
      <circle cx="67" cy="40" r="1" fill={a.dark} />
      <circle cx="73" cy="40" r="1" fill={a.dark} />
      <path d="M68 44 Q70 46 72 44" stroke={a.accent} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* cheek */}
      <circle cx="64" cy="43" r="1.5" fill={a.accent} opacity="0.2" />
      {/* arm link toward brother */}
      <path d="M60 72 Q56 70 52 72" stroke={a.skin} strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* star sparkle above */}
      <path d="M58 22 L59 18 L60 22 L64 23 L60 24 L59 28 L58 24 L54 23 Z" fill={a.accent} opacity="0.5" />
    </svg>
  )
}

function OlderYoungerIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="60" fill={a.bg} />

      {/* Older sibling - much taller, jacket, leaning toward younger */}
      {/* jacket body */}
      <path d="M25 70 Q27 60 34 57 L46 57 Q50 60 50 70 L50 108 L25 108 Z" fill={a.dark} />
      {/* jacket collar */}
      <path d="M34 58 L38 63 L42 58" stroke={a.cloth} strokeWidth="0.8" fill="none" opacity="0.5" />
      {/* jacket center line */}
      <path d="M38 63 L38 108" stroke={a.cloth} strokeWidth="0.6" opacity="0.3" />
      {/* legs */}
      <rect x="28" y="100" width="5" height="8" rx="2" fill={a.dark} />
      <rect x="42" y="100" width="5" height="8" rx="2" fill={a.dark} />
      {/* neck */}
      <rect x="35" y="46" width="5.5" height="7" rx="2" fill={a.skin} />
      {/* head leaning right */}
      <ellipse cx="38" cy="39" rx="10" ry="11" fill={a.skin} transform="rotate(-5 38 39)" />
      {/* mature hair */}
      <path d="M28 35 Q28 24 38 22 Q48 24 48 35" fill={a.hairAlt} />
      <ellipse cx="38" cy="28" rx="11" ry="7" fill={a.hairAlt} />
      {/* face */}
      <circle cx="35" cy="38" r="1" fill={a.dark} />
      <circle cx="41" cy="38" r="1" fill={a.dark} />
      <path d="M36 42 Q38 44 40 42" stroke={a.accent} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* hand on younger's head */}
      <path d="M50 66 Q58 62 66 58 Q70 56 72 55" stroke={a.skin} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <ellipse cx="72" cy="55" rx="3" ry="2" fill={a.skin} />

      {/* Younger sibling - small, overalls, looking up */}
      {/* overalls */}
      <path d="M62 82 Q64 76 69 74 L79 74 Q82 76 82 82 L82 108 L62 108 Z" fill={a.clothAlt} />
      {/* overall straps */}
      <path d="M66 74 L66 82" stroke={a.dark} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M78 74 L78 82" stroke={a.dark} strokeWidth="1.2" strokeLinecap="round" />
      {/* overall chest piece */}
      <rect x="66" y="78" width="12" height="5" rx="1" fill={a.cloth} />
      {/* overall button */}
      <circle cx="68" cy="79" r="0.8" fill={a.dark} />
      <circle cx="76" cy="79" r="0.8" fill={a.dark} />
      {/* legs */}
      <rect x="64" y="102" width="4" height="6" rx="1.5" fill={a.clothAlt} />
      <rect x="76" y="102" width="4" height="6" rx="1.5" fill={a.clothAlt} />
      {/* shoes */}
      <ellipse cx="66" cy="108" rx="3.5" ry="2" fill={a.dark} />
      <ellipse cx="78" cy="108" rx="3.5" ry="2" fill={a.dark} />
      {/* neck */}
      <rect x="70" y="60" width="4.5" height="5" rx="1.5" fill={a.skin} />
      {/* head looking up */}
      <ellipse cx="72" cy="54" rx="8.5" ry="9.5" fill={a.skin} />
      {/* cute childish hair */}
      <ellipse cx="72" cy="47" rx="9" ry="5.5" fill={a.hair} />
      <path d="M63 50 Q63 43 72 41 Q81 43 81 50" fill={a.hair} />
      {/* small tuft */}
      <path d="M72 41 Q72 37 74 36" stroke={a.hair} strokeWidth="2" strokeLinecap="round" />
      {/* face looking up */}
      <circle cx="69" cy="52" r="0.8" fill={a.dark} />
      <circle cx="75" cy="52" r="0.8" fill={a.dark} />
      {/* big happy smile */}
      <path d="M69 56 Q72 59 75 56" stroke={a.accent} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* cheeks */}
      <circle cx="66" cy="55" r="1.8" fill={a.accent} opacity="0.2" />
      <circle cx="78" cy="55" r="1.8" fill={a.accent} opacity="0.2" />
    </svg>
  )
}

/* ─── Cousins ─── */

function CousinsGroupIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="60" fill={a.bg} />

      {/* Person 1 - far left, medium height */}
      <path d="M6 78 Q8 70 13 68 L21 68 Q24 70 24 78 L24 108 L6 108 Z" fill={a.cloth} />
      <rect x="14" y="59" width="4" height="5" rx="1.5" fill={a.skin} />
      <ellipse cx="16" cy="53" rx="7.5" ry="8.5" fill={a.skin} />
      <ellipse cx="16" cy="47" rx="8" ry="5" fill={a.hair} />
      <path d="M8 50 Q8 43 16 41 Q9 47 9 55" fill={a.hair} />
      <circle cx="14" cy="52" r="0.7" fill={a.dark} />
      <circle cx="19" cy="52" r="0.7" fill={a.dark} />
      <path d="M14.5 55.5 Q16 57 17.5 55.5" stroke={a.accent} strokeWidth="0.6" fill="none" strokeLinecap="round" />
      {/* arm around person 2 */}
      <path d="M24 74 Q28 72 32 74" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Person 2 - second from left, tallest */}
      <path d="M26 72 Q28 62 34 60 L42 60 Q46 62 46 72 L46 108 L26 108 Z" fill={a.dark} />
      <rect x="35" y="50" width="4.5" height="6" rx="1.5" fill={a.skin} />
      <ellipse cx="37" cy="43" rx="8.5" ry="9.5" fill={a.skin} />
      <path d="M29 40 Q29 30 37 28 Q45 30 45 40" fill={a.hairAlt} />
      <ellipse cx="37" cy="33" rx="9" ry="6" fill={a.hairAlt} />
      <circle cx="34" cy="42" r="0.8" fill={a.dark} />
      <circle cx="40" cy="42" r="0.8" fill={a.dark} />
      <path d="M35 46 Q37 48 39 46" stroke={a.accent} strokeWidth="0.7" fill="none" strokeLinecap="round" />

      {/* Person 3 - center, shorter (child) */}
      <path d="M48 86 Q50 78 54 76 L62 76 Q64 78 64 86 L64 108 L48 108 Z" fill={a.clothAlt} />
      <rect x="55" y="68" width="4" height="5" rx="1.5" fill={a.skin} />
      <ellipse cx="57" cy="62" rx="7.5" ry="8.5" fill={a.skin} />
      <ellipse cx="57" cy="56" rx="8" ry="5" fill={a.hair} />
      <circle cx="55" cy="61" r="0.7" fill={a.dark} />
      <circle cx="60" cy="61" r="0.7" fill={a.dark} />
      <path d="M55.5 64.5 Q57 66 58.5 64.5" stroke={a.accent} strokeWidth="0.6" fill="none" strokeLinecap="round" />
      {/* pigtails */}
      <path d="M49 56 Q47 58 47 62" stroke={a.hair} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M65 56 Q67 58 67 62" stroke={a.hair} strokeWidth="2.5" strokeLinecap="round" />

      {/* Person 4 - second from right, tall */}
      <path d="M66 74 Q68 64 73 62 L81 62 Q84 64 84 74 L84 108 L66 108 Z" fill={a.cloth} />
      <rect x="74" y="52" width="4.5" height="6" rx="1.5" fill={a.skin} />
      <ellipse cx="76" cy="45" rx="8.5" ry="9.5" fill={a.skin} />
      <ellipse cx="76" cy="38" rx="9" ry="5.5" fill={a.hairAlt} />
      <path d="M85 42 Q85 34 76 32 Q84 38 84 48" fill={a.hairAlt} />
      <circle cx="73" cy="44" r="0.8" fill={a.dark} />
      <circle cx="79" cy="44" r="0.8" fill={a.dark} />
      <path d="M74 48 Q76 50 78 48" stroke={a.accent} strokeWidth="0.7" fill="none" strokeLinecap="round" />
      {/* arm around person 5 */}
      <path d="M84 72 Q88 70 92 72" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Person 5 - far right, medium-short */}
      <path d="M86 80 Q88 72 93 70 L101 70 Q104 72 104 80 L104 108 L86 108 Z" fill={a.dark} />
      <rect x="94" y="62" width="4" height="5" rx="1.5" fill={a.skin} />
      <ellipse cx="96" cy="56" rx="7.5" ry="8.5" fill={a.skin} />
      <ellipse cx="96" cy="50" rx="8" ry="5" fill={a.hair} />
      <path d="M88 53 Q88 46 96 44 Q89 50 89 58" fill={a.hair} />
      <circle cx="93" cy="55" r="0.7" fill={a.dark} />
      <circle cx="99" cy="55" r="0.7" fill={a.dark} />
      <path d="M94 58.5 Q96 60 98 58.5" stroke={a.accent} strokeWidth="0.6" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function CousinsFunIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="60" fill={a.bg} />

      {/* Cousin 1 - far left, arms up */}
      <path d="M10 78 Q12 70 17 68 L27 68 Q30 70 30 78 L30 108 L10 108 Z" fill={a.cloth} />
      <rect x="18" y="58" width="4.5" height="6" rx="1.5" fill={a.skin} />
      <ellipse cx="20" cy="52" rx="8" ry="9" fill={a.skin} />
      <ellipse cx="20" cy="45" rx="8.5" ry="5.5" fill={a.hair} />
      <path d="M12 48 Q12 41 20 39 Q28 41 28 48" fill={a.hair} />
      {/* face - laughing */}
      <circle cx="17" cy="51" r="0.8" fill={a.dark} />
      <circle cx="23" cy="51" r="0.8" fill={a.dark} />
      <path d="M17 55 Q20 58 23 55" stroke={a.dark} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* arms up */}
      <path d="M12 70 Q8 60 6 52" stroke={a.skin} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M28 70 Q32 60 34 52" stroke={a.skin} strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* legs */}
      <rect x="14" y="103" width="4" height="5" rx="1.5" fill={a.dark} />
      <rect x="24" y="103" width="4" height="5" rx="1.5" fill={a.dark} />

      {/* Cousin 2 - jumping! (elevated position) */}
      <path d="M38 62 Q40 54 45 52 L55 52 Q58 54 58 62 L58 88 L38 88 Z" fill={a.clothAlt} />
      <rect x="44" y="42" width="5" height="6" rx="1.5" fill={a.skin} />
      <ellipse cx="47" cy="35" rx="8.5" ry="9.5" fill={a.skin} />
      <ellipse cx="47" cy="28" rx="9" ry="5.5" fill={a.hairAlt} />
      <path d="M38 32 Q38 24 47 22 Q56 24 56 32" fill={a.hairAlt} />
      {/* face - excited */}
      <circle cx="44" cy="34" r="0.8" fill={a.dark} />
      <circle cx="50" cy="34" r="0.8" fill={a.dark} />
      <ellipse cx="47" cy="38.5" rx="2.5" ry="2" fill={a.dark} opacity="0.15" />
      <path d="M44.5 38 Q47 41 49.5 38" stroke={a.dark} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* arms up high */}
      <path d="M38 56 Q34 46 30 38" stroke={a.skin} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M58 56 Q62 46 66 38" stroke={a.skin} strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* legs apart (jumping) */}
      <path d="M42 86 L36 98" stroke={a.dark} strokeWidth="3" strokeLinecap="round" />
      <path d="M54 86 L60 98" stroke={a.dark} strokeWidth="3" strokeLinecap="round" />
      {/* motion lines under jumper */}
      <path d="M40 94 L56 94" stroke={a.dark} strokeWidth="0.6" opacity="0.25" strokeLinecap="round" />
      <path d="M42 97 L54 97" stroke={a.dark} strokeWidth="0.6" opacity="0.2" strokeLinecap="round" />

      {/* Cousin 3 - right of center, arms raised */}
      <path d="M64 76 Q66 68 71 66 L81 66 Q84 68 84 76 L84 108 L64 108 Z" fill={a.dark} />
      <rect x="72" y="56" width="5" height="6" rx="1.5" fill={a.skin} />
      <ellipse cx="75" cy="50" rx="8.5" ry="9.5" fill={a.skin} />
      <ellipse cx="75" cy="43" rx="9" ry="5.5" fill={a.hair} />
      <path d="M66 46 Q66 39 75 37 Q67 43 67 52" fill={a.hair} />
      <path d="M84 46 Q84 39 75 37 Q83 43 83 52" fill={a.hair} />
      {/* face - laughing */}
      <circle cx="72" cy="49" r="0.8" fill={a.dark} />
      <circle cx="78" cy="49" r="0.8" fill={a.dark} />
      <path d="M72 53 Q75 56 78 53" stroke={a.dark} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* one arm up */}
      <path d="M64 70 Q60 60 58 52" stroke={a.skin} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M84 72 Q88 68 92 70" stroke={a.skin} strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Cousin 4 - far right, smaller/younger */}
      <path d="M88 84 Q90 78 94 76 L102 76 Q104 78 104 84 L104 108 L88 108 Z" fill={a.cloth} />
      <rect x="95" y="68" width="4" height="5" rx="1.5" fill={a.skin} />
      <ellipse cx="97" cy="62" rx="7.5" ry="8.5" fill={a.skin} />
      <ellipse cx="97" cy="56" rx="8" ry="5" fill={a.hairAlt} />
      {/* face - big smile */}
      <circle cx="94" cy="61" r="0.7" fill={a.dark} />
      <circle cx="100" cy="61" r="0.7" fill={a.dark} />
      <path d="M94 65 Q97 67.5 100 65" stroke={a.dark} strokeWidth="0.7" fill="none" strokeLinecap="round" />
      {/* arms up */}
      <path d="M88 80 Q85 74 82 68" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M104 80 Q107 74 110 68" stroke={a.skin} strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* ball in scene */}
      <circle cx="14" cy="102" r="5" fill={a.accent} opacity="0.6" />
      <path d="M11 99 Q14 102 17 99" stroke={a.cloth} strokeWidth="0.7" opacity="0.4" fill="none" />
      <path d="M11 105 Q14 102 17 105" stroke={a.cloth} strokeWidth="0.7" opacity="0.4" fill="none" />

      {/* motion lines around the group */}
      <path d="M30 36 L28 32" stroke={a.dark} strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
      <path d="M33 34 L33 30" stroke={a.dark} strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
      <path d="M66 36 L68 32" stroke={a.dark} strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
      <path d="M110 64 L113 62" stroke={a.dark} strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
    </svg>
  )
}


// === Icons from _icons_part4.tsx ===
function ReadingIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>
      {/* Lamp with glow */}
      <circle cx="28" cy="38" r="14" fill={a.accent} opacity="0.15"/>
      <rect x="26" y="42" width="4" height="18" rx="1" fill={a.dark}/>
      <path d="M22 42 L34 42 L30 34 Q28 30 26 34 Z" fill={a.accent}/>
      <circle cx="28" cy="33" r="3" fill="#fffbe6" opacity="0.7"/>
      {/* Plant in pot */}
      <rect x="86" y="78" width="12" height="10" rx="2" fill={a.accent}/>
      <path d="M92 78 Q92 68 86 62" stroke={a.green} strokeWidth="2.5" fill="none"/>
      <path d="M92 78 Q92 70 98 64" stroke={a.green} strokeWidth="2.5" fill="none"/>
      <ellipse cx="85" cy="61" rx="4" ry="3" fill={a.green}/>
      <ellipse cx="99" cy="63" rx="4" ry="3" fill={a.green}/>
      <ellipse cx="92" cy="66" rx="3.5" ry="2.5" fill={a.green} opacity="0.7"/>
      {/* Person body - cross-legged */}
      <ellipse cx="58" cy="88" rx="20" ry="8" fill={a.clothAlt} opacity="0.5"/>
      <path d="M48 82 Q52 92 58 88 Q64 84 50 82 Z" fill={a.cloth}/>
      <path d="M68 82 Q64 92 58 88 Q52 84 66 82 Z" fill={a.cloth}/>
      {/* Torso with cozy sweater */}
      <path d="M48 58 Q46 75 48 82 L68 82 Q70 75 68 58 Z" fill={a.clothAlt}/>
      <path d="M50 65 L66 65" stroke={a.accent} strokeWidth="1" opacity="0.4"/>
      <path d="M50 70 L66 70" stroke={a.accent} strokeWidth="1" opacity="0.4"/>
      <path d="M50 75 L66 75" stroke={a.accent} strokeWidth="1" opacity="0.4"/>
      {/* Neck */}
      <rect x="55" y="50" width="6" height="8" rx="2" fill={a.skin}/>
      {/* Head */}
      <ellipse cx="58" cy="44" rx="11" ry="12" fill={a.skin}/>
      {/* Hair bun */}
      <path d="M47 42 Q47 30 58 30 Q69 30 69 42 Q66 36 58 36 Q50 36 47 42 Z" fill={a.hair}/>
      <circle cx="58" cy="28" r="6" fill={a.hair}/>
      <circle cx="58" cy="28" r="4" fill={a.hairAlt}/>
      {/* Glasses */}
      <circle cx="53" cy="43" r="4" stroke={a.dark} strokeWidth="1.2" fill="none"/>
      <circle cx="63" cy="43" r="4" stroke={a.dark} strokeWidth="1.2" fill="none"/>
      <path d="M57 43 L59 43" stroke={a.dark} strokeWidth="1"/>
      <path d="M49 42 L47 41" stroke={a.dark} strokeWidth="1"/>
      <path d="M67 42 L69 41" stroke={a.dark} strokeWidth="1"/>
      {/* Eyes behind glasses */}
      <circle cx="53" cy="43.5" r="1" fill={a.dark}/>
      <circle cx="63" cy="43.5" r="1" fill={a.dark}/>
      {/* Mouth */}
      <path d="M55 48 Q58 50 61 48" stroke={a.dark} strokeWidth="0.8" fill="none"/>
      {/* Arms holding book */}
      <path d="M48 62 Q42 68 44 76" stroke={a.skin} strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M68 62 Q74 68 72 76" stroke={a.skin} strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* Open book */}
      <path d="M44 74 Q58 70 58 76 L58 84 Q58 78 44 82 Z" fill="#fff"/>
      <path d="M72 74 Q58 70 58 76 L58 84 Q58 78 72 82 Z" fill="#faf8f5"/>
      <line x1="58" y1="76" x2="58" y2="84" stroke={a.dark} strokeWidth="0.5"/>
      {/* Text lines on pages */}
      <rect x="47" y="76" width="8" height="1" rx="0.5" fill={a.dark} opacity="0.2"/>
      <rect x="47" y="78.5" width="7" height="1" rx="0.5" fill={a.dark} opacity="0.2"/>
      <rect x="47" y="81" width="6" height="1" rx="0.5" fill={a.dark} opacity="0.2"/>
      <rect x="61" y="76" width="8" height="1" rx="0.5" fill={a.dark} opacity="0.2"/>
      <rect x="61" y="78.5" width="7" height="1" rx="0.5" fill={a.dark} opacity="0.2"/>
      <rect x="61" y="81" width="5" height="1" rx="0.5" fill={a.dark} opacity="0.2"/>
      {/* Coffee cup */}
      <rect x="78" y="80" width="8" height="9" rx="2" fill={a.cloth}/>
      <path d="M86 83 Q90 83 90 87 Q90 89 86 89" stroke={a.clothAlt} strokeWidth="1.5" fill="none"/>
      <path d="M80 79 Q82 76 84 79" stroke={a.dark} strokeWidth="0.7" fill="none" opacity="0.3"/>
    </svg>
  )
}

function CookingIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>
      {/* Kitchen shelf */}
      <rect x="15" y="18" width="40" height="3" rx="1" fill={a.dark} opacity="0.3"/>
      <rect x="20" y="10" width="6" height="8" rx="1" fill={a.accent} opacity="0.5"/>
      <rect x="28" y="12" width="5" height="6" rx="1" fill={a.green} opacity="0.5"/>
      <rect x="36" y="9" width="7" height="9" rx="1" fill={a.clothAlt} opacity="0.5"/>
      <circle cx="44" cy="14" r="3" fill={a.accent} opacity="0.4"/>
      {/* Counter/table */}
      <rect x="10" y="72" width="100" height="5" rx="2" fill={a.dark} opacity="0.6"/>
      <rect x="12" y="77" width="96" height="30" rx="2" fill={a.dark} opacity="0.15"/>
      {/* Person */}
      {/* Head */}
      <ellipse cx="50" cy="36" rx="10" ry="11" fill={a.skin}/>
      {/* Hair tied back */}
      <path d="M40 34 Q40 24 50 24 Q56 24 58 28 L60 26 Q55 22 50 22 Q38 22 38 34 Z" fill={a.hair}/>
      <ellipse cx="60" cy="27" rx="4" ry="3" fill={a.hair}/>
      <path d="M58 28 Q62 30 60 34" stroke={a.hairAlt} strokeWidth="1.5" fill="none"/>
      {/* Eyes & mouth */}
      <circle cx="46" cy="36" r="1.2" fill={a.dark}/>
      <circle cx="54" cy="36" r="1.2" fill={a.dark}/>
      <path d="M47 40 Q50 43 53 40" stroke={a.dark} strokeWidth="0.8" fill="none"/>
      {/* Neck */}
      <rect x="47" y="46" width="6" height="6" rx="2" fill={a.skin}/>
      {/* Body */}
      <path d="M40 52 Q38 65 40 72 L60 72 Q62 65 60 52 Z" fill={a.cloth}/>
      {/* Apron */}
      <path d="M42 54 L58 54 L56 72 L44 72 Z" fill="#fff" opacity="0.9"/>
      <path d="M46 54 Q50 52 54 54" stroke={a.dark} strokeWidth="0.7" fill="none"/>
      <rect x="48" y="58" width="4" height="4" rx="1" fill={a.accent} opacity="0.3"/>
      {/* Arms */}
      <path d="M40 56 Q32 62 36 68 L38 70" stroke={a.skin} strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M60 56 Q68 60 72 58" stroke={a.skin} strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* Pot on counter */}
      <ellipse cx="80" cy="62" rx="14" ry="4" fill={a.dark} opacity="0.5"/>
      <rect x="66" y="62" width="28" height="10" rx="3" fill={a.dark} opacity="0.6"/>
      <ellipse cx="80" cy="62" rx="12" ry="3" fill={a.accent} opacity="0.4"/>
      {/* Pot handles */}
      <rect x="63" y="65" width="5" height="3" rx="1" fill={a.dark} opacity="0.7"/>
      <rect x="92" y="65" width="5" height="3" rx="1" fill={a.dark} opacity="0.7"/>
      {/* Steam */}
      <path d="M74 56 Q72 50 74 44" stroke={a.dark} strokeWidth="1" opacity="0.2" fill="none"/>
      <path d="M80 54 Q78 48 80 42" stroke={a.dark} strokeWidth="1" opacity="0.2" fill="none"/>
      <path d="M86 56 Q84 50 86 44" stroke={a.dark} strokeWidth="1" opacity="0.2" fill="none"/>
      {/* Wooden spoon in hand */}
      <line x1="72" y1="58" x2="72" y2="42" stroke="#b8884c" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="72" cy="40" rx="3.5" ry="5" fill="#b8884c"/>
      <ellipse cx="72" cy="40" rx="2" ry="3.5" fill="#a07040"/>
      {/* Vegetables on counter */}
      <circle cx="34" cy="69" r="3" fill="#e85050"/>
      <circle cx="28" cy="70" r="2.5" fill="#e8a050"/>
      <ellipse cx="40" cy="70" rx="4" ry="2" fill={a.green}/>
      <circle cx="22" cy="69" r="2" fill="#e8d050"/>
      {/* Cutting board */}
      <rect x="18" y="66" width="14" height="6" rx="1.5" fill="#d4a060" opacity="0.5"/>
    </svg>
  )
}

function YogaIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>
      {/* Zen circles */}
      <circle cx="60" cy="55" r="40" stroke={a.accent} strokeWidth="0.5" opacity="0.12" fill="none"/>
      <circle cx="60" cy="55" r="32" stroke={a.accent} strokeWidth="0.5" opacity="0.1" fill="none"/>
      <circle cx="60" cy="55" r="24" stroke={a.accent} strokeWidth="0.5" opacity="0.08" fill="none"/>
      {/* Yoga mat */}
      <ellipse cx="60" cy="92" rx="34" ry="6" fill={a.accent} opacity="0.35"/>
      <ellipse cx="60" cy="92" rx="32" ry="5" fill={a.accent} opacity="0.2"/>
      {/* Small plant on side */}
      <rect x="92" y="80" width="8" height="8" rx="2" fill={a.accent} opacity="0.6"/>
      <path d="M96 80 Q96 72 91 68" stroke={a.green} strokeWidth="2" fill="none"/>
      <path d="M96 80 Q96 74 101 70" stroke={a.green} strokeWidth="2" fill="none"/>
      <ellipse cx="90" cy="67" rx="3.5" ry="2.5" fill={a.green}/>
      <ellipse cx="102" cy="69" rx="3.5" ry="2.5" fill={a.green}/>
      {/* Incense stick with smoke */}
      <line x1="18" y1="88" x2="20" y2="68" stroke={a.dark} strokeWidth="1" opacity="0.5"/>
      <rect x="16" y="86" width="5" height="4" rx="1" fill={a.dark} opacity="0.3"/>
      <path d="M20 68 Q18 60 20 52" stroke={a.dark} strokeWidth="0.8" opacity="0.15" fill="none"/>
      <path d="M20 52 Q22 46 20 40" stroke={a.dark} strokeWidth="0.6" opacity="0.1" fill="none"/>
      <path d="M20 40 Q18 35 20 30" stroke={a.dark} strokeWidth="0.4" opacity="0.07" fill="none"/>
      {/* Person - cross-legged meditation pose */}
      {/* Legs crossed */}
      <path d="M46 86 Q52 92 60 86 Q54 80 46 82 Z" fill={a.cloth}/>
      <path d="M74 86 Q68 92 60 86 Q66 80 74 82 Z" fill={a.cloth}/>
      {/* Feet */}
      <ellipse cx="46" cy="86" rx="4" ry="2.5" fill={a.skin}/>
      <ellipse cx="74" cy="86" rx="4" ry="2.5" fill={a.skin}/>
      {/* Torso */}
      <path d="M48 60 Q46 72 48 84 L72 84 Q74 72 72 60 Z" fill={a.cloth}/>
      <path d="M54 60 L54 80" stroke={a.clothAlt} strokeWidth="0.5" opacity="0.3"/>
      <path d="M60 58 L60 80" stroke={a.clothAlt} strokeWidth="0.5" opacity="0.3"/>
      <path d="M66 60 L66 80" stroke={a.clothAlt} strokeWidth="0.5" opacity="0.3"/>
      {/* Neck */}
      <rect x="57" y="52" width="6" height="8" rx="2" fill={a.skin}/>
      {/* Head */}
      <ellipse cx="60" cy="44" rx="11" ry="12" fill={a.skin}/>
      {/* Hair flowing */}
      <path d="M49 42 Q49 28 60 28 Q71 28 71 42 Q68 34 60 34 Q52 34 49 42 Z" fill={a.hair}/>
      <path d="M49 40 Q46 50 42 58" stroke={a.hair} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M48 42 Q44 52 40 62" stroke={a.hairAlt} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M71 40 Q74 50 78 58" stroke={a.hair} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M72 42 Q76 52 80 62" stroke={a.hairAlt} strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Eyes closed - peaceful curved lines */}
      <path d="M54 43 Q56 45 58 43" stroke={a.dark} strokeWidth="1" fill="none"/>
      <path d="M62 43 Q64 45 66 43" stroke={a.dark} strokeWidth="1" fill="none"/>
      {/* Serene smile */}
      <path d="M57 49 Q60 51 63 49" stroke={a.dark} strokeWidth="0.7" fill="none"/>
      {/* Arms on knees, palms up */}
      <path d="M48 64 Q40 72 42 82" stroke={a.skin} strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M72 64 Q80 72 78 82" stroke={a.skin} strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* Palms facing up */}
      <ellipse cx="42" cy="83" rx="3.5" ry="2" fill={a.skin}/>
      <ellipse cx="78" cy="83" rx="3.5" ry="2" fill={a.skin}/>
      {/* Small energy dots on palms */}
      <circle cx="42" cy="82" r="1" fill={a.accent} opacity="0.5"/>
      <circle cx="78" cy="82" r="1" fill={a.accent} opacity="0.5"/>
    </svg>
  )
}

function PaintingIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>
      {/* Easel - A frame */}
      <line x1="30" y1="24" x2="22" y2="100" stroke={a.dark} strokeWidth="2.5" opacity="0.6"/>
      <line x1="70" y1="24" x2="78" y2="100" stroke={a.dark} strokeWidth="2.5" opacity="0.6"/>
      <line x1="50" y1="24" x2="50" y2="105" stroke={a.dark} strokeWidth="2.5" opacity="0.6"/>
      {/* Easel shelf */}
      <rect x="28" y="68" width="44" height="3" rx="1" fill={a.dark} opacity="0.5"/>
      {/* Canvas on easel */}
      <rect x="26" y="24" width="48" height="44" rx="2" fill="#fff"/>
      <rect x="28" y="26" width="44" height="40" rx="1" fill="#faf8f5"/>
      {/* Paint splotches on canvas */}
      <circle cx="38" cy="36" r="4" fill="#e85050" opacity="0.7"/>
      <circle cx="50" cy="42" r="5" fill="#5088d0" opacity="0.6"/>
      <circle cx="42" cy="50" r="3.5" fill="#e8d050" opacity="0.7"/>
      <circle cx="58" cy="34" r="3" fill={a.green} opacity="0.7"/>
      <circle cx="62" cy="48" r="4" fill="#d070c0" opacity="0.5"/>
      <circle cx="34" cy="56" r="2.5" fill="#e8a050" opacity="0.6"/>
      <circle cx="54" cy="56" r="3" fill="#50b8a0" opacity="0.5"/>
      {/* Person */}
      {/* Head */}
      <ellipse cx="88" cy="42" rx="10" ry="11" fill={a.skin}/>
      {/* Beret */}
      <path d="M78 38 Q78 28 88 30 Q98 28 98 38 Q96 34 88 34 Q80 34 78 38 Z" fill={a.accent}/>
      <circle cx="88" cy="28" r="2.5" fill={a.accent}/>
      {/* Hair peeking */}
      <path d="M79 40 Q78 36 80 34" stroke={a.hair} strokeWidth="2" fill="none"/>
      <path d="M97 40 Q98 36 96 34" stroke={a.hair} strokeWidth="2" fill="none"/>
      {/* Eyes */}
      <circle cx="84" cy="42" r="1.2" fill={a.dark}/>
      <circle cx="92" cy="42" r="1.2" fill={a.dark}/>
      {/* Focused expression */}
      <path d="M86 47 Q88 48 90 47" stroke={a.dark} strokeWidth="0.7" fill="none"/>
      {/* Neck */}
      <rect x="85" y="52" width="6" height="6" rx="2" fill={a.skin}/>
      {/* Body */}
      <path d="M78 58 Q76 75 78 92 L98 92 Q100 75 98 58 Z" fill={a.cloth}/>
      <path d="M82 58 L82 88" stroke={a.clothAlt} strokeWidth="0.5" opacity="0.3"/>
      {/* Arm holding brush toward canvas */}
      <path d="M78 62 Q70 58 66 54" stroke={a.skin} strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* Brush */}
      <line x1="66" y1="54" x2="56" y2="44" stroke="#b8884c" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="55" cy="43" rx="1.5" ry="2.5" fill={a.dark} transform="rotate(-40 55 43)"/>
      {/* Arm holding palette */}
      <path d="M98 62 Q104 70 102 78" stroke={a.skin} strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* Palette */}
      <ellipse cx="100" cy="80" rx="10" ry="6" fill="#d4a060"/>
      <ellipse cx="100" cy="80" rx="8" ry="4.5" fill="#c89850"/>
      <circle cx="95" cy="78" r="2" fill="#e85050"/>
      <circle cx="100" cy="77" r="2" fill="#5088d0"/>
      <circle cx="105" cy="78" r="2" fill="#e8d050"/>
      <circle cx="98" cy="82" r="1.5" fill={a.green}/>
      <circle cx="103" cy="82" r="1.5" fill="#d070c0"/>
      {/* Palette thumb hole */}
      <ellipse cx="96" cy="83" rx="2" ry="1.5" fill={a.skin}/>
      {/* Paint tubes on ground */}
      <rect x="80" y="96" width="4" height="10" rx="1.5" fill="#e85050" transform="rotate(-20 82 101)"/>
      <rect x="88" y="97" width="4" height="9" rx="1.5" fill="#5088d0" transform="rotate(10 90 101)"/>
      <rect x="96" y="96" width="4" height="10" rx="1.5" fill="#e8d050" transform="rotate(-5 98 101)"/>
    </svg>
  )
}

function GamingIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>
      {/* Screen glow */}
      <rect x="20" y="18" width="80" height="50" rx="4" fill={a.dark} opacity="0.08"/>
      {/* Screen */}
      <rect x="24" y="22" width="72" height="42" rx="3" fill={a.dark} opacity="0.7"/>
      <rect x="26" y="24" width="68" height="38" rx="2" fill="#2a3a4a"/>
      {/* Screen content */}
      <rect x="30" y="28" width="20" height="14" rx="1" fill="#4a6a8a" opacity="0.6"/>
      <circle cx="70" cy="35" r="6" fill="#5a8a5a" opacity="0.5"/>
      <rect x="56" y="46" width="34" height="3" rx="1" fill="#6a8aaa" opacity="0.4"/>
      <rect x="30" y="50" width="24" height="3" rx="1" fill="#8a6a6a" opacity="0.4"/>
      <circle cx="40" cy="35" r="3" fill="#e85050" opacity="0.6"/>
      {/* Screen stand */}
      <rect x="55" y="64" width="10" height="6" rx="1" fill={a.dark} opacity="0.5"/>
      <rect x="48" y="69" width="24" height="3" rx="1" fill={a.dark} opacity="0.4"/>
      {/* Person sitting, leaning forward */}
      {/* Head */}
      <ellipse cx="60" cy="78" rx="9" ry="10" fill={a.skin}/>
      {/* Hair */}
      <path d="M51 76 Q51 66 60 66 Q69 66 69 76 Q66 72 60 72 Q54 72 51 76 Z" fill={a.hair}/>
      <path d="M52 74 Q51 70 53 68" stroke={a.hairAlt} strokeWidth="1.5" fill="none"/>
      {/* Headphones */}
      <path d="M49 78 Q48 66 60 64 Q72 66 71 78" stroke={a.dark} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <rect x="45" y="76" width="6" height="8" rx="2" fill={a.dark}/>
      <rect x="69" y="76" width="6" height="8" rx="2" fill={a.dark}/>
      <rect x="46" y="77" width="4" height="6" rx="1.5" fill={a.clothAlt}/>
      <rect x="70" y="77" width="4" height="6" rx="1.5" fill={a.clothAlt}/>
      {/* Eyes - focused */}
      <circle cx="56" cy="78" r="1.2" fill={a.dark}/>
      <circle cx="64" cy="78" r="1.2" fill={a.dark}/>
      {/* Mouth */}
      <path d="M58 82 L62 82" stroke={a.dark} strokeWidth="0.7"/>
      {/* Body */}
      <path d="M50 88 Q48 96 50 108 L70 108 Q72 96 70 88 Z" fill={a.cloth}/>
      {/* Hoodie collar */}
      <path d="M54 88 Q60 92 66 88" stroke={a.clothAlt} strokeWidth="1" fill="none"/>
      {/* Arms forward holding controller */}
      <path d="M50 94 Q44 98 42 100" stroke={a.skin} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M70 94 Q76 98 78 100" stroke={a.skin} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      {/* Controller */}
      <rect x="38" y="98" width="44" height="10" rx="5" fill={a.dark} opacity="0.8"/>
      <rect x="40" y="99" width="40" height="8" rx="4" fill={a.dark} opacity="0.6"/>
      {/* Controller buttons */}
      <circle cx="72" cy="102" r="1.5" fill="#e85050"/>
      <circle cx="68" cy="105" r="1.5" fill="#5088d0"/>
      <circle cx="72" cy="105" r="1.5" fill="#50b850"/>
      <circle cx="76" cy="102" r="1.5" fill="#e8d050"/>
      {/* D-pad */}
      <rect x="46" y="101" width="6" height="2" rx="0.5" fill={a.clothAlt}/>
      <rect x="48" y="99" width="2" height="6" rx="0.5" fill={a.clothAlt}/>
      {/* Joysticks */}
      <circle cx="54" cy="104" r="2" fill={a.clothAlt} opacity="0.7"/>
      <circle cx="64" cy="100" r="2" fill={a.clothAlt} opacity="0.7"/>
      {/* Snack - can beside */}
      <rect x="14" y="92" width="8" height="14" rx="3" fill="#e85050" opacity="0.6"/>
      <rect x="15" y="94" width="6" height="2" rx="1" fill="#fff" opacity="0.3"/>
    </svg>
  )
}

function MusicLoverIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>
      {/* Sound wave arcs */}
      <path d="M20 50 Q15 60 20 70" stroke={a.accent} strokeWidth="1.5" opacity="0.2" fill="none"/>
      <path d="M14 45 Q8 60 14 75" stroke={a.accent} strokeWidth="1.5" opacity="0.15" fill="none"/>
      <path d="M100 50 Q105 60 100 70" stroke={a.accent} strokeWidth="1.5" opacity="0.2" fill="none"/>
      <path d="M106 45 Q112 60 106 75" stroke={a.accent} strokeWidth="1.5" opacity="0.15" fill="none"/>
      {/* Music notes floating */}
      <text x="22" y="38" fill={a.dark} fontSize="14" opacity="0.3" fontFamily="serif">&#9834;</text>
      <text x="90" y="32" fill={a.dark} fontSize="12" opacity="0.25" fontFamily="serif">&#9835;</text>
      <text x="30" y="96" fill={a.dark} fontSize="10" opacity="0.2" fontFamily="serif">&#9834;</text>
      <text x="84" y="90" fill={a.dark} fontSize="13" opacity="0.3" fontFamily="serif">&#9835;</text>
      <text x="16" y="66" fill={a.accent} fontSize="11" opacity="0.25" fontFamily="serif">&#9834;</text>
      <text x="98" y="62" fill={a.accent} fontSize="9" opacity="0.2" fontFamily="serif">&#9835;</text>
      {/* Person - head tilted slightly */}
      {/* Head */}
      <ellipse cx="62" cy="46" rx="14" ry="15" fill={a.skin} transform="rotate(8 62 46)"/>
      {/* Hair */}
      <path d="M48 42 Q48 28 62 28 Q76 28 76 42 Q72 34 62 34 Q52 34 48 42 Z" fill={a.hair}/>
      <path d="M50 40 Q46 48 44 56" stroke={a.hair} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M48 42 Q44 52 42 60" stroke={a.hairAlt} strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Eyes closed - peaceful */}
      <path d="M55 45 Q58 47 61 45" stroke={a.dark} strokeWidth="1.2" fill="none"/>
      <path d="M65 44 Q68 46 71 44" stroke={a.dark} strokeWidth="1.2" fill="none"/>
      {/* Peaceful smile */}
      <path d="M59 52 Q63 55 67 52" stroke={a.dark} strokeWidth="0.8" fill="none"/>
      {/* Headphones */}
      <path d="M46 44 Q44 28 62 26 Q80 28 78 44" stroke={a.dark} strokeWidth="4" fill="none" strokeLinecap="round"/>
      <rect x="41" y="42" width="8" height="10" rx="3" fill={a.dark}/>
      <rect x="75" y="40" width="8" height="10" rx="3" fill={a.dark}/>
      <rect x="42" y="43" width="6" height="8" rx="2" fill={a.clothAlt}/>
      <rect x="76" y="41" width="6" height="8" rx="2" fill={a.clothAlt}/>
      {/* Neck */}
      <rect x="58" y="58" width="7" height="7" rx="2" fill={a.skin}/>
      {/* Body - hoodie */}
      <path d="M46 65 Q44 80 46 100 L78 100 Q80 80 78 65 Z" fill={a.cloth}/>
      {/* Hoodie strings */}
      <line x1="56" y1="68" x2="54" y2="82" stroke={a.dark} strokeWidth="1" opacity="0.4"/>
      <line x1="68" y1="68" x2="66" y2="82" stroke={a.dark} strokeWidth="1" opacity="0.4"/>
      <circle cx="54" cy="83" r="1.5" fill={a.dark} opacity="0.3"/>
      <circle cx="66" cy="83" r="1.5" fill={a.dark} opacity="0.3"/>
      {/* Hood collar */}
      <path d="M50 65 Q62 72 74 65" stroke={a.clothAlt} strokeWidth="2" fill="none"/>
      {/* Hood on back */}
      <path d="M50 65 Q48 58 54 56" fill={a.cloth} stroke={a.clothAlt} strokeWidth="0.5"/>
      <path d="M74 65 Q76 58 70 56" fill={a.cloth} stroke={a.clothAlt} strokeWidth="0.5"/>
      {/* Arms relaxed */}
      <path d="M46 70 Q38 78 36 90" stroke={a.skin} strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M78 70 Q86 78 84 90" stroke={a.skin} strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* Slightly swaying lines */}
      <path d="M34 85 Q36 92 34 98" stroke={a.accent} strokeWidth="1" opacity="0.15" fill="none"/>
      <path d="M86 85 Q88 92 86 98" stroke={a.accent} strokeWidth="1" opacity="0.15" fill="none"/>
    </svg>
  )
}

// ─── TRIPS & VACATIONS ICONS ────────────────────────────────────────────────

function MountainsIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>
      {/* Sky */}
      {/* Sun behind mountains */}
      <circle cx="85" cy="32" r="14" fill={a.accent} opacity="0.6"/>
      <circle cx="85" cy="32" r="10" fill={a.accent} opacity="0.3"/>
      {/* Sun rays */}
      <line x1="85" y1="14" x2="85" y2="18" stroke={a.accent} strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
      <line x1="99" y1="22" x2="96" y2="24" stroke={a.accent} strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
      <line x1="103" y1="32" x2="99" y2="32" stroke={a.accent} strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
      <line x1="71" y1="22" x2="74" y2="24" stroke={a.accent} strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
      {/* Clouds */}
      <ellipse cx="30" cy="24" rx="10" ry="4" fill="#fff" opacity="0.5"/>
      <ellipse cx="26" cy="22" rx="6" ry="3" fill="#fff" opacity="0.4"/>
      <ellipse cx="70" cy="18" rx="8" ry="3" fill="#fff" opacity="0.3"/>
      {/* Mountains - back layer */}
      <path d="M-5 90 L25 35 L55 90 Z" fill={a.dark} opacity="0.25"/>
      <path d="M25 35 L30 42 L20 42 Z" fill="#fff" opacity="0.6"/>
      {/* Mountains - mid layer */}
      <path d="M30 90 L60 28 L90 90 Z" fill={a.dark} opacity="0.4"/>
      <path d="M60 28 L66 38 L54 38 Z" fill="#fff" opacity="0.7"/>
      {/* Mountains - front layer */}
      <path d="M60 90 L95 40 L125 90 Z" fill={a.dark} opacity="0.3"/>
      <path d="M95 40 L100 48 L90 48 Z" fill="#fff" opacity="0.6"/>
      {/* Pine trees at base */}
      <path d="M12 90 L16 76 L20 90 Z" fill={a.green}/>
      <path d="M14 86 L16 78 L18 86 Z" fill={a.green} opacity="0.8"/>
      <path d="M24 90 L27 80 L30 90 Z" fill={a.green}/>
      <path d="M36 90 L39 82 L42 90 Z" fill={a.green} opacity="0.9"/>
      <path d="M76 90 L79 80 L82 90 Z" fill={a.green}/>
      <path d="M88 90 L91 84 L94 90 Z" fill={a.green} opacity="0.8"/>
      <path d="M100 90 L103 82 L106 90 Z" fill={a.green}/>
      {/* Winding trail */}
      <path d="M60 90 Q55 82 60 74 Q65 68 60 60 Q56 54 60 48" stroke={a.clothAlt} strokeWidth="2" strokeDasharray="3 2" fill="none" opacity="0.5"/>
      {/* Small hiker silhouette */}
      <circle cx="58" cy="54" r="2" fill={a.dark} opacity="0.6"/>
      <line x1="58" y1="56" x2="58" y2="62" stroke={a.dark} strokeWidth="1.5" opacity="0.6"/>
      <line x1="58" y1="62" x2="55" y2="66" stroke={a.dark} strokeWidth="1.2" opacity="0.6"/>
      <line x1="58" y1="62" x2="61" y2="66" stroke={a.dark} strokeWidth="1.2" opacity="0.6"/>
      <line x1="58" y1="58" x2="55" y2="61" stroke={a.dark} strokeWidth="1.2" opacity="0.6"/>
      <line x1="58" y1="58" x2="61" y2="56" stroke={a.dark} strokeWidth="1.2" opacity="0.6"/>
      {/* Backpack */}
      <rect x="56" y="57" width="4" height="4" rx="1" fill={a.accent} opacity="0.5"/>
      {/* Ground */}
      <path d="M0 90 Q30 86 60 90 Q90 94 120 90 L120 120 L0 120 Z" fill={a.green} opacity="0.3"/>
    </svg>
  )
}

function BeachIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>
      {/* Sun */}
      <circle cx="90" cy="25" r="12" fill={a.accent} opacity="0.7"/>
      {/* Sun rays */}
      <line x1="90" y1="9" x2="90" y2="13" stroke={a.accent} strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
      <line x1="102" y1="17" x2="99" y2="19" stroke={a.accent} strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
      <line x1="106" y1="25" x2="102" y2="25" stroke={a.accent} strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
      <line x1="78" y1="17" x2="81" y2="19" stroke={a.accent} strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
      <line x1="102" y1="33" x2="99" y2="31" stroke={a.accent} strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
      {/* Birds */}
      <path d="M30 20 Q33 17 36 20" stroke={a.dark} strokeWidth="1" fill="none" opacity="0.3"/>
      <path d="M40 16 Q42 14 44 16" stroke={a.dark} strokeWidth="0.8" fill="none" opacity="0.25"/>
      <path d="M22 28 Q24 26 26 28" stroke={a.dark} strokeWidth="0.8" fill="none" opacity="0.2"/>
      {/* Ocean */}
      <path d="M0 65 Q15 60 30 65 Q45 70 60 65 Q75 60 90 65 Q105 70 120 65 L120 85 L0 85 Z" fill={a.accent} opacity="0.25"/>
      <path d="M0 70 Q15 66 30 70 Q45 74 60 70 Q75 66 90 70 Q105 74 120 70 L120 85 L0 85 Z" fill={a.accent} opacity="0.2"/>
      <path d="M0 75 Q15 72 30 75 Q45 78 60 75 Q75 72 90 75 Q105 78 120 75 L120 85 L0 85 Z" fill={a.accent} opacity="0.15"/>
      {/* Sandy shore */}
      <path d="M0 80 Q30 75 60 80 Q90 85 120 80 L120 120 L0 120 Z" fill={a.clothAlt} opacity="0.5"/>
      <path d="M0 85 Q30 82 60 85 Q90 88 120 85 L120 120 L0 120 Z" fill={a.clothAlt} opacity="0.3"/>
      {/* Palm tree */}
      <path d="M28 85 Q26 60 30 40" stroke="#8b6940" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M30 42 Q40 30 52 36" stroke={a.green} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M30 42 Q38 38 48 42" stroke={a.green} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M30 42 Q20 30 10 36" stroke={a.green} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M30 42 Q22 38 14 42" stroke={a.green} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M30 42 Q28 30 26 24" stroke={a.green} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Beach umbrella */}
      <line x1="72" y1="52" x2="72" y2="88" stroke={a.dark} strokeWidth="2"/>
      <path d="M56 52 Q64 42 72 52 Q80 42 88 52 Z" fill={a.accent} opacity="0.7"/>
      <path d="M64 52 Q68 46 72 52" fill={a.cloth} opacity="0.5"/>
      <path d="M72 52 Q76 46 80 52" fill={a.cloth} opacity="0.5"/>
      {/* Beach towel */}
      <rect x="62" y="86" width="20" height="8" rx="1" fill={a.accent} opacity="0.4" transform="rotate(-5 72 90)"/>
      <rect x="63" y="87" width="18" height="2" rx="0.5" fill={a.cloth} opacity="0.3" transform="rotate(-5 72 90)"/>
      {/* Seashell */}
      <path d="M48 92 Q50 88 54 90 Q52 94 48 92 Z" fill={a.cloth} opacity="0.6"/>
      <path d="M49 91 Q51 89 53 90" stroke={a.dark} strokeWidth="0.5" opacity="0.3" fill="none"/>
      {/* Sandcastle */}
      <rect x="84" y="90" width="8" height="8" rx="1" fill={a.clothAlt} opacity="0.6"/>
      <rect x="86" y="86" width="4" height="4" rx="1" fill={a.clothAlt} opacity="0.5"/>
      <rect x="87" y="84" width="2" height="2" rx="0.5" fill={a.clothAlt} opacity="0.4"/>
      {/* Small flag on sandcastle */}
      <line x1="88" y1="84" x2="88" y2="80" stroke={a.dark} strokeWidth="0.5" opacity="0.4"/>
      <path d="M88 80 L92 82 L88 83" fill={a.accent} opacity="0.5"/>
    </svg>
  )
}

function CityTripIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>
      {/* Clouds */}
      <ellipse cx="25" cy="22" rx="10" ry="4" fill="#fff" opacity="0.4"/>
      <ellipse cx="80" cy="18" rx="8" ry="3" fill="#fff" opacity="0.35"/>
      {/* Small airplane */}
      <path d="M95 14 L100 12 L102 14 L100 15 Z" fill={a.dark} opacity="0.4"/>
      <path d="M98 10 L100 12 L98 14" fill={a.dark} opacity="0.3"/>
      <line x1="95" y1="14" x2="90" y2="14" stroke={a.dark} strokeWidth="0.5" opacity="0.3"/>
      {/* Buildings - back row */}
      <rect x="8" y="40" width="16" height="52" rx="1" fill={a.dark} opacity="0.25"/>
      <rect x="26" y="34" width="14" height="58" rx="1" fill={a.dark} opacity="0.3"/>
      <rect x="42" y="44" width="12" height="48" rx="1" fill={a.dark} opacity="0.22"/>
      <rect x="70" y="38" width="14" height="54" rx="1" fill={a.dark} opacity="0.28"/>
      <rect x="86" y="46" width="16" height="46" rx="1" fill={a.dark} opacity="0.22"/>
      <rect x="104" y="50" width="12" height="42" rx="1" fill={a.dark} opacity="0.2"/>
      {/* Landmark building with dome */}
      <rect x="54" y="30" width="16" height="62" rx="1" fill={a.dark} opacity="0.35"/>
      <path d="M54 30 Q62 18 70 30" fill={a.dark} opacity="0.35"/>
      <circle cx="62" cy="24" r="2" fill={a.accent} opacity="0.5"/>
      {/* Windows on buildings */}
      {/* Building 1 */}
      <circle cx="14" cy="46" r="1" fill={a.accent} opacity="0.3"/>
      <circle cx="18" cy="46" r="1" fill={a.accent} opacity="0.3"/>
      <circle cx="14" cy="52" r="1" fill={a.accent} opacity="0.3"/>
      <circle cx="18" cy="52" r="1" fill={a.accent} opacity="0.3"/>
      <circle cx="14" cy="58" r="1" fill={a.accent} opacity="0.3"/>
      <circle cx="18" cy="58" r="1" fill={a.accent} opacity="0.3"/>
      {/* Building 2 */}
      <circle cx="31" cy="40" r="1" fill={a.accent} opacity="0.3"/>
      <circle cx="35" cy="40" r="1" fill={a.accent} opacity="0.3"/>
      <circle cx="31" cy="46" r="1" fill={a.accent} opacity="0.3"/>
      <circle cx="35" cy="46" r="1" fill={a.accent} opacity="0.3"/>
      <circle cx="31" cy="52" r="1" fill={a.accent} opacity="0.3"/>
      <circle cx="35" cy="52" r="1" fill={a.accent} opacity="0.3"/>
      {/* Landmark windows */}
      <circle cx="59" cy="38" r="1" fill={a.accent} opacity="0.4"/>
      <circle cx="65" cy="38" r="1" fill={a.accent} opacity="0.4"/>
      <circle cx="59" cy="44" r="1" fill={a.accent} opacity="0.4"/>
      <circle cx="65" cy="44" r="1" fill={a.accent} opacity="0.4"/>
      <circle cx="59" cy="50" r="1" fill={a.accent} opacity="0.4"/>
      <circle cx="65" cy="50" r="1" fill={a.accent} opacity="0.4"/>
      {/* Building 4 */}
      <circle cx="75" cy="44" r="1" fill={a.accent} opacity="0.3"/>
      <circle cx="79" cy="44" r="1" fill={a.accent} opacity="0.3"/>
      <circle cx="75" cy="50" r="1" fill={a.accent} opacity="0.3"/>
      <circle cx="79" cy="50" r="1" fill={a.accent} opacity="0.3"/>
      {/* Building 5 */}
      <circle cx="92" cy="52" r="1" fill={a.accent} opacity="0.3"/>
      <circle cx="96" cy="52" r="1" fill={a.accent} opacity="0.3"/>
      <circle cx="92" cy="58" r="1" fill={a.accent} opacity="0.3"/>
      <circle cx="96" cy="58" r="1" fill={a.accent} opacity="0.3"/>
      {/* Street */}
      <rect x="0" y="92" width="120" height="28" rx="0" fill={a.dark} opacity="0.12"/>
      {/* Street lamp */}
      <line x1="100" y1="68" x2="100" y2="92" stroke={a.dark} strokeWidth="2" opacity="0.4"/>
      <circle cx="100" cy="66" r="3" fill={a.accent} opacity="0.5"/>
      <circle cx="100" cy="66" r="6" fill={a.accent} opacity="0.1"/>
      {/* Suitcase in foreground */}
      <rect x="18" y="82" width="16" height="12" rx="3" fill={a.accent}/>
      <rect x="20" y="84" width="12" height="8" rx="2" fill={a.accent} opacity="0.7"/>
      <rect x="24" y="79" width="6" height="3" rx="1.5" fill={a.dark} opacity="0.5"/>
      <line x1="26" y1="82" x2="26" y2="94" stroke={a.dark} strokeWidth="0.8" opacity="0.3"/>
      {/* Suitcase wheels */}
      <circle cx="22" cy="95" r="1.5" fill={a.dark} opacity="0.4"/>
      <circle cx="30" cy="95" r="1.5" fill={a.dark} opacity="0.4"/>
    </svg>
  )
}

function CampingIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>
      {/* Night sky gradient */}
      <circle cx="60" cy="60" r="60" fill={a.dark} opacity="0.08"/>
      {/* Moon crescent */}
      <circle cx="90" cy="22" r="10" fill={a.cloth}/>
      <circle cx="94" cy="19" r="9" fill={a.bg}/>
      {/* Stars */}
      <circle cx="20" cy="18" r="1.5" fill={a.cloth} opacity="0.6"/>
      <circle cx="40" cy="12" r="1" fill={a.cloth} opacity="0.5"/>
      <circle cx="60" cy="16" r="1.2" fill={a.cloth} opacity="0.55"/>
      <circle cx="75" cy="10" r="0.8" fill={a.cloth} opacity="0.4"/>
      <circle cx="30" cy="28" r="0.8" fill={a.cloth} opacity="0.45"/>
      <circle cx="108" cy="16" r="1" fill={a.cloth} opacity="0.4"/>
      <circle cx="50" cy="24" r="1.2" fill={a.cloth} opacity="0.5"/>
      {/* Star shapes */}
      <path d="M15 32 L16 29 L17 32 L20 33 L17 34 L16 37 L15 34 L12 33 Z" fill={a.cloth} opacity="0.4"/>
      <path d="M105 30 L106 28 L107 30 L109 31 L107 32 L106 34 L105 32 L103 31 Z" fill={a.cloth} opacity="0.35"/>
      {/* Pine trees */}
      <path d="M10 88 L18 58 L26 88 Z" fill={a.green} opacity="0.7"/>
      <path d="M13 80 L18 62 L23 80 Z" fill={a.green} opacity="0.8"/>
      <rect x="16" y="88" width="4" height="6" fill="#8b6940" opacity="0.5"/>
      <path d="M90 88 L96 64 L102 88 Z" fill={a.green} opacity="0.7"/>
      <path d="M92 82 L96 68 L100 82 Z" fill={a.green} opacity="0.8"/>
      <rect x="94" y="88" width="4" height="6" fill="#8b6940" opacity="0.5"/>
      <path d="M102 88 L106 74 L110 88 Z" fill={a.green} opacity="0.6"/>
      {/* Tent */}
      <path d="M38 88 L60 44 L82 88 Z" fill={a.accent}/>
      <path d="M42 88 L60 48 L78 88 Z" fill={a.accent} opacity="0.7"/>
      {/* Tent opening */}
      <path d="M54 88 L60 68 L66 88 Z" fill={a.dark} opacity="0.3"/>
      {/* Tent stripe */}
      <path d="M60 44 L70 66" stroke={a.cloth} strokeWidth="1" opacity="0.3"/>
      <path d="M60 44 L50 66" stroke={a.cloth} strokeWidth="1" opacity="0.3"/>
      {/* Campfire */}
      {/* Logs */}
      <rect x="52" y="94" width="18" height="3" rx="1.5" fill="#8b6940" transform="rotate(-15 61 95)"/>
      <rect x="50" y="94" width="18" height="3" rx="1.5" fill="#7a5830" transform="rotate(15 59 95)"/>
      {/* Flames */}
      <path d="M56 94 Q58 84 60 88 Q62 82 64 94 Z" fill="#e8a050"/>
      <path d="M58 94 Q59 86 60 89 Q61 85 62 94 Z" fill="#e8d050"/>
      <path d="M59 94 Q60 88 61 94 Z" fill="#fffbe6" opacity="0.8"/>
      {/* Fire glow */}
      <circle cx="60" cy="90" r="10" fill="#e8a050" opacity="0.1"/>
      {/* Smoke */}
      <path d="M60 82 Q58 76 60 70" stroke={a.dark} strokeWidth="0.8" opacity="0.1" fill="none"/>
      <path d="M62 80 Q64 74 62 68" stroke={a.dark} strokeWidth="0.6" opacity="0.08" fill="none"/>
      {/* Sleeping bag near tent */}
      <ellipse cx="36" cy="92" rx="8" ry="3" fill={a.clothAlt} opacity="0.6"/>
      <ellipse cx="30" cy="92" rx="3" ry="2.5" fill={a.cloth} opacity="0.5"/>
      {/* Backpack */}
      <rect x="82" y="82" width="7" height="9" rx="2" fill={a.accent} opacity="0.6"/>
      <rect x="83" y="80" width="5" height="3" rx="1" fill={a.dark} opacity="0.3"/>
      {/* Ground */}
      <path d="M0 96 L120 96 L120 120 L0 120 Z" fill={a.green} opacity="0.15"/>
    </svg>
  )
}

function RoadTripIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>
      {/* Sun setting */}
      <circle cx="60" cy="38" r="14" fill={a.accent} opacity="0.5"/>
      <circle cx="60" cy="38" r="10" fill={a.accent} opacity="0.3"/>
      {/* Mountains/hills in background */}
      <path d="M0 65 L20 40 L40 58 L60 35 L80 50 L100 38 L120 65 Z" fill={a.dark} opacity="0.2"/>
      <path d="M0 70 L30 52 L50 62 L75 48 L100 58 L120 70 Z" fill={a.dark} opacity="0.15"/>
      {/* Road - perspective */}
      <path d="M40 120 L56 60 L64 60 L80 120 Z" fill={a.dark} opacity="0.35"/>
      <path d="M42 120 L56.5 62 L63.5 62 L78 120 Z" fill={a.dark} opacity="0.25"/>
      {/* Road dashed center line */}
      <line x1="60" y1="64" x2="60" y2="70" stroke={a.accent} strokeWidth="1.5" opacity="0.6"/>
      <line x1="60" y1="74" x2="60" y2="80" stroke={a.accent} strokeWidth="1.8" opacity="0.6"/>
      <line x1="60" y1="84" x2="60" y2="92" stroke={a.accent} strokeWidth="2" opacity="0.6"/>
      <line x1="60" y1="96" x2="60" y2="106" stroke={a.accent} strokeWidth="2.5" opacity="0.6"/>
      <line x1="60" y1="110" x2="60" y2="120" stroke={a.accent} strokeWidth="3" opacity="0.6"/>
      {/* Cactus on roadside */}
      <line x1="28" y1="95" x2="28" y2="78" stroke={a.green} strokeWidth="3" strokeLinecap="round"/>
      <path d="M28 85 Q22 85 22 80" stroke={a.green} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M28 82 Q34 82 34 78" stroke={a.green} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Trees on other side */}
      <path d="M92 90 L96 76 L100 90 Z" fill={a.green} opacity="0.6"/>
      <path d="M98 90 L101 80 L104 90 Z" fill={a.green} opacity="0.5"/>
      {/* Car */}
      <rect x="48" y="88" width="24" height="10" rx="3" fill={a.accent}/>
      <path d="M52 88 Q54 82 60 82 Q66 82 68 88" fill={a.cloth}/>
      {/* Windows */}
      <path d="M54 88 Q55 84 60 84 Q65 84 66 88" fill={a.dark} opacity="0.3"/>
      <line x1="60" y1="84" x2="60" y2="88" stroke={a.cloth} strokeWidth="0.5" opacity="0.5"/>
      {/* Wheels */}
      <circle cx="54" cy="98" r="3.5" fill={a.dark} opacity="0.6"/>
      <circle cx="66" cy="98" r="3.5" fill={a.dark} opacity="0.6"/>
      <circle cx="54" cy="98" r="1.5" fill={a.clothAlt} opacity="0.4"/>
      <circle cx="66" cy="98" r="1.5" fill={a.clothAlt} opacity="0.4"/>
      {/* Headlights */}
      <circle cx="49" cy="92" r="1.5" fill="#fffbe6" opacity="0.7"/>
      <circle cx="71" cy="92" r="1.5" fill="#fffbe6" opacity="0.7"/>
      {/* Luggage on roof */}
      <rect x="53" y="79" width="6" height="4" rx="1" fill={a.clothAlt}/>
      <rect x="60" y="80" width="5" height="3" rx="1" fill={a.dark} opacity="0.3"/>
      {/* Roof rack lines */}
      <line x1="52" y1="82" x2="68" y2="82" stroke={a.dark} strokeWidth="0.7" opacity="0.3"/>
      {/* Dust clouds behind car */}
      <ellipse cx="52" cy="102" rx="4" ry="2" fill={a.clothAlt} opacity="0.2"/>
      <ellipse cx="68" cy="102" rx="4" ry="2" fill={a.clothAlt} opacity="0.2"/>
    </svg>
  )
}

function SunsetIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>
      {/* Color bands */}
      <rect x="0" y="30" width="120" height="10" fill={a.accent} opacity="0.08"/>
      <rect x="0" y="38" width="120" height="10" fill={a.accent} opacity="0.12"/>
      <rect x="0" y="46" width="120" height="10" fill={a.accent} opacity="0.18"/>
      <rect x="0" y="54" width="120" height="10" fill={a.accent} opacity="0.22"/>
      {/* Large sun at horizon */}
      <circle cx="60" cy="62" r="22" fill={a.accent} opacity="0.5"/>
      <circle cx="60" cy="62" r="18" fill={a.accent} opacity="0.3"/>
      <circle cx="60" cy="62" r="14" fill={a.accent} opacity="0.2"/>
      {/* Horizon line */}
      <line x1="0" y1="64" x2="120" y2="64" stroke={a.dark} strokeWidth="0.5" opacity="0.15"/>
      {/* Only show top half of sun */}
      <rect x="0" y="64" width="120" height="56" fill={a.bg}/>
      {/* Water/lake */}
      <rect x="0" y="64" width="120" height="40" fill={a.accent} opacity="0.08"/>
      {/* Water reflections */}
      <path d="M30 68 Q40 66 50 68" stroke={a.accent} strokeWidth="1" opacity="0.2" fill="none"/>
      <path d="M50 72 Q60 70 70 72" stroke={a.accent} strokeWidth="1.2" opacity="0.25" fill="none"/>
      <path d="M40 76 Q50 74 60 76" stroke={a.accent} strokeWidth="0.8" opacity="0.15" fill="none"/>
      <path d="M55 80 Q65 78 75 80" stroke={a.accent} strokeWidth="0.8" opacity="0.15" fill="none"/>
      <path d="M45 84 Q55 82 65 84" stroke={a.accent} strokeWidth="1" opacity="0.2" fill="none"/>
      {/* Sun reflection in water */}
      <ellipse cx="60" cy="72" rx="8" ry="2" fill={a.accent} opacity="0.15"/>
      <ellipse cx="60" cy="78" rx="5" ry="1.5" fill={a.accent} opacity="0.1"/>
      {/* Birds */}
      <path d="M30 36 Q34 32 38 36" stroke={a.dark} strokeWidth="1.2" fill="none" opacity="0.3"/>
      <path d="M40 32 Q43 29 46 32" stroke={a.dark} strokeWidth="1" fill="none" opacity="0.25"/>
      <path d="M80 34 Q83 31 86 34" stroke={a.dark} strokeWidth="1" fill="none" opacity="0.25"/>
      <path d="M72 38 Q74 36 76 38" stroke={a.dark} strokeWidth="0.8" fill="none" opacity="0.2"/>
      {/* Silhouette of two people sitting */}
      {/* Person 1 */}
      <circle cx="44" cy="56" r="4" fill={a.dark} opacity="0.5"/>
      <path d="M40 60 L40 72 L48 72 L48 60 Z" fill={a.dark} opacity="0.5"/>
      <path d="M40 72 L36 80" stroke={a.dark} strokeWidth="3" opacity="0.5" strokeLinecap="round"/>
      <path d="M48 72 L52 80" stroke={a.dark} strokeWidth="3" opacity="0.5" strokeLinecap="round"/>
      {/* Person 2 */}
      <circle cx="56" cy="57" r="3.5" fill={a.dark} opacity="0.5"/>
      <path d="M52 61 L52 72 L60 72 L60 61 Z" fill={a.dark} opacity="0.5"/>
      <path d="M52 72 L48 80" stroke={a.dark} strokeWidth="3" opacity="0.5" strokeLinecap="round"/>
      <path d="M60 72 L64 80" stroke={a.dark} strokeWidth="3" opacity="0.5" strokeLinecap="round"/>
      {/* Person leaning on other (shoulders touching) */}
      <path d="M48 60 L52 61" stroke={a.dark} strokeWidth="2" opacity="0.5"/>
      {/* Grass/reeds at edges */}
      <line x1="8" y1="64" x2="6" y2="54" stroke={a.green} strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
      <line x1="12" y1="64" x2="10" y2="52" stroke={a.green} strokeWidth="1.2" opacity="0.35" strokeLinecap="round"/>
      <line x1="16" y1="64" x2="14" y2="56" stroke={a.green} strokeWidth="1" opacity="0.3" strokeLinecap="round"/>
      <line x1="104" y1="64" x2="106" y2="54" stroke={a.green} strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
      <line x1="108" y1="64" x2="110" y2="52" stroke={a.green} strokeWidth="1.2" opacity="0.35" strokeLinecap="round"/>
      <line x1="112" y1="64" x2="114" y2="56" stroke={a.green} strokeWidth="1" opacity="0.3" strokeLinecap="round"/>
    </svg>
  )
}

// ─── CELEBRATIONS & MORE ICONS ──────────────────────────────────────────────

function HeartIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>
      {/* Sparkles around */}
      <circle cx="22" cy="30" r="2" fill={a.accent} opacity="0.3"/>
      <circle cx="98" cy="28" r="2.5" fill={a.accent} opacity="0.25"/>
      <circle cx="18" cy="70" r="1.5" fill={a.accent} opacity="0.2"/>
      <circle cx="102" cy="75" r="2" fill={a.accent} opacity="0.25"/>
      <circle cx="30" cy="95" r="1.5" fill={a.accent} opacity="0.2"/>
      <circle cx="90" cy="98" r="2" fill={a.accent} opacity="0.2"/>
      {/* Small floating hearts */}
      <path d="M24 46 Q24 42 27 42 Q30 42 30 46 Q30 50 27 52 Q24 50 24 46 Z" fill={a.accent} opacity="0.25"/>
      <path d="M92 40 Q92 37 94.5 37 Q97 37 97 40 Q97 43 94.5 45 Q92 43 92 40 Z" fill={a.accent} opacity="0.3"/>
      <path d="M86 85 Q86 82 88.5 82 Q91 82 91 85 Q91 88 88.5 90 Q86 88 86 85 Z" fill={a.accent} opacity="0.2"/>
      <path d="M28 78 Q28 76 30 76 Q32 76 32 78 Q32 80 30 82 Q28 80 28 78 Z" fill={a.accent} opacity="0.2"/>
      {/* Large heart - main */}
      <path d="M60 95 Q30 75 30 50 Q30 35 45 35 Q55 35 60 48 Q65 35 75 35 Q90 35 90 50 Q90 75 60 95 Z" fill={a.accent}/>
      {/* Inner pattern - smaller heart */}
      <path d="M60 85 Q40 70 40 53 Q40 43 50 43 Q56 43 60 52 Q64 43 70 43 Q80 43 80 53 Q80 70 60 85 Z" fill={a.cloth} opacity="0.3"/>
      {/* Highlight reflection */}
      <ellipse cx="48" cy="48" rx="6" ry="4" fill="#fff" opacity="0.25" transform="rotate(-20 48 48)"/>
      {/* Ribbon/band across middle */}
      <path d="M34 60 Q46 55 60 62 Q74 55 86 60" stroke={a.cloth} strokeWidth="3" fill="none" opacity="0.4"/>
      <path d="M34 62 Q46 57 60 64 Q74 57 86 62" stroke={a.cloth} strokeWidth="1" fill="none" opacity="0.2"/>
      {/* Decorative dots on heart */}
      <circle cx="50" cy="55" r="1.5" fill={a.cloth} opacity="0.2"/>
      <circle cx="70" cy="55" r="1.5" fill={a.cloth} opacity="0.2"/>
      <circle cx="60" cy="72" r="1.5" fill={a.cloth} opacity="0.2"/>
      <circle cx="45" cy="65" r="1" fill={a.cloth} opacity="0.15"/>
      <circle cx="75" cy="65" r="1" fill={a.cloth} opacity="0.15"/>
      {/* Sparkle stars */}
      <path d="M15 50 L16 47 L17 50 L20 51 L17 52 L16 55 L15 52 L12 51 Z" fill={a.accent} opacity="0.3"/>
      <path d="M100 55 L101 53 L102 55 L104 56 L102 57 L101 59 L100 57 L98 56 Z" fill={a.accent} opacity="0.25"/>
    </svg>
  )
}

function CelebrationIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>
      {/* Confetti pieces scattered */}
      <rect x="20" y="18" width="4" height="4" rx="1" fill="#e85050" opacity="0.5" transform="rotate(30 22 20)"/>
      <rect x="88" y="22" width="3" height="5" rx="1" fill="#5088d0" opacity="0.4" transform="rotate(-20 89 24)"/>
      <rect x="32" y="28" width="3" height="3" rx="0.5" fill="#e8d050" opacity="0.4" transform="rotate(45 33 29)"/>
      <rect x="78" y="14" width="4" height="3" rx="1" fill={a.green} opacity="0.4" transform="rotate(15 80 15)"/>
      <rect x="15" y="42" width="3" height="4" rx="0.5" fill="#d070c0" opacity="0.4" transform="rotate(-35 16 44)"/>
      <rect x="100" y="38" width="3" height="3" rx="1" fill="#e8a050" opacity="0.4" transform="rotate(60 101 39)"/>
      <circle cx="26" cy="36" r="2" fill="#e85050" opacity="0.3"/>
      <circle cx="92" cy="32" r="1.5" fill="#5088d0" opacity="0.3"/>
      <circle cx="40" cy="16" r="1.5" fill="#e8d050" opacity="0.35"/>
      <circle cx="70" y="20" r="2" fill={a.green} opacity="0.3"/>
      {/* Stars/sparkles */}
      <path d="M25 24 L26 21 L27 24 L30 25 L27 26 L26 29 L25 26 L22 25 Z" fill={a.accent} opacity="0.4"/>
      <path d="M95 26 L96 24 L97 26 L99 27 L97 28 L96 30 L95 28 L93 27 Z" fill={a.accent} opacity="0.35"/>
      {/* Plate underneath cake */}
      <ellipse cx="60" cy="98" rx="28" ry="5" fill={a.dark} opacity="0.12"/>
      <ellipse cx="60" cy="97" rx="26" ry="4" fill={a.cloth}/>
      {/* Cake - bottom tier */}
      <rect x="38" y="76" width="44" height="22" rx="4" fill={a.accent}/>
      <rect x="40" y="78" width="40" height="18" rx="3" fill={a.accent} opacity="0.8"/>
      {/* Frosting drips - bottom tier */}
      <path d="M38 78 Q40 82 42 78 Q44 82 46 78 Q48 82 50 78 Q52 82 54 78 Q56 82 58 78 Q60 82 62 78 Q64 82 66 78 Q68 82 70 78 Q72 82 74 78 Q76 82 78 78 Q80 82 82 78" stroke={a.cloth} strokeWidth="2" fill="none" opacity="0.5"/>
      {/* Cake - top tier */}
      <rect x="46" y="58" width="28" height="18" rx="4" fill={a.accent} opacity="0.9"/>
      <rect x="48" y="60" width="24" height="14" rx="3" fill={a.accent} opacity="0.7"/>
      {/* Frosting drips - top tier */}
      <path d="M46 60 Q48 64 50 60 Q52 64 54 60 Q56 64 58 60 Q60 64 62 60 Q64 64 66 60 Q68 64 70 60 Q72 64 74 60" stroke={a.cloth} strokeWidth="2" fill="none" opacity="0.5"/>
      {/* Decorative line on cake */}
      <path d="M40 86 L80 86" stroke={a.cloth} strokeWidth="1" opacity="0.3"/>
      <path d="M48 68 L72 68" stroke={a.cloth} strokeWidth="1" opacity="0.3"/>
      {/* Candles */}
      <rect x="52" y="48" width="3" height="10" rx="1" fill={a.cloth}/>
      <rect x="59" y="46" width="3" height="12" rx="1" fill={a.clothAlt}/>
      <rect x="66" y="48" width="3" height="10" rx="1" fill={a.cloth}/>
      {/* Flames */}
      <ellipse cx="53.5" cy="46" rx="2.5" ry="4" fill="#e8a050"/>
      <ellipse cx="53.5" cy="45" rx="1.5" ry="2.5" fill="#e8d050"/>
      <ellipse cx="60.5" cy="44" rx="2.5" ry="4" fill="#e8a050"/>
      <ellipse cx="60.5" cy="43" rx="1.5" ry="2.5" fill="#e8d050"/>
      <ellipse cx="67.5" cy="46" rx="2.5" ry="4" fill="#e8a050"/>
      <ellipse cx="67.5" cy="45" rx="1.5" ry="2.5" fill="#e8d050"/>
    </svg>
  )
}

function MemoriesIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>
      {/* Flash effect */}
      <circle cx="60" cy="38" r="20" fill={a.accent} opacity="0.08"/>
      <circle cx="60" cy="38" r="12" fill={a.accent} opacity="0.05"/>
      {/* Camera body */}
      <rect x="30" y="28" width="60" height="42" rx="6" fill={a.dark} opacity="0.7"/>
      <rect x="32" y="30" width="56" height="38" rx="5" fill={a.dark} opacity="0.5"/>
      {/* Camera top details */}
      <rect x="42" y="24" width="16" height="6" rx="2" fill={a.dark} opacity="0.6"/>
      {/* Viewfinder */}
      <rect x="54" y="22" width="8" height="6" rx="1.5" fill={a.dark} opacity="0.8"/>
      <rect x="56" y="23" width="4" height="4" rx="1" fill={a.cloth} opacity="0.3"/>
      {/* Flash */}
      <circle cx="76" cy="36" r="4" fill={a.cloth} opacity="0.5"/>
      <circle cx="76" cy="36" r="2.5" fill="#fff" opacity="0.3"/>
      {/* Lens - concentric circles */}
      <circle cx="55" cy="48" r="14" fill={a.dark} opacity="0.6"/>
      <circle cx="55" cy="48" r="12" fill={a.dark} opacity="0.8"/>
      <circle cx="55" cy="48" r="9" fill="#2a3a4a"/>
      <circle cx="55" cy="48" r="7" fill="#1a2a3a"/>
      <circle cx="55" cy="48" r="4" fill="#3a4a5a"/>
      <circle cx="55" cy="48" r="2" fill="#4a5a6a"/>
      {/* Lens reflection */}
      <ellipse cx="51" cy="44" rx="2" ry="1.5" fill="#fff" opacity="0.15"/>
      {/* Shutter button */}
      <circle cx="72" cy="27" r="3.5" fill={a.accent} opacity="0.7"/>
      <circle cx="72" cy="27" r="2" fill={a.accent} opacity="0.5"/>
      {/* Camera grip texture */}
      <rect x="32" y="38" width="8" height="22" rx="2" fill={a.dark} opacity="0.3"/>
      <line x1="34" y1="42" x2="38" y2="42" stroke={a.cloth} strokeWidth="0.5" opacity="0.2"/>
      <line x1="34" y1="46" x2="38" y2="46" stroke={a.cloth} strokeWidth="0.5" opacity="0.2"/>
      <line x1="34" y1="50" x2="38" y2="50" stroke={a.cloth} strokeWidth="0.5" opacity="0.2"/>
      <line x1="34" y1="54" x2="38" y2="54" stroke={a.cloth} strokeWidth="0.5" opacity="0.2"/>
      {/* Polaroid coming out bottom */}
      <rect x="40" y="68" width="40" height="44" rx="2" fill="#fff"/>
      <rect x="41" y="69" width="38" height="42" rx="1.5" fill="#faf8f5"/>
      {/* Image area in polaroid */}
      <rect x="44" y="72" width="32" height="28" rx="1" fill={a.clothAlt} opacity="0.3"/>
      {/* Scene inside polaroid - mini landscape */}
      <rect x="44" y="72" width="32" height="16" fill={a.accent} opacity="0.15"/>
      <circle cx="68" cy="78" r="5" fill={a.accent} opacity="0.3"/>
      <path d="M44 88 L52 80 L60 85 L68 78 L76 84 L76 88 L44 88 Z" fill={a.green} opacity="0.4"/>
      <path d="M44 88 L50 84 L58 88 Z" fill={a.green} opacity="0.5"/>
      {/* Polaroid bottom white area */}
      <rect x="44" y="100" width="32" height="8" rx="0" fill="#fff"/>
      {/* Sparkle/flash effects */}
      <path d="M85 20 L86 17 L87 20 L90 21 L87 22 L86 25 L85 22 L82 21 Z" fill={a.accent} opacity="0.4"/>
      <path d="M24 24 L25 22 L26 24 L28 25 L26 26 L25 28 L24 26 L22 25 Z" fill={a.accent} opacity="0.3"/>
      <circle cx="92" cy="50" r="2" fill={a.accent} opacity="0.2"/>
      <circle cx="22" cy="56" r="1.5" fill={a.accent} opacity="0.15"/>
    </svg>
  )
}

function JournalIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>
      {/* Book shadow */}
      <rect x="30" y="22" width="62" height="80" rx="4" fill={a.dark} opacity="0.1" transform="rotate(2 61 62)"/>
      {/* Book cover */}
      <rect x="28" y="20" width="62" height="80" rx="4" fill={a.accent}/>
      <rect x="29" y="21" width="60" height="78" rx="3.5" fill={a.accent} opacity="0.9"/>
      {/* Spine */}
      <rect x="28" y="20" width="10" height="80" rx="2" fill={a.dark} opacity="0.3"/>
      <rect x="28" y="20" width="8" height="80" rx="2" fill={a.dark} opacity="0.2"/>
      {/* Spine ridges */}
      <line x1="30" y1="30" x2="34" y2="30" stroke={a.cloth} strokeWidth="0.5" opacity="0.3"/>
      <line x1="30" y1="50" x2="34" y2="50" stroke={a.cloth} strokeWidth="0.5" opacity="0.3"/>
      <line x1="30" y1="70" x2="34" y2="70" stroke={a.cloth} strokeWidth="0.5" opacity="0.3"/>
      <line x1="30" y1="90" x2="34" y2="90" stroke={a.cloth} strokeWidth="0.5" opacity="0.3"/>
      {/* Pages visible (inner rectangle) */}
      <rect x="40" y="24" width="46" height="72" rx="2" fill={a.cloth}/>
      <rect x="41" y="25" width="44" height="70" rx="1.5" fill="#faf8f5"/>
      {/* Text lines */}
      <rect x="45" y="32" width="28" height="2" rx="1" fill={a.dark} opacity="0.12"/>
      <rect x="45" y="38" width="34" height="2" rx="1" fill={a.dark} opacity="0.12"/>
      <rect x="45" y="44" width="26" height="2" rx="1" fill={a.dark} opacity="0.12"/>
      <rect x="45" y="50" width="30" height="2" rx="1" fill={a.dark} opacity="0.12"/>
      <rect x="45" y="56" width="22" height="2" rx="1" fill={a.dark} opacity="0.12"/>
      <rect x="45" y="62" width="32" height="2" rx="1" fill={a.dark} opacity="0.12"/>
      <rect x="45" y="68" width="18" height="2" rx="1" fill={a.dark} opacity="0.12"/>
      <rect x="45" y="74" width="28" height="2" rx="1" fill={a.dark} opacity="0.12"/>
      <rect x="45" y="80" width="24" height="2" rx="1" fill={a.dark} opacity="0.12"/>
      {/* Bookmark ribbon */}
      <path d="M72 20 L72 36 L75 32 L78 36 L78 20" fill={a.accent} opacity="0.6"/>
      {/* Doodle on cover - small heart */}
      <path d="M56 104 Q53 98 56 96 Q59 94 62 98 Q65 94 68 96 Q71 98 68 104 Q62 110 56 104 Z" fill="none" stroke={a.cloth} strokeWidth="1" opacity="0.0"/>
      {/* Cover decoration - small bear face */}
      <circle cx="62" cy="15" r="0" fill="none"/>
      {/* (decoration on the visible cover area) */}
      <circle cx="68" cy="60" r="0" fill="none"/>
      {/* Pen lying diagonally across */}
      <line x1="70" y1="30" x2="96" y2="90" stroke={a.dark} strokeWidth="3" strokeLinecap="round"/>
      <line x1="70" y1="30" x2="96" y2="90" stroke={a.hairAlt} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Pen clip */}
      <line x1="92" y1="82" x2="94" y2="74" stroke={a.dark} strokeWidth="1" opacity="0.5"/>
      {/* Pen nib */}
      <path d="M70 30 L67 24" stroke={a.dark} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="67" cy="23" r="1" fill={a.dark}/>
      {/* Pen grip section */}
      <line x1="74" y1="40" x2="78" y2="50" stroke={a.dark} strokeWidth="3.5" strokeLinecap="round" opacity="0.6"/>
      {/* Cover doodle - small heart on book cover */}
      <path d="M52 106 Q52 104 54 104 Q56 104 56 106 Q56 108 54 110 Q52 108 52 106 Z" fill={a.cloth} opacity="0.4" transform="translate(-12, -86)"/>
    </svg>
  )
}

function CheersIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>
      {/* Left wine glass */}
      {/* Stem + base */}
      <line x1="42" y1="70" x2="42" y2="88" stroke={a.dark} strokeWidth="2" opacity="0.4"/>
      <ellipse cx="42" cy="90" rx="10" ry="3" fill={a.dark} opacity="0.2"/>
      {/* Bowl */}
      <path d="M28 42 Q28 70 42 70 Q56 70 56 42 Z" fill={a.cloth} opacity="0.3"/>
      <path d="M30 44 Q30 68 42 68 Q54 68 54 44 Z" fill={a.cloth} opacity="0.2"/>
      {/* Wine liquid */}
      <path d="M32 52 Q32 68 42 68 Q52 68 52 52 Z" fill={a.accent} opacity="0.5"/>
      <path d="M34 54 Q34 66 42 66 Q50 66 50 54 Z" fill={a.accent} opacity="0.3"/>
      {/* Rim */}
      <ellipse cx="42" cy="42" rx="14" ry="4" fill="none" stroke={a.dark} strokeWidth="0.8" opacity="0.2"/>
      {/* Bubbles */}
      <circle cx="38" cy="58" r="1" fill="#fff" opacity="0.3"/>
      <circle cx="44" cy="55" r="1.5" fill="#fff" opacity="0.25"/>
      <circle cx="40" cy="62" r="0.8" fill="#fff" opacity="0.2"/>
      {/* Right wine glass */}
      {/* Stem + base */}
      <line x1="78" y1="70" x2="78" y2="88" stroke={a.dark} strokeWidth="2" opacity="0.4"/>
      <ellipse cx="78" cy="90" rx="10" ry="3" fill={a.dark} opacity="0.2"/>
      {/* Bowl */}
      <path d="M64 42 Q64 70 78 70 Q92 70 92 42 Z" fill={a.cloth} opacity="0.3"/>
      <path d="M66 44 Q66 68 78 68 Q90 68 90 44 Z" fill={a.cloth} opacity="0.2"/>
      {/* Wine liquid */}
      <path d="M68 50 Q68 68 78 68 Q88 68 88 50 Z" fill={a.accent} opacity="0.5"/>
      <path d="M70 52 Q70 66 78 66 Q86 66 86 52 Z" fill={a.accent} opacity="0.3"/>
      {/* Rim */}
      <ellipse cx="78" cy="42" rx="14" ry="4" fill="none" stroke={a.dark} strokeWidth="0.8" opacity="0.2"/>
      {/* Bubbles */}
      <circle cx="74" cy="56" r="1.2" fill="#fff" opacity="0.3"/>
      <circle cx="80" cy="60" r="1" fill="#fff" opacity="0.25"/>
      <circle cx="76" cy="63" r="0.8" fill="#fff" opacity="0.2"/>
      {/* Clink sparkle at meeting point */}
      <path d="M60 38 L61 34 L62 38 L66 39 L62 40 L61 44 L60 40 L56 39 Z" fill={a.accent} opacity="0.6"/>
      <circle cx="60" cy="39" r="3" fill="#fff" opacity="0.2"/>
      {/* Small sparkles */}
      <circle cx="55" cy="32" r="1.5" fill={a.accent} opacity="0.3"/>
      <circle cx="66" cy="34" r="1" fill={a.accent} opacity="0.25"/>
      <circle cx="58" cy="46" r="1" fill={a.accent} opacity="0.2"/>
      {/* Hands/sleeves holding glasses */}
      {/* Left arm */}
      <path d="M20 100 Q24 90 32 82 Q36 78 40 74" stroke={a.skin} strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M18 102 Q22 94 28 88" stroke={a.cloth} strokeWidth="6" strokeLinecap="round" fill="none"/>
      {/* Right arm */}
      <path d="M100 100 Q96 90 88 82 Q84 78 80 74" stroke={a.skin} strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M102 102 Q98 94 92 88" stroke={a.cloth} strokeWidth="6" strokeLinecap="round" fill="none"/>
      {/* Highlight reflections on glasses */}
      <line x1="34" y1="48" x2="36" y2="56" stroke="#fff" strokeWidth="1" opacity="0.2" strokeLinecap="round"/>
      <line x1="84" y1="48" x2="82" y2="56" stroke="#fff" strokeWidth="1" opacity="0.2" strokeLinecap="round"/>
    </svg>
  )
}

function SpecialIcon({ accent = 0 }: IconProps) {
  const a = getA(accent)
  return (
    <svg viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="60" fill={a.bg}/>
      {/* Sparkle stars around */}
      <path d="M20 25 L22 19 L24 25 L30 27 L24 29 L22 35 L20 29 L14 27 Z" fill={a.accent} opacity="0.35"/>
      <path d="M92 20 L93 17 L94 20 L97 21 L94 22 L93 25 L92 22 L89 21 Z" fill={a.accent} opacity="0.3"/>
      <path d="M100 65 L101 62 L102 65 L105 66 L102 67 L101 70 L100 67 L97 66 Z" fill={a.accent} opacity="0.25"/>
      <path d="M16 70 L17 68 L18 70 L20 71 L18 72 L17 74 L16 72 L14 71 Z" fill={a.accent} opacity="0.25"/>
      <circle cx="26" cy="48" r="2" fill={a.accent} opacity="0.2"/>
      <circle cx="96" cy="42" r="1.5" fill={a.accent} opacity="0.2"/>
      <circle cx="22" cy="90" r="1.5" fill={a.accent} opacity="0.15"/>
      <circle cx="98" cy="88" r="2" fill={a.accent} opacity="0.15"/>
      {/* Gift box shadow */}
      <rect x="35" y="52" width="52" height="42" rx="4" fill={a.dark} opacity="0.08" transform="translate(2,2)"/>
      {/* Gift box body */}
      <rect x="34" y="52" width="52" height="42" rx="4" fill={a.accent}/>
      <rect x="36" y="54" width="48" height="38" rx="3" fill={a.accent} opacity="0.8"/>
      {/* Lid (slightly wider) */}
      <rect x="30" y="44" width="60" height="10" rx="3" fill={a.accent} opacity="0.9"/>
      <rect x="32" y="46" width="56" height="6" rx="2" fill={a.accent} opacity="0.7"/>
      {/* Ribbon vertical */}
      <rect x="56" y="44" width="8" height="50" rx="0" fill={a.cloth} opacity="0.5"/>
      {/* Ribbon horizontal */}
      <rect x="30" y="46" width="60" height="6" rx="0" fill={a.cloth} opacity="0.4"/>
      {/* Ribbon cross center */}
      <rect x="56" y="46" width="8" height="6" fill={a.cloth} opacity="0.6"/>
      {/* Bow - left loop */}
      <path d="M60 44 Q46 28 40 36 Q36 42 52 44 Z" fill={a.cloth} opacity="0.6"/>
      <path d="M60 44 Q48 30 42 36 Q38 40 54 44 Z" fill={a.cloth} opacity="0.4"/>
      {/* Bow - right loop */}
      <path d="M60 44 Q74 28 80 36 Q84 42 68 44 Z" fill={a.cloth} opacity="0.6"/>
      <path d="M60 44 Q72 30 78 36 Q82 40 66 44 Z" fill={a.cloth} opacity="0.4"/>
      {/* Bow center */}
      <circle cx="60" cy="44" r="4" fill={a.cloth} opacity="0.7"/>
      <circle cx="60" cy="44" r="2.5" fill={a.cloth} opacity="0.5"/>
      {/* Ribbon tails */}
      <path d="M56 44 Q50 34 46 28" stroke={a.cloth} strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round"/>
      <path d="M64 44 Q70 34 74 28" stroke={a.cloth} strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round"/>
      {/* Gift tag */}
      <rect x="82" y="56" width="12" height="16" rx="2" fill={a.cloth} opacity="0.6"/>
      <rect x="84" y="58" width="8" height="12" rx="1" fill="#faf8f5"/>
      <circle cx="88" cy="57" r="1.5" fill="none" stroke={a.dark} strokeWidth="0.5" opacity="0.3"/>
      {/* String from tag to box */}
      <path d="M86 56 Q84 52 86 50" stroke={a.dark} strokeWidth="0.7" opacity="0.3" fill="none"/>
      {/* Tag text lines */}
      <rect x="85" y="61" width="6" height="1" rx="0.5" fill={a.dark} opacity="0.15"/>
      <rect x="85" y="64" width="5" height="1" rx="0.5" fill={a.dark} opacity="0.15"/>
      {/* Box pattern/texture */}
      <circle cx="44" cy="66" r="1.5" fill={a.cloth} opacity="0.15"/>
      <circle cx="76" cy="66" r="1.5" fill={a.cloth} opacity="0.15"/>
      <circle cx="44" cy="80" r="1.5" fill={a.cloth} opacity="0.15"/>
      <circle cx="76" cy="80" r="1.5" fill={a.cloth} opacity="0.15"/>
    </svg>
  )
}


// === ICON REGISTRY ===

export interface SpaceIconDef {
  id: string
  name: string
  category: string
  component: React.FC<IconProps>
}

export const iconCategories = [
  'Pets',
  'Kids',
  'College & School',
  'Friends & Gang',
  'Family & Couples',
  'Siblings & Cousins',
  'Personal',
  'Trips & Vacations',
  'Celebrations & More',
] as const

export const spaceIconDefs: SpaceIconDef[] = [
  // Pets
  { id: 'cat-lover', name: 'Cat Lover', category: 'Pets', component: CatLoverIcon },
  { id: 'dog-lover', name: 'Dog Lover', category: 'Pets', component: DogLoverIcon },
  { id: 'bird-lover', name: 'Bird Lover', category: 'Pets', component: BirdLoverIcon },
  // Kids
  { id: 'baby', name: 'Baby', category: 'Kids', component: BabyIcon },
  { id: 'little-girl', name: 'Little Girl', category: 'Kids', component: LittleGirlIcon },
  { id: 'little-boy', name: 'Little Boy', category: 'Kids', component: LittleBoyIcon },
  // College & School
  { id: 'college-friends', name: 'College Friends', category: 'College & School', component: CollegeFriendsIcon },
  { id: 'school-buddies', name: 'School Buddies', category: 'College & School', component: SchoolBuddiesIcon },
  { id: 'study-group', name: 'Study Group', category: 'College & School', component: StudyGroupIcon },
  // Friends & Gang
  { id: 'friends-trio', name: 'Friends Trio', category: 'Friends & Gang', component: FriendsTrioIcon },
  { id: 'friends-group', name: 'Friends Group', category: 'Friends & Gang', component: FriendsGroupIcon },
  { id: 'boy-gang', name: 'Boy Gang', category: 'Friends & Gang', component: BoyGangIcon },
  { id: 'girl-gang', name: 'Girl Gang', category: 'Friends & Gang', component: GirlGangIcon },
  { id: 'friends-pose', name: 'Friends Pose', category: 'Friends & Gang', component: FriendsPoseIcon },
  { id: 'homies', name: 'Homies', category: 'Friends & Gang', component: HomiesIcon },
  // Family & Couples
  { id: 'couple-romantic', name: 'Couple', category: 'Family & Couples', component: CoupleRomanticIcon },
  { id: 'couple-hug', name: 'Couple Hug', category: 'Family & Couples', component: CoupleHugIcon },
  { id: 'family-one-kid', name: 'Family', category: 'Family & Couples', component: FamilyOneKidIcon },
  { id: 'family-two-kids', name: 'Family +2', category: 'Family & Couples', component: FamilyTwoKidsIcon },
  { id: 'couple-walk', name: 'Couple Walk', category: 'Family & Couples', component: CoupleWalkIcon },
  // Siblings & Cousins
  { id: 'siblings-cute', name: 'Siblings', category: 'Siblings & Cousins', component: SiblingsCuteIcon },
  { id: 'siblings-fight', name: 'Sibling Rivalry', category: 'Siblings & Cousins', component: SiblingsFightIcon },
  { id: 'brother-sister', name: 'Brother & Sister', category: 'Siblings & Cousins', component: BrotherSisterIcon },
  { id: 'older-younger', name: 'Big & Little', category: 'Siblings & Cousins', component: OlderYoungerIcon },
  { id: 'cousins-group', name: 'Cousins', category: 'Siblings & Cousins', component: CousinsGroupIcon },
  { id: 'cousins-fun', name: 'Cousins Fun', category: 'Siblings & Cousins', component: CousinsFunIcon },
  // Personal
  { id: 'reading', name: 'Reading', category: 'Personal', component: ReadingIcon },
  { id: 'cooking', name: 'Cooking', category: 'Personal', component: CookingIcon },
  { id: 'yoga', name: 'Yoga', category: 'Personal', component: YogaIcon },
  { id: 'painting', name: 'Painting', category: 'Personal', component: PaintingIcon },
  { id: 'gaming', name: 'Gaming', category: 'Personal', component: GamingIcon },
  { id: 'music-lover', name: 'Music', category: 'Personal', component: MusicLoverIcon },
  // Trips & Vacations
  { id: 'mountains', name: 'Mountains', category: 'Trips & Vacations', component: MountainsIcon },
  { id: 'beach', name: 'Beach', category: 'Trips & Vacations', component: BeachIcon },
  { id: 'city-trip', name: 'City Trip', category: 'Trips & Vacations', component: CityTripIcon },
  { id: 'camping', name: 'Camping', category: 'Trips & Vacations', component: CampingIcon },
  { id: 'road-trip', name: 'Road Trip', category: 'Trips & Vacations', component: RoadTripIcon },
  { id: 'sunset', name: 'Sunset', category: 'Trips & Vacations', component: SunsetIcon },
  // Celebrations & More
  { id: 'heart', name: 'Heart', category: 'Celebrations & More', component: HeartIcon },
  { id: 'celebration', name: 'Celebration', category: 'Celebrations & More', component: CelebrationIcon },
  { id: 'memories', name: 'Memories', category: 'Celebrations & More', component: MemoriesIcon },
  { id: 'journal', name: 'Journal', category: 'Celebrations & More', component: JournalIcon },
  { id: 'cheers', name: 'Cheers', category: 'Celebrations & More', component: CheersIcon },
  { id: 'special', name: 'Special', category: 'Celebrations & More', component: SpecialIcon },
]

export function getIconsByCategory(category: string) {
  return spaceIconDefs.filter(d => d.category === category)
}

export function getIconDef(iconId: string): SpaceIconDef | undefined {
  const base = iconId.replace(/-[0-2]$/, '')
  return spaceIconDefs.find(d => d.id === base)
}

export function getIconVariation(iconId: string): number {
  const match = iconId.match(/-([0-2])$/)
  return match ? parseInt(match[1]) : 0
}

export function makeIconId(baseId: string, variation: number): string {
  return variation === 0 ? baseId : `${baseId}-${variation}`
}

// === COLOR PALETTES ===

export interface IconColor {
  id: string
  name: string
  classes: string
  preview: string
}

export const iconColors: IconColor[] = [
  { id: 'purple-pink', name: 'Lavender Rose', classes: 'from-purple-200/60 to-pink-200/60', preview: '#DDD6FE' },
  { id: 'amber-orange', name: 'Sunset', classes: 'from-amber-200/60 to-orange-200/60', preview: '#FDE68A' },
  { id: 'teal-cyan', name: 'Ocean', classes: 'from-teal-200/60 to-cyan-200/60', preview: '#99F6E4' },
  { id: 'rose-red', name: 'Berry', classes: 'from-rose-200/60 to-red-200/60', preview: '#FECDD3' },
  { id: 'indigo-blue', name: 'Twilight', classes: 'from-indigo-200/60 to-blue-200/60', preview: '#C7D2FE' },
  { id: 'lime-emerald', name: 'Forest', classes: 'from-lime-200/60 to-emerald-200/60', preview: '#D9F99D' },
  { id: 'peach-cream', name: 'Peach', classes: 'from-orange-100/70 to-amber-50/70', preview: '#FFE4CC' },
  { id: 'lavender', name: 'Iris', classes: 'from-violet-200/60 to-purple-100/60', preview: '#DDD6FE' },
  { id: 'sage-mint', name: 'Sage', classes: 'from-emerald-100/60 to-teal-100/60', preview: '#D1FAE5' },
  { id: 'blush', name: 'Blush', classes: 'from-rose-100/70 to-pink-100/70', preview: '#FFE4E6' },
  { id: 'golden', name: 'Honey', classes: 'from-amber-100/70 to-yellow-200/60', preview: '#FEF3C7' },
  { id: 'sky', name: 'Sky', classes: 'from-sky-200/60 to-sky-100/60', preview: '#BAE6FD' },
]

export function getColorClasses(colorId: string): string {
  const color = iconColors.find(c => c.id === colorId)
  return color?.classes || iconColors[0].classes
}

const glowColorMap: Record<string, string> = {
  'purple-pink': 'rgba(196, 181, 253, 0.4)',
  'amber-orange': 'rgba(253, 230, 138, 0.4)',
  'teal-cyan': 'rgba(153, 246, 228, 0.4)',
  'rose-red': 'rgba(254, 205, 211, 0.4)',
  'indigo-blue': 'rgba(199, 210, 254, 0.4)',
  'lime-emerald': 'rgba(217, 249, 157, 0.4)',
  'peach-cream': 'rgba(255, 228, 204, 0.4)',
  'lavender': 'rgba(221, 214, 254, 0.4)',
  'sage-mint': 'rgba(209, 250, 229, 0.4)',
  'blush': 'rgba(255, 228, 230, 0.4)',
  'golden': 'rgba(254, 243, 199, 0.4)',
  'sky': 'rgba(186, 230, 253, 0.4)',
}

export function getGlowColor(colorId: string): string {
  return glowColorMap[colorId] || 'rgba(212, 165, 116, 0.3)'
}

// === TAGLINES ===

export const iconTaglines: Record<string, string[]> = {
  'cat-lover': ['Purring memories, one curl at a time.', 'Life is better with whiskers.', 'Cozy moments with my feline friend.'],
  'dog-lover': ['Wet noses and warm hearts.', 'Every walk is an adventure.', 'Unconditional love on four paws.'],
  'bird-lover': ['Songs and feathers, joy and colors.', 'A little bird told me this story.', 'Wings of wonder, heart of gold.'],
  'baby': ['Tiny hands, biggest love.', 'The littlest moments are the biggest.', 'Growing up, one giggle at a time.'],
  'little-girl': ['Princess of her own story.', 'Twirling through life.', 'Sugar, spice, and everything nice.'],
  'little-boy': ['Adventure is his middle name.', 'Mud, trucks, and endless energy.', 'A boy and his imagination.'],
  'college-friends': ['The best years, the best people.', 'Late nights and lasting bonds.', 'Campus life, lifelong friends.'],
  'school-buddies': ['Backpack adventures and recess memories.', 'Friends since the first bell.', 'Growing up together, one grade at a time.'],
  'study-group': ['Books, coffee, and brilliant minds.', 'Together we learn, together we grow.', 'The squad that studies together stays together.'],
  'friends-trio': ['Three is never a crowd.', 'Our little trio of chaos.', 'Together through thick and thin.'],
  'friends-group': ['More the merrier, always.', 'The crew that makes everything better.', 'Our chaos, our memories.'],
  'boy-gang': ['Brothers from another mother.', 'The boys are back in town.', 'Legends in the making.'],
  'girl-gang': ['Queens supporting queens.', 'Slay together, stay together.', 'Girl power, activated.'],
  'friends-pose': ['Say cheese! No, say memories!', 'Posing our way through life.', 'Picture perfect friendships.'],
  'homies': ['Chillin with the best ones.', 'No plans needed, just vibes.', 'Home is wherever my homies are.'],
  'couple-romantic': ['Two hearts, one timeline.', 'Every moment with you is golden.', 'Our love story, beautifully told.'],
  'couple-hug': ['In your arms is my favorite place.', 'Wrapped in love and memories.', 'Hold me close, hold me forever.'],
  'family-one-kid': ['Every family has a story. This is ours.', 'Built on love, held by memories.', 'Where laughter echoes forever.'],
  'family-two-kids': ['Our little team of four.', 'Double the kids, double the joy.', 'The more we are, the merrier it gets.'],
  'couple-walk': ['Walking through life together.', 'Every step with you is a memory.', 'Side by side, mile by mile.'],
  'siblings-cute': ['Built-in best friend.', 'Together since day one.', 'Sibling love, the purest kind.'],
  'siblings-fight': ['Love you, fight you, love you again.', 'The rivalry that makes us stronger.', 'We fight because we care.'],
  'brother-sister': ['Brother and sister, forever friends.', 'Different but inseparable.', 'The ultimate duo.'],
  'older-younger': ['Big sibling, big protector.', 'I got you, always.', 'Looking up to the best.'],
  'cousins-group': ['Cousins by blood, friends by choice.', 'Family reunions, best reunions.', 'The extended family that extends the fun.'],
  'cousins-fun': ['Cousins make the best playmates.', 'Family fun, cousin style.', 'Together at every gathering.'],
  'reading': ['Lost in pages, found in stories.', 'A quiet chapter of my life.', 'Books, coffee, and calm.'],
  'cooking': ['Love served on a plate.', 'Stirring up memories.', 'The kitchen is where the magic happens.'],
  'yoga': ['Finding peace within.', 'Breathe in calm, breathe out chaos.', 'My quiet center.'],
  'painting': ['Colors of my imagination.', 'Every stroke tells a story.', 'Creating my own masterpiece.'],
  'gaming': ['Level up, power up, game on.', 'My digital adventures.', 'Press start to begin.'],
  'music-lover': ['The soundtrack of my life.', 'Every note, every memory.', 'Lost in the melody.'],
  'mountains': ['The mountains are calling.', 'Peak moments, peak views.', 'Higher we climb, better the story.'],
  'beach': ['Salt in the air, sand in my toes.', 'Ocean vibes, beach memories.', 'Where the waves tell stories.'],
  'city-trip': ['City lights, unforgettable nights.', 'Urban adventures await.', 'Every city has a story.'],
  'camping': ['Under the stars, by the fire.', 'Campfire tales and starry nights.', 'Nature is our home.'],
  'road-trip': ['The road is the destination.', 'Miles of memories ahead.', 'Windows down, music up.'],
  'sunset': ['Golden hour, golden memories.', 'Every sunset is a new ending.', 'Chasing sunsets together.'],
  'heart': ['Feelings too big for words.', 'The heart remembers everything.', 'Where love lives.'],
  'celebration': ['Life is worth celebrating.', 'Every milestone matters.', 'Cheers to the good times.'],
  'memories': ['Captured moments, lasting forever.', 'Through the lens of love.', 'Every click tells a story.'],
  'journal': ['Pages of our story.', 'Written one day at a time.', 'The chapters that define us.'],
  'cheers': ['Here is to the moments worth toasting.', 'Raise a glass to us.', 'Joy in every sip.'],
  'special': ['The moments that sparkle.', 'Something extraordinary lives here.', 'For the moments that take your breath away.'],
}

export function randomTaglineForIcon(iconId: string): string {
  const base = iconId.replace(/-[0-2]$/, '')
  const lines = iconTaglines[base]
  if (!lines) return 'A collection of precious moments.'
  return lines[Math.floor(Math.random() * lines.length)]
}

// === RENDER HELPER ===

export function SpaceIconRenderer({ iconId, size = 'lg' }: { iconId: string; size?: 'sm' | 'md' | 'lg' | 'full' }) {
  const def = getIconDef(iconId)
  const variation = getIconVariation(iconId)

  if (!def) return <span className="text-4xl">✨</span>

  const sizeClass = size === 'full' ? 'w-full h-full' : size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-full h-full' : 'w-full h-full'

  const IconComp = def.component
  return (
    <div className={`${sizeClass} relative z-10 rounded-full overflow-hidden`}>
      <IconComp accent={variation} />
    </div>
  )
}
