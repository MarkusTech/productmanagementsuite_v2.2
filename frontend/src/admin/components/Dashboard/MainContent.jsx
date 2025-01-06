import React, { useEffect, useState } from "react";
import Customers from "../Customers";
import axios from "axios";

const MainContent = ({ isDarkMode }) => {
  const [totalSales, setTotalSales] = useState(0);
  const [completedSalesCount, setCompletedSalesCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

  // Fetch total sales from API
  useEffect(() => {
    const fetchTotalSales = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v3/total-sales"
        );
        if (response.data.success) {
          setTotalSales(response.data.data.totalSales);
        } else {
          console.error("Failed to fetch total sales:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching total sales:", error);
      }
    };

    fetchTotalSales();
  }, []);

  // Fetch paid orders count from API
  useEffect(() => {
    const fetchCompletedSalesCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v3/paid-orders"
        );
        if (response.data.success) {
          setCompletedSalesCount(response.data.data.completedSalesCount); // Update with fetched count
        } else {
          console.error(
            "Failed to fetch completed sales count:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error fetching completed sales count:", error);
      }
    };

    fetchCompletedSalesCount();
  }, []);

  // Fetch recent orders from the API
  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v3/sales-summary"
        );
        if (response.data.success) {
          setRecentOrders(response.data.data); // Set the fetched recent orders
        } else {
          console.error(
            "Failed to fetch recent orders:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error fetching recent orders:", error);
      }
    };

    fetchRecentOrders();
  }, []);

  return (
    <main>
      <div className="header">
        <div className="left">
          <h1>Dashboard</h1>
          <ul className="breadcrumb">
            <li>
              <a href="/analytics">Analytics</a>
            </li>
            <li>
              <a href="/shop" className="active">
                Shop
              </a>
            </li>
          </ul>
        </div>
        <a href="/report" className="report">
          <i className="bx bx-cloud-download"></i>
          <span>Download CSV</span>
        </a>
      </div>

      <ul className="insights">
        <li>
          <i className="bx bx-calendar-check"></i>
          <span className="info">
            <h3>{completedSalesCount.toLocaleString()}</h3>{" "}
            {/* Display completed sales count */}
            <p>Paid Order</p>
          </span>
        </li>
        <li>
          <i className="bx bx-show-alt"></i>
          <span className="info">
            <h3>3,944</h3>
            <p>Site Visit</p>
          </span>
        </li>
        <li>
          <i className="bx bx-line-chart"></i>
          <span className="info">
            <h3>14,721</h3>
            <p>Searches</p>
          </span>
        </li>
        <li>
          <i className="bx bx-dollar-circle"></i>
          <span className="info">
            <h3>₱{totalSales.toLocaleString()}</h3>
            <p>Total Sales</p>
          </span>
        </li>
      </ul>

      <div className="bottom-data">
        <div className="orders">
          <div className="orders">
            <div className="header">
              <i className="bx bx-receipt"></i>
              <h3>Recent Orders</h3>
              <i className="bx bx-filter"></i>
              <i className="bx bx-search"></i>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Order Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order, index) => (
                    <tr key={index}>
                      <td>
                        <p>{order.customerName}</p>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`status ${order.status.toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No recent orders available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="reminders">
          <div className="reminders">
            <div className="header">
              <i className="bx bx-note"></i>
              <h3>Reminders</h3>
              <i className="bx bx-filter"></i>
              <i className="bx bx-plus"></i>
            </div>
            <ul className="task-list">
              <li className="completed">
                <div className="task-title">
                  <i className="bx bx-check-circle"></i>
                  <p>Start Our Meeting</p>
                </div>
                <i className="bx bx-dots-vertical-rounded"></i>
              </li>
              <li className="completed">
                <div className="task-title">
                  <i className="bx bx-check-circle"></i>
                  <p>Analyse Our Site</p>
                </div>
                <i className="bx bx-dots-vertical-rounded"></i>
              </li>
              <li className="not-completed">
                <div className="task-title">
                  <i className="bx bx-x-circle"></i>
                  <p>Pending Transactions</p>
                </div>
                <i className="bx bx-dots-vertical-rounded"></i>
              </li>
            </ul>
          </div>
        </div>
        <div className="customer-dashboard">
          <Customers />
        </div>
      </div>
    </main>
  );
};

export default MainContent;
