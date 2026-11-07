'use client'

import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import '../../styles/comic.scss'

type Variant = 'yellow' | 'orange' | 'lime' | 'white' | 'black' | 'ghost'
type Size = 'normal' | 'small' | 'huge' | 'round'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  block?: boolean
  /** Small second line under the label ("nice try", "for real") */
  sub?: string
  ref?: Ref<HTMLButtonElement>
  children?: ReactNode
}

/** The one button: 54px min height, 3px black border, hard shadow, press-down. */
export default function Button({ variant = 'yellow', size = 'normal', block, sub, className = '', children, type = 'button', ...rest }: Props) {
  const cls = ['cp-btn', `cp-btn--${variant}`, size !== 'normal' && `cp-btn--${size}`, block && 'cp-btn--block', className].filter(Boolean).join(' ')
  return (
    <button type={type} className={cls} {...rest}>
      {children}
      {sub && <span className="cp-btn__sub">{sub}</span>}
    </button>
  )
}
