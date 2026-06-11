'use client'

interface CategoryChipProps {
  label: string
  selected: boolean
  onClick: () => void
}

function CategoryChip({ label, selected, onClick }: CategoryChipProps) {
  return (
    <button
      className={`category-chip ${selected ? 'category-chip--selected' : ''}`}
      onClick={onClick}
      type="button"
    >
      {selected && <span className="category-chip__check">✓</span>}
      {label}
    </button>
  )
}

export default CategoryChip
