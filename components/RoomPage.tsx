'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { track } from '../utils/analytics'
import { connectRoomSocket, disconnectRoomSocket } from '../utils/roomSocket'
import type { Socket } from 'socket.io-client'
import { fetchCategories, type Category } from '../services/clientService'
import Button from './comic/Button'
import Card from './comic/Card'
import CategorySticker from './comic/CategorySticker'
import Meter from './comic/Meter'
import MascotBubble from './comic/MascotBubble'
import ShareSheet from './comic/ShareSheet'
import { useToast } from './comic/Toast'
import logo from '../assets/smartass-logo.png'
import '../styles/comic.scss'
import '../styles/Room.scss'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PlayerInfo {
  socketId: string
  name: string
  score: number
}

interface QuestionData {
  index: number
  total: number
  saFact: string
  endsAt: number
}

interface RevealResult {
  socketId: string
  playerName: string
  answer: boolean | null
  correct: boolean
  pointsEarned: number
  totalScore: number
}

interface RevealData {
  correctAnswer: boolean
  explanation: string | null
  results: RevealResult[]
  questionIndex: number
  isLast: boolean
}

interface FinalScore {
  socketId: string
  name: string
  score: number
  rank: number
}

type Phase =
  | { tag: 'create' }
  | { tag: 'joining'; code: string }
  | { tag: 'lobby'; code: string; category: string; players: PlayerInfo[]; isHost: boolean }
  | { tag: 'question'; code: string; category: string; data: QuestionData; answered: boolean; userAnswer: boolean | null; answeredCount: number; playerCount: number; isHost: boolean }
  | { tag: 'reveal'; code: string; category: string; data: RevealData; isHost: boolean }
  | { tag: 'finished'; finalScores: FinalScore[] }
  | { tag: 'error'; message: string }

interface RoomPageProps {
  navigate: (path: string, search?: string, replace?: boolean) => void
  initialCode?: string  // if set, open the "join" screen for this code
}

// ─── Countdown hook ────────────────────────────────────────────────────────────

function useCountdown(endsAt: number) {
  const [remaining, setRemaining] = useState(() => Math.max(0, endsAt - Date.now()))

  useEffect(() => {
    const tick = () => {
      const ms = Math.max(0, endsAt - Date.now())
      setRemaining(ms)
    }
    tick()
    const id = setInterval(tick, 100)
    return () => clearInterval(id)
  }, [endsAt])

  return remaining
}

// ─── Countdown display (standalone so it re-renders independently) ─────────────

function Countdown({ endsAt, total }: { endsAt: number; total: number }) {
  const remaining = useCountdown(endsAt)
  const secs = Math.ceil(remaining / 1000)
  const pct = (remaining / total) * 100
  const urgent = secs <= 5

  return (
    <>
      <div className="room-question__header">
        <span className="room-question__progress" />
        <span className={`room-question__timer ${urgent ? 'room-question__timer--urgent' : ''}`}>
          {secs}s
        </span>
      </div>
      <div className="room-question__timer-bar">
        <div
          className={`room-question__timer-fill ${urgent ? 'room-question__timer-fill--urgent' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </>
  )
}

// ─── Helper ────────────────────────────────────────────────────────────────────

const fmt = (n: number) => n.toLocaleString('en-US')

// A private seat key lets a phone reclaim its place after the connection drops (switching apps,
// locking the screen, a page reload). Per tab, never shown to other players.
const SESSION_KEY = 'sa_room_session'
function getPlayerKey(): string {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    const cur = raw ? JSON.parse(raw) : null
    if (cur?.key) return cur.key
    const key = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ key, code: null }))
    return key
  } catch { return `k-${Math.random().toString(36).slice(2)}` }
}
function saveRoomCode(code: string | null) {
  try { const cur = JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}'); sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...cur, code })) } catch { /* private mode */ }
}
function readSession(): { key?: string; code?: string | null } {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}') } catch { return {} }
}

function initials(name: string) {
  return name.slice(0, 2).toUpperCase()
}

function medalFor(rank: number) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `${rank}.`
}

// ─── Round timer (comic): "Round 8 of 10 · 12s" + draining bar ──────────────────

function RoundTimer({ endsAt, total, round, rounds }: { endsAt: number; total: number; round: number; rounds: number }) {
  const remaining = useCountdown(endsAt)
  const secs = Math.ceil(remaining / 1000)
  const urgent = secs <= 5
  return (
    <>
      <div className="cp-cat-step">Round {round} of {rounds} · <span style={{ color: urgent ? 'var(--cp-orange)' : undefined, fontWeight: 900 }}>{secs}s</span></div>
      <div className="cp-progress" role="progressbar" aria-label="Time left" aria-valuemin={0} aria-valuemax={Math.round(total / 1000)} aria-valuenow={secs}>
        <div className="cp-progress__fill" style={{ width: `${(remaining / total) * 100}%`, background: urgent ? 'var(--cp-orange)' : 'var(--cp-lime)', transition: 'none' }} />
      </div>
    </>
  )
}

// Module-level (a component defined inside RoomPage would remount every render and steal input focus)
function Shell({ children, toast, lost }: { children: React.ReactNode; toast: React.ReactNode; lost?: boolean }) {
  return (
    <div className="cp-screen">
      <div className="cp-col">
        {lost && <div className="cp-card cp-card--navy" role="status" style={{ borderColor: 'var(--cp-orange)', textAlign: 'center', fontWeight: 800, padding: '8px 12px' }}>Connection lost. Reconnecting…</div>}
        {children}{toast}
      </div>
    </div>
  )
}

function Crown() {
  return (
    <svg className="cp-crown__hat" viewBox="0 0 120 80" aria-hidden="true">
      <path d="M8 70 L16 18 L42 44 L60 8 L78 44 L104 18 L112 70 Z" fill="#ffd23f" stroke="#000" strokeWidth="6" strokeLinejoin="round" />
      <circle cx="60" cy="8" r="7" fill="#ff6b35" stroke="#000" strokeWidth="4" />
      <circle cx="16" cy="18" r="6" fill="#ff6b35" stroke="#000" strokeWidth="4" />
      <circle cx="104" cy="18" r="6" fill="#ff6b35" stroke="#000" strokeWidth="4" />
    </svg>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

function RoomPage({ navigate, initialCode }: RoomPageProps) {
  const [phase, setPhase] = useState<Phase>(
    initialCode ? { tag: 'joining', code: initialCode } : { tag: 'create' }
  )
  const [categories, setCategories] = useState<Category[]>([])
  const [hostName, setHostName] = useState('')
  const [joinName, setJoinName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  // Connected once, inside the socket effect below. (It used to be
  // `useRef(connectRoomSocket())`, which re-ran connect() on every render and raced
  // with the user's first click: "WebSocket is already in CLOSING or CLOSED state".)
  const socketRef = useRef<Socket>(null as unknown as Socket)
  const mySocketId = useRef<string>('')
  const isHostRef = useRef(false)
  const [board, setBoard] = useState<PlayerInfo[]>([])
  const lastFactRef = useRef('')
  const myCorrectRef = useRef(0)
  const [shareOpen, setShareOpen] = useState(false)
  const [pickingCat, setPickingCat] = useState(false)
  const [connLost, setConnLost] = useState(false)
  const roomCodeRef = useRef<string | null>(null)
  const everConnected = useRef(false)
  const [rematchCat, setRematchCat] = useState('')
  const { toast, node: toastNode } = useToast()
  const roomMeta = useRef({ category: '', players: 1 })

  // ── Fetch categories for create screen ──────────────────────────────────────
  useEffect(() => {
    fetchCategories().then(cats => {
      const playable = cats.filter(c =>
        c.saCategory.toLowerCase() !== 'game of the day'
      )
      setCategories(playable)
      // /room?cat=Past%20Drama (from "Challenge a friend 1-on-1") preselects the category
      const wanted = new URLSearchParams(window.location.search).get('cat')
      const pre = playable.find(c => c.saCategory === wanted)
      if (playable.length > 0) setSelectedCategory((pre ?? playable[0]).saCategory)
    })
  }, [])

  // ── Socket setup ────────────────────────────────────────────────────────────
  useEffect(() => {
    const socket = connectRoomSocket()
    socketRef.current = socket
    mySocketId.current = socket.id ?? ''

    // (Re)connected: if this phone already has a seat in a room (or is reloading on /room/CODE with a
    // saved seat), ask the server to give it back.
    const tryRejoin = () => {
      const sess = readSession()
      const code = roomCodeRef.current ?? (initialCode && sess.code === initialCode ? initialCode : null)
      if (code && sess.key) socket.emit('room:rejoin', { code, playerKey: sess.key })
    }
    socket.on('connect', () => {
      mySocketId.current = socket.id ?? ''
      if (everConnected.current || initialCode) tryRejoin()
      everConnected.current = true
    })
    socket.on('disconnect', () => { if (roomCodeRef.current) setConnLost(true) })
    if (socket.connected) { everConnected.current = true; if (initialCode) tryRejoin() }
    const onVisible = () => { if (document.visibilityState === 'visible' && !socket.connected) socket.connect() }
    document.addEventListener('visibilitychange', onVisible)

    socket.on('room:created', ({ code, category, players }) => {
      isHostRef.current = true
      roomCodeRef.current = code; saveRoomCode(code)
      setBoard(players)
      roomMeta.current = { category, players: players.length }
      track('party_room_created', { category_name: category, mode: 'party' })
      setLoading(false)
      setErrorMsg('')
      setPhase({ tag: 'lobby', code, category, players, isHost: true })
      // Update URL so it's shareable. Must NOT go through navigate(): /room and
      // /room/[code] are different Next pages, so a router replace remounts
      // RoomPage, whose cleanup disconnects the socket and kills the room.
      window.history.replaceState(null, '', `/room/${code}/`)
    })

    socket.on('room:joined', ({ code, category, players, hostSocketId }) => {
      roomMeta.current = { category, players: players.length }
      roomCodeRef.current = code; saveRoomCode(code)
      setBoard(players)
      setLoading(false)
      setErrorMsg('')
      setPhase({
        tag: 'lobby',
        code,
        category,
        players,
        isHost: socket.id === hostSocketId,
      })
    })

    socket.on('room:player_joined', ({ player }: { player: PlayerInfo }) => {
      roomMeta.current.players += 1
      setBoard(prev => prev.find(p => p.socketId === player.socketId) ? prev : [...prev, player])
      setPhase(prev => {
        if (prev.tag !== 'lobby') return prev
        if (prev.players.find(p => p.socketId === player.socketId)) return prev
        return { ...prev, players: [...prev.players, player] }
      })
    })

    socket.on('room:player_left', ({ socketId }: { socketId: string; playerName: string }) => {
      setBoard(prev => prev.filter(p => p.socketId !== socketId))
      setPhase(prev => {
        if (prev.tag === 'lobby') {
          return { ...prev, players: prev.players.filter(p => p.socketId !== socketId) }
        }
        return prev
      })
    })

    socket.on('room:started', () => {
      // Server will immediately follow with room:question
    })

    socket.on('room:question', ({ index, total, saFact, endsAt }) => {
      lastFactRef.current = saFact
      setPhase(prev => {
        const code = prev.tag === 'lobby' || prev.tag === 'question' || prev.tag === 'reveal'
          ? prev.code : ''
        const category = prev.tag === 'lobby' || prev.tag === 'question' || prev.tag === 'reveal'
          ? prev.category : ''
        const isHost = prev.tag === 'lobby' || prev.tag === 'question' || prev.tag === 'reveal'
          ? prev.isHost : false
        const playerCount = prev.tag === 'lobby' ? prev.players.length :
          prev.tag === 'question' ? prev.playerCount :
          prev.tag === 'reveal' ? prev.data.results.length : 1

        return {
          tag: 'question',
          code,
          category,
          isHost,
          answered: false,
          userAnswer: null,
          answeredCount: 0,
          playerCount,
          data: { index, total, saFact, endsAt },
        }
      })
    })

    socket.on('room:answer_count', ({ answered, total }) => {
      setPhase(prev => {
        if (prev.tag !== 'question') return prev
        return { ...prev, answeredCount: answered, playerCount: total }
      })
    })

    socket.on('room:reveal', (data: RevealData) => {
      setBoard(prev => data.results.map(r => ({ socketId: r.socketId, name: r.playerName, score: r.totalScore })).concat(prev.filter(p => !data.results.find(r => r.socketId === p.socketId))))
      const mine = data.results.find(r => r.socketId === socketRef.current.id)
      if (mine?.correct) myCorrectRef.current += 1
      setPhase(prev => {
        if (prev.tag !== 'question') return prev
        return { tag: 'reveal', code: prev.code, category: prev.category, isHost: prev.isHost, data }
      })
    })

    socket.on('room:finished', ({ finalScores }: { finalScores: FinalScore[] }) => {
      // Host only, so each Party game is counted once, not once per player.
      if (isHostRef.current) track('party_game_complete', { category_name: roomMeta.current.category, mode: 'party', players: finalScores.length, final_score: finalScores[0]?.score })
      setPhase({ tag: 'finished', finalScores })
    })

    // Host started a rematch: everyone stays in the room and returns to the lobby
    socket.on('room:rematch', ({ code, category, players, hostSocketId }: { code: string; category: string; players: PlayerInfo[]; hostSocketId: string }) => {
      myCorrectRef.current = 0
      roomMeta.current = { category, players: players.length }
      setBoard(players)
      setLoading(false); setErrorMsg(''); setPickingCat(false); setShareOpen(false)
      setPhase({ tag: 'lobby', code, category, players, isHost: socket.id === hostSocketId })
    })

    // Reclaimed our seat after a drop: put the screen back where the game is
    socket.on('room:rejoined', (r: { code: string; category: string; status: string; players: PlayerInfo[]; hostSocketId: string; question: QuestionData | null; answered: boolean; answeredCount: number; reveal: RevealData | null; finalScores: FinalScore[] | null }) => {
      roomCodeRef.current = r.code; saveRoomCode(r.code)
      mySocketId.current = socket.id ?? ''
      isHostRef.current = socket.id === r.hostSocketId
      roomMeta.current = { category: r.category, players: r.players.length }
      setBoard(r.players); setConnLost(false); setErrorMsg(''); setLoading(false)
      const isHost = socket.id === r.hostSocketId
      if (r.status === 'question' && r.question) {
        lastFactRef.current = r.question.saFact
        setPhase({ tag: 'question', code: r.code, category: r.category, isHost, answered: r.answered, userAnswer: null, answeredCount: r.answeredCount, playerCount: r.players.length, data: r.question })
      } else if (r.status === 'reveal' && r.reveal) {
        setPhase({ tag: 'reveal', code: r.code, category: r.category, isHost, data: r.reveal })
      } else if (r.status === 'finished' && r.finalScores) {
        setPhase({ tag: 'finished', finalScores: r.finalScores })
      } else {
        setPhase({ tag: 'lobby', code: r.code, category: r.category, players: r.players, isHost })
      }
    })
    socket.on('room:rejoin_failed', () => {
      // Only matters if we thought we were in a room; on a fresh /room/CODE link the join form just stays
      if (roomCodeRef.current) { roomCodeRef.current = null; saveRoomCode(null); setConnLost(false); setPhase({ tag: 'error', message: 'The room has closed. Start a new one from Party Mode.' }) }
    })
    socket.on('room:player_rekeyed', ({ oldSocketId, newSocketId }: { oldSocketId: string; newSocketId: string }) => {
      setBoard(prev => prev.map(p => p.socketId === oldSocketId ? { ...p, socketId: newSocketId } : p))
      setPhase(prev => prev.tag === 'lobby' ? { ...prev, players: prev.players.map(p => p.socketId === oldSocketId ? { ...p, socketId: newSocketId } : p) } : prev)
    })

    socket.on('room:host_left', () => {
      setPhase({ tag: 'error', message: 'The host left — the room has closed.' })
    })

    socket.on('room:error', ({ message }: { message: string }) => {
      setLoading(false)
      setErrorMsg(message)
    })

    return () => {
      socket.off('connect')
      socket.off('room:created')
      socket.off('room:joined')
      socket.off('room:player_joined')
      socket.off('room:player_left')
      socket.off('room:started')
      socket.off('room:question')
      socket.off('room:answer_count')
      socket.off('room:reveal')
      socket.off('room:finished')
      socket.off('room:rematch')
      socket.off('room:rejoined')
      socket.off('room:rejoin_failed')
      socket.off('room:player_rekeyed')
      socket.off('disconnect')
      document.removeEventListener('visibilitychange', onVisible)
      socket.off('room:host_left')
      socket.off('room:error')
      disconnectRoomSocket()
    }
  }, [navigate])

  // ── Actions ─────────────────────────────────────────────────────────────────

  // Game actions must not be queued while the phone is reconnecting: socket.io would send them the
  // instant the connection returns, BEFORE we reclaim our seat, and the server would ignore them.
  const connectedOrWarn = useCallback(() => {
    if (socketRef.current?.connected) return true
    toast('Reconnecting… try again in a moment')
    return false
  }, [toast])

  const handleCreate = useCallback(() => {
    if (!hostName.trim()) { setErrorMsg('Enter your name first'); return }
    if (!selectedCategory) { setErrorMsg('Pick a category'); return }
    setErrorMsg('')
    setLoading(true)
    socketRef.current.emit('room:create', { category: selectedCategory, hostName: hostName.trim(), playerKey: getPlayerKey() })
  }, [hostName, selectedCategory])

  const handleJoin = useCallback(() => {
    if (phase.tag !== 'joining') return
    if (!joinName.trim()) { setErrorMsg('Enter your name'); return }
    setErrorMsg('')
    setLoading(true)
    socketRef.current.emit('room:join', { code: phase.code, playerName: joinName.trim(), playerKey: getPlayerKey() })
  }, [phase, joinName])

  const handleStart = useCallback(() => {
    if (!connectedOrWarn()) return
    track('party_game_start', { category_name: roomMeta.current.category, mode: 'party', players: roomMeta.current.players })
    socketRef.current.emit('room:start')
  }, [connectedOrWarn])

  const handleAnswer = useCallback((answer: boolean) => {
    if (!connectedOrWarn()) return
    setPhase(prev => {
      if (prev.tag !== 'question' || prev.answered) return prev
      socketRef.current.emit('room:answer', { answer })
      return { ...prev, answered: true, userAnswer: answer }
    })
  }, [connectedOrWarn])

  const handleNext = useCallback(() => {
    if (!connectedOrWarn()) return
    socketRef.current.emit('room:next')
  }, [connectedOrWarn])

  const handleShare = useCallback(async (code: string) => {
    const url = `${window.location.origin}/room/${code}`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Join my Smartass Facts room!', text: `Join my room — code: ${code}`, url })
      } else {
        await navigator.clipboard.writeText(url)
        setShareCopied(true)
        setTimeout(() => setShareCopied(false), 2500)
      }
    } catch { /* dismissed */ }
  }, [])

  // ── Render helpers ──────────────────────────────────────────────────────────

  const goHome = () => navigate('/')
  const myId = socketRef.current?.id
  const others = (board.length ? board : []).filter(p => p.socketId !== myId)
  const me = board.find(p => p.socketId === myId)

  // ═══ CREATE ════════════════════════════════════════════════════════════════
  if (phase.tag === 'create') {
    return (
      <Shell toast={toastNode} lost={connLost}>
        <div className="cp-topbar" style={{ justifyContent: 'flex-start' }}>
          <Button variant="yellow" size="round" aria-label="Back to home" onClick={goHome}>←</Button>
        </div>
        <h1 className="cp-h1 cp-h1--yellow">PARTY MODE</h1>
        <p className="cp-sub">Create a room, share the code, and play together live.</p>

        {errorMsg && <Card tone="navy" role="alert" style={{ borderColor: 'var(--cp-orange)' }}>{errorMsg}</Card>}

        <label className="cp-field">
          <span className="cp-label">Your name</span>
          <input className="cp-input" placeholder="Gigi" value={hostName} onChange={e => setHostName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreate()} maxLength={20} autoFocus />
        </label>
        <label className="cp-field">
          <span className="cp-label">Category</span>
          <select className="cp-input" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            {categories.map(c => <option key={c.id} value={c.saCategory}>{c.saCategory}</option>)}
          </select>
        </label>

        <div className="cp-spacer" />
        <Button variant="yellow" block onClick={handleCreate} disabled={loading}>{loading ? 'Creating…' : 'Create room'}</Button>
        <Button variant="ghost" block onClick={goHome}>Back to home</Button>
      </Shell>
    )
  }

  // ═══ JOIN (arrived via /room/CODE) ═════════════════════════════════════════
  if (phase.tag === 'joining') {
    return (
      <Shell toast={toastNode} lost={connLost}>
        <h1 className="cp-h1 cp-h1--yellow">YOU&apos;RE INVITED!</h1>
        <p className="cp-sub">Enter your name to join the room.</p>
        <Card tilt="l" style={{ textAlign: 'center', fontSize: '2.4rem', fontWeight: 900, letterSpacing: '0.2em' }} aria-label={`Room code ${phase.code}`}>{phase.code}</Card>
        {errorMsg && <Card tone="navy" role="alert" style={{ borderColor: 'var(--cp-orange)' }}>{errorMsg}</Card>}
        <label className="cp-field">
          <span className="cp-label">Your name</span>
          <input className="cp-input" placeholder="Gigi" value={joinName} onChange={e => setJoinName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleJoin()} maxLength={20} autoFocus />
        </label>
        <div className="cp-spacer" />
        <Button variant="yellow" block onClick={handleJoin} disabled={loading}>{loading ? 'Joining…' : 'Join game'}</Button>
        <Button variant="ghost" block onClick={goHome}>Back to home</Button>
      </Shell>
    )
  }

  // ═══ LOBBY ═════════════════════════════════════════════════════════════════
  if (phase.tag === 'lobby') {
    const { code, category, players, isHost } = phase
    return (
      <Shell toast={toastNode} lost={connLost}>
        <div className="cp-cat-row">
          <CategorySticker category={category} />
          <div className="cp-cat-meta">
            <span className="cp-label">Room code</span>
            <div className="cp-cat-name" style={{ letterSpacing: '0.12em' }} aria-label={`Room code ${code}`}>{code}</div>
            <div className="cp-cat-step">{category}</div>
          </div>
        </div>

        <Button variant="white" onClick={async () => { await handleShare(code); }} aria-label="Invite friends: share the room link">
          {shareCopied ? 'Link copied!' : '🔗 Invite friends'}
        </Button>

        <h2 className="cp-label" style={{ margin: '6px 0 0' }}>Players ({players.length})</h2>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {players.map(p => (
            <li key={p.socketId} className={`cp-rank-row${p.socketId === myId ? ' cp-rank-row--me' : ''}`}>
              <span className="cp-rank-row__avatar" aria-hidden="true">{initials(p.name)}</span>
              <span className="cp-rank-row__name">{p.name}</span>
              {p.socketId === myId && <span className="cp-chip" style={{ minHeight: 28, padding: '0 10px' }}>You</span>}
            </li>
          ))}
        </ul>

        {errorMsg && <Card tone="navy" role="alert" style={{ borderColor: 'var(--cp-orange)' }}>{errorMsg}</Card>}
        <div className="cp-spacer" />
        {isHost ? (
          <Button variant="yellow" block onClick={handleStart} disabled={players.length < 2}>
            {players.length < 2 ? 'Waiting for players…' : `Start game (${players.length} players)`}
          </Button>
        ) : (
          <Card tone="navy" style={{ textAlign: 'center', fontWeight: 800 }} role="status">Waiting for the host to start…</Card>
        )}
      </Shell>
    )
  }

  // ═══ QUESTION (player turn) ════════════════════════════════════════════════
  if (phase.tag === 'question') {
    const { data, answered, userAnswer, answeredCount, playerCount, category } = phase
    const peek = others.length === 1 ? `NO PEEKING AT ${others[0].name.toUpperCase()}\u2019S PHONE.` : 'EVERYONE ANSWERS AT ONCE. NO PEEKING.'
    return (
      <Shell toast={toastNode} lost={connLost}>
        <div className="cp-topbar">
          <Button variant="yellow" size="round" aria-label="Leave game and go home" onClick={goHome}>✕</Button>
          <div style={{ display: 'flex', gap: 8, flex: 1, minWidth: 0 }}>
            <div className="cp-score-card cp-score-card--active">
              <div style={{ minWidth: 0 }}><small>{answered ? 'Locked in' : 'Your turn'}</small><b>{me?.name ?? 'You'}</b></div>
              <strong>{fmt(me?.score ?? 0)}</strong>
            </div>
            {others[0] && (
              <div className="cp-score-card">
                <div style={{ minWidth: 0 }}><small>{others.length > 1 ? `+${others.length - 1} more` : 'Waiting'}</small><b>{others[0].name}</b></div>
                <strong>{fmt(others[0].score)}</strong>
              </div>
            )}
          </div>
        </div>

        <div className="cp-cat-row">
          <CategorySticker category={category} />
          <div className="cp-cat-meta">
            <h1 className="cp-cat-name">{category}</h1>
            <RoundTimer endsAt={data.endsAt} total={15_000} round={data.index + 1} rounds={data.total} />
          </div>
        </div>

        <MascotBubble label={peek} text={data.saFact} />

        <div className="cp-spacer" />

        <div className="cp-row">
          <Button variant="white" size="huge" sub="nice try" disabled={answered} className={answered && userAnswer === false ? 'is-pressed' : ''} aria-pressed={answered && userAnswer === false} onClick={() => handleAnswer(false)}>FAKE</Button>
          <Button variant="yellow" size="huge" sub="for real" disabled={answered} className={answered && userAnswer === true ? 'is-pressed' : ''} aria-pressed={answered && userAnswer === true} onClick={() => handleAnswer(true)}>FACT</Button>
        </div>
        <p className="cp-sub cp-muted" style={{ fontWeight: 700, fontSize: '0.875rem' }} role="status">
          {answered ? `${answeredCount} of ${playerCount} locked in` : 'Answer fast: speed earns bonus points'}
        </p>
      </Shell>
    )
  }

  // ═══ REVEAL (same BS-o-meter as solo) ══════════════════════════════════════
  if (phase.tag === 'reveal') {
    const { data, isHost, category } = phase
    const { correctAnswer, explanation, results, isLast } = data
    const mine = results.find(r => r.socketId === myId)
    const timedOut = !!mine && mine.answer === null
    const nailed = !!mine?.correct
    const truth = correctAnswer ? 'a FACT' : 'FAKE'
    const subline = timedOut ? `Too slow. It\u2019s ${truth}.`
      : nailed ? `It\u2019s ${truth}. +${mine!.pointsEarned} points`
      : `You said ${mine?.answer ? 'FACT' : 'FAKE'}. It\u2019s ${truth}.`
    return (
      <Shell toast={toastNode} lost={connLost}>
        <div className="cp-topbar">
          <Button variant="yellow" size="round" aria-label="Leave game and go home" onClick={goHome}>✕</Button>
          <span className={`cp-chip${nailed ? ' cp-chip--lime' : ' cp-chip--dim'}`}>{fmt(me?.score ?? mine?.totalScore ?? 0)} pts</span>
        </div>
        <Meter isFact={correctAnswer} />
        <div>
          <h1 className={`cp-h1 ${nailed ? 'cp-h1--yellow' : 'cp-h1--orange'}`} role="status">{nailed ? 'NAILED IT!' : timedOut ? 'TOO SLOW!' : 'BUSTED!'}</h1>
          <p className="cp-sub">{subline}</p>
        </div>
        <Card tilt="l" className="cp-reveal-card">
          {correctAnswer ? (
            <>
              <span className="cp-reveal-card__label">Meanwhile, in {category}</span>
              <p className="cp-reveal-card__text">{explanation?.trim() || 'Yep, that one\u2019s real.'}</p>
            </>
          ) : (
            <>
              <p className="cp-reveal-card__struck">{lastFactRef.current}</p>
              <p className="cp-reveal-card__fake">It&apos;s not a real fact, it&apos;s just our fantasy. Now you know 🐒</p>
            </>
          )}
        </Card>

        <h2 className="cp-label" style={{ margin: 0 }}>Standings after round {data.questionIndex + 1}</h2>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {results.map((r, i) => (
            <li key={r.socketId} className={`cp-rank-row${r.socketId === myId ? ' cp-rank-row--me' : ''}`}>
              <span className="cp-rank-row__rank">{i + 1}</span>
              <span className="cp-rank-row__name">{r.playerName}{r.socketId === myId ? ' (you)' : ''}</span>
              <span aria-label={r.answer === null ? 'no answer' : r.correct ? 'correct' : 'wrong'}>{r.answer === null ? '–' : r.correct ? '✓' : '✗'}</span>
              <span className="cp-rank-row__pts">{fmt(r.totalScore)}</span>
            </li>
          ))}
        </ol>

        <div className="cp-spacer" />
        {isHost ? (
          <Button variant="yellow" block onClick={handleNext}>{isLast ? 'SEE FINAL RESULTS' : 'NEXT FACT'}</Button>
        ) : (
          <Card tone="navy" style={{ textAlign: 'center', fontWeight: 800 }} role="status">Waiting for the host to continue…</Card>
        )}
      </Shell>
    )
  }

  // ═══ GAME OVER ═════════════════════════════════════════════════════════════
  if (phase.tag === 'finished') {
    const { finalScores } = phase
    const topScore = finalScores[0]?.score ?? 0
    const winners = finalScores.filter(p => p.score === topScore)
    const tie = winners.length > 1
    const winner = winners[0]
    const category = roomMeta.current.category
    const isHost = isHostRef.current
    const headline = tie ? 'IT\u2019S A TIE!' : `${winner.name.toUpperCase()} WINS!`
    const subline = tie ? 'Nobody blinks. Rematch?'
      : finalScores.length === 2 ? `${finalScores[1].name} demands a rematch. Obviously.`
      : 'The room has spoken. The monkey approves.'
    const rematch = (newCategory: boolean) => {
      if (!connectedOrWarn()) return
      track('rematch', { same_category: !newCategory, mode: 'party', category_name: category })
      socketRef.current.emit('room:rematch', newCategory ? { category: rematchCat || undefined } : {})
    }

    return (
      <Shell toast={toastNode} lost={connLost}>
        <span className="cp-label" style={{ textAlign: 'center' }}>Game over: {category}</span>
        <div className="cp-crown">
          <Crown />
          <div className="cp-mascot cp-mascot--ring"><img src={logo.src} alt="" /></div>
        </div>
        <div>
          <h1 className="cp-h1 cp-h1--yellow" role="status">{headline}</h1>
          <p className="cp-sub">{subline}</p>
        </div>

        <div className="cp-row" style={{ flexWrap: 'wrap' }}>
          {finalScores.slice(0, 6).map(p => (
            <div key={p.socketId} className={`cp-score-card${winners.includes(p) ? ' cp-score-card--winner' : ''}`} style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', minWidth: 140 }}>
              <b>{p.name}{p.socketId === myId ? ' (you)' : ''}</b>
              <strong style={{ fontSize: '2.4rem' }}>{fmt(p.score)}</strong>
              <small>{winners.includes(p) ? (tie ? 'Tied' : 'Winner') : 'So close'}</small>
            </div>
          ))}
        </div>

        <div className="cp-spacer" />

        {isHost ? (
          <>
            <Button variant="orange" block onClick={() => rematch(false)}>Rematch: same category</Button>
            {pickingCat ? (
              <Card tone="navy">
                <label className="cp-field">
                  <span className="cp-label">New category</span>
                  <select className="cp-input" value={rematchCat || category} onChange={e => setRematchCat(e.target.value)}>
                    {categories.map(c => <option key={c.id} value={c.saCategory}>{c.saCategory}</option>)}
                  </select>
                </label>
                <div style={{ marginTop: 12 }}><Button variant="yellow" block onClick={() => rematch(true)}>Start rematch</Button></div>
              </Card>
            ) : (
              <Button variant="yellow" block onClick={() => { setRematchCat(category); setPickingCat(true) }}>Rematch: new category</Button>
            )}
          </>
        ) : (
          <Card tone="navy" style={{ textAlign: 'center', fontWeight: 800 }} role="status">Waiting for the host to start a rematch…</Card>
        )}
        <div className="cp-row">
          <Button variant="white" onClick={() => setShareOpen(true)}>Share result</Button>
          <Button variant="ghost" onClick={goHome}>Home</Button>
        </div>
        {errorMsg && <Card tone="navy" role="alert" style={{ borderColor: 'var(--cp-orange)' }}>{errorMsg}</Card>}

        <ShareSheet
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          category={category}
          score={Math.min(myCorrectRef.current, 10)}
          total={10}
          mode="party"
          name={me?.name}
        />
      </Shell>
    )
  }

  // ═══ ERROR ═════════════════════════════════════════════════════════════════
  return (
    <Shell toast={toastNode} lost={connLost}>
      <h1 className="cp-h1 cp-h1--orange">OOPS</h1>
      <p className="cp-sub" role="alert">{phase.tag === 'error' ? phase.message : 'Something went wrong.'}</p>
      <div className="cp-spacer" />
      <Button variant="yellow" block onClick={goHome}>Back to home</Button>
    </Shell>
  )
}

export default RoomPage
