import { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import { ref, push, set, update } from "firebase/database";
import styles from "./SupplierModal.module.css";

import closeIcon from "../../assets/cross.svg";

const SupplierModal = ({ config, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    company: "",
    delivery_date: "",
    amount: "",
    status: "Active",
  });

  useEffect(() => {
    if (config.type === "edit" && config.data) {
      setFormData(config.data);
    }
  }, [config]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (config.type === "add") {
        const newRef = push(ref(db, "suppliers"));
        await set(newRef, formData);
      } else {
        await update(ref(db, `suppliers/${config.data.id}`), formData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      alert("İşlem başarısız.");
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <div className={styles.modalHeader}>
          <div>
            <h2>
              {config.type === "add"
                ? "Add New Supplier"
                : "Edit Supplier"}
            </h2>
            <p>
              {config.type === "add"
                ? "Add supplier details and save directly to Firebase."
                : "Update supplier information and save changes."}
            </p>
          </div>

          {/* ❌ CROSS BUTTON */}
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
          >
            <img src={closeIcon} alt="close" />
          </button>
        </div>

        {/* BODY */}
        <div className={styles.modalBody}>
          <form className={styles.formGrid} onSubmit={handleSubmit}>
            <input
              placeholder="Supplier name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <input
              placeholder="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
            />

            <input
              placeholder="Company"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              required
            />

            <input
              type="date"
              value={formData.delivery_date}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  delivery_date: e.target.value,
                })
              }
              required
            />

            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
            />

            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Deactive">Deactive</option>
            </select>

            <div className={styles.actions}>
              <button type="submit" className={styles.primaryBtn}>
                {config.type === "add" ? "Add" : "Save"}
              </button>

              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default SupplierModal;