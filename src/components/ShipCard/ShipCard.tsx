import { memo, useState, type CSSProperties } from 'react';
// Note: <button> wraps block-level content here intentionally —
// browsers handle this correctly and it gives native keyboard/focus semantics.
import type { Vehicle } from '../../types';
import { useShipData } from '../../hooks/useShipData';
import { getShipImageUrl } from '../../images';
import ShipPlaceholder from '../../icons/ShipPlaceholder';
import { toRoman, hideImageOnError } from '../../utils';
import styles from './ShipCard.module.css';

interface Props {
  ship: Vehicle;
  onClick: (ship: Vehicle) => void;
}

function ShipCard({ ship, onClick }: Props) {
  const [imgError, setImgError] = useState(false);
  const { name, shipType, premium, special, typeColor, nationName, nationFlagUrl, typeIconUrl, typeName, mediaPath } = useShipData(ship);
  const shipImageUrl = getShipImageUrl(mediaPath, ship.icons);

  return (
    <button
      className={styles.card}
      style={{ '--type-color': typeColor } as CSSProperties}
      onClick={() => onClick(ship)}
      aria-label={`View details for ${name}`}
      data-testid="ship-card"
    >
      <div className={styles.topBar}>
        <span className={`${styles.tier} ${ship.level === 11 ? styles.tierStar : ''}`}>
          {toRoman(ship.level)}
        </span>
        <div className={styles.badges}>
          {special && <span className={styles.badgeSpecial}>Special</span>}
          {!special && premium && <span className={styles.badgePremium}>Premium</span>}
        </div>
      </div>

      <div className={styles.imageWrapper}>
        {!imgError && shipImageUrl ? (
          <img
            src={shipImageUrl}
            alt={name}
            className={styles.shipImage}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <ShipPlaceholder />
          </div>
        )}
      </div>

      <div className={styles.info}>
        <p className={styles.name}>{name}</p>
        <div className={styles.meta}>
          <div className={styles.nationBadge}>
            {nationFlagUrl && (
              <img
                src={nationFlagUrl}
                alt={nationName}
                className={styles.flag}
                loading="lazy"
                onError={hideImageOnError}
              />
            )}
            <span className={styles.nationName}>{nationName}</span>
          </div>
          <div className={styles.typeBadge}>
            {typeIconUrl && (
              <img
                src={typeIconUrl}
                alt={shipType}
                className={styles.typeIcon}
                loading="lazy"
                onError={hideImageOnError}
              />
            )}
            <span className={styles.typeName}>{typeName}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default memo(ShipCard);
