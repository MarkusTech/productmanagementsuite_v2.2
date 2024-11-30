import React, { useState } from "react";
import { TextField, Button, Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import axios from "axios"; // For API call

const TransactionTypeCreateForm = ({ onTransactionTypeCreated, closeForm }) => {
  const [formData, setFormData] = useState({
    transactionName: "",
    description: "", // Description field is included here
    createdByID: 1, // Assuming you get this dynamically
    modifiedByID: null,
  });

  const [error, setError] = useState(null);

  // Handle change in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your actual API endpoint
      const response = await axios.post(
        "/api/v3/transaction/transaction-types",
        formData
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Transaction Type Created!",
          text: "The new transaction type has been successfully created.",
          confirmButtonText: "Okay",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });
        onTransactionTypeCreated(); // Refresh the list after creation
        closeForm(); // Close the form
      } else {
        setError(response.data.message); // Show error message if creation fails
      }
    } catch (err) {
      setError(err.message || "An unknown error occurred");
    }
  };

  return (
    <div style={styles.formContainer}>
      <IconButton
        style={styles.closeButton}
        onClick={closeForm}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>

      <h1
        style={{ marginTop: "20px", fontWeight: "bold", textAlign: "center" }}
      >
        Create New Transaction Type
      </h1>
      <br />
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
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4} // Allows multiple lines for the description
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
                Create Transaction Type
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

export default TransactionTypeCreateForm;
