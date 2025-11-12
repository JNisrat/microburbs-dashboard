import { useState } from "react";
import axios from "axios";

function App() {
  const [suburb, setSuburb] = useState("Belmont North");
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    setProperties([]);

    try {
      const res = await axios.get("http://localhost:8000/properties", {
        params: { suburb },
      });

      // ✅ The API returns data.results, not data.properties
      const results = res.data.results || [];
      setProperties(results);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch property data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>🏡 Microburbs Property Dashboard</h1>

      {/* Input for suburb search */}
      <div style={{ marginBottom: "20px" }}>
        <input
          value={suburb}
          onChange={(e) => setSuburb(e.target.value)}
          placeholder="Enter suburb name"
          style={{
            padding: "10px",
            width: "250px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={fetchData}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {loading && <p>Loading properties...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && properties.length > 0 && (
        <table
          border="1"
          cellPadding="10"
          style={{
            marginTop: "20px",
            borderCollapse: "collapse",
            width: "100%",
          }}
        >
          <thead style={{ backgroundColor: "#f5f5f5" }}>
            <tr>
              <th>Address</th>
              <th>Bedrooms</th>
              <th>Bathrooms</th>
              <th>Garage</th>
              <th>Land Size</th>
              <th>Price (AUD)</th>
              <th>Listed On</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p, index) => (
              <tr key={index}>
                <td>
                  {p.address.street}, {p.address.sal}, {p.address.state}
                </td>
                <td>{p.attributes.bedrooms}</td>
                <td>{p.attributes.bathrooms}</td>
                <td>{p.attributes.garage_spaces}</td>
                <td>{p.attributes.land_size}</td>
                <td>{p.price ? p.price.toLocaleString() : "N/A"}</td>
                <td>{p.listing_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && properties.length === 0 && (
        <p>No properties found for "{suburb}".</p>
      )}
    </div>
  );
}

export default App;
