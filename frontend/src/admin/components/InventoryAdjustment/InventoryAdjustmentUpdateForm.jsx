import React, { useEffect, useState } from "react";
import {
  fetchInventoryAdjustmentById,
  updateInventoryAdjustment,
} from "../../../services/inventory/inventoryAdjustmentService";
import { TextField, Button, Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

const InventoryAdjustmentUpdateForm = ({
  adjustmentId,
  onAdjustmentUpdated,
  closeForm,
}) => {
  const [formData, setFormData] = useState({
    inventoryID: "",
    adjustmentReasonID: "",
    quantityAdjusted: "",
    status: "Pending",
    modifiedByID: 1,
  });
  const [error, setError] = useState(null);

  // Fetch the adjustment data when the component mounts
  useEffect(() => {
    const fetchAdjustment = async () => {
      try {
        const response = await fetchInventoryAdjustmentById(adjustmentId);
        if (response.success) {
          setFormData(response.data);
        } else {
          setError("Failed to fetch adjustment data.");
        }
      } catch (err) {
        setError("An error occurred while fetching the adjustment.");
      }
    };

    fetchAdjustment();
  }, [adjustmentId]);

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
      const response = await updateInventoryAdjustment(adjustmentId, formData);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Adjustment Updated!",
          text: "The inventory adjustment has been successfully updated.",
          confirmButtonText: "Okay",
        });
        onAdjustmentUpdated();
        closeForm();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || "An unknown error occurred while updating.");
    }
  };

  return (
    <div style={styles.formContainer}>
      <IconButton style={styles.closeButton} onClick={closeForm}>
        <CloseIcon />
      </IconButton>

      <h1
        style={{ marginTop: "20px", fontWeight: "bold", textAlign: "center" }}
      >
        Update Inventory Adjustment
      </h1>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Inventory ID"
              name="inventoryID"
              value={formData.inventoryID}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Adjustment Reason ID"
              name="adjustmentReasonID"
              value={formData.adjustmentReasonID}
              onChange={handleChange}
              required
              fullWidth
            />
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
          {/* <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                labelId="status-label"
                label="Status"
                required
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid> */}
          <Grid item xs={12}>
            <Grid container justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Update Adjustment
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

export default InventoryAdjustmentUpdateForm;
