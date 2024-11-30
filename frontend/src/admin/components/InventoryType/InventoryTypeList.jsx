import React, { useEffect, useState } from "react";
import Table from "../Table";
import { fetchInventoryTypes } from "../../../services/inventory/inventoryTypeService";
import InventoryTypeCreateForm from "./InventoryTypeCreateForm";
import InventoryTypeUpdateForm from "./InventoryTypeUpdateForm";
// import { Button } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";

const inventoryTypeTableHead = [
  "Inventory Type ID",
  "Inventory Type Name",
  "Description",
  "Status",
  // "Action",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const InventoryTypeList = () => {
  const [inventoryTypes, setInventoryTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editInventoryTypeID, setEditInventoryTypeID] = useState(null);

  const loadInventoryTypes = async () => {
    setLoading(true);
    try {
      const data = await fetchInventoryTypes();
      setInventoryTypes(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventoryTypes();
  }, []);

  const handleInventoryTypeCreated = () => {
    loadInventoryTypes();
    setShowCreateForm(false);
  };

  // const handleEdit = (inventoryType) => {
  //   setEditInventoryTypeID(inventoryType.inventoryTypeID);
  //   setShowEditForm(true);
  // };

  const handleEditFormClose = () => {
    setShowEditForm(false);
    setEditInventoryTypeID(null);
  };

  const handleInventoryTypeUpdated = () => {
    handleEditFormClose();
    loadInventoryTypes();
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.inventoryTypeID}</td>
      <td>{item.typeName}</td>
      <td>{item.description}</td>
      <td style={{ color: item.status ? "blue" : "red", fontWeight: "bold" }}>
        {item.status ? "Active" : "Inactive"}
      </td>
      {/* <td>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleEdit(item)}
          startIcon={<EditIcon />}
        >
          Edit
        </Button>
      </td> */}
    </tr>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="table-container">
      <h3>INVENTORY TYPE LIST</h3>
      <button
        className="create-form-btn"
        onClick={() => setShowCreateForm((prev) => !prev)}
      >
        + Create Inventory Type
      </button>
      <br />

      {showCreateForm && (
        <InventoryTypeCreateForm
          onInventoryTypeCreated={handleInventoryTypeCreated}
          closeForm={() => setShowCreateForm(false)}
        />
      )}

      {showEditForm && (
        <InventoryTypeUpdateForm
          inventoryTypeID={editInventoryTypeID}
          onClose={handleEditFormClose}
          onInventoryTypeUpdated={handleInventoryTypeUpdated}
        />
      )}

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                limit="10"
                headData={inventoryTypeTableHead}
                renderHead={renderHead}
                bodyData={inventoryTypes}
                renderBody={renderBody}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryTypeList;
