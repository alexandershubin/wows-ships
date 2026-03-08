import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/useAppDispatch';
import { loadMeta, loadVehicles } from './store/dataSlice';
import Header from './components/Header/Header';
import FilterPanel from './components/FilterPanel/FilterPanel';
import ShipGrid from './components/ShipGrid/ShipGrid';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import ErrorBanner from './components/ErrorBanner/ErrorBanner';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import styles from './App.module.css';

export default function App() {
  const dispatch = useAppDispatch();
  const { metaStatus, vehiclesStatus, metaError, vehiclesError } =
    useAppSelector((item) => item.data);
  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.matchMedia('(min-width: 641px)').matches
  );

  useEffect(() => {
    dispatch(loadMeta());
    dispatch(loadVehicles());
  }, [dispatch]);

  const handleRetry = () => {
    if (metaStatus === 'failed') dispatch(loadMeta());
    if (vehiclesStatus === 'failed') dispatch(loadVehicles());
  };

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  if (metaStatus === 'idle' || metaStatus === 'loading') {
    return <LoadingScreen />;
  }

  if (metaStatus === 'failed') {
    return <ErrorBanner message={metaError ?? 'Unknown error'} onRetry={handleRetry} />;
  }

  return (
    <div className={styles.app}>
      <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      <div className={styles.body}>
        {sidebarOpen && (
          <>
            <div
              className={styles.backdrop}
              onClick={toggleSidebar}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSidebar(); }}
              role="button"
              tabIndex={0}
              aria-label="Close filters"
            />
            <div className={styles.sidebar}>
              <FilterPanel />
            </div>
          </>
        )}

        <main className={styles.main}>
          <ErrorBoundary>
            {vehiclesStatus === 'failed' ? (
              <ErrorBanner message={vehiclesError ?? 'Unknown error'} onRetry={handleRetry} />
            ) : (
              <ShipGrid />
            )}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
