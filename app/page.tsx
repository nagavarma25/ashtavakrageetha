'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { episodes, Episode } from './data/episodes'

function formatTime(s: number) {
  if (!isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

/* ─── Forest tree silhouette (SVG sub-component) ─── */
function Tree({ x, s, fill }: { x: number; s: number; fill: string }) {
  const g  = 900
  const tH = 280 * s
  const rX = 58  * s
  const rY = 72  * s
  return (
    <g>
      <rect    x={x - 5*s}        y={g - tH}              width={10*s}        height={tH}      fill={fill} />
      <ellipse cx={x}             cy={g - tH - rY*0.50}   rx={rX}             ry={rY}           fill={fill} />
      <ellipse cx={x - rX*0.65}   cy={g - tH - rY*0.25}   rx={rX*0.68}       ry={rY*0.65}      fill={fill} />
      <ellipse cx={x + rX*0.60}   cy={g - tH - rY*0.18}   rx={rX*0.62}       ry={rY*0.60}      fill={fill} />
      <ellipse cx={x + rX*0.08}   cy={g - tH - rY*1.15}   rx={rX*0.48}       ry={rY*0.55}      fill={fill} />
    </g>
  )
}

/* ─── Fixed forest backdrop ─── */
function ForestBackdrop() {
  const layers = [
    { fill: '#2D6A30', opacity: 0.22, s: 0.28, xs: [70,180,310,440,580,700,840,970,1110,1250,1390] },
    { fill: '#1F4E26', opacity: 0.32, s: 0.42, xs: [120,290,480,660,850,1040,1230] },
    { fill: '#163D1E', opacity: 0.44, s: 0.62, xs: [30,240,490,760,1020,1280] },
    { fill: '#0E2D14', opacity: 0.64, s: 0.88, xs: [80,380,740,1100,1420] },
    { fill: '#071A09', opacity: 0.84, s: 1.15, xs: [-30,340,800,1200] },
    { fill: '#040F06', opacity: 0.94, s: 1.45, xs: [-80,600,1360] },
  ]

  const fireflies = [
    { x: 12, y: 28, d: 5.2, delay: 0,   rgb: '212,168,85'  },
    { x: 28, y: 18, d: 4.5, delay: 1.3, rgb: '116,198,157' },
    { x: 45, y: 33, d: 6.1, delay: 0.7, rgb: '240,224,144' },
    { x: 58, y: 22, d: 4.8, delay: 2.1, rgb: '212,168,85'  },
    { x: 72, y: 29, d: 5.5, delay: 1.8, rgb: '116,198,157' },
    { x: 85, y: 16, d: 4.2, delay: 0.4, rgb: '240,224,144' },
    { x: 93, y: 38, d: 5.8, delay: 3.0, rgb: '212,168,85'  },
    { x: 18, y: 42, d: 6.3, delay: 2.5, rgb: '116,198,157' },
    { x: 35, y: 56, d: 4.6, delay: 1.1, rgb: '212,168,85'  },
    { x: 62, y: 48, d: 5.1, delay: 3.5, rgb: '240,224,144' },
    { x: 78, y: 36, d: 4.9, delay: 0.9, rgb: '116,198,157' },
    { x: 50, y: 62, d: 5.7, delay: 4.2, rgb: '212,168,85'  },
  ]

  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}
    >
      <svg
        width="100%" height="100%"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <radialGradient id="mist-a" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#74C69D" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#74C69D" stopOpacity="0"    />
          </radialGradient>
          <radialGradient id="mist-b" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#A0D8B0" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#A0D8B0" stopOpacity="0"    />
          </radialGradient>
        </defs>
        <rect x="0" y="870" width="1440" height="30" fill="#040F06" />
        {layers.map((layer, li) => (
          <g key={li} opacity={layer.opacity}>
            {layer.xs.map((x, ti) => (
              <Tree key={ti} x={x} s={layer.s} fill={layer.fill} />
            ))}
          </g>
        ))}
        <ellipse cx="720"  cy="740" rx="1000" ry="80"  fill="url(#mist-a)" style={{ animation: 'mistDrift 22s ease-in-out infinite' }} />
        <ellipse cx="380"  cy="490" rx="680"  ry="55"  fill="url(#mist-b)" style={{ animation: 'mistDrift 18s ease-in-out infinite reverse' }} />
        <ellipse cx="1080" cy="350" rx="580"  ry="45"  fill="url(#mist-b)" style={{ animation: 'mistDrift 25s ease-in-out infinite' }} />
        <polygon points="145,0 225,0 250,900 120,900"     fill="rgba(255,215,100,0.05)" style={{ animation: 'shimmerShaft 9s ease-in-out infinite' }} />
        <polygon points="698,0 802,0 828,900 672,900"     fill="rgba(255,220,95,0.06)"  style={{ animation: 'shimmerShaft 13s ease-in-out infinite reverse' }} />
        <polygon points="1198,0 1272,0 1295,900 1175,900" fill="rgba(255,215,100,0.04)" style={{ animation: 'shimmerShaft 11s ease-in-out infinite' }} />
      </svg>
      {fireflies.map((ff, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${ff.x}%`,
            top:  `${ff.y}%`,
            width: 3, height: 3,
            borderRadius: '50%',
            background: `rgb(${ff.rgb})`,
            boxShadow: `0 0 8px 3px rgba(${ff.rgb},0.65)`,
            animation: `firefly ${ff.d}s ease-in-out infinite`,
            animationDelay: `${ff.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

/* ─── Audio row ─── */
function AudioRow({
  ep,
  index,
  isActive,
  isPlaying,
  onSelect,
}: {
  ep: Episode
  index: number
  isActive: boolean
  isPlaying: boolean
  onSelect: (n: number) => void
}) {
  const audioRef    = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [progress,    setProgress]    = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration,    setDuration]    = useState(0)
  const [loaded,      setLoaded]      = useState(false)
  const isEven = index % 2 === 0

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isActive && isPlaying) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [isActive, isPlaying])

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    setCurrentTime(audio.currentTime)
    setDuration(audio.duration || 0)
    setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0)
  }, [])

  const handleLoaded = useCallback(() => {
    setLoaded(true)
    setDuration(audioRef.current?.duration || 0)
  }, [])

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect    = progressRef.current!.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const ratio   = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    audio.currentTime = ratio * audio.duration
  }, [])

  return (
    <li>
      <audio
        ref={audioRef}
        src={ep.audioUrl}
        preload="none"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoaded}
        onEnded={() => onSelect(ep.number + 1)}
      />

      <div
        onClick={() => onSelect(ep.number)}
        className="audio-row"
        style={{
          minHeight: 64,
          padding: '0 20px',
          gap: 14,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'background 0.18s ease',
          background: isActive
            ? 'linear-gradient(100deg, rgba(201,168,76,0.18) 0%, rgba(10,30,12,0.82) 60%)'
            : isEven
            ? 'rgba(10,28,13,0.68)'
            : 'rgba(6,20,9,0.52)',
          borderLeft: `3px solid ${isActive ? '#C9A84C' : 'transparent'}`,
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        {/* Play/Pause button */}
        <button
          aria-label={isActive && isPlaying ? `Pause discourse ${ep.number}` : `Play discourse ${ep.number}`}
          onClick={(e) => { e.stopPropagation(); onSelect(ep.number) }}
          style={{
            width: 44, height: 44,
            borderRadius: '50%',
            flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.18s ease',
            background: isActive
              ? 'radial-gradient(circle, #D4A855 0%, #C49440 100%)'
              : 'rgba(201,168,76,0.08)',
            border: `1.5px solid ${isActive ? '#C9A84C' : 'rgba(201,168,76,0.35)'}`,
            color: isActive ? '#071209' : '#C9A84C',
            boxShadow: isActive ? '0 0 16px rgba(201,168,76,0.30)' : 'none',
          }}
        >
          {isActive && isPlaying ? (
            <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true">
              <rect x="0" y="0" width="3" height="12" rx="1"/>
              <rect x="7" y="0" width="3" height="12" rx="1"/>
            </svg>
          ) : (
            <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true">
              <path d="M1 0.8L9.5 6L1 11.2V0.8Z"/>
            </svg>
          )}
        </button>

        {/* Number */}
        <span
          style={{
            flexShrink: 0,
            width: 28,
            fontSize: 11,
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 700,
            letterSpacing: '0.10em',
            fontVariantNumeric: 'tabular-nums',
            color: isActive ? '#C9A84C' : 'rgba(201,168,76,0.42)',
          }}
        >
          {String(ep.number).padStart(2, '0')}
        </span>

        {/* Title */}
        <span
          style={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: 15,
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: isActive ? 500 : 400,
            letterSpacing: '0.015em',
            lineHeight: 1.3,
            color: isActive ? '#F2E8CE' : 'rgba(235,224,196,0.78)',
          }}
        >
          {ep.title}
        </span>

        {/* Duration */}
        {ep.duration && (
          <span
            style={{
              flexShrink: 0,
              fontSize: 11,
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 300,
              letterSpacing: '0.04em',
              fontVariantNumeric: 'tabular-nums',
              color: isActive ? 'rgba(201,168,76,0.75)' : 'rgba(220,210,180,0.38)',
              whiteSpace: 'nowrap',
            }}
          >
            {ep.duration}
          </span>
        )}
      </div>

      {/* Expanded player */}
      {isActive && (
        <div
          style={{
            padding: '12px 20px 16px 20px',
            background: 'linear-gradient(100deg, rgba(201,168,76,0.10) 0%, rgba(6,18,8,0.90) 70%)',
            borderLeft: '3px solid #C9A84C',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div
            ref={progressRef}
            onClick={handleSeek}
            onTouchMove={handleSeek}
            style={{ position: 'relative', height: 44, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-label="Seek audio"
          >
            <div style={{ position: 'absolute', width: '100%', height: 2, borderRadius: 2, background: 'rgba(201,168,76,0.18)' }} />
            <div style={{ position: 'absolute', left: 0, height: 2, borderRadius: 2, width: `${progress}%`, background: 'linear-gradient(90deg, #C9A84C, #E8C870)', transition: 'width 0.1s linear' }} />
            <div
              style={{
                position: 'absolute',
                left: `calc(${progress}% - 7px)`,
                width: 14, height: 14,
                borderRadius: '50%',
                background: '#C9A84C',
                boxShadow: '0 0 0 3px rgba(201,168,76,0.22), 0 0 10px rgba(201,168,76,0.30)',
                transition: 'left 0.1s linear',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 10,
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 400,
              letterSpacing: '0.06em',
              color: 'rgba(220,210,170,0.50)',
              marginTop: 2,
            }}
          >
            <span>{formatTime(currentTime)}</span>
            <span>{loaded ? formatTime(duration) : ep.duration}</span>
          </div>
        </div>
      )}
    </li>
  )
}

/* ─── Page ─── */
export default function Home() {
  const [query,     setQuery]     = useState('')
  const [activeNum, setActiveNum] = useState<number | null>(null)
  const [playing,   setPlaying]   = useState(false)

  const filtered = episodes.filter((ep) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return String(ep.number).padStart(2, '0').includes(q) || ep.title.toLowerCase().includes(q)
  })

  const handleSelect = (n: number) => {
    if (n < 1 || n > 91) return
    if (activeNum === n) {
      setPlaying((p) => !p)
    } else {
      setActiveNum(n)
      setPlaying(true)
    }
  }

  return (
    <div style={{ overflowX: 'hidden', minHeight: '100dvh' }}>
      <ForestBackdrop />

      {/* Warm dawn-light overlay — makes the header area luminous */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: [
            'radial-gradient(ellipse 90% 45% at 50% 0%, rgba(201,168,76,0.10) 0%, transparent 65%)',
            'linear-gradient(180deg, rgba(6,14,8,0.42) 0%, rgba(4,10,6,0.28) 45%, rgba(4,10,6,0.55) 100%)',
          ].join(', '),
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>

        {/* ── Header ── */}
        <header style={{ padding: '52px 24px 36px', position: 'relative' }}>

          {/* Ambient gold halo behind the title */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              pointerEvents: 'none',
              background: 'radial-gradient(ellipse 75% 65% at 30% 45%, rgba(201,168,76,0.09) 0%, transparent 68%)',
            }}
          />

          <p style={{
            fontSize: 10,
            letterSpacing: '0.30em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.55)',
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 500,
            marginBottom: 18,
          }}>
            Osho · Hindi Discourses
          </p>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 'clamp(48px, 13vw, 100px)',
            lineHeight: 0.92,
            color: '#EDE4C6',
            marginBottom: 8,
            textShadow: '0 2px 40px rgba(201,168,76,0.12)',
          }}>
            Ashtavakra
          </h1>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: 'clamp(36px, 10vw, 78px)',
            lineHeight: 1,
            color: '#C9A84C',
            marginBottom: 24,
            textShadow: '0 2px 32px rgba(201,168,76,0.22)',
          }}>
            Maha Geeta
          </h2>

          {/* Decorative gold rule */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, #C9A84C, transparent)' }} />
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(201,168,76,0.55)' }} />
            <div style={{ width: 20, height: 1, background: 'rgba(201,168,76,0.25)' }} />
          </div>

          <p style={{
            fontSize: 13,
            lineHeight: 1.75,
            color: 'rgba(225,215,185,0.58)',
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 300,
            maxWidth: 300,
            marginBottom: 32,
          }}>
            91 discourses on the Ashtavakra Gita — the radical scripture on consciousness and liberation.
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 340 }}>
            <svg
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(201,168,76,0.45)', pointerEvents: 'none' }}
              width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"
            >
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search discourses…"
              className="search-input"
              style={{
                width: '100%',
                height: 48,
                background: 'rgba(255,255,255,0.055)',
                border: '1px solid rgba(201,168,76,0.20)',
                borderRadius: 10,
                paddingLeft: 40,
                paddingRight: 16,
                fontSize: 14,
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 300,
                color: '#EDE4C6',
                outline: 'none',
                WebkitAppearance: 'none',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                transition: 'border-color 0.2s',
              }}
            />
          </div>
        </header>

        {/* ── Episode panel ── */}
        <div
          style={{
            margin: '0 10px 0',
            borderRadius: 14,
            overflow: 'hidden',
            border: '1px solid rgba(201,168,76,0.12)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(201,168,76,0.08)',
            background: 'rgba(5,15,7,0.52)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Status bar */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              flexWrap: 'wrap',
              background: 'rgba(4,12,6,0.40)',
            }}
          >
            <span style={{
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(210,200,165,0.42)',
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 500,
            }}>
              {filtered.length} {filtered.length === 1 ? 'Discourse' : 'Discourses'}
            </span>

            {activeNum && (
              <>
                <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: 12 }}>|</span>
                <span style={{
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#C9A84C',
                  fontFamily: "'Raleway', sans-serif",
                  fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: 7,
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: 6, height: 6,
                    borderRadius: '50%',
                    background: playing ? '#C9A84C' : 'rgba(201,168,76,0.38)',
                    boxShadow: playing ? '0 0 8px rgba(201,168,76,0.55)' : 'none',
                    animation: playing ? 'pulse 1.5s infinite' : 'none',
                  }} />
                  {playing ? 'Playing' : 'Paused'} · Discourse {String(activeNum).padStart(2, '0')}
                </span>
              </>
            )}
          </div>

          {/* Episode list */}
          <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {filtered.map((ep, i) => (
              <AudioRow
                key={ep.number}
                ep={ep}
                index={i}
                isActive={activeNum === ep.number}
                isPlaying={playing && activeNum === ep.number}
                onSelect={handleSelect}
              />
            ))}
          </ol>

          {filtered.length === 0 && (
            <p style={{
              padding: '80px 24px',
              textAlign: 'center',
              fontSize: 13,
              color: 'rgba(210,200,165,0.40)',
              fontFamily: "'Raleway', sans-serif",
            }}>
              No discourses found.
            </p>
          )}
        </div>

        {/* Footer */}
        <footer style={{ padding: '28px 24px 56px', marginTop: 24 }}>
          <p style={{
            fontSize: 11,
            lineHeight: 1.8,
            color: 'rgba(200,190,158,0.32)',
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 300,
          }}>
            Audio content from{' '}
            <a
              href="https://oshoworld.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'rgba(200,190,158,0.48)', textDecoration: 'underline', textUnderlineOffset: 3 }}
            >
              oshoworld.com
            </a>
            .<br />All rights reserved by Osho International Foundation.
          </p>
        </footer>
      </div>

      <style>{`
        .audio-row:hover {
          background: rgba(201,168,76,0.07) !important;
        }
        .search-input:focus {
          border-color: rgba(201,168,76,0.42) !important;
          background: rgba(255,255,255,0.08) !important;
        }
        input[type=search]::-webkit-search-cancel-button { -webkit-appearance: none; }
        input::placeholder { color: rgba(210,200,170,0.32) !important; }
        * { -webkit-tap-highlight-color: transparent; }
        li { list-style: none; }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; }
        }
      `}</style>
    </div>
  )
}
