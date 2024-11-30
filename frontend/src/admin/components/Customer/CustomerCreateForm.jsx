import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import axios from "axios";

const CustomerCreateForm = ({ onCustomerCreated, closeForm }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    contactNo: "",
    address: "",
    email: "",
    customerTypeID: 0,
    createdByID: 1,
    modifiedByID: null,
  });

  const [error, setError] = useState(null);
  const [customerTypes, setCustomerTypes] = useState([]); // To hold customer types
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerTypes = async () => {
      try {
        const response = await axios.get("/api/v2/customer-types");
        if (response.data.success) {
          setCustomerTypes(response.data.data);
        } else {
          setError("Failed to fetch customer types");
        }
      } catch (err) {
        setError("Error fetching customer types");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerTypes();
  }, []);

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
      const response = await axios.post("/api/v2/customers", formData);

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Customer Created!",
          text: "The new customer has been successfully created.",
          confirmButtonText: "Okay",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });
        onCustomerCreated(); // Refresh the customer list
        closeForm(); // Close the form
      } else {
        setError(response.data.message);
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
        Create New Customer
      </h1>
      <br />
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Middle Name"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Contact No"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          {/* Customer Type Selection */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Customer Type</InputLabel>
              <Select
                label="Customer Type"
                name="customerTypeID"
                value={formData.customerTypeID}
                onChange={handleChange}
                required
              >
                {/* Render Customer Type options */}
                {loading ? (
                  <MenuItem value="">Loading...</MenuItem>
                ) : (
                  customerTypes.map((type) => (
                    <MenuItem
                      key={type.customerTypeID}
                      value={type.customerTypeID}
                    >
                      {type.TypeName}
                    </MenuItem>
                  ))
                )}
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
                Create Customer
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

export default CustomerCreateForm;
