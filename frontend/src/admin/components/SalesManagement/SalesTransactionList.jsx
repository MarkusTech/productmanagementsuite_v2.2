import React, { useState, useEffect } from "react";
import Table from "../Table";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SalesTransaction from "./SalesTransaction";
import axios from "axios";

// Table headers for Sales Transaction
const categoryTableHead = [
  "Sales Transaction ID",
  "Transaction Number",
  "Location",
  "Transaction Type",
  "Payment Type",
  "Total Items",
  "Total Quantity",
  "Total Purchase",
  "Transaction Date",
  "Status",
  "Action",
];

// Rendering table header
const renderHead = (item, index) => <th key={index}>{item}</th>;

const SalesTransactionList = () => {
  const [salesTransactions, setSalesTransactions] = useState([]);
  const [showSalesTransaction, setShowSalesTransaction] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchSalesTransactions = async () => {
      try {
        const result = await axios.get(
          "http://localhost:5000/api/v3/transaction"
        );

        // Check response format
        console.log(result.data); // Log the full response for debugging
        const transactionSuccess = result.data.success;
        const transactionData = result.data.data;

        if (transactionSuccess) {
          setSalesTransactions(transactionData);
        } else {
          setError("Failed to fetch sales transactions");
        }
      } catch (error) {
        setError("Error fetching sales transactions");
        console.error("Error fetching sales transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesTransactions();
  }, []);

  const showSalesTransactionbutton = () => {
    setShowSalesTransaction(!showSalesTransaction);
  };

  const closeForm = () => {
    setShowSalesTransaction(false); // Close the form
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.salesTransactionID}</td>
      <td>{item.transactionNumber}</td>
      <td>{item.location?.locationName}</td>
      <td>{item.transactionType?.transactionName}</td>
      <td>{item.paymentType?.paymentName}</td>
      <td>{item.totalItems}</td>
      <td>{item.totalQuantity}</td>
      <td>
        ₱
        {item.totalPurchase?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </td>
      <td>{new Date(item.transactionDate).toLocaleString()}</td>
      <td
        style={{
          color: item.status === "COMPLETED" ? "blue" : "orange",
          fontWeight: "bold",
        }}
      >
        {item.status}
      </td>
      <td>
        <Button variant="contained" color="primary" startIcon={<EditIcon />}>
          Edit
        </Button>
      </td>
    </tr>
  );

  return (
    <div>
      <h3>SALES TRANSACTION LIST</h3>
      <div className="button-container">
        <button
          className="create-form-btn"
          onClick={showSalesTransactionbutton}
        >
          + Create Sales Transaction
        </button>
      </div>

      <div className="table-container">
        {loading && <p>Loading sales transactions...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && salesTransactions.length === 0 && (
          <p>No sales transactions available.</p>
        )}

        {!loading && !error && salesTransactions.length > 0 && (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card__body">
                  <Table
                    limit="10"
                    headData={categoryTableHead}
                    renderHead={renderHead}
                    bodyData={salesTransactions}
                    renderBody={renderBody}
                    tableClass="table"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {showSalesTransaction && <SalesTransaction closeForm={closeForm} />}
      </div>

      <style>{`
        .button-container {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 10px;
          margin-bottom: 10px;
        }

        .create-form-btn {
          padding: 10px 20px;
          font-size: 14px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .create-form-btn:hover {
          background-color: #0056b3;
        }

        h3 {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default SalesTransactionList;
