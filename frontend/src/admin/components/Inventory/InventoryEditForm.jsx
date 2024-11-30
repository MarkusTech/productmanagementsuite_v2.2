import React, { useEffect, useState } from "react";
import {
  updateInventory,
  fetchInventoryById,
  fetchInventoryTypes,
  fetchLocations,
  fetchItems,
} from "../../../services/inventory/inventoryService";
import {
  TextField,
  Button,
  Grid,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

const InventoryEditForm = ({ inventoryId, onInventoryUpdated, closeForm }) => {
  const [formData, setFormData] = useState({
    inventoryTypeID: "",
    locationID: "",
    itemID: "",
    quantity: 0,
    reOrderThreshold: 0,
  });

  const [inventoryTypes, setInventoryTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching inventory details to populate the form
        const inventory = await fetchInventoryById(inventoryId);
        setFormData({
          inventoryTypeID: inventory.inventoryTypeID,
          locationID: inventory.locationID,
          itemID: inventory.itemID,
          quantity: inventory.quantity,
          reOrderThreshold: inventory.reOrderThreshold,
        });

        // Fetching data for dropdowns
        const types = await fetchInventoryTypes();
        setInventoryTypes(types);

        const locs = await fetchLocations();
        setLocations(locs);

        const itm = await fetchItems();
        setItems(itm);
      } catch (err) {
        setError("Failed to load data.");
      }
    };

    fetchData();
  }, [inventoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === "quantity" ? parseInt(value, 10) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calling the update service to update the inventory
      const response = await updateInventory(inventoryId, formData);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Inventory Updated!",
          text: "The inventory item has been successfully updated.",
          confirmButtonText: "Okay",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });
        onInventoryUpdated();
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
        Edit Inventory Item
      </h1>
      <br />
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth required variant="outlined">
              <InputLabel id="inventory-type-label">Inventory Type</InputLabel>
              <Select
                labelId="inventory-type-label"
                name="inventoryTypeID"
                value={formData.inventoryTypeID}
                onChange={handleChange}
                label="Inventory Type"
              >
                {inventoryTypes.map((type) => (
                  <MenuItem
                    key={type.inventoryTypeID}
                    value={type.inventoryTypeID}
                  >
                    {type.typeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required variant="outlined">
              <InputLabel id="location-label">Location</InputLabel>
              <Select
                labelId="location-label"
                name="locationID"
                value={formData.locationID}
                onChange={handleChange}
                label="Location"
              >
                {locations.map((loc) => (
                  <MenuItem key={loc.locationID} value={loc.locationID}>
                    {loc.locationName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required variant="outlined">
              <InputLabel id="item-label">Item</InputLabel>
              <Select
                labelId="item-label"
                name="itemID"
                value={formData.itemID}
                onChange={handleChange}
                label="Item"
              >
                {items.map((item) => (
                  <MenuItem key={item.itemID} value={item.itemID}>
                    {item.itemName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 0, step: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Re-Order Threshold"
              name="reOrderThreshold"
              type="number"
              value={formData.reOrderThreshold}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 0, step: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={styles.submitButton}
                fullWidth
              >
                Update Inventory Item
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

export default InventoryEditForm;
