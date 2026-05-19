import { skills } from '../data/portfolio'
import styles from './About.module.css'

export default function About() {
  return (
    <section className={styles.about} id="about">
      <div className={styles.label}>002 — About</div>
      <h2 className={styles.title}>
        Design sense.<br /><em>Engineering depth.</em>
      </h2>

      <div className={styles.grid}>
        <div className={styles.text}>
          <p>
            I've spent the last 7 years building things for the web, starting out as a{' '}
            <strong>UI/UX designer</strong> and growing into someone who builds full products
            from a Figma file all the way to a production-ready, optimised application.
          </p>
          <p>
            What makes me different is the range — I can go from{' '}
            <strong>pixel-perfect interface design</strong> to writing RAG pipelines with
            LangChain and NVIDIA NIM. I know how to make things look exceptional{' '}
            <em>and</em> make them work at scale.
          </p>
          <p>
            Currently at <strong>INSK Group</strong> as Senior Frontend Developer, and
            independently building AI-powered SaaS tools on the side.
          </p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.stat}>
            <div className={styles.statNum}>7<span>+</span></div>
            <div className={styles.statLabel}>Years experience</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>4</div>
            <div className={styles.statLabel}>Companies</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>15<span>+</span></div>
            <div className={styles.statLabel}>Projects shipped</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>∞</div>
            <div className={styles.statLabel}>Tabs open</div>
          </div>
        </div>
      </div>

      <div className={styles.skillsHeader}>
        <div className={styles.label}>Skills</div>
      </div>
      <div className={styles.skillsGrid}>
        {skills.map((s) => (
          <div key={s.category} className={styles.skillCat}>
            <div className={styles.skillCatName}>{s.category}</div>
            <div className={styles.skillTags}>
              {s.items.map((item) => (
                <span key={item} className={styles.skillTag}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
