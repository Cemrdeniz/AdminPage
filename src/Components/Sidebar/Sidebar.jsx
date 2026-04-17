import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import styles from './Sidebar.module.css';

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  // Şartnamede belirtilen menü öğeleri ve rotalar
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'icon-dashboard' },
    { name: 'Orders', path: '/orders', icon: 'icon-orders' },
    { name: 'Products', path: '/products', icon: 'icon-products' },
    { name: 'Customers', path: '/customers', icon: 'icon-customers' },
    { name: 'Suppliers', path: '/suppliers', icon: 'icon-suppliers' },
  ];

  return (
    <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
      <div className={styles.sidebarHeader}>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close sidebar">
          <img src="/cross.svg" alt="Close sidebar" className={styles.iconImg} />
        </button>
      </div>

      <nav className={styles.sidebarNav}>
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            end
            className={({ isActive }) => 
              isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
            }
            onClick={onClose}
          >
            <svg className={styles.navIcon}>
              {/* İkonlar sprite üzerinden bağlanıyor [cite: 15] */}
              <use href={`/sprite.svg#${item.icon}`} />
            </svg>
            <span className={styles.navText}>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
        <img src="/sign-out-alt.svg" alt="Logout" className={styles.logoutIcon} />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;