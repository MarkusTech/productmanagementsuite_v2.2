import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import { fetchPoReceivingItems } from "../../../services/purchaseOrder/poReceivingItem";
import PoReceivingItemCreateForm from "./PoReceivinItemCreateForm";
import PoReceivingItemEditForm from "./PoReceivinItemUpdateForm";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const tableHead = [
  "ID",
  "Item Name",
  "Unit Of Measurement",
  "Received Quantity",
  "Unit Cost",
  "Action",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const PoReceivingItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const loadItems = async () => {
    try {
      const data = await fetchPoReceivingItems();
      setItems(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleItemCreated = () => {
    loadItems();
    setShowCreateForm(false);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowEditForm(true);
  };

  const handleEditFormClose = () => {
    setShowEditForm(false);
    setEditItem(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.poReceivingItemID}</td>
      <td>{item.item.itemName}</td>
      <td>{item.uom}</td>
      <td>{item.receivedQty}</td>
      <td>{item.unitCost}</td>
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

  return (
    <div className="table-container">
      <h3>Purchase Order Receiving Item List</h3>
      <button
        className="create-form-btn"
        onClick={() => setShowCreateForm((prev) => !prev)}
      >
        + Create Receiving Item
      </button>
      <br />

      {showCreateForm && (
        <PoReceivingItemCreateForm
          onItemCreated={handleItemCreated}
          closeForm={() => setShowCreateForm(false)}
        />
      )}

      {showEditForm && (
        <PoReceivingItemEditForm
          item={editItem}
          onClose={handleEditFormClose}
        />
      )}

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                limit="10"
                headData={tableHead}
                renderHead={renderHead}
                bodyData={items}
                renderBody={renderBody}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoReceivingItemList;
