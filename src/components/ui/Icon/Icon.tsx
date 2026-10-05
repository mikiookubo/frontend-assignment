import type { CSSProperties } from 'react'
import cancel from '../../../assets/icons/cancel.svg'
import deleteIcon from '../../../assets/icons/delete.svg'
import done from '../../../assets/icons/done.svg'
import edit from '../../../assets/icons/edit.svg'
import plus from '../../../assets/icons/plus.svg'
import save from '../../../assets/icons/save.svg'
import styles from './Icon.module.css'

const icons = { cancel, delete: deleteIcon, done, edit, plus, save } as const

export type IconName = keyof typeof icons

type Props = {
  name: IconName
  /** 省略時は tokens.css の --icon-size（24px） */
  size?: number
}

/**
 * 配布された SVG を CSS の mask として使い、色は currentColor で塗る。
 * SVG 側の色は固定されているため、ボタンの種類ごとに色を変えられるようにしている。
 */
export function Icon({ name, size }: Props) {
  return (
    <span
      className={styles.icon}
      style={
        {
          '--icon-url': `url("${icons[name]}")`,
          ...(size !== undefined && { '--icon-size': `${size}px` }),
        } as CSSProperties
      }
      aria-hidden="true"
    />
  )
}
