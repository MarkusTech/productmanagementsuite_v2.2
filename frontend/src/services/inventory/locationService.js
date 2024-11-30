import axios from "axios";

const API_URL = "/api/v1/locations";

// Fetch all locations
export const fetchLocations = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
};

// Fetch a location by ID
export const fetchLocationByID = async (locationID) => {
  try {
    const response = await axios.get(`${API_URL}/${locationID}`);
    return response.data.data; // Adjust according to your API response structure
  } catch (error) {
    console.error("Error fetching location:", error);
    throw error;
  }
};

// Create a new location
export const createLocation = async (locationData) => {
  try {
    const response = await axios.post(API_URL, locationData);
    return response.data; // Assuming the response has a success message or data
  } catch (error) {
    console.error("Error creating location:", error);
    throw error; // Rethrow to handle it in the component
  }
};

// Update a location by ID
export const updateLocation = async (locationID, locationData) => {
  try {
    const response = await axios.put(`${API_URL}/${locationID}`, locationData);
    return response.data; // Assuming the response has a success message or data
  } catch (error) {
    console.error("Error updating location:", error);
    throw error; // Rethrow to handle it in the component
  }
};
