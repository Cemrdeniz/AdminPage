// src/pages/Dashboard/Dashboard.jsx
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const stats = [
    { title: 'Orders', value: 128, change: '+12%' },
    { title: 'Products', value: 54, change: '+3%' },
    { title: 'Customers', value: 342, change: '+8%' },
    { title: 'Revenue', value: '$12.430', change: '+18%' },
  ];

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.title}>Dashboard</h2>

      {/* STATS CARDS */}
      <div className={styles.grid}>
        {stats.map((item) => (
          <div key={item.title} className={styles.card}>
            <div className={styles.cardTop}>
              <span className={styles.cardTitle}>{item.title}</span>
              <span className={styles.cardChange}>{item.change}</span>
            </div>
            <div className={styles.cardValue}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* CHART AREA (placeholder) */}
      <div className={styles.chartCard}>
        <h3>Sales Overview</h3>
        <div className={styles.chartPlaceholder}>
          Grafik alanı (Chart ekleyeceğiz)
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className={styles.bottomGrid}>
        <div className={styles.listCard}>
          <h3>Recent Orders</h3>
          <ul>
            <li>Order #1023 - Completed</li>
            <li>Order #1024 - Pending</li>
            <li>Order #1025 - Cancelled</li>
          </ul>
        </div>

        <div className={styles.listCard}>
          <h3>Top Products</h3>
          <ul>
            <li>Paracetamol</li>
            <li>Vitamin C</li>
            <li>Omega 3</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;