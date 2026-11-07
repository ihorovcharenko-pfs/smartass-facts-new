'use client'

import type { CSSProperties } from 'react'
import '../../styles/comic.scss'

interface Props {
  /** The TRUE answer: true = FACT (needle right), false = FAKE (needle left). */
  isFact: boolean
}

/**
 * BS-o-meter: semicircle gauge, FAKE half orange (left), FACT half yellow (right).
 * The needle always points at the true answer; it sweeps from centre in ~600ms with a
 * small overshoot (CSS), and just shows the final position under prefers-reduced-motion.
 */
export default function Meter({ isFact }: Props) {
  const deg = isFact ? 50 : -50
  return (
    <div
      className="cp-meter is-animating"
      style={{ '--cp-needle-final': `${deg}deg` } as CSSProperties}
      role="img"
      aria-label={`BS-o-meter: the true answer is ${isFact ? 'FACT' : 'FAKE'}`}
    >
      <span className="cp-label cp-meter__title">BS-o-meter</span>
      <svg viewBox="0 0 300 195" aria-hidden="true" fontFamily="inherit">
        <path d="M15 150 A135 135 0 0 1 150 15 L150 68 A82 82 0 0 0 68 150 Z" fill="#ff6b35" stroke="#000" strokeWidth="6" strokeLinejoin="round" />
        <path d="M150 15 A135 135 0 0 1 285 150 L232 150 A82 82 0 0 0 150 68 Z" fill="#ffd23f" stroke="#000" strokeWidth="6" strokeLinejoin="round" />
        <g className="cp-meter__needle">
          <line x1="150" y1="150" x2="150" y2="58" stroke="#000" strokeWidth="14" strokeLinecap="round" />
          <line x1="150" y1="150" x2="150" y2="58" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
        </g>
        <circle cx="150" cy="150" r="15" fill="#fff" stroke="#000" strokeWidth="5" />
        <text x="15" y="184" fill="#fff" fontSize="19" fontWeight="900">FAKE</text>
        <text x="285" y="184" fill="#fff" fontSize="19" fontWeight="900" textAnchor="end">FACT</text>
      </svg>
    </div>
  )
}
