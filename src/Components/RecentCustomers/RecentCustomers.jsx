import styles from './RecentCustomers.module.css';

const RecentCustomers = ({ customers }) => {
  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.title}>Recent Customers</h2>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Spent</th>
            </tr>
          </thead>

          <tbody>
            {customers.length > 0 ? (
              [...customers]        // array copy
                .slice(-5)           // 🔥 SON 5
                .reverse()           // en yeni en üstte
                .map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.user_name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.total_spent || 0}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="3">No recent customers available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentCustomers;