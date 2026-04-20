import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { ref, get, push, set } from "firebase/database";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Orders.module.css";

const emptyOrder = {
  user_name: "",
  address: "",
  order_date: "",
  price: "",
  products: "",
  status: "Delivered",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const [formValues, setFormValues] = useState(emptyOrder);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const ordersRef = ref(db, "orders");
        const snapshot = await get(ordersRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const ordersArray = Object.entries(data).map(([id, val]) => ({
            id,
            ...val,
          }));

          setOrders(ordersArray);
          setFilteredOrders(ordersArray);
        } else {
          setOrders([]);
          setFilteredOrders([]);
        }
      } catch (error) {
        console.error("Siparişler çekilirken hata oluştu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Search
  useEffect(() => {
    const filtered = orders.filter((order) =>
      order.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, orders]);

  const handleFilter = () => {
    const filtered = orders.filter((order) =>
      order.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredOrders(filtered);
  };

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleOpenForm = () => {
    setFormValues(emptyOrder);
    setShowForm(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const ordersRef = ref(db, "orders");
      const newOrderRef = push(ordersRef);

      const newOrder = {
        ...formValues,
        price: Number(formValues.price) || 0,
      };

      await set(newOrderRef, newOrder);

      const savedOrder = { id: newOrderRef.key, ...newOrder };

      setOrders((prev) => [savedOrder, ...prev]);
      setFilteredOrders((prev) => [savedOrder, ...prev]);

      toast.success("Order successfully created!");
      setShowForm(false);
    } catch (error) {
      console.error("Sipariş kaydedilirken hata oluştu:", error);
      toast.error("Failed to create order!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <h1 className={styles.pageTitle}>Orders</h1>
          <p className={styles.pageSubtitle}>
            View, track, and manage customer orders in one place.
          </p>
        </div>

        <button className={styles.addButton} onClick={handleOpenForm}>
          <span>+</span> New order
        </button>
      </div>

      <div className={styles.filterWrapper}>
        <input
          type="text"
          placeholder="Search by user name"
          className={styles.filterInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button className={styles.filterButton} onClick={handleFilter}>
          Search
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Address</th>
              <th>Products</th>
              <th>Order date</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.user_name}</td>
                  <td>{order.address}</td>
                  <td className={styles.productsCell}>{order.products}</td>
                  <td>{order.order_date}</td>
                  <td>{order.price}</td>
                  <td>
                    <span
                      className={`${styles.status} ${
                        styles[order.status.toLowerCase()]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className={styles.noResult}>
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              border: "none",
              background:
                currentPage === index + 1 ? "#5b6bf7" : "#e5e7eb",
              color: currentPage === index + 1 ? "#fff" : "#111",
              cursor: "pointer",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <div>
                <h2>Add New Order</h2>
                <p className={styles.modalSubtitle}>
                  Fill the details and save the order to the database.
                </p>
              </div>

              <button
                className={styles.closeModal}
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <form className={styles.formGrid} onSubmit={handleSubmit}>
                <label>
                  Customer name
                  <input
                    name="user_name"
                    value={formValues.user_name}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Address
                  <input
                    name="address"
                    value={formValues.address}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Order date
                  <input
                    name="order_date"
                    type="date"
                    value={formValues.order_date}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Price
                  <input
                    name="price"
                    type="number"
                    min="0"
                    value={formValues.price}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className={styles.fullWidth}>
                  Products
                  <input
                    name="products"
                    value={formValues.products}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className={styles.fullWidth}>
                  Status
                  <select
                    name="status"
                    value={formValues.status}
                    onChange={handleChange}
                  >
                    <option>Delivered</option>
                    <option>Pending</option>
                    <option>Shipped</option>
                  </select>
                </label>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save order"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Orders;