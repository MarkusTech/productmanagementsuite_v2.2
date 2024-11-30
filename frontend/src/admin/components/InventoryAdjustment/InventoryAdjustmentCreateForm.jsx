import React, { useState, useEffect } from "react";
import {
  createInventoryAdjustment,
  fetchInventories,
  fetchAdjustmentReasons,
} from "../../../services/inventory/inventoryAdjustmentService";
import { TextField, Button, Grid, IconButton, MenuItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

const InventoryAdjustmentCreateForm = ({
  inventoryID,
  onAdjustmentCreated,
  closeForm,
}) => {
  const [formData, setFormData] = useState({
    inventoryID: inventoryID || 0,
    adjustmentTypeID: 1,
    adjustmentReasonID: 0,
    quantityAdjusted: 0,
    status: "Pending",
    createdByID: 1,
  });

  const [inventories, setInventories] = useState([]);
  const [adjustmentReasons, setAdjustmentReasons] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventoryData = await fetchInventories();
        const adjustmentReasonData = await fetchAdjustmentReasons();
        setInventories(inventoryData);
        setAdjustmentReasons(adjustmentReasonData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantityAdjusted" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createInventoryAdjustment(formData);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Adjustment Created!",
          text: "The new inventory adjustment has been successfully created.",
          confirmButtonText: "Okay",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });
        onAdjustmentCreated();
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
        Create New Inventory Adjustment
      </h1>
      <br />
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Inventory Item"
              name="inventoryID"
              value={
                inventories.find((inv) => inv.inventoryID === inventoryID)?.item
                  .itemName || "N/A"
              }
              fullWidth
              InputLabelProps={{
                style: {
                  color: "#000",
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Adjustment Reason"
              name="adjustmentReasonID"
              value={formData.adjustmentReasonID}
              onChange={handleChange}
              required
              fullWidth
              select
            >
              {adjustmentReasons.map((reason) => (
                <MenuItem
                  key={reason.adjustmentReasonID}
                  value={reason.adjustmentReasonID}
                >
                  {reason.reasonName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Quantity Adjusted"
              name="quantityAdjusted"
              type="number"
              value={formData.quantityAdjusted}
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
              select
            >
              <MenuItem value="Pending">Pending</MenuItem>
              {/* <MenuItem value="Completed">Completed</MenuItem> */}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={styles.submitButton}
              >
                Create Adjustment
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

export default InventoryAdjustmentCreateForm;
