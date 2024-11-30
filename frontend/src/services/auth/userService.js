import axios from "axios";

// Fetch all users
export const fetchUsers = async () => {
  try {
    const response = await axios.get("/api/v1/users");
    return response.data.data;
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

// Create user
export const createUser = async (userData) => {
  try {
    const response = await axios.post("/api/v1/users", userData);
    return response.data;
  } catch (error) {
    throw new Error("Error creating user: " + error.message);
  }
};

// Fetch user by ID
export const fetchUserByID = async (userID) => {
  try {
    const response = await axios.get(`/api/v1/users/${userID}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching user.");
  }
};

// Update user by ID
export const updateUser = async (userID, userData) => {
  try {
    const response = await axios.put(`/api/v1/users/${userID}`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error updating user.");
  }
};

// Fetch all user roles
export const fetchUserRoles = async () => {
  try {
    const response = await axios.get("/api/v1/user-role");
    return response.data.data;
  } catch (error) {
    throw new Error("Error fetching user roles: " + error.message);
  }
};
