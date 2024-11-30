import React, { useState } from "react";
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
      const response = await axios.post(
        "/api/v2/company-profile",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure this is set for file uploads
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Company Profile Created!",
          text: "The company profile has been successfully created.",
          confirmButtonText: "Okay",
        });
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ marginTop: "20px", padding: "20px" }}>
      <h1>Create Company Profile</h1>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <div
              style={{
                border: "1px dashed #ccc",
                padding: "10px",
                textAlign: "center",
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "100%", maxHeight: "200px" }}
                />
              ) : (
                <p>No Image Selected</p>
              )}
            </div>
            <input
              type="file"
              name="image_url"
              onChange={handleFileChange}
              style={{ marginTop: "10px", width: "100%" }}
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Registration Number"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Company Email"
              name="companyEmail"
              value={formData.companyEmail}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Company Phone"
              name="companyPhone"
              value={formData.companyPhone}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Secondary Phone"
              name="companyPhoneSecondary"
              value={formData.companyPhoneSecondary}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Company Address"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Tax Details"
              name="taxDetails"
              value={formData.taxDetails}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: "20px" }}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default CompanyProfileCreateForm;
