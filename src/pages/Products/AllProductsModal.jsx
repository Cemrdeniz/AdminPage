import { useState } from "react";
import { db } from "../../services/firebase";
import { ref, push, set } from "firebase/database";
import styles from "./AllProductsModal.module.css";

import closeIcon from "../../assets/cross.svg";

const AddProductModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "Medicine",
    stock: "",
    suppliers: "",
    price: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRef = push(ref(db, "products"));

    await set(newRef, {
      ...formData,
      stock: Number(formData.stock),
      price: Number(formData.price),
      added_date: new Date().toISOString()
    });

    onSuccess();
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <div className={styles.header}>
          <h2>Add Product</h2>

          {/* SAĞ ÜST CLOSE BUTTON */}
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
          >
            <img src={closeIcon} alt="close" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <input
            placeholder="Stock"
            type="number"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
          />

          <input
            placeholder="Supplier"
            value={formData.suppliers}
            onChange={(e) =>
              setFormData({ ...formData, suppliers: e.target.value })
            }
          />

          <input
            placeholder="Price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />

          <div className={styles.actions}>
            <button type="submit" className={styles.addBtn}>
              Add
            </button>

            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddProductModal;