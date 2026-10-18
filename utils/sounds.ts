// Web Audio API sound generator — no files or packages needed

let audioCtx: AudioContext | null = null

const getCtx = (): AudioContext => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioCtx
}

// Create the AudioContext ahead of the first answer (first-time creation can take
// hundreds of ms and used to delay the first result screen).
export const warmAudio = () => {
  try { getCtx() } catch { /* unsupported */ }
}

const playTone = (
  frequency: number,
  type: OscillatorType,
  duration: number,
  gainPeak: number
) => {
  try {
    const ctx = getCtx()
    if (ctx.state === 'suspended') ctx.resume().catch(() => {})
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = type
    osc.frequency.setValueAtTime(frequency, ctx.currentTime)

    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(gainPeak, ctx.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch {
    // Audio not supported — silently fail
  }
}

export const playCorrect = () => {
  // Pleasant two-tone ding
  playTone(880, 'sine', 0.15, 0.3)
  setTimeout(() => playTone(1100, 'sine', 0.2, 0.2), 80)
}

export const playWrong = () => {
  // Low buzzer
  playTone(220, 'sawtooth', 0.12, 0.25)
  setTimeout(() => playTone(180, 'sawtooth', 0.18, 0.2), 80)
}
