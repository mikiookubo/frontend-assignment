import type { ComponentProps } from 'react'
import { Icon, type IconName } from '../Icon/Icon'
import styles from './Button.module.css'

type Props = Omit<ComponentProps<'button'>, 'children'> & {
  icon: IconName
  label: string
  /** primary: 青 / secondary: 白地に青枠 / normal: 灰色 */
  variant?: 'primary' | 'secondary' | 'normal'
  /** wide: 幅 90px / compact: 幅 40px（Cancel・Save など並べて置くとき） */
  size?: 'wide' | 'compact'
}

/** デザインガイドライン A03 のボタン。アイコンと小さなラベルを縦に並べる */
export function Button({
  icon,
  label,
  variant = 'primary',
  size = 'wide',
  type = 'button',
  className,
  ...rest
}: Props) {
  const classNames = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classNames} {...rest}>
      <Icon name={icon} />
      <span className={styles.label}>{label}</span>
    </button>
  )
}
