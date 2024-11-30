import axios from "axios";

const API_URL = "/api/v1/inventory-type";

export const fetchInventoryTypes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching inventory types:", error);
    throw error;
  }
};

export const fetchInventoryTypeById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching inventory type with ID ${id}:`, error);
    throw error;
  }
};

export const createInventoryType = async (inventoryTypeData) => {
  try {
    const response = await axios.post(API_URL, inventoryTypeData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const updateInventoryType = async (id, inventoryTypeData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, inventoryTypeData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
