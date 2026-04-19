import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Header from '../../Components/Header/Header';
import styles from './SharedLayout.module.css';

const SharedLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 1280) {
      setSidebarOpen(true);
    }
  }, []);

  return (
    <div className={`${styles.layoutWrapper} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={styles.mainContent}>
        <Header onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        <main className={styles.pageOutlet}>
          <Outlet />
        </main>
      </div>
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default SharedLayout;