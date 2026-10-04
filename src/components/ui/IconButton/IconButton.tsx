import type { ComponentProps } from 'react'
import { Icon, type IconName } from '../Icon/Icon'
import styles from './IconButton.module.css'

type Props = Omit<ComponentProps<'button'>, 'children'> & {
  icon: IconName
  /** 文字のないボタンなので、読み上げ用のラベルを必須にする */
  'aria-label': string
}

/** ゴミ箱など、アイコンだけのボタン */
export function IconButton({
  icon,
  type = 'button',
  className,
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={[styles.iconButton, className].filter(Boolean).join(' ')}
      {...rest}
    >
      <Icon name={icon} />
    </button>
  )
}
