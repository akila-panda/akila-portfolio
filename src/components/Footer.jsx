import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} Akila Ranasinghe</p>
      <p>
        Built with React · Hosted on{' '}
        <a href="https://pages.github.com" target="_blank" rel="noreferrer">
          GitHub Pages
        </a>
      </p>
    </footer>
  )
}
