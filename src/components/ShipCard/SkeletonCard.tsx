import styles from './SkeletonCard.module.css';

export default function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.topBar}>
        <div className={`${styles.bone} ${styles.tierBone}`} />
      </div>
      <div className={styles.imageArea}>
        <div className={`${styles.bone} ${styles.imageBone}`} />
      </div>
      <div className={styles.info}>
        <div className={`${styles.bone} ${styles.nameBone}`} />
        <div className={styles.metaRow}>
          <div className={`${styles.bone} ${styles.metaBone}`} />
          <div className={`${styles.bone} ${styles.metaBone}`} />
        </div>
      </div>
    </div>
  );
}
