import axios from "axios";

const API_URL = "/api/v1/inventory-adjustment";
const INVENTORY_URL = "/api/v1/inventory";
const ADJUSTMENT_TYPE_URL = "/api/v1/adjustment-type";
const ADJUSTMENT_REASON_URL = "/api/v1/adjustment-reason";

export const fetchInventoryAdjustments = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching inventory adjustments:", error);
    throw error;
  }
};

export const fetchInventoryAdjustmentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory adjustment:", error);
    throw error;
  }
};

export const createInventoryAdjustment = async (adjustmentData) => {
  try {
    const response = await axios.post(
      "/api/v1/inventory-adjustment",
      adjustmentData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating inventory adjustment:", error);
    throw error;
  }
};

export const updateInventoryAdjustment = async (id, adjustmentData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, adjustmentData);
    return response.data;
  } catch (error) {
    console.error("Error updating inventory adjustment:", error);
    throw error;
  }
};

// New service functions
export const fetchInventories = async () => {
  try {
    const response = await axios.get(INVENTORY_URL);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching inventories:", error);
    throw error;
  }
};

export const fetchAdjustmentTypes = async () => {
  try {
    const response = await axios.get(ADJUSTMENT_TYPE_URL);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching adjustment types:", error);
    throw error;
  }
};

export const fetchAdjustmentReasons = async () => {
  try {
    const response = await axios.get(ADJUSTMENT_REASON_URL);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching adjustment reasons:", error);
    throw error;
  }
};

const API_BASE_URL = "http://localhost:5000/api/v1/inventory-adjustment";

// Approve inventory adjustment
export const approveInventoryAdjustment = async (inventoryID, adjustmentID) => {
  const response = await fetch(
    `${API_BASE_URL}/${inventoryID}/approve/${adjustmentID}`,
    {
      method: "PUT", // Use PUT as per your backend route
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to approve adjustment");
  }

  return response.json();
};

// Decline inventory adjustment
export const declineInventoryAdjustment = async (adjustmentID) => {
  const response = await fetch(`${API_BASE_URL}/${adjustmentID}/decline`, {
    method: "PUT", // Use PUT as per your backend route
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to decline adjustment");
  }

  return response.json();
};
