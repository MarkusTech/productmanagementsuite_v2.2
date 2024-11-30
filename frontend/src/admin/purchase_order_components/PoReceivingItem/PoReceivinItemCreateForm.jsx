import React, { useState } from "react";
import { createPoReceivingItem } from "../../../services/purchaseOrder/poReceivingItem";
import {
  TextField,
  Button,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

const PoReceivingItemCreateForm = ({ onItemCreated, closeForm }) => {
  const [formData, setFormData] = useState({
    itemID: "",
    uom: "",
    receivedQty: "",
    unitCost: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Parse itemID, receivedQty, and unitCost as integers
    const parsedValue =
      name === "itemID" || name === "receivedQty" || name === "unitCost"
        ? parseInt(value, 10)
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(parsedValue) ? value : parsedValue, // If parse fails, keep the original value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createPoReceivingItem(formData);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Item Created!",
          text: "The new item has been successfully created.",
        });
        onItemCreated();
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
        Create New Purchase Order Receiving Item
      </h1>
      <br />
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Item ID"
              name="itemID"
              value={formData.itemID}
              onChange={handleChange}
              required
              fullWidth
              type="number" // Set input type to number
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Unit Of Measurement (UOM)</InputLabel>
              <Select
                label="Unit Of Measurement (UOM)"
                name="uom"
                value={formData.uom}
                onChange={handleChange}
              >
                <MenuItem value="grams">grms</MenuItem>
                <MenuItem value="kg">kg</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Received Quantity"
              name="receivedQty"
              value={formData.receivedQty}
              onChange={handleChange}
              required
              fullWidth
              type="number" // Set input type to number
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
              type="number" // Set input type to number
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={styles.submitButton}
                fullWidth // Make the button full width
              >
                Create Item
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

export default PoReceivingItemCreateForm;
