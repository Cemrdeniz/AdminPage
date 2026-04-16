import styles from "./IncomeExpenses.module.css";

const IncomeExpenses = ({ transactions, suppliers }) => {
  const supplierIncome = suppliers.map((s) => ({
    id: `s-${s.id}`,
    name: s.name,
    email: s.company,
    amount: Number(s.amount || 0),
    type: "income",
  }));

  const merged = [...transactions, ...supplierIncome]
    .slice(-5)
    .reverse();

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.title}>Income / Expenses</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {merged.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.email || item.company}</td>
              <td>
                {item.type === "income" ? "+" : "-"}
                {item.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncomeExpenses;