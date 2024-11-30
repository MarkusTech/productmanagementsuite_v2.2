import React, { useEffect, useState } from "react";
import Table from "../Table";
import { fetchInventories } from "../../../services/inventory/inventoryService";
import InventoryCreateForm from "./InventoryCreateForm";
import InventoryEditForm from "./InventoryEditForm";
import InventoryAdjustmentCreateForm from "../InventoryAdjustment/InventoryAdjustmentCreateForm";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const inventoryTableHead = [
  "",
  "ID",
  "Inventory Type",
  "Location",
  "Item",
  "Quantity",
  "Action",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const InventoryList = () => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editInventory, setEditInventory] = useState(null);
  const [showInventoryAdjustment, setShowInventoryAdjustment] = useState(false);
  const [selectedInventoryID, setSelectedInventoryID] = useState(null);

  // Load inventories when the component mounts
  const loadInventories = async () => {
    try {
      const data = await fetchInventories();
      setInventories(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventories();
  }, []);

  const handleInventoryCreated = () => {
    loadInventories();
    setShowCreateForm(false);
  };

  const handleInventoryAdjustment = (inventoryID) => {
    setSelectedInventoryID(inventoryID);
    setShowInventoryAdjustment(true);
  };

  const handleInventoryUpdated = () => {
    loadInventories();
    setShowEditForm(false);
    setEditInventory(null);
  };

  const handleEditFormClose = () => {
    setShowEditForm(false);
    setEditInventory(null);
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>
        {item.item.image_url && (
          <img
            src={`/${item.item.image_url.replace(/\\/g, "/")}`}
            alt="Inventory"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        )}
      </td>
      <td>{item.inventoryID}</td>
      <td>{item.inventoryType.typeName}</td>
      <td>{item.location.locationName}</td>
      <td>{item.item.itemName}</td>
      <td>{item.quantity}</td>
      <td>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleInventoryAdjustment(item.inventoryID)}
          startIcon={<EditIcon />}
        >
          Adjust Inventory
        </Button>
      </td>
    </tr>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="table-container">
      <h3>INVENTORY LIST</h3>
      <br />
      {showCreateForm && (
        <InventoryCreateForm
          onInventoryCreated={handleInventoryCreated}
          closeForm={() => setShowCreateForm(false)}
        />
      )}

      {showEditForm && (
        <InventoryEditForm
          inventoryId={editInventory?.inventoryID}
          onInventoryUpdated={handleInventoryUpdated}
          closeForm={handleEditFormClose}
        />
      )}

      {showInventoryAdjustment && (
        <InventoryAdjustmentCreateForm
          inventoryID={selectedInventoryID}
          onAdjustmentCreated={loadInventories}
          closeForm={() => setShowInventoryAdjustment(false)}
        />
      )}

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                limit="10"
                headData={inventoryTableHead}
                renderHead={renderHead}
                bodyData={inventories}
                renderBody={renderBody}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;
