import React, { useState, useEffect } from "react";
import { TextField, Button, Grid } from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";

const CompanyProfileCreateForm = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    registrationNumber: "",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
    companyPhoneSecondary: "",
    taxDetails: "",
    createdByID: 1,
    image_url: null, // Store the image file here
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch the company profile when the component mounts
  useEffect(() => {
    axios
      .get("/api/v2/company-profile")
      .then((response) => {
        if (response.data.success && response.data.data) {
          const data = response.data.data;
          setFormData({
            companyName: data.companyName,
            registrationNumber: data.registrationNumber,
            companyAddress: data.companyAddress,
            companyEmail: data.companyEmail,
            companyPhone: data.companyPhone,
            companyPhoneSecondary: data.companyPhoneSecondary,
            taxDetails: data.taxDetails,
            createdByID: 1,
            image_url: null,
          });
          setImagePreview(data.image_url);
          setIsEditMode(true);
        }
      })
      .catch((err) => {
        console.log("Failed to fetch profile");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image_url: file,
    }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "image_url") {
        formDataToSend.append(key, formData[key]);
      } else if (formData[key]) {
        formDataToSend.append("image_url", formData[key]);
      }
    });

    try {
      let response;
      if (isEditMode) {
        response = await axios.put("/api/v2/company-profile", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // If it's a new profile, send a POST request
        response = await axios.post("/api/v2/company-profile", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Company Profile Saved!",
          text: "The company profile has been successfully saved.",
          confirmButtonText: "Okay",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "There was an error while saving the profile.",
          confirmButtonText: "Okay",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "success",
        title: "Company Profile updated",
        text: "There was an error while saving the profile.",
        confirmButtonText: "Okay",
        customClass: {
          confirmButton: "swal-confirm-button",
        },
      });
    }
  };

  return (
    <div style={styles.formContainer}>
      <h1
        style={{ marginTop: "20px", fontWeight: "bold", textAlign: "center" }}
      >
        {isEditMode ? "Edit Company Profile" : "Create Company Profile"}
      </h1>
      <br />

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* First Column: Image Preview */}
          <Grid item xs={12} sm={4}>
            <div style={styles.imagePreviewBox}>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={styles.imagePreview}
                />
              ) : (
                <div style={styles.placeholder}>No Image Selected</div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ marginTop: "10px", width: "100%" }}
            />
          </Grid>

          {/* Second and Third Columns: Text Fields */}
          <Grid item xs={12} sm={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Registration Number"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Company Email"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Company Phone"
                  name="companyPhone"
                  value={formData.companyPhone}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Secondary Phone"
                  name="companyPhoneSecondary"
                  value={formData.companyPhoneSecondary}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Tax Details"
                  name="taxDetails"
                  value={formData.taxDetails}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Company Address"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              {isEditMode ? "Update Profile" : "Save Profile"}
            </Button>
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
    width: "800px",
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
  imagePreviewBox: {
    width: "100%",
    height: "200px",
    border: "1px dashed #ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "8px",
  },
  imagePreview: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
  placeholder: {
    color: "#aaa",
    fontSize: "14px",
    textAlign: "center",
  },
};

export default CompanyProfileCreateForm;
