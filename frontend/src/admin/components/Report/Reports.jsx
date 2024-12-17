import React, { useEffect, useState } from "react";
import { FaDollarSign, FaBox, FaChartLine, FaRegClock } from "react-icons/fa";

const Reports = () => {
  // State for sales data
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    totalItemsSold: 0,
    totalPurchases: 0,
    totalProfit: 0, // Add totalProfit to the state
  });

  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState("Day");

  // Function to fetch sales data based on the selected report
  const fetchSalesData = async (reportType) => {
    setLoading(true);
    try {
      let url = "";
      if (reportType === "Day") {
        url = `http://localhost:5000/api/v3/sales-report/daily`;
      } else if (reportType === "Week") {
        url = `http://localhost:5000/api/v3/sales-report/weekly`;
      } else if (reportType === "Month") {
        url = `http://localhost:5000/api/v3/sales-report/monthly`;
      } else if (reportType === "Year") {
        url = `http://localhost:5000/api/v3/sales-report/annual`;
      }

      const response = await fetch(url);
      const data = await response.json();

      // Update the sales data state with the totals from the response
      setSalesData({
        totalSales: data.totals.totalSales,
        totalItemsSold: data.totals.totalItemsSold,
        totalPurchases: data.totals.totalPurchases,
        totalProfit: data.totals.totalProfit, // Add totalProfit from the response
      });
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the data whenever the selected report changes
  useEffect(() => {
    fetchSalesData(selectedReport);
  }, [selectedReport]);

  return (
    <div className="table-container">
      <div style={styles.formContainer}>
        <header style={styles.header}>
          <h1 style={styles.title}>Inventory System Reports</h1>
          <p style={styles.subtitle}>Date: {new Date().toLocaleDateString()}</p>
        </header>

        {loading ? (
          <div style={styles.loading}>
            <FaRegClock size={24} /> Loading {selectedReport} sales data...
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
              <button
                style={styles.reportButton}
                onClick={() => setSelectedReport("Year")}
              >
                Annual Report
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

              {/* Profit for the selected report */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>
                  Profit for the {selectedReport}
                </h3>
                <div style={styles.cardContent}>
                  <FaChartLine size={40} color="#28a745" />
                  <div>
                    <h4 style={styles.cardAmount}>
                      ₱{salesData.totalProfit.toLocaleString()}
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
            {/* Similar to the above section, you can map over data for best-selling items and low stock */}
          </div>
        )}
      </div>
    </div>
  );
};

// Styles (same as your existing styles)
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
    gap: "80px",
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
};

export default Reports;
