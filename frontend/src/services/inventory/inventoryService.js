import axios from "axios";

const API_URL = "/api/v1/inventory";
const API_BASE_URL = "/api/v1";

export const fetchInventories = async (filters) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();

    const response = await axios.get(`${API_URL}?${queryParams}`);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching inventories:", error);
    throw error;
  }
};

// Fetches a specific inventory by ID
export const fetchInventoryById = async (inventoryId) => {
  try {
    const response = await axios.get(`${API_URL}/${inventoryId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching inventory with ID ${inventoryId}:`, error);
    throw error;
  }
};

// Creates a new inventory item
export const createInventory = async (inventoryData) => {
  try {
    const response = await axios.post(API_URL, inventoryData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error creating inventory:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

// Updates an inventory item by ID
export const updateInventory = async (inventoryId, inventoryData) => {
  try {
    const response = await axios.put(
      `${API_URL}/${inventoryId}`,
      inventoryData
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`Error updating inventory with ID ${inventoryId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const fetchInventoryTypes = async () => {
  const response = await axios.get(`${API_BASE_URL}/inventory-type`);
  return response.data.data;
};

export const fetchLocations = async () => {
  const response = await axios.get(`${API_BASE_URL}/locations`);
  return response.data.data;
};

export const fetchItems = async () => {
  const response = await axios.get(`${API_BASE_URL}/items`);
  return response.data.data;
};
