import styles from "./Statistics.module.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Statistics = ({ stats }) => {
  const data = {
    labels: ["Products", "Suppliers", "Customers"],
    datasets: [
      {
        label: "Count",
        data: [
          stats.products || 0,
          stats.suppliers || 0,
          stats.customers || 0,
        ],
        backgroundColor: ["#5b6bf7", "#7c55ff", "#22c55e"],
        borderRadius: 10,
      },
    ],
  };

  const financeData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Money",
        data: [stats.income || 0, stats.expense || 0],
        backgroundColor: ["#16a34a", "#ef4444"],
        borderRadius: 10,
      },
    ],
  };

  return (
    <div className={styles.wrapper}>
      {/* CARDS */}
      <div className={styles.statsWrapper}>
        <div className={styles.statCard}>
          <h3>All products</h3>
          <p className={styles.count}>{stats.products || 0}</p>
        </div>

        <div className={styles.statCard}>
          <h3>All suppliers</h3>
          <p className={styles.count}>{stats.suppliers || 0}</p>
        </div>

        <div className={styles.statCard}>
          <h3>All customers</h3>
          <p className={styles.count}>{stats.customers || 0}</p>
        </div>

        <div className={styles.statCard}>
          <h3>Total income</h3>
          <p className={styles.count}>{stats.income || 0}</p>
        </div>

        <div className={styles.statCard}>
          <h3>Total expense</h3>
          <p className={styles.count}>{stats.expense || 0}</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className={styles.charts}>
        <div className={styles.chartCard}>
          <h4>Overview</h4>
          <Bar
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>

        <div className={styles.chartCard}>
          <h4>Finance</h4>
          <Bar
            data={financeData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Statistics;