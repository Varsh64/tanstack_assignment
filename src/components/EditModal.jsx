import { useState, useEffect } from "react";
import { getCountries, updateTax } from "../services/api";

const EditModal = ({ data, onClose, refresh }) => {
  const [name, setName] = useState(data.name || "");
  const [country, setCountry] = useState(data.country || "");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await getCountries();
        setCountries(res.data);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      }
    };
    fetchCountries();
  }, []);

  const handleSave = async () => {
    try {
      await updateTax(data.id, { ...data, name, country });
      refresh();
      onClose();
    } catch (error) {
      console.error("Failed to update customer:", error);
    }
  };

  return (
    <div className="modal-bg">
      <div className="modal-card">
        <h3 style={{ fontWeight: 600, fontSize: "1.22rem", marginBottom: 18 }}>
          Edit Customer
        </h3>
        <div>
          <label>Name *</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter name"
            required
          />
        </div>
        <div>
          <label>Country</label>
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
          >
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "7px",
          paddingTop: "16px"
        }}>
          <button
            onClick={onClose}
            style={{
              background: "#f3f3f6",
              color: "#555",
              borderRadius: "7px",
              border: "none",
              padding: "8px 20px",
              fontWeight: 500,
              fontSize: "1rem",
              marginRight: "6px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
