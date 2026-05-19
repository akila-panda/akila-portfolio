import styles from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <a href="#top" className={styles.logo}>AR — Portfolio</a>
      <ul className={styles.links}>
        <li><a href="#about">About</a></li>
        <li><a href="#projects">Work</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <span className={styles.status}>
        <span className={styles.dot} />
        Open to work
      </span>
    </nav>
  )
}
