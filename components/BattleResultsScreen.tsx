'use client'

import '../styles/Battle.scss'

interface BattleResultsScreenProps {
  category: string
  challengerScore: number
  myScore: number
  totalFacts: number
  battleId: string
  onPlayAgain: () => void
  onGoHome: () => void
}

function BattleResultsScreen({
  category,
  challengerScore,
  myScore,
  totalFacts,
  battleId,
  onPlayAgain,
  onGoHome,
}: BattleResultsScreenProps) {
  const iWon = myScore > challengerScore
  const itsTied = myScore === challengerScore

  const outcomeText = itsTied
    ? "It's a tie! Great minds think alike 🤝"
    : iWon
      ? "You won! Send this back and rub it in 😏"
      : "They beat you… rematch?"

  const outcomeClass = itsTied
    ? 'battle-results__outcome--tie'
    : iWon
      ? 'battle-results__outcome--win'
      : 'battle-results__outcome--lose'

  const handleShare = async () => {
    const url = `${window.location.origin}/battle/${battleId}`
    const text = `I scored ${myScore}/${totalFacts} on "${category}" — can you beat ${challengerScore}/${totalFacts}? Play at ${url} 🧠`
    try {
      if (navigator.share) {
        await navigator.share({ text })
      } else {
        await navigator.clipboard.writeText(text)
        alert('Result copied to clipboard!')
      }
    } catch {
      // user dismissed
    }
  }

  return (
    <div className="battle-results">
      <p className="battle-results__title">Battle Results</p>
      <p className={`battle-results__outcome ${outcomeClass}`}>{outcomeText}</p>

      <div className="battle-results__scores">
        {/* Challenger */}
        <div className={`battle-results__score-card ${!iWon && !itsTied ? 'battle-results__score-card--winner' : ''}`}>
          <p className="battle-results__score-label">Them</p>
          <p className="battle-results__score-value">{challengerScore}</p>
          <p className="battle-results__score-total">/ {totalFacts}</p>
          {!iWon && !itsTied && (
            <span className="battle-results__winner-badge">Winner</span>
          )}
        </div>

        {/* You */}
        <div className={`battle-results__score-card ${iWon ? 'battle-results__score-card--winner' : ''}`}>
          <p className="battle-results__score-label">You</p>
          <p className="battle-results__score-value">{myScore}</p>
          <p className="battle-results__score-total">/ {totalFacts}</p>
          {iWon && (
            <span className="battle-results__winner-badge">Winner</span>
          )}
        </div>
      </div>

      <div className="battle-results__actions">
        <button className="battle-results__btn battle-results__btn--primary" onClick={handleShare}>
          Share result ↗
        </button>
        <button className="battle-results__btn battle-results__btn--secondary" onClick={onPlayAgain}>
          Play again
        </button>
        <button className="battle-results__btn battle-results__btn--secondary" onClick={onGoHome}>
          Explore categories
        </button>
      </div>
    </div>
  )
}

export default BattleResultsScreen
