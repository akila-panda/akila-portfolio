import { experience } from '../data/portfolio'
import styles from './Experience.module.css'

export default function Experience() {
  return (
    <section className={styles.experience} id="experience">
      <div className={styles.label}>004 — Experience</div>
      <h2 className={styles.title}>
        Where I've<br /><em>worked.</em>
      </h2>

      <div className={styles.list}>
        {experience.map((e, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.meta}>
              <div className={styles.period}>{e.period}</div>
              <div className={styles.company}>{e.company}</div>
              <div className={styles.location}>{e.location}</div>
            </div>
            <div className={styles.detail}>
              <div className={styles.role}>{e.role}</div>
              <ul className={styles.points}>
                {e.points.map((point, j) => (
                  <li key={j}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
