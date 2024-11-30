import axios from "axios";

export const fetchSuppliers = async () => {
  try {
    const response = await axios.get("/api/v2/suppliers");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw error;
  }
};

export const createSupplier = async (supplierData) => {
  try {
    const response = await axios.post("/api/v2/suppliers", supplierData);
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
