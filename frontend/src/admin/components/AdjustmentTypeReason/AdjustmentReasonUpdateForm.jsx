import React, { useState, useEffect } from "react";
import {
  fetchAdjustmentReasonById,
  updateAdjustmentReason,
} from "../../../services/inventory/adjustmentReasonService";
import { TextField, Button, Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

const AdjustmentReasonUpdateForm = ({
  adjustmentReasonID,
  onAdjustmentReasonUpdated,
  closeForm,
}) => {
  const [formData, setFormData] = useState({
    reasonName: "",
    description: "",
    modifiedByID: 1, // Adjust as necessary
  });

  const [error, setError] = useState(null);

  // Fetch adjustment reason details when the component mounts
  useEffect(() => {
    const fetchAdjustmentReason = async () => {
      try {
        const data = await fetchAdjustmentReasonById(adjustmentReasonID);
        setFormData({
          reasonName: data.reasonName,
          description: data.description,
          modifiedByID: 1, // Adjust as necessary
        });
      } catch (err) {
        setError(
          err.message ||
            "An error occurred while fetching the adjustment reason."
        );
      }
    };

    fetchAdjustmentReason();
  }, [adjustmentReasonID]);

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
      const response = await updateAdjustmentReason(
        adjustmentReasonID,
        formData
      );
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Adjustment Reason Updated!",
          text: "The adjustment reason has been successfully updated.",
          confirmButtonText: "Okay",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });
        onAdjustmentReasonUpdated();
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
        Update Adjustment Reason
      </h1>
      <br />
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Reason Name"
              name="reasonName"
              value={formData.reasonName}
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
              required
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
                style={styles.submitButton}
              >
                Update Adjustment Reason
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
    width: "100%", // Set the width to 100% to make it full width
    marginTop: "20px", // Add some margin if needed
  },
};

export default AdjustmentReasonUpdateForm;
