import type { ReactNode } from 'react'
import { Footer } from '../Footer/Footer'
import styles from './AppLayout.module.css'

type Props = {
  sidebar: ReactNode
  children: ReactNode
}

/** 左にサイドバー、右にメインエリアとフッターを置く画面全体の枠 */
export function AppLayout({ sidebar, children }: Props) {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>{sidebar}</aside>
      <div className={styles.content}>
        <main className={styles.main}>{children}</main>
        <Footer />
      </div>
    </div>
  )
}
