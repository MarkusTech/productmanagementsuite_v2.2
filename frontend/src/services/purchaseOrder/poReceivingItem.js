import axios from "axios";

export const fetchPoReceivingItems = async () => {
  try {
    const response = await axios.get("/api/v2/po-receiving-items");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching purchase receiving items:", error);
    throw error;
  }
};

export const createPoReceivingItem = async (poReceivingItemData) => {
  try {
    const response = await axios.post(
      "/api/v2/po-receiving-items",
      poReceivingItemData
    );
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
