'use client'

import logo from '../../assets/smartass-logo.png'
import Card from './Card'
import '../../styles/comic.scss'

interface Props { label: string; text: string }

/** Monkey avatar + white speech bubble (label in small red caps, then the text). */
export default function MascotBubble({ label, text }: Props) {
  return (
    <div className="cp-say">
      <div className="cp-mascot"><img src={logo.src} alt="" /></div>
      <Card className="cp-bubble">
        <span className="cp-bubble__label">{label}</span>
        <p className="cp-bubble__text">{text}</p>
      </Card>
    </div>
  )
}
