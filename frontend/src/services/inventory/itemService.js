import axios from "axios";

export const fetchItems = async () => {
  try {
    const response = await axios.get(`/api/v1/items`);
    return response.data.data;
  } catch (error) {
    throw new Error("Error fetching items: " + error.message);
  }
};

export const createItem = async (itemData) => {
  try {
    // const response = await axios.post(`${API_URL}/api/v1/items`, itemData);
    const response = await axios.post(`/api/v1/item-inventory`, itemData);
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

// Update an item by ID
export const updateItem = async (itemID, itemData) => {
  try {
    const response = await axios.put(`/api/v1/items/${itemID}`, itemData);
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

// Fetch a single item by ID
export const fetchItemByID = async (itemID) => {
  try {
    const response = await axios.get(`/api/v1/items/${itemID}`);
    return response.data.data;
  } catch (error) {
    throw new Error("Error fetching item by ID: " + error.message);
  }
};

// Fetch item images by item ID
export const fetchItemImagesByID = async (itemID) => {
  try {
    const response = await axios.get(`/api/v1/items/${itemID}`);
    return response.data.data; // Assuming the backend response is structured with 'data' field
  } catch (err) {
    console.error("Error fetching item images by ID:", err);
    throw err; // Rethrow the error to be handled in the component
  }
};
