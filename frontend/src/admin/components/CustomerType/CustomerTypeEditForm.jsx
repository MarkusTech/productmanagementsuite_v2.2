import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

const CustomerTypeEditForm = ({
  customerTypeID,
  onClose,
  onCustomerTypeUpdated,
}) => {
  const [formData, setFormData] = useState({
    TypeName: "",
    description: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCustomerType = async () => {
      try {
        const response = await axios.get(
          `/api/v2/customer-types/${customerTypeID}`
        );
        if (response.data.success) {
          setFormData(response.data.data);
        } else {
          setError("Failed to load customer type data.");
        }
      } catch (err) {
        setError(
          err.message ||
            "An unknown error occurred while fetching the customer type."
        );
      }
    };

    if (customerTypeID) {
      loadCustomerType();
    }
  }, [customerTypeID]);

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
      const response = await axios.put(
        `/api/v2/customer-types/${customerTypeID}`,
        formData
      );
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Customer Type Updated!",
          text: "The customer type has been successfully updated.",
          confirmButtonText: "Okay",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });
        onCustomerTypeUpdated();
        onClose();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(
        err.message ||
          "An unknown error occurred while updating the customer type."
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
        Edit Customer Type
      </h1>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Customer Type Name"
              name="TypeName"
              value={formData.TypeName}
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
            <Grid container justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Update Customer Type
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

export default CustomerTypeEditForm;
