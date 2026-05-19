import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero} id="top">
      <div className={styles.heroBg} />
      <div className={styles.heroGrid} />
      <div className={styles.counter}>001 — INTRODUCTION</div>

      <div className={styles.content}>
        <div className={styles.tag}>Senior Frontend Developer · Sri Lanka</div>

        <h1 className={styles.name}>
          Akila<br />
          <em>Ranasinghe</em>
        </h1>

        <p className={styles.desc}>
          7+ years building things for the web — from Figma file to production-ready,<br />
          optimised application. React.js · Next.js · Vue.js · TypeScript · AI Engineering.
        </p>

        <div className={styles.cta}>
          <a href="#projects" className={styles.btnPrimary}>View My Work</a>
          <a href="#contact" className={styles.btnSecondary}>Get In Touch</a>
        </div>
      </div>

      <div className={styles.scroll}>
        <div className={styles.scrollLine} />
        Scroll
      </div>
    </section>
  )
}
