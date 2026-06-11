'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { connectRoomSocket, disconnectRoomSocket } from '../utils/roomSocket'
import { fetchCategories, type Category } from '../services/clientService'
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

function initials(name: string) {
  return name.slice(0, 2).toUpperCase()
}

function medalFor(rank: number) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `${rank}.`
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
  const socketRef = useRef(connectRoomSocket())
  const mySocketId = useRef<string>('')

  // ── Fetch categories for create screen ──────────────────────────────────────
  useEffect(() => {
    fetchCategories().then(cats => {
      const playable = cats.filter(c =>
        c.saCategory.toLowerCase() !== 'game of the day'
      )
      setCategories(playable)
      if (playable.length > 0) setSelectedCategory(playable[0].saCategory)
    })
  }, [])

  // ── Socket setup ────────────────────────────────────────────────────────────
  useEffect(() => {
    const socket = socketRef.current
    mySocketId.current = socket.id ?? ''

    socket.on('connect', () => {
      mySocketId.current = socket.id ?? ''
    })

    socket.on('room:created', ({ code, category, players }) => {
      setLoading(false)
      setErrorMsg('')
      setPhase({ tag: 'lobby', code, category, players, isHost: true })
      // Update URL so it's shareable
      navigate(`/room/${code}`, undefined, true)
    })

    socket.on('room:joined', ({ code, category, players, hostSocketId }) => {
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
      setPhase(prev => {
        if (prev.tag !== 'lobby') return prev
        if (prev.players.find(p => p.socketId === player.socketId)) return prev
        return { ...prev, players: [...prev.players, player] }
      })
    })

    socket.on('room:player_left', ({ socketId }: { socketId: string; playerName: string }) => {
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
      setPhase(prev => {
        if (prev.tag !== 'question') return prev
        return { tag: 'reveal', code: prev.code, category: prev.category, isHost: prev.isHost, data }
      })
    })

    socket.on('room:finished', ({ finalScores }: { finalScores: FinalScore[] }) => {
      setPhase({ tag: 'finished', finalScores })
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
      socket.off('room:host_left')
      socket.off('room:error')
      disconnectRoomSocket()
    }
  }, [navigate])

  // ── Actions ─────────────────────────────────────────────────────────────────

  const handleCreate = useCallback(() => {
    if (!hostName.trim()) { setErrorMsg('Enter your name first'); return }
    if (!selectedCategory) { setErrorMsg('Pick a category'); return }
    setErrorMsg('')
    setLoading(true)
    socketRef.current.emit('room:create', { category: selectedCategory, hostName: hostName.trim() })
  }, [hostName, selectedCategory])

  const handleJoin = useCallback(() => {
    if (phase.tag !== 'joining') return
    if (!joinName.trim()) { setErrorMsg('Enter your name'); return }
    setErrorMsg('')
    setLoading(true)
    socketRef.current.emit('room:join', { code: phase.code, playerName: joinName.trim() })
  }, [phase, joinName])

  const handleStart = useCallback(() => {
    socketRef.current.emit('room:start')
  }, [])

  const handleAnswer = useCallback((answer: boolean) => {
    setPhase(prev => {
      if (prev.tag !== 'question' || prev.answered) return prev
      socketRef.current.emit('room:answer', { answer })
      return { ...prev, answered: true, userAnswer: answer }
    })
  }, [])

  const handleNext = useCallback(() => {
    socketRef.current.emit('room:next')
  }, [])

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

  // ═══════════════════════════════════════════════════════════════════════════
  // CREATE SCREEN
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase.tag === 'create') {
    return (
      <div className="room">
        <div className="room-setup">
          <div className="room-setup__icon">🎮</div>
          <h1 className="room-setup__title">Party Mode</h1>
          <p className="room-setup__sub">Create a room, share the code, and play together live.</p>

          {errorMsg && <div className="room-setup__error">{errorMsg}</div>}

          <label className="room-setup__label">
            Your name
            <input
              className="room-setup__input"
              placeholder="e.g. Gigi"
              value={hostName}
              onChange={e => setHostName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              maxLength={20}
              autoFocus
            />
          </label>

          <label className="room-setup__label">
            Category
            <select
              className="room-setup__select"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              {categories.map(c => (
                <option key={c.id} value={c.saCategory}>{c.saCategory}</option>
              ))}
            </select>
          </label>

          <button className="room-setup__btn room-setup__btn--primary" onClick={handleCreate} disabled={loading}>
            {loading ? 'Creating…' : 'Create Room →'}
          </button>

          <div className="room-setup__divider">or</div>

          <button className="room-setup__btn room-setup__btn--secondary" onClick={goHome}>
            Back to home
          </button>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // JOIN SCREEN (arrived via /room/CODE link)
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase.tag === 'joining') {
    return (
      <div className="room">
        <div className="room-setup">
          <div className="room-setup__icon">⚡</div>
          <h1 className="room-setup__title">You're invited!</h1>
          <p className="room-setup__sub">Enter your name to join the room.</p>

          <div className="room-setup__code-display">{phase.code}</div>

          {errorMsg && <div className="room-setup__error">{errorMsg}</div>}

          <label className="room-setup__label">
            Your name
            <input
              className="room-setup__input"
              placeholder="e.g. Alice"
              value={joinName}
              onChange={e => setJoinName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              maxLength={20}
              autoFocus
            />
          </label>

          <button className="room-setup__btn room-setup__btn--primary" onClick={handleJoin} disabled={loading}>
            {loading ? 'Joining…' : 'Join Game →'}
          </button>

          <button className="room-setup__btn room-setup__btn--secondary" onClick={goHome}>
            Back to home
          </button>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LOBBY
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase.tag === 'lobby') {
    const { code, category, players, isHost } = phase
    return (
      <div className="room">
        <div className="room-lobby">
          <div className="room-lobby__code">
            <p className="room-lobby__code-label">Room Code</p>
            <p className="room-lobby__code-value">{code}</p>
            <p className="room-lobby__category">{category}</p>
          </div>

          <button className="room-lobby__share" onClick={() => handleShare(code)}>
            <span>🔗</span>
            <span>Share invite link</span>
            <span>{shareCopied ? 'Copied!' : 'Tap to copy'}</span>
          </button>

          {errorMsg && <div className="room-setup__error">{errorMsg}</div>}

          <p className="room-lobby__players-title">
            Players ({players.length}/10)
          </p>

          <div className="room-lobby__player-list">
            {players.map(p => (
              <div key={p.socketId} className="room-lobby__player">
                <div className="room-lobby__player-avatar">{initials(p.name)}</div>
                <span className="room-lobby__player-name">{p.name}</span>
                {p.socketId === socketRef.current.id && (
                  <span className="room-lobby__player-badge">You</span>
                )}
              </div>
            ))}
          </div>

          {isHost ? (
            <button
              className="room-setup__btn room-setup__btn--primary"
              onClick={handleStart}
              disabled={players.length < 2}
              style={{ marginTop: '0.5rem' }}
            >
              {players.length < 2 ? 'Waiting for players…' : `Start Game (${players.length} players)`}
            </button>
          ) : (
            <p className="room-lobby__waiting">Waiting for the host to start…</p>
          )}
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // QUESTION
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase.tag === 'question') {
    const { data, answered, userAnswer, answeredCount, playerCount } = phase
    const answerPct = playerCount > 0 ? (answeredCount / playerCount) * 100 : 0

    return (
      <div className="room">
        <div className="room-question">
          <div className="room-question__header">
            <span className="room-question__progress">
              Question {data.index + 1} / {data.total}
            </span>
          </div>

          <Countdown endsAt={data.endsAt} total={15_000} />

          <div className="room-question__card">
            <p className="room-question__label">True or false?</p>
            <p className="room-question__text">{data.saFact}</p>
          </div>

          <div className="room-question__buttons">
            <button
              className={`room-question__btn room-question__btn--fact ${answered && userAnswer === true ? 'room-question__btn--selected-fact' : ''}`}
              onClick={() => handleAnswer(true)}
              disabled={answered}
            >
              ✓ Fact
            </button>
            <button
              className={`room-question__btn room-question__btn--fake ${answered && userAnswer === false ? 'room-question__btn--selected-fake' : ''}`}
              onClick={() => handleAnswer(false)}
              disabled={answered}
            >
              ✗ Fake
            </button>
          </div>

          <div className="room-question__answered">
            {answered
              ? <><strong>{answeredCount}</strong> of {playerCount} answered</>
              : <span>Tap your answer above</span>
            }
          </div>

          <div className="room-question__answer-bar">
            <div className="room-question__answer-fill" style={{ width: `${answerPct}%` }} />
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // REVEAL
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase.tag === 'reveal') {
    const { data, isHost } = phase
    const { correctAnswer, explanation, results, isLast } = data

    return (
      <div className="room">
        <div className="room-reveal">
          <div className={`room-reveal__verdict room-reveal__verdict--${correctAnswer ? 'fact' : 'fake'}`}>
            <p className="room-reveal__verdict-label">{correctAnswer ? 'That\'s a Fact ✓' : 'That\'s Fake ✗'}</p>
            <p className="room-reveal__verdict-text">{correctAnswer ? 'It\'s TRUE!' : 'It\'s FALSE!'}</p>
            {explanation && <p className="room-reveal__explanation">{explanation}</p>}
          </div>

          <p className="room-reveal__scores-title">Scores after Q{data.questionIndex + 1}</p>

          <div className="room-reveal__score-list">
            {results.map((r, i) => (
              <div key={r.socketId} className="room-reveal__score-row">
                <span className="room-reveal__rank">{i + 1}</span>
                <span className="room-reveal__player-name">
                  {r.playerName}
                  {r.socketId === socketRef.current.id && ' (you)'}
                </span>
                <span className="room-reveal__result-icon">
                  {r.answer === null ? '–' : r.correct ? '✓' : '✗'}
                </span>
                <span className={`room-reveal__points ${r.pointsEarned === 0 ? 'room-reveal__points--zero' : ''}`}>
                  {r.pointsEarned > 0 ? `+${r.pointsEarned}` : '+0'}
                </span>
                <span className="room-reveal__total">{r.totalScore}</span>
              </div>
            ))}
          </div>

          {isHost ? (
            <button
              className="room-setup__btn room-setup__btn--primary"
              onClick={handleNext}
              style={{ marginTop: '0.5rem' }}
            >
              {isLast ? 'See Final Results →' : 'Next Question →'}
            </button>
          ) : (
            <p className="room-lobby__waiting" style={{ marginTop: '0.5rem' }}>
              Waiting for host to continue…
            </p>
          )}
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FINISHED
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase.tag === 'finished') {
    const { finalScores } = phase
    const winner = finalScores[0]

    const shareText = `🎮 Smartass Facts Party Mode results:\n${finalScores.map(p => `${medalFor(p.rank)} ${p.name}: ${p.score} pts`).join('\n')}\nPlay at smartassfacts.com`

    const handleShareNative = async () => {
      try {
        if (navigator.share) await navigator.share({ text: shareText, url: 'https://smartassfacts.com' })
        else await navigator.clipboard.writeText(shareText)
      } catch { /* dismissed */ }
    }

    const handleShareX = () => {
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
      window.open(url, '_blank', 'noopener')
    }

    const handleShareInstagram = async () => {
      // Instagram doesn't support direct text share; copy to clipboard instead
      await navigator.clipboard.writeText(shareText)
      alert('Result copied! Paste it into your Instagram story or post.')
    }

    const handleShareTikTok = async () => {
      await navigator.clipboard.writeText(shareText)
      alert('Result copied! Paste it into your TikTok caption.')
    }

    const handleReplay = () => {
      setPhase({ tag: 'create' })
    }

    return (
      <div className="room">
        <div className="room-finished">
          <div className="room-finished__trophy">🏆</div>
          <h1 className="room-finished__title">Game Over!</h1>
          {winner && (
            <p className="room-finished__winner">
              <span className="room-finished__winner-name">{winner.name}</span> wins with {winner.score} pts!
            </p>
          )}

          <div className="room-finished__podium">
            {finalScores.map(p => (
              <div key={p.socketId} className={`room-finished__row ${p.rank === 1 ? 'room-finished__row--first' : ''}`}>
                <span className="room-finished__medal">{medalFor(p.rank)}</span>
                <span className="room-finished__name">
                  {p.name}
                  {p.socketId === socketRef.current.id && <span className="room-finished__you-badge"> you</span>}
                </span>
                <span className="room-finished__score">{p.score} pts</span>
              </div>
            ))}
          </div>

          <p className="room-finished__share-label">Share results</p>
          <div className="room-finished__share-row">
            <button className="room-finished__share-btn room-finished__share-btn--x" onClick={handleShareX} title="Share on X">
              𝕏
            </button>
            <button className="room-finished__share-btn room-finished__share-btn--ig" onClick={handleShareInstagram} title="Share on Instagram">
              📸
            </button>
            <button className="room-finished__share-btn room-finished__share-btn--tt" onClick={handleShareTikTok} title="Share on TikTok">
              🎵
            </button>
            <button className="room-finished__share-btn room-finished__share-btn--more" onClick={handleShareNative} title="More options">
              ↗
            </button>
          </div>

          <div className="room-finished__actions">
            <button className="room-setup__btn room-setup__btn--primary" onClick={handleReplay}>
              🔄 Play Again
            </button>
            <button className="room-setup__btn room-setup__btn--secondary" onClick={goHome}>
              Back to home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ERROR
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="room">
      <div className="room-setup" style={{ textAlign: 'center' }}>
        <div className="room-setup__icon">😕</div>
        <h1 className="room-setup__title">Oops</h1>
        <p className="room-setup__sub">{(phase as { tag: 'error'; message: string }).message}</p>
        <button className="room-setup__btn room-setup__btn--primary" onClick={goHome}>
          Back to home
        </button>
      </div>
    </div>
  )
}

export default RoomPage
