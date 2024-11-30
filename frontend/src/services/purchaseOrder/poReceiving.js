import axios from "axios";

export const fetchPoReceiving = async () => {
  try {
    const response = await axios.get("/api/v2/po-receiving");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching purchase receiving data:", error);
    throw error;
  }
};

export const createPoReceiving = async (poReceivingData) => {
  try {
    const response = await axios.post("/api/v2/po-receiving", poReceivingData);
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
