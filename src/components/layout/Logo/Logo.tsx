import logo from '../../../assets/icons/logo.svg'
import styles from './Logo.module.css'

export function Logo() {
  return (
    <div className={styles.logo}>
      <img src={logo} alt="" width={32} height={32} />
      <span className={styles.name}>ServiceName</span>
    </div>
  )
}
