import styles from './ShipsLoader.module.css';

interface Props {
  progress: number;
}

export default function ShipsLoader({ progress }: Props) {
  const percent = Math.round(progress * 100);
  const hasProgress = progress > 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <span className={styles.icon}>⚓</span>
        <p className={styles.title}>Loading Ships…</p>

        <div className={styles.barTrack}>
          <div className={styles.barFill} style={{ width: `${percent}%` }} />
          {!hasProgress && <div className={styles.barIndeterminate} />}
        </div>

        <p className={styles.percent}>
          {hasProgress ? `${percent}%` : 'Connecting…'}
        </p>
      </div>
    </div>
  );
}
