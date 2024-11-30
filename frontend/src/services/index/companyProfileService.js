import axios from "axios";

const API_URL = "/api/v2/company-profile";

// Create a new company profile
export const createCompanyProfile = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred.",
    };
  }
};

// Fetch the existing company profile
export const getCompanyProfile = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred.",
    };
  }
};

// Update an existing company profile
export const updateCompanyProfile = async (formData) => {
  try {
    const response = await axios.put(API_URL, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred.",
    };
  }
};
