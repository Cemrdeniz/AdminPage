import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { ref, get } from "firebase/database";

import Statistics from "../../Components/Statistics/Statistics";
import RecentCustomers from "../../Components/RecentCustomers/RecentCustomers";
import IncomeExpenses from "../../Components/IncomeExpenses/IncomeExpenses";

import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [data, setData] = useState({
    stats: {
      customers: 0,
      suppliers: 0,
      products: 0,
      income: 0,
      expense: 0,
    },
    customers: [],
    suppliers: [],
    products: [],
    transactions: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersSnap, suppliersSnap, productsSnap, transactionsSnap] =
          await Promise.all([
            get(ref(db, "customers")),
            get(ref(db, "suppliers")),
            get(ref(db, "products")),
            get(ref(db, "income_expenses")),
          ]);

        const customersList = customersSnap.exists()
          ? Object.entries(customersSnap.val()).map(([id, val]) => ({
              id,
              ...val,
            }))
          : [];

        const suppliersList = suppliersSnap.exists()
          ? Object.entries(suppliersSnap.val()).map(([id, val]) => ({
              id,
              ...val,
            }))
          : [];

        const productsList = productsSnap.exists()
          ? Object.entries(productsSnap.val()).map(([id, val]) => ({
              id,
              ...val,
            }))
          : [];

        const transactionsList = transactionsSnap.exists()
          ? Object.entries(transactionsSnap.val()).map(([id, val]) => ({
              id,
              ...val,
            }))
          : [];

        const incomeFromSuppliers = suppliersList.reduce(
          (acc, s) => acc + Number(s.amount || 0),
          0
        );

        const expenseTotal = transactionsList
          .filter((t) => t.type === "expense")
          .reduce((acc, t) => acc + Number(t.amount || 0), 0);

        const stats = {
          customers: customersList.length,
          suppliers: suppliersList.length,
          products: productsList.length,
          income: incomeFromSuppliers,
          expense: expenseTotal,
        };

        setData({
          stats,
          customers: customersList,
          suppliers: suppliersList,
          products: productsList,
          transactions: transactionsList,
        });
      } catch (error) {
        console.error("Firebase error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.dashboard}>
      <Statistics stats={data.stats} />

      <div className={styles.bottomGrid}>
        <RecentCustomers customers={data.customers} />
        <IncomeExpenses
          transactions={data.transactions}
          suppliers={data.suppliers}
        />
      </div>
    </div>
  );
};

export default Dashboard;