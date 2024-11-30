import React, { useEffect, useState } from "react";
import {
  fetchItemByID,
  updateItem,
} from "../../../services/inventory/itemService";
import { fetchCategories } from "../../../services/inventory/categoryService";
import {
  TextField,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

const ItemEditForm = ({ itemID, onClose, onItemUpdated }) => {
  const [formData, setFormData] = useState({
    itemCode: "",
    itemName: "",
    categoryID: 0,
    barcode: "",
    description: "",
    grams: 0,
    uom: "",
    price: 0.0,
    cost: 0.0,
    status: true,
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  // Fetch categories for the dropdown
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryList = await fetchCategories();
        setCategories(categoryList);
      } catch (err) {
        setError("Error loading categories.");
      }
    };
    loadCategories();
  }, []);

  // Fetch item data by ID
  useEffect(() => {
    const loadItem = async () => {
      try {
        const item = await fetchItemByID(itemID);
        if (item) {
          setFormData(item);
        }
      } catch (err) {
        setError("Error loading item data.");
      }
    };
    loadItem();
  }, [itemID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "categoryID"
          ? parseInt(value, 10)
          : name === "grams" || name === "price" || name === "cost"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateItem(itemID, formData);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Item Updated!",
          text: "The item has been successfully updated.",
          confirmButtonText: "Okay",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });
        onItemUpdated();
        onClose(); // Close the form after updating
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Error updating the item.");
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
        Edit Item
      </h1>
      <br />
      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Item Code"
              name="itemCode"
              value={formData.itemCode}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Item Name"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth required>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="categoryID"
                name="categoryID"
                value={formData.categoryID}
                onChange={handleChange}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category.categoryID}
                    value={category.categoryID}
                  >
                    {category.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Barcode"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Grams"
              name="grams"
              value={formData.grams}
              onChange={handleChange}
              type="number"
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth required>
              <InputLabel id="uom-label">UOM</InputLabel>
              <Select
                labelId="uom-label"
                id="uom"
                name="uom"
                value={formData.uom}
                onChange={handleChange}
                label="UOM"
              >
                <MenuItem value="PCS">PCS</MenuItem>
                <MenuItem value="PAIR">PAIR</MenuItem>
                <MenuItem value="BULK">BULK</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              type="number"
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Cost"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              type="number"
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
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
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Update Item
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

// Styles for the form and close button
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

export default ItemEditForm;
