import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Vehicle } from '../../types';
import { useShipData } from '../../hooks/useShipData';
import { getShipImageUrl, getShipLargeImageUrl } from '../../images';
import ShipPlaceholder from '../../icons/ShipPlaceholder';
import { toRoman, hideImageOnError } from '../../utils';
import styles from './ShipModal.module.css';

interface Props {
  ship: Vehicle;
  onClose: () => void;
}

export default function ShipModal({ ship, onClose }: Props) {
  const [imgError, setImgError] = useState(false);
  const [largeLoaded, setLargeLoaded] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const { name, shipType, premium, special, typeColor, nationName, nationFlagUrl, typeIconUrl, typeName, mediaPath } = useShipData(ship);
  const description = ship.localization.description?.en ?? '';
  const mediumImageUrl = getShipImageUrl(mediaPath, ship.icons);
  const largeImageUrl = getShipLargeImageUrl(mediaPath, ship.icons);
  const hasSeparateLarge = largeImageUrl && largeImageUrl !== mediumImageUrl;

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className={styles.backdrop} onClick={onClose} data-testid="modal-backdrop">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ship-modal-name"
        className={styles.panel}
        style={{ '--type-color': typeColor } as CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeBtnRef} className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>

        <div className={styles.imageSection}>
          {imgError || !mediumImageUrl ? (
            <div className={styles.imagePlaceholder}>
              <ShipPlaceholder />
            </div>
          ) : (
            <div className={styles.imageContainer}>
              <img
                src={mediumImageUrl}
                alt={name}
                className={styles.shipImage}
                onError={() => setImgError(true)}
              />
              {hasSeparateLarge && (
                <img
                  src={largeImageUrl}
                  alt=""
                  aria-hidden="true"
                  className={`${styles.shipImageLarge} ${largeLoaded ? styles.shipImageLargeVisible : ''}`}
                  onLoad={() => setLargeLoaded(true)}
                  onError={() => { /* silently ignore, medium remains */ }}
                />
              )}
            </div>
          )}
        </div>

        <div className={styles.body}>
          <div className={styles.titleRow}>
            <span className={`${styles.tier} ${ship.level === 11 ? styles.tierStar : ''}`}>
              {toRoman(ship.level)}
            </span>
            <h2 className={styles.name} id="ship-modal-name">{name}</h2>
            <div className={styles.badges}>
              {special && <span className={styles.badgeSpecial}>Special</span>}
              {!special && premium && <span className={styles.badgePremium}>Premium</span>}
            </div>
          </div>

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              {nationFlagUrl && (
                <img
                  src={nationFlagUrl}
                  alt={nationName}
                  className={styles.flag}
                  onError={hideImageOnError}
                />
              )}
              <span>{nationName}</span>
            </div>
            <div className={styles.metaItem}>
              {typeIconUrl && (
                <img
                  src={typeIconUrl}
                  alt={shipType}
                  className={styles.typeIcon}
                  onError={hideImageOnError}
                />
              )}
              <span>{typeName}</span>
            </div>
          </div>

          {description && (
            <p className={styles.description}>{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
