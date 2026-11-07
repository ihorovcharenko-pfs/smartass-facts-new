'use client'

import { getCategoryArt } from '../../utils/categoryImages'
import '../../styles/comic.scss'

/** Square "sticker" category art: white background, black border, slight tilt, never cropped. */
export default function CategorySticker({ category, small }: { category: string; small?: boolean }) {
  const src = getCategoryArt(category)
  const cls = `cp-sticker${small ? ' cp-sticker--small' : ''}${src ? '' : ' cp-sticker--placeholder'}`
  return (
    <div className={cls}>
      {src ? <img src={src} alt="" width={small ? 44 : 128} height={small ? 44 : 128} /> : <span>{category}</span>}
    </div>
  )
}
