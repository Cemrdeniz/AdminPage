import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { ref, push, set, remove, update, get } from "firebase/database";
import styles from "./Customers.module.css";
import cross from "../../assets/cross.svg";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const emptyCustomer = {
  user_name: "",
  email: "",
  phone: "",
};

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [newCustomer, setNewCustomer] = useState(emptyCustomer);
  const [editCustomerId, setEditCustomerId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;

  const fetchCustomers = async () => {
    try {
      const snapshot = await get(ref(db, "customers"));

      if (snapshot.exists()) {
        const data = Object.entries(snapshot.val()).map(([id, val]) => ({
          id,
          ...val,
        }));

        setCustomers(data);
        setFilteredCustomers(data);
      } else {
        setCustomers([]);
        setFilteredCustomers([]);
      }
    } catch (error) {
      console.error("Customers çekilirken hata:", error);
      toast.error("Failed to load customers");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const addCustomer = async () => {
    if (!newCustomer.user_name || !newCustomer.email || !newCustomer.phone) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const customerRef = push(ref(db, "customers"));
      await set(customerRef, newCustomer);

      toast.success("Customer added successfully");

      setNewCustomer(emptyCustomer);
      fetchCustomers();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Customer eklenirken hata:", error);
      toast.error("Failed to add customer");
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Delete this customer?")) return;

    try {
      await remove(ref(db, `customers/${id}`));

      toast.success("Customer deleted");

      fetchCustomers();
    } catch (error) {
      console.error("Customer silinirken hata:", error);
      toast.error("Delete failed");
    }
  };

  const updateCustomer = async () => {
    try {
      await update(ref(db, `customers/${editCustomerId}`), newCustomer);

      toast.success("Customer updated");

      setNewCustomer(emptyCustomer);
      setIsModalOpen(false);
      setIsEditMode(false);

      fetchCustomers();
    } catch (error) {
      console.error("Customer update error:", error);
      toast.error("Update failed");
    }
  };

  const openEditModal = (customer) => {
    setIsEditMode(true);
    setEditCustomerId(customer.id);

    setNewCustomer({
      user_name: customer.user_name,
      email: customer.email,
      phone: customer.phone,
    });

    setIsModalOpen(true);
  };

  const handleFilter = () => {
    const filtered = customers.filter((c) =>
      c.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredCustomers(filtered);
    setCurrentPage(1);
  };

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;

  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  return (
    <div className={styles.container}>
      {/* TOAST */}
      <ToastContainer position="top-right" autoClose={2000} />

      <div className={styles.pageTop}>
        <div>
          <h1 className={styles.pageTitle}>Customers</h1>
          <p className={styles.pageSubtitle}>
            Manage your customers and keep their information organized.
          </p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() => {
            setIsEditMode(false);
            setNewCustomer(emptyCustomer);
            setIsModalOpen(true);
          }}
        >
          + Add Customer
        </button>
      </div>

      <div className={styles.searchCard}>
        <input
          type="text"
          placeholder="Search customer name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />

        <button className={styles.searchBtn} onClick={handleFilter}>
          Search
        </button>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button
              className={styles.closeBtn}
              onClick={() => setIsModalOpen(false)}
            >
              <img src={cross} alt="close" />
            </button>

            <h2 style={{ color: "#111827" }}>
              {isEditMode ? "Edit Customer" : "Add Customer"}
            </h2>

            <div className={styles.formGrid}>
              <input
                type="text"
                placeholder="Name"
                value={newCustomer.user_name}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    user_name: e.target.value,
                  })
                }
              />

              <input
                type="email"
                placeholder="Email"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    email: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Phone"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    phone: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.actions}>
              {isEditMode ? (
                <button onClick={updateCustomer}>Update</button>
              ) : (
                <button onClick={addCustomer}>Add</button>
              )}

              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentCustomers.length === 0 ? (
              <tr>
                <td colSpan="4" className={styles.emptyState}>
                  No customers found
                </td>
              </tr>
            ) : (
              currentCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.user_name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>

                  <td className={styles.actionsCell}>
                    <button
                      className={styles.editBtn}
                      onClick={() => openEditModal(customer)}
                    >
                      Edit
                    </button>

                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteCustomer(customer.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={
              currentPage === index + 1 ? styles.activePage : ""
            }
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Customers;