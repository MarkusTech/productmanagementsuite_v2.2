import axios from "axios";

const API_URL = "/api/v1/adjustment-reason";

// Fetch all adjustment reasons
export const fetchAdjustmentReasons = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching adjustment reasons:", error);
    throw error;
  }
};

// Fetch a specific adjustment reason by ID
export const fetchAdjustmentReasonById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.data; // Adjust as per your API response structure
  } catch (error) {
    console.error(`Error fetching adjustment reason with ID ${id}:`, error);
    throw error;
  }
};

// Create a new adjustment reason
export const createAdjustmentReason = async (reasonData) => {
  try {
    const response = await axios.post(API_URL, reasonData);
    return response.data;
  } catch (error) {
    console.error("Error creating adjustment reason:", error);
    throw error;
  }
};

// Update an existing adjustment reason by ID
export const updateAdjustmentReason = async (id, reasonData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, reasonData);
    return response.data;
  } catch (error) {
    console.error(`Error updating adjustment reason with ID ${id}:`, error);
    throw error;
  }
};
