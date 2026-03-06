import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/useAppDispatch';
import { loadMeta, loadVehicles } from './store/dataSlice';
import Header from './components/Header/Header';
import FilterPanel from './components/FilterPanel/FilterPanel';
import ShipGrid from './components/ShipGrid/ShipGrid';
import LoadingScreen from './ui/LoadingScreen/LoadingScreen';
import ErrorBanner from './ui/ErrorBanner/ErrorBanner';
import ErrorBoundary from './ui/ErrorBoundary/ErrorBoundary';
import styles from './App.module.css';

export default function App() {
  const dispatch = useAppDispatch();
  const { metaStatus, vehiclesStatus, metaError, vehiclesError } =
    useAppSelector((s) => s.data);
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

  const toggleSidebar = () => setSidebarOpen((v) => !v);

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
            <div className={styles.backdrop} onClick={toggleSidebar} />
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
