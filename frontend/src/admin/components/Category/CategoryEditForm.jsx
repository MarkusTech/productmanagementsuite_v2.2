import React, { useState, useEffect } from "react";
import {
  fetchCategoryById,
  updateCategory,
} from "../../../services/inventory/categoryService";
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

const CategoryEditForm = ({ categoryID, onClose, onCategoryUpdated }) => {
  const [formData, setFormData] = useState({
    categoryCode: "",
    categoryName: "",
    description: "",
    status: true,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const response = await fetchCategoryById(categoryID);
        if (response.success) {
          setFormData(response.data);
        }
      } catch (err) {
        setError(
          err.message ||
            "An unknown error occurred while fetching the category."
        );
      }
    };

    loadCategory();
  }, [categoryID]);

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
      const response = await updateCategory(categoryID, formData);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Category Updated!",
          text: "The category has been successfully updated.",
          confirmButtonText: "Okay",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });
        onCategoryUpdated();
        onClose();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(
        err.message || "An unknown error occurred while updating the category."
      );
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
        Edit Category
      </h1>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Category Code"
              name="categoryCode"
              value={formData.categoryCode}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Category Name"
              name="categoryName"
              value={formData.categoryName}
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
                Update Category
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

export default CategoryEditForm;
