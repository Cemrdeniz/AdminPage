import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import styles from './Header.module.css';

const Header = ({ onMenuToggle }) => {
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  const logoTarget = ['/login', '/register'].includes(location.pathname) ? '/login' : '/dashboard';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email || '');
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftContent}>
        <Link to={logoTarget} className={styles.logoWrapper} aria-label="Go to home">
          <div className={styles.logoIcon}>
            <img 
              src="/medicine.jpg" 
              alt="Medicine Store Logo" 
              className={styles.logoImage}
            />
          </div>

          <div>
            <h1 className={styles.mainTitle}>Medicine Store</h1>
            <p className={styles.logoCaption}>Admin Panel</p>
          </div>
        </Link>
      </div>

      <div className={styles.rightContent}>
        <span className={styles.userEmail}>{userEmail || 'user@example.com'}</span>
        <button type="button" className={styles.menuBtn} onClick={onMenuToggle} aria-label="Toggle sidebar">
          <img src="/menu-burger.svg" alt="Menu" className={styles.iconImg} />
        </button>
      </div>
    </header>
  );
};

export default Header;