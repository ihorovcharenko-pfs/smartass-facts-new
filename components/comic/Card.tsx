'use client'

import type { HTMLAttributes, ReactNode } from 'react'
import '../../styles/comic.scss'

interface Props extends HTMLAttributes<HTMLDivElement> {
  tone?: 'white' | 'yellow' | 'lime' | 'navy' | 'dim'
  tilt?: 'l' | 'r'
  children?: ReactNode
}

/** White comic card: 3px border, hard offset shadow, optional tilt. */
export default function Card({ tone = 'white', tilt, className = '', children, ...rest }: Props) {
  const cls = ['cp-card', tone !== 'white' && `cp-card--${tone}`, tilt && `cp-card--tilt-${tilt}`, className].filter(Boolean).join(' ')
  return <div className={cls} {...rest}>{children}</div>
}
