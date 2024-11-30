import React, { useState } from "react";
import { createPoReceiving } from "../../../services/purchaseOrder/poReceiving";
import { TextField, Button, Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

const PoReceivingCreateForm = ({ onPoReceivingCreated, closeForm }) => {
  const [formData, setFormData] = useState({
    poID: "",
    referenceNumber: "",
    receivedDate: "",
    receivedByID: "",
    totalQty: "",
    totalCost: "",
    status: "",
  });

  const [error, setError] = useState(null);

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
      const response = await createPoReceiving(formData);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Purchase Order Receiving Created!",
          text: "The new purchase order receiving has been successfully created.",
        });
        onPoReceivingCreated();
        closeForm();
      } else {
        setError(response.message);
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
        Create New Purchase Order Receiving
      </h1>
      <br />
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Purchase Order ID"
              name="poID"
              value={formData.poID}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Reference Number"
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Received Date"
              name="receivedDate"
              type="date"
              value={formData.receivedDate}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }} // Keeps label above input when date is selected
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Received By ID"
              name="receivedByID"
              value={formData.receivedByID}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Total Quantity"
              name="totalQty"
              type="number"
              value={formData.totalQty}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Total Cost"
              name="totalCost"
              type="number"
              value={formData.totalCost}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ width: "100%", backgroundColor: "#3f51b5" }} // Full width button
            >
              Create Purchase Order Receiving
            </Button>
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

export default PoReceivingCreateForm;
