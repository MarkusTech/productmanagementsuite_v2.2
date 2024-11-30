import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

const PaymentTypeEditForm = ({
  paymentTypeID,
  onClose,
  onPaymentTypeUpdated,
}) => {
  const [formData, setFormData] = useState({
    paymentName: "",
    description: "",
    createdByID: 1,
    modifiedByID: 1,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPaymentType = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v3/transaction/payment-types/${paymentTypeID}`
        );
        if (response.data.success) {
          setFormData({
            paymentName: response.data.data.paymentName,
            description: response.data.data.description, // Set the description value
          });
        } else {
          setError("Failed to load payment type data.");
        }
      } catch (err) {
        setError(
          err.message ||
            "An unknown error occurred while fetching the payment type."
        );
      }
    };

    if (paymentTypeID) {
      loadPaymentType();
    }
  }, [paymentTypeID]);

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
        `http://localhost:5000/api/v3/transaction/payment-types/${paymentTypeID}`,
        formData
      );
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Payment Type Updated!",
          text: "The payment type has been successfully updated.",
          confirmButtonText: "Okay",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });
        onPaymentTypeUpdated();
        onClose();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(
        err.message ||
          "An unknown error occurred while updating the payment type."
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
        Edit Payment Type
      </h1>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Payment Name"
              name="paymentName"
              value={formData.paymentName}
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
                Update Payment Type
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

export default PaymentTypeEditForm;
