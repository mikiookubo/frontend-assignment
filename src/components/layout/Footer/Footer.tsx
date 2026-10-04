import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <small className={styles.copyright}>Copyright © 2021 Sample</small>
      <a className={styles.link} href="#">
        運営会社
      </a>
    </footer>
  )
}
