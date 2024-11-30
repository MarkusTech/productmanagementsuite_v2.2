import React, { useState } from "react";
import { createPurchaseOrderItem } from "../../../services/purchaseOrder/poItemService";
import { TextField, Button, Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

const PurchaseOrderItemCreateForm = ({
  onPurchaseOrderItemCreated,
  closeForm,
}) => {
  const [formData, setFormData] = useState({
    poID: "",
    itemID: "",
    uom: "",
    unitCost: "",
    orderQty: "",
    createdByID: 1, // Adjust based on authentication or default
    modifiedByID: 1, // Adjust as needed
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
      const response = await createPurchaseOrderItem(formData);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Purchase Order Item Created!",
          text: "The new item has been successfully created.",
        });
        onPurchaseOrderItemCreated();
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
        Create Purchase Order Item
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
              label="Item ID"
              name="itemID"
              value={formData.itemID}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Unit of Measurement"
              name="uom"
              value={formData.uom}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Unit Cost"
              name="unitCost"
              value={formData.unitCost}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Order Quantity"
              name="orderQty"
              value={formData.orderQty}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={styles.submitButton}
                fullWidth // Add fullWidth prop here
              >
                Create Receiving Item
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
  submitButton: {
    backgroundColor: "#3f51b5",
  },
};

export default PurchaseOrderItemCreateForm;
