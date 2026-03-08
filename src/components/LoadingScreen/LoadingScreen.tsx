import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
  return (
    <div className={styles.overlay} role="status" aria-label="Loading ship data">
      <div className={styles.content}>
        <div className={styles.anchor}>⚓</div>
        <div className={styles.spinner}>
          <div className={styles.ring} />
          <div className={styles.ring} />
        </div>
        <p className={styles.text}>Loading Ship Data…</p>
        <p className={styles.sub}>Connecting to Naval Command</p>
      </div>
    </div>
  );
}
