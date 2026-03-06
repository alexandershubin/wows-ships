import { useCallback } from 'react';
import { SHIP_TYPES, TIERS } from '../../types';
import { getNationFlagUrl, getTypeIconUrl } from '../../images';
import { toRoman } from '../../utils';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { clearFilters, toggleLevel, toggleNation, toggleType } from '../../store/filtersSlice';
import { selectFilteredShips, selectTotalShipCount } from '../../store/selectors';
import styles from './FilterPanel.module.css';

export default function FilterPanel() {
  const dispatch = useAppDispatch();
  const { nations, vehicleTypes, mediaPath } = useAppSelector((s) => s.data);
  const selectedNations = useAppSelector((s) => s.filters.nations);
  const selectedTypes = useAppSelector((s) => s.filters.types);
  const selectedLevels = useAppSelector((s) => s.filters.levels);
  const filteredCount = useAppSelector(selectFilteredShips).length;
  const totalCount = useAppSelector(selectTotalShipCount);

  const hasActiveFilters =
    selectedNations.length > 0 || selectedTypes.length > 0 || selectedLevels.length > 0;

  const handleClear = useCallback(() => dispatch(clearFilters()), [dispatch]);

  const visibleNations = nations.filter((n) => n.tags.includes('inTree'));

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>Filters</span>
        {hasActiveFilters && (
          <button className={styles.clearBtn} onClick={handleClear} aria-label="Clear all filters">
            Clear
          </button>
        )}
      </div>

      <div className={styles.count}>
        {filteredCount === totalCount ? (
          <span>{totalCount} ships</span>
        ) : (
          <span>
            {filteredCount} / {totalCount} ships
          </span>
        )}
      </div>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Nation</h4>
        <div className={styles.nationList}>
          {visibleNations.map((nation) => {
            const isActive = selectedNations.includes(nation.name);
            const flagUrl = getNationFlagUrl(mediaPath, nation.icons?.tiny);
            const label = nation.localization?.mark?.en ?? nation.name;
            return (
              <button
                key={nation.name}
                className={`${styles.nationBtn} ${isActive ? styles.active : ''}`}
                onClick={() => dispatch(toggleNation(nation.name))}
                aria-pressed={isActive}
                title={label}
              >
                {flagUrl && (
                  <img
                    src={flagUrl}
                    alt={label}
                    className={styles.nationFlag}
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <span className={styles.nationLabel}>{label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Ship Type</h4>
        <div className={styles.typeList}>
          {SHIP_TYPES.map((type) => {
            const isActive = selectedTypes.includes(type);
            const vt = vehicleTypes[type];
            const iconUrl = getTypeIconUrl(mediaPath, vt?.icons?.default);
            const label = vt?.localization?.mark?.en ?? type;
            return (
              <button
                key={type}
                className={`${styles.typeBtn} ${isActive ? styles.active : ''}`}
                onClick={() => dispatch(toggleType(type))}
                aria-pressed={isActive}
                data-type={type}
              >
                {iconUrl && (
                  <img
                    src={iconUrl}
                    alt={label}
                    className={styles.typeIcon}
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Tier</h4>
        <div className={styles.tierGrid}>
          {TIERS.map((tier) => {
            const isActive = selectedLevels.includes(tier);
            return (
              <button
                key={tier}
                className={`${styles.tierBtn} ${isActive ? styles.active : ''} ${tier === 11 ? styles.tierBtnStar : ''}`}
                onClick={() => dispatch(toggleLevel(tier))}
                aria-pressed={isActive}
                aria-label={`Tier ${tier}`}
              >
                {toRoman(tier)}
              </button>
            );
          })}
        </div>
      </section>
    </aside>
  );
}
