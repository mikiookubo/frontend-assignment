import type { ReactNode } from 'react'
import styles from './StatusMessage.module.css'

type Props = {
  children: ReactNode
  /** error のときは読み上げ環境にすぐ伝わるよう role="alert" にする */
  tone?: 'info' | 'error'
}

/** 読み込み中・エラー・データなしなど、本来の表示の代わりに出す案内 */
export function StatusMessage({ children, tone = 'info' }: Props) {
  return (
    <div
      className={[styles.message, tone === 'error' && styles.error]
        .filter(Boolean)
        .join(' ')}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {children}
    </div>
  )
}
