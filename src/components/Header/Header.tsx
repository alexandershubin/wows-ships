import { useTransition, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { setSearch } from '../../store/filtersSlice';
import styles from './Header.module.css';

interface Props {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export default function Header({ onToggleSidebar, sidebarOpen }: Props) {
  const dispatch = useAppDispatch();
  const currentSearch = useAppSelector((s) => s.filters.search);
  const [localSearch, setLocalSearch] = useState(currentSearch);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    startTransition(() => {
      dispatch(setSearch(value));
    });
  };

  const handleClear = () => {
    setLocalSearch('');
    startTransition(() => {
      dispatch(setSearch(''));
    });
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          className={styles.menuBtn}
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Hide filters' : 'Show filters'}
          aria-expanded={sidebarOpen}
        >
          <span className={styles.menuIcon} />
          <span className={styles.menuIcon} />
          <span className={styles.menuIcon} />
        </button>
        <div className={styles.logo}>
          <span className={styles.logoAnchor}>⚓</span>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>World of Warships</span>
            <span className={styles.logoSub}>Ship Encyclopedia</span>
          </div>
        </div>
      </div>

      <div className={`${styles.searchWrapper} ${isPending ? styles.searchPending : ''}`}>
        <span className={styles.searchIcon} aria-hidden="true">
          🔍
        </span>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search ships…"
          value={localSearch}
          onChange={handleChange}
          aria-label="Search ships"
        />
        {localSearch && (
          <button className={styles.clearSearch} onClick={handleClear} aria-label="Clear search">
            ✕
          </button>
        )}
      </div>
    </header>
  );
}
