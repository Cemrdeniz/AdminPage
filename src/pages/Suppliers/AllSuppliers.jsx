import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { ref, get, remove } from "firebase/database";
import SupplierModal from "./SupplierModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./AllSuppliers.module.css";

const AllSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "add",
    data: null,
  });

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchSuppliers = async () => {
    try {
      const snapshot = await get(ref(db, "suppliers"));
      if (snapshot.exists()) {
        const data = Object.entries(snapshot.val()).map(([id, val]) => ({
          id,
          ...val,
        }));

        setSuppliers(data);
        setFilteredSuppliers(data);
      } else {
        setSuppliers([]);
        setFilteredSuppliers([]);
      }
    } catch (error) {
      console.error("Hata:", error);
      toast.error("Failed to load suppliers!");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleFilter = () => {
    const filtered = suppliers.filter((supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredSuppliers(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?"))
      return;

    try {
      await remove(ref(db, `suppliers/${id}`));
      toast.success("Supplier deleted successfully!");
      fetchSuppliers();
    } catch (error) {
      console.error("Supplier delete failed:", error);
      toast.error("Failed to delete supplier!");
    }
  };

  // PAGINATION LOGIC
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentSuppliers = filteredSuppliers.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  return (
    <div className={styles.container}>
      <div className={styles.pageTop}>
        <div>
          <h1 className={styles.pageTitle}>Suppliers</h1>
          <p className={styles.pageSubtitle}>
            View and manage all your supplier information in one place.
          </p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() =>
            setModalConfig({ isOpen: true, type: "add", data: null })
          }
        >
          + Add Supplier
        </button>
      </div>

      {/* SEARCH */}
      <div className={styles.controls}>
        <div className={styles.searchCard}>
          <input
            type="text"
            placeholder="Search supplier name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />

          <button className={styles.searchBtn} onClick={handleFilter}>
            Search
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Address</th>
              <th>Company</th>
              <th>Delivery Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentSuppliers.length === 0 ? (
              <tr>
                <td colSpan="7" className={styles.emptyState}>
                  No suppliers found. Add a supplier or adjust your search.
                </td>
              </tr>
            ) : (
              currentSuppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.address}</td>
                  <td>{supplier.company}</td>
                  <td>{supplier.delivery_date}</td>
                  <td>{supplier.amount}</td>
                  <td>
                    <span
                      className={
                        supplier.status === "Active"
                          ? styles.active
                          : styles.deactive
                      }
                    >
                      {supplier.status}
                    </span>
                  </td>

                  <td className={styles.actionsCell}>
                    <button
                      className={styles.editBtn}
                      onClick={() =>
                        setModalConfig({
                          isOpen: true,
                          type: "edit",
                          data: supplier,
                        })
                      }
                    >
                      Edit
                    </button>

                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(supplier.id)}
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

      {/* MODAL */}
      {modalConfig.isOpen && (
        <SupplierModal
          config={modalConfig}
          onClose={() =>
            setModalConfig({ ...modalConfig, isOpen: false })
          }
          onSuccess={() => {
            fetchSuppliers();
            toast.success(
              modalConfig.type === "add"
                ? "Supplier added successfully!"
                : "Supplier updated successfully!"
            );
          }}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AllSuppliers;