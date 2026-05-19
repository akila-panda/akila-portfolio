import { projects } from '../data/portfolio'
import styles from './Projects.module.css'

export default function Projects() {
  return (
    <section className={styles.projects} id="projects">
      <div className={styles.label}>003 — Selected Work</div>
      <h2 className={styles.title}>
        Projects that<br /><em>actually shipped.</em>
      </h2>

      <div className={styles.list}>
        {projects.map((p) => (
          <div
            key={p.num}
            className={styles.item}
            onClick={() => p.url && window.open(p.url, '_blank')}
            style={{ cursor: p.url ? 'pointer' : 'default' }}
          >
            <div className={styles.num}>{p.num}</div>
            <div className={styles.body}>
              <div className={styles.top}>
                <span className={styles.name}>{p.name}</span>
                <span className={styles.type}>{p.type}</span>
              </div>
              <p className={styles.desc}>{p.desc}</p>
              <div className={styles.techs}>
                {p.techs.map((t) => (
                  <span key={t} className={styles.tech}>{t}</span>
                ))}
              </div>
            </div>
            <div className={styles.arrow} style={{ opacity: p.url ? 1 : 0.2 }}>↗</div>
          </div>
        ))}
      </div>
    </section>
  )
}
