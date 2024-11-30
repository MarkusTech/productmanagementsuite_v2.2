import axios from "axios";

const API_URL = "/api/v1/adjustment-type";

export const fetchAdjustmentTypes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching adjustment types:", error);
    throw error;
  }
};

export const createAdjustmentType = async (adjustmentTypeData) => {
  try {
    const response = await axios.post(API_URL, adjustmentTypeData);
    return response.data; // Assuming the API response will contain the created data
  } catch (error) {
    console.error("Error creating adjustment type:", error);
    throw error;
  }
};
