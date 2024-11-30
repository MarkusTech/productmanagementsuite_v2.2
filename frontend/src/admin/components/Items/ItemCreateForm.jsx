import React, { useState, useEffect } from "react";
import { createItem } from "../../../services/inventory/itemService";
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

const ItemCreateForm = ({ onItemCreated, closeForm }) => {
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
    createdByID: 1,
  });

  const [images, setImages] = useState([]); // To store multiple uploaded images
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryList = await fetchCategories();
        setCategories(categoryList);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "categoryID" || name === "createdByID"
          ? parseInt(value, 10)
          : name === "grams" || name === "price" || name === "cost"
          ? parseFloat(value)
          : value,
    }));
  };

  // Handling multiple file uploads
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to array
    setImages(selectedFiles); // Store all selected files in the state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    // Append form data fields
    form.append("itemCode", formData.itemCode);
    form.append("itemName", formData.itemName);
    form.append("categoryID", formData.categoryID);
    form.append("barcode", formData.barcode);
    form.append("description", formData.description);
    form.append("grams", formData.grams);
    form.append("uom", formData.uom);
    form.append("price", formData.price);
    form.append("cost", formData.cost);
    form.append("createdByID", formData.createdByID);

    // Append each image file
    images.forEach((image) => {
      form.append("images", image); // 'images' is the field name expected by multer in the backend
    });

    try {
      const response = await createItem(form); // Pass FormData to your service function
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Item Created!",
          text: "The item has been successfully created.",
          confirmButtonText: "Okay",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });
        onItemCreated(); // This will trigger the auto-refresh of the item list
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
      {/* Close Button */}
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
        Create New Item
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
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              multiple // Allow multiple files
            />
            {images.length > 0 && (
              <div>
                <h5>Selected Images:</h5>
                <ul>
                  {images.map((img, index) => (
                    <li key={index}>{img.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Create Item
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
    width: "700px",
    height: "550px",
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

export default ItemCreateForm;
