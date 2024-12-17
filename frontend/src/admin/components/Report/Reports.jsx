import React, { useEffect, useState } from "react";
import { FaDollarSign, FaBox, FaChartLine, FaRegClock } from "react-icons/fa";

const Reports = () => {
  // Dummy Data
  const [salesData, setSalesData] = useState({
    totalSales: 25000, // Total sales amount in pesos
    totalItemsSold: 120, // Number of items sold
    topSellingItems: [
      { name: "Item A", sold: 50, totalRevenue: 5000 },
      { name: "Item B", sold: 30, totalRevenue: 6000 },
      { name: "Item C", sold: 20, totalRevenue: 4000 },
      { name: "Item D", sold: 10, totalRevenue: 2500 },
      { name: "Item E", sold: 10, totalRevenue: 2500 },
    ],
    lowStockItems: [
      { name: "Item X", stock: 5, reorderLevel: 10 },
      { name: "Item Y", stock: 2, reorderLevel: 5 },
    ],
    totalPurchases: 15000, // Total amount spent on inventory purchases
    profit: 5000, // Profit from sales
  });

  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState("Day");

  useEffect(() => {
    const fetchSalesData = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    };

    fetchSalesData();
  }, []);

  return (
    <div className="table-container">
      <div style={styles.formContainer}>
        <header style={styles.header}>
          <h1 style={styles.title}>Inventory System Daily Report</h1>
          <p style={styles.subtitle}>Date: {new Date().toLocaleDateString()}</p>
        </header>

        {loading ? (
          <div style={styles.loading}>
            <FaRegClock size={24} /> Loading daily sales data...
          </div>
        ) : (
          <div>
            {/* Report Selection */}
            <div style={styles.reportSelection}>
              <button
                style={styles.reportButton}
                onClick={() => setSelectedReport("Day")}
              >
                Daily Report
              </button>
              <button
                style={styles.reportButton}
                onClick={() => setSelectedReport("Week")}
              >
                Weekly Report
              </button>
              <button
                style={styles.reportButton}
                onClick={() => setSelectedReport("Month")}
              >
                Monthly Report
              </button>
            </div>

            {/* Report Grid (Total Sales, Items Sold, Purchases, Profit) */}
            <div style={styles.gridContainer}>
              {/* Total Sales */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Total Sales</h3>
                <div style={styles.cardContent}>
                  <FaDollarSign size={40} color="#28a745" />
                  <div>
                    <h4 style={styles.cardAmount}>
                      ₱{salesData.totalSales.toLocaleString()}
                    </h4>
                    <p style={styles.cardSubtitle}>
                      Sales for this {selectedReport}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Items Sold */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Total Items Sold</h3>
                <div style={styles.cardContent}>
                  <FaBox size={40} color="#007bff" />
                  <div>
                    <h4 style={styles.cardAmount}>
                      {salesData.totalItemsSold} items
                    </h4>
                    <p style={styles.cardSubtitle}>
                      Items sold during this {selectedReport}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Purchases */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Total Purchases</h3>
                <div style={styles.cardContent}>
                  <FaDollarSign size={40} color="#dc3545" />
                  <div>
                    <h4 style={styles.cardAmount}>
                      ₱{salesData.totalPurchases.toLocaleString()}
                    </h4>
                    <p style={styles.cardSubtitle}>
                      Inventory purchases during this {selectedReport}
                    </p>
                  </div>
                </div>
              </div>

              {/* Profit */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>
                  Profit for the {selectedReport}
                </h3>
                <div style={styles.cardContent}>
                  <FaChartLine size={40} color="#28a745" />
                  <div>
                    <h4 style={styles.cardAmount}>
                      ₱{salesData.profit.toLocaleString()}
                    </h4>
                    <p style={styles.cardSubtitle}>
                      Profit from sales during this {selectedReport}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <br />
            <br />
            {/* Top 5 Best-Selling Items and Low Stock Items */}
            <div style={styles.reportContent}>
              {/* Top 5 Best-Selling Items */}
              <section style={styles.tableSection}>
                <div style={styles.tableCard}>
                  <h3 style={styles.tableTitle}>Top 5 Best-Selling Items</h3>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th>Item Name</th>
                        <th>Quantity Sold</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData.topSellingItems.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.sold}</td>
                          <td>₱{item.totalRevenue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Low Stock Items */}
              <section style={styles.tableSection}>
                <div style={styles.tableCard}>
                  <h3 style={styles.tableTitle}>Low Stock Items</h3>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th>Item Name</th>
                        <th>Stock Level</th>
                        <th>Reorder Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData.lowStockItems.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.stock}</td>
                          <td>{item.reorderLevel}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    padding: "30px", // Add padding to the outer container
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    margin: "0 auto",
    maxWidth: "1200px", // Limit width for larger screens
  },
  formContainer: {
    padding: "20px", // Padding around the form container
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#007bff",
    padding: "0 10px", // Padding for title
  },
  subtitle: {
    fontSize: "16px",
    color: "#6c757d",
    padding: "0 10px", // Padding for subtitle
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    color: "#6c757d",
  },
  reportSelection: {
    textAlign: "center",
    marginBottom: "20px",
  },
  reportButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    margin: "0 10px",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", // Responsive grid
    gap: "30px",
    justifyItems: "center",
    padding: "20px", // Padding inside grid container
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "300px",
    textAlign: "center",
    paddingTop: "20px", // Add padding to card top
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  cardContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  cardAmount: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#28a745",
  },
  cardSubtitle: {
    fontSize: "16px",
    color: "#6c757d",
  },
  reportContent: {
    display: "flex",
    gap: "30px", // Space between sections
    justifyContent: "space-between",
    flexWrap: "wrap",
    padding: "20px", // Padding inside the report content area
  },
  tableSection: {
    flex: 1,
    minWidth: "45%",
  },
  tableCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  tableTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "15px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    padding: "10px", // Padding inside table cells
  },
};

export default Reports;
