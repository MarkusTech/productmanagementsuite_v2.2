import React, { useState, useEffect } from "react";
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
import axios from "axios"; // For API calls

const CustomerEditForm = ({ customerID, onClose, onCustomerUpdated }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    contactNo: "",
    address: "",
    email: "",
    customerTypeID: "", // Customer Type ID
    createdByID: 1,
    modifiedByID: null,
  });

  const [error, setError] = useState(null);
  const [customerTypes, setCustomerTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch customer data based on customerID
  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const response = await axios.get(`/api/v2/customers/${customerID}`);
        if (response.data.success) {
          setFormData(response.data.data); // Pre-fill the form with customer data
        } else {
          setError("Failed to load customer data");
        }
      } catch (err) {
        setError("Error fetching customer data");
      }
    };

    loadCustomer();
  }, [customerID]);

  // Fetch customer types for selection
  useEffect(() => {
    const fetchCustomerTypes = async () => {
      try {
        const response = await axios.get("/api/v2/customer-types");
        if (response.data.success) {
          setCustomerTypes(response.data.data);
        } else {
          setError("Failed to load customer types");
        }
      } catch (err) {
        setError("Error fetching customer types");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerTypes();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission (update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/api/v2/customers/${customerID}`,
        formData
      );
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Customer Updated!",
          text: "The customer has been successfully updated.",
          confirmButtonText: "Okay",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });
        onCustomerUpdated();
        onClose();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(
        err.message || "An unknown error occurred while updating the customer."
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
        Edit Customer
      </h1>
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
              <InputLabel id="customer-type-label">Customer Type</InputLabel>
              <Select
                label="Customer Type"
                name="customerTypeID"
                value={formData.customerTypeID}
                onChange={handleChange}
                labelId="customer-type-label"
                required
              >
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
                Update Customer
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

export default CustomerEditForm;
