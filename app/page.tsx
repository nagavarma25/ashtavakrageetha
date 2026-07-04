'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { episodes, Episode } from './data/episodes'

function formatTime(s: number) {
  if (!isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

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
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loaded, setLoaded] = useState(false)
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
    const rect = progressRef.current!.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
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

      {/* Row */}
      <div
        onClick={() => onSelect(ep.number)}
        className="flex items-center cursor-pointer transition-all duration-200"
        style={{
          minHeight: 56,
          padding: '0 16px',
          gap: 12,
          background: isActive
            ? 'linear-gradient(135deg,rgba(201,168,76,.13) 0%,rgba(201,168,76,.04) 100%)'
            : isEven
            ? '#F9F7F2'
            : '#F2EEE6',
          borderLeft: `3px solid ${isActive ? '#C9A84C' : 'transparent'}`,
        }}
      >
        {/* Play/Pause — 44×44 touch target */}
        <button
          aria-label={isActive && isPlaying ? `Pause discourse ${ep.number}` : `Play discourse ${ep.number}`}
          onClick={(e) => { e.stopPropagation(); onSelect(ep.number) }}
          className="shrink-0 flex items-center justify-center rounded-full transition-all duration-200"
          style={{
            width: 44,
            height: 44,
            background: isActive ? '#C9A84C' : 'transparent',
            border: `1.5px solid ${isActive ? '#C9A84C' : 'rgba(201,168,76,0.5)'}`,
            color: isActive ? '#F9F7F2' : '#C9A84C',
            flexShrink: 0,
          }}
        >
          {isActive && isPlaying ? (
            <svg width="11" height="13" viewBox="0 0 11 13" fill="currentColor" aria-hidden="true">
              <rect x="0.5" y="0.5" width="3.5" height="12" rx="1"/>
              <rect x="7" y="0.5" width="3.5" height="12" rx="1"/>
            </svg>
          ) : (
            <svg width="11" height="13" viewBox="0 0 11 13" fill="currentColor" aria-hidden="true">
              <path d="M1.5 1.2L10.5 6.5L1.5 11.8V1.2Z"/>
            </svg>
          )}
        </button>

        {/* Number */}
        <span
          className="shrink-0 tabular-nums"
          style={{
            fontSize: 11,
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 600,
            letterSpacing: '0.05em',
            color: isActive ? '#C9A84C' : '#8C8880',
            width: 24,
          }}
        >
          {String(ep.number).padStart(2, '0')}
        </span>

        {/* Title — takes remaining space */}
        <span
          className="flex-1 min-w-0 truncate"
          style={{
            fontSize: 16,
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: isActive ? 500 : 400,
            color: isActive ? '#1A1A1A' : '#2A2A2A',
            lineHeight: 1.3,
          }}
        >
          {ep.title}
        </span>

        {/* Duration — hidden on very small screens */}
        {ep.duration && (
          <span
            className="shrink-0"
            style={{
              fontSize: 11,
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 300,
              color: isActive ? '#C9A84C' : '#8C8880',
              whiteSpace: 'nowrap',
            }}
          >
            {ep.duration}
          </span>
        )}
      </div>

      {/* Expanded player — only when active */}
      {isActive && (
        <div
          style={{
            padding: '10px 16px 14px',
            background: 'linear-gradient(135deg,rgba(201,168,76,.08) 0%,rgba(201,168,76,.02) 100%)',
            borderLeft: '3px solid #C9A84C',
          }}
        >
          {/* Progress bar — tall touch area */}
          <div
            ref={progressRef}
            onClick={handleSeek}
            onTouchMove={handleSeek}
            className="relative w-full cursor-pointer"
            style={{ height: 44, display: 'flex', alignItems: 'center' }}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-label="Seek audio"
          >
            {/* Track */}
            <div className="absolute w-full h-1 rounded-full" style={{ background: 'rgba(201,168,76,.2)' }} />
            {/* Filled */}
            <div
              className="absolute h-1 rounded-full left-0"
              style={{ width: `${progress}%`, background: '#C9A84C', transition: 'width 0.1s linear' }}
            />
            {/* Thumb */}
            <div
              className="absolute w-4 h-4 rounded-full"
              style={{
                left: `calc(${progress}% - 8px)`,
                background: '#C9A84C',
                boxShadow: '0 0 0 4px rgba(201,168,76,.2)',
                transition: 'left 0.1s linear',
              }}
            />
          </div>

          {/* Time labels */}
          <div
            className="flex justify-between"
            style={{
              fontSize: 11,
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 300,
              color: '#8C8880',
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

export default function Home() {
  const [query, setQuery] = useState('')
  const [activeNum, setActiveNum] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)

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
    <div className="overflow-x-hidden" style={{ background: 'var(--ivory)', minHeight: '100dvh' }}>
      {/* Header */}
      <header style={{ padding: '48px 20px 24px' }}>
        <p
          style={{
            fontSize: 10,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 500,
            marginBottom: 16,
          }}
        >
          Osho · Hindi Discourses
        </p>

        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 'clamp(36px, 11vw, 88px)',
            lineHeight: 1,
            color: '#1A1A1A',
            marginBottom: 4,
          }}
        >
          Ashtavakra
        </h1>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: 'clamp(28px, 9vw, 72px)',
            lineHeight: 1,
            color: '#C9A84C',
            marginBottom: 20,
          }}
        >
          Maha Geeta
        </h2>

        <p
          style={{
            fontSize: 13,
            lineHeight: 1.7,
            color: 'var(--muted)',
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 300,
            maxWidth: 320,
            marginBottom: 24,
          }}
        >
          91 discourses on the Ashtavakra Gita — the radical scripture on consciousness and liberation.
        </p>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: 340 }}>
          <svg
            style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }}
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
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--border)',
              paddingBottom: 10,
              paddingLeft: 24,
              fontSize: 14,
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 300,
              color: 'var(--charcoal)',
              outline: 'none',
              WebkitAppearance: 'none',
              height: 44,
            }}
          />
        </div>
      </header>

      {/* Status bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 20px',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          marginBottom: 4,
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontSize: 10,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            fontFamily: "'Raleway', sans-serif",
          }}
        >
          {filtered.length} {filtered.length === 1 ? 'Discourse' : 'Discourses'}
        </span>

        {activeNum && (
          <>
            <span style={{ color: 'var(--border)', fontSize: 12 }}>|</span>
            <span
              style={{
                fontSize: 10,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#C9A84C',
                fontFamily: "'Raleway', sans-serif",
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: playing ? '#C9A84C' : '#8C8880',
                  animation: playing ? 'pulse 1.5s infinite' : 'none',
                }}
              />
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
        <p
          style={{
            padding: '80px 20px',
            textAlign: 'center',
            fontSize: 13,
            color: 'var(--muted)',
            fontFamily: "'Raleway', sans-serif",
          }}
        >
          No discourses found.
        </p>
      )}

      {/* Footer */}
      <footer
        style={{
          padding: '32px 20px 48px',
          borderTop: '1px solid var(--border)',
          marginTop: 16,
        }}
      >
        <p
          style={{
            fontSize: 11,
            lineHeight: 1.8,
            color: 'var(--muted)',
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 300,
          }}
        >
          Audio content from{' '}
          <a
            href="https://oshoworld.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            oshoworld.com
          </a>
          .<br />All rights reserved by Osho International Foundation.
        </p>
      </footer>

      <style>{`
        @keyframes pulse {
          0%,100%{opacity:1} 50%{opacity:.3}
        }
        input[type=search]::-webkit-search-cancel-button {
          -webkit-appearance: none;
        }
        * { -webkit-tap-highlight-color: transparent; }
        li { list-style: none; }
      `}</style>
    </div>
  )
}
