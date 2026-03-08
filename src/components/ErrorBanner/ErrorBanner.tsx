import { useState } from 'react';
import styles from './ErrorBanner.module.css';

interface Props {
  message: string;
  onRetry: () => void;
}

export default function ErrorBanner({ message, onRetry }: Props) {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    onRetry();
  };

  return (
    <div className={styles.wrapper} role="alert">
      <div className={styles.content}>
        <span className={styles.icon} aria-hidden="true">⚠</span>
        <div className={styles.text}>
          <p className={styles.title}>Failed to load ship data</p>
          <p className={styles.detail}>{message}</p>
          <p className={styles.hint}>
            The naval database server may be temporarily unavailable. Please try again.
          </p>
        </div>
        <button className={styles.retryBtn} onClick={handleRetry} disabled={retrying}>
          {retrying ? 'Loading…' : 'Retry'}
        </button>
      </div>
    </div>
  );
}
