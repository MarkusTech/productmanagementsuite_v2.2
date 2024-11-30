import React, { useEffect, useState } from "react";
import Table from "../Table";
import { fetchLocations } from "../../../services/inventory/locationService";
import LocationCreateForm from "./LocationCreateForm";
import LocationEditForm from "./LocationUpdateForm";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const locationTableHead = [
  "Location ID",
  "Location Name",
  "Description",
  "Status",
  "Action",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const LocationList = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editLocationID, setEditLocationID] = useState(null);

  const loadLocations = async () => {
    setLoading(true);
    try {
      const data = await fetchLocations();
      setLocations(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const handleLocationCreated = () => {
    loadLocations();
    setShowCreateForm(false);
  };

  const handleEdit = (location) => {
    setEditLocationID(location.locationID);
    setShowEditForm(!showEditForm);
  };

  const handleEditFormClose = () => {
    handleCloseEditForm();
    setEditLocationID(null);
  };

  const handleLocationUpdated = () => {
    handleEditFormClose();
    loadLocations();
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.locationID}</td>
      <td>{item.locationName}</td>
      <td>{item.description}</td>
      <td
        style={{
          color: item.status ? "blue" : "red",
          fontWeight: "bold",
        }}
      >
        {item.status ? "Active" : "Inactive"}
      </td>
      <td>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleEdit(item)}
          startIcon={<EditIcon />}
        >
          Edit
        </Button>
      </td>
    </tr>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="table-container">
      <h3>LOCATION LIST</h3>
      <button
        className="create-form-btn"
        onClick={() => setShowCreateForm((prev) => !prev)}
      >
        + Create Location
      </button>
      <br />

      {showCreateForm && (
        <LocationCreateForm
          onLocationCreated={handleLocationCreated}
          closeForm={() => setShowCreateForm(false)}
        />
      )}

      {showEditForm && (
        <LocationEditForm
          locationID={editLocationID}
          closeForm={handleEditFormClose}
          onLocationUpdated={handleLocationUpdated}
        />
      )}

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                limit="10"
                headData={locationTableHead}
                renderHead={renderHead}
                bodyData={locations}
                renderBody={renderBody}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationList;
