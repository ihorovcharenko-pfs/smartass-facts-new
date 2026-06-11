'use client'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import '../styles/Game.scss'

function GamePageSkeleton() {
  return (
    <div className="game">
      <div className="game__header">
        {/* Back button skeleton */}
        <div style={{ position: 'absolute', left: '50px', top: '16px' }}>
          <Skeleton circle width={40} height={40} />
        </div>

        {/* Category name skeleton */}
        <div className="game__category-name" style={{ pointerEvents: 'none' }}>
          <Skeleton width={200} height={24} style={{ margin: '0 auto' }} />
        </div>

        {/* Progress container skeleton */}
        <div className="game__progress-container" style={{ pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="game__progress-bar" style={{ flex: 1 }}>
            <Skeleton height={8} borderRadius={4} />
          </div>
          <div className="game__step-counter">
            <Skeleton width={40} height={20} />
          </div>
        </div>
      </div>

      <div className="game__content">
        <div className="game__fact-card" style={{ pointerEvents: 'none' }}>
          {/* Question skeleton */}
          <Skeleton height={28} width="60%" style={{ marginBottom: '1.5rem' }} />

          {/* Fact text skeleton - multiple lines */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Skeleton height={20} width="100%" />
            <Skeleton height={20} width="100%" />
            <Skeleton height={20} width="90%" />
            <Skeleton height={20} width="85%" />
            <Skeleton height={20} width="95%" />
          </div>

          {/* Buttons skeleton */}
          <div className="game__fact-buttons" style={{ marginTop: 'auto' }}>
            <Skeleton height={48} borderRadius={24} style={{ flex: 1 }} />
            <Skeleton height={48} borderRadius={24} style={{ flex: 1 }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default GamePageSkeleton
