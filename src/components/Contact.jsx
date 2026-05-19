import styles from './Contact.module.css'

export default function Contact() {
  return (
    <section className={styles.contact} id="contact">
      <div className={styles.label}>005 — Contact</div>
      <div className={styles.inner}>
        <div className={styles.big}>
          Let's build<br /><em>something.</em>
        </div>
        <p className={styles.sub}>
          Open to senior frontend roles, freelance projects, and interesting AI engineering work.
          Based in Sri Lanka, available remote.
        </p>
        <div className={styles.links}>
          <a href="mailto:akilaranasinghe@gmail.com" className={styles.btnPrimary}>
            akilaranasinghe@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/akila-ranasinghe-89bba0100/"
            target="_blank"
            rel="noreferrer"
            className={styles.btnSecondary}
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className={styles.btnSecondary}
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
