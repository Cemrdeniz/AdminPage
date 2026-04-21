import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { ref, get, remove } from "firebase/database";
import AddProductModal from "./AllProductsModal";
import styles from "./AllProducts.module.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchProducts = async () => {
    try {
      const snapshot = await get(ref(db, "products"));

      if (snapshot.exists()) {
        const data = snapshot.val();

        const productsArray = Object.entries(data).map(([id, val]) => ({
          id,
          ...val,
        }));

        const sorted = productsArray.sort(
          (a, b) => new Date(b.added_date) - new Date(a.added_date)
        );

        setProducts(sorted);
        setFilteredProducts(sorted);
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      toast.error("Products load error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilter = () => {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await remove(ref(db, `products/${id}`));
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" />

      <div className={styles.pageTop}>
        <div>
          <h1 className={styles.pageTitle}>Products</h1>
          <p className={styles.subtitle}>
            Manage your products, track stock levels, and organize your catalog easily.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className={styles.addBtn}>
          ＋ Add New Product
        </button>
      </div>

      {/* FILTER */}
      <div className={styles.header}>
        <div className={styles.filterSection}>
          <input
            type="text"
            placeholder="Product Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.input}
          />

          <button onClick={handleFilter} className={styles.filterBtn}>
            Filter
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product Info</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Suppliers</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.noResult}>
                  No products found
                </td>
              </tr>
            ) : (
              currentItems.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>{product.suppliers}</td>
                  <td>{product.price}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className={styles.deleteBtn}
                    >
                      🗑️
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
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={
              currentPage === i + 1 ? styles.activePage : styles.pageBtn
            }
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <AddProductModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            fetchProducts();
            toast.success("Product added");
          }}
        />
      )}
    </div>
  );
};

export default AllProducts;