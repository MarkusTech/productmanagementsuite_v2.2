import axios from "axios";

export const fetchPurchaseOrders = async () => {
  try {
    const response = await axios.get("/api/v2/purchase-orders");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    throw error;
  }
};

/**
 * Create a new purchase order along with its items
 * @param {Object} purchaseOrderData - The data for the purchase order and its items
 */
export const createPurchaseOrderAndItems = async (purchaseOrderData) => {
  try {
    const response = await axios.post(
      `/api/v2/po/purchase-order-items`,
      purchaseOrderData
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

export const fetchSuppliers = async () => {
  try {
    const response = await axios.get("/api/v2/suppliers");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw error;
  }
};

// Fetch all locations
export const fetchLocations = async () => {
  try {
    const response = await axios.get("/api/v1/locations");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
};

export const cancelPurchaseOrder = async (poID) => {
  try {
    const response = await axios.put(`/api/v2/purchaseOrders/${poID}/cancel`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to cancel purchase order");
  }
};
