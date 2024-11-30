import React, { useState, useEffect } from "react";
import {
  fetchInventoryTypeById,
  updateInventoryType,
} from "../../../services/inventory/inventoryTypeService";
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

const InventoryTypeUpdateForm = ({
  inventoryTypeID,
  onClose,
  onInventoryTypeUpdated,
}) => {
  const [formData, setFormData] = useState({
    typeName: "",
    description: "",
    status: true,
    modifiedByID: 1,
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInventoryType = async () => {
      try {
        const response = await fetchInventoryTypeById(inventoryTypeID);
        if (response) {
          setFormData({
            typeName: response.typeName,
            description: response.description,
            status: response.status,
            createdByID: response.createdByID || 1,
          });
        }
      } catch (err) {
        setError(
          err.message ||
            "An unknown error occurred while fetching the inventory type."
        );
      }
    };

    loadInventoryType();
  }, [inventoryTypeID]);

  // Handle input changes
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
      const response = await updateInventoryType(inventoryTypeID, formData);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Inventory Type Updated!",
          text: "The inventory type has been successfully updated.",
          confirmButtonText: "Okay",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });
        onInventoryTypeUpdated(); // Notify parent component to refresh data
        onClose(); // Close the form
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(
        err.message ||
          "An unknown error occurred while updating the inventory type."
      );
    }
  };

  return (
    <div style={styles.formContainer}>
      <IconButton
        style={styles.closeButton}
        onClick={onClose}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>

      <h1
        style={{ marginTop: "20px", fontWeight: "bold", textAlign: "center" }}
      >
        Update Inventory Type
      </h1>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Type Name"
              name="typeName"
              value={formData.typeName}
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
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
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
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Update Inventory Type
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

export default InventoryTypeUpdateForm;
