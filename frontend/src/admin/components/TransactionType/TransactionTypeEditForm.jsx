import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

const TransactionTypeEditForm = ({
  transactionTypeID,
  onClose,
  onTransactionTypeUpdated,
}) => {
  const [formData, setFormData] = useState({
    transactionName: "",
    description: "", // Add description to formData
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTransactionType = async () => {
      try {
        const response = await axios.get(
          `/api/v3/transaction/transaction-types/${transactionTypeID}`
        );
        if (response.data.success) {
          const { transactionName, description } = response.data.data;
          setFormData({ transactionName, description }); // Set both fields
        } else {
          setError("Failed to load transaction type data.");
        }
      } catch (err) {
        setError(
          err.message ||
            "An unknown error occurred while fetching the transaction type."
        );
      }
    };

    if (transactionTypeID) {
      loadTransactionType();
    }
  }, [transactionTypeID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/api/v3/transaction/transaction-types/${transactionTypeID}`,
        formData
      );
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Transaction Type Updated!",
          text: "The transaction type has been successfully updated.",
          confirmButtonText: "Okay",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });
        onTransactionTypeUpdated();
        onClose();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(
        err.message ||
          "An unknown error occurred while updating the transaction type."
      );
    }
  };

  return (
    <div style={styles.formContainer}>
      <IconButton style={styles.closeButton} onClick={onClose}>
        <CloseIcon />
      </IconButton>

      <h1
        style={{ marginTop: "20px", fontWeight: "bold", textAlign: "center" }}
      >
        Edit Transaction Type
      </h1>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Transaction Type Name"
              name="transactionName"
              value={formData.transactionName}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description" // New field for description
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4} // Makes it a larger input area
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Update Transaction Type
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

const styles = {
  formContainer: {
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
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
  },
};

export default TransactionTypeEditForm;
