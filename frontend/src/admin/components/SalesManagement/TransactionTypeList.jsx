import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

const TransactionTypeList = () => {
  const [transactionTypes, setTransactionTypes] = useState([]);

  // Fetch the transaction types from the API
  useEffect(() => {
    axios
      .get("/api/v3/transaction/transaction-types")
      .then((response) => {
        if (response.data.success) {
          setTransactionTypes(response.data.data);
        }
      })
      .catch((err) => {
        console.log("Error fetching transaction types:", err);
      });
  }, []);

  // Render table headers
  const renderHead = () => {
    return (
      <tr>
        <th>Transaction Type ID</th>
        <th>Transaction Name</th>
        <th>Action</th>
      </tr>
    );
  };

  // Render table body with transaction data
  const renderBody = () => {
    return transactionTypes.map((transaction) => (
      <tr key={transaction.transactionTypeID}>
        <td>{transaction.transactionTypeID}</td>
        <td>{transaction.transactionName}</td>
        <td>
          <Button variant="contained" color="primary">
            Edit
          </Button>
        </td>
      </tr>
    ));
  };

  return (
    <div style={styles.container}>
      <IconButton
        style={styles.closeButton}
        onClick={() => window.history.back()} // Close modal
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>

      <h3 style={{ textAlign: "center" }}>Transaction Type List</h3>
      <table style={styles.table}>
        <thead>{renderHead()}</thead>
        <tbody>{renderBody()}</tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    backgroundColor: "#fff",
    padding: "20px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    zIndex: 1000,
    overflow: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    backgroundColor: "#f4f4f4",
    padding: "10px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
  },
  td: {
    padding: "10px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  },
  button: {
    fontSize: "12px",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
  },
};

export default TransactionTypeList;
