import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import { fetchPurchaseOrderItems } from "../../../services/purchaseOrder/poItemService";
import PoItemCreateForm from "./PoItemCreateForm";
// import PoItemEditForm from "./PoItemUpdateForm";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const poItemTableHead = [
  "ID",
  "Purchase Order",
  "Item",
  "Unit of Measurement",
  "Unit Cost",
  "Order Quantity",
  "Action",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const PoItemList = () => {
  const [poItems, setPoItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  // const [showEditForm, setShowEditForm] = useState(false);
  // const [editPoItem, setEditPoItem] = useState(null);

  const loadPoItems = async () => {
    try {
      const data = await fetchPurchaseOrderItems();
      setPoItems(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPoItems();
  }, []);

  const handlePoItemCreated = () => {
    loadPoItems();
    setShowCreateForm(false);
  };

  // const handlePoItemUpdated = () => {
  //   loadPoItems();
  //   setShowEditForm(false);
  // };

  // const handleEdit = (poItem) => {
  //   setEditPoItem(poItem);
  //   setShowEditForm(true);
  // };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.poItemID}</td>
      <td>{item.purchaseOrder.poNumber}</td>
      <td>{item.item.itemName}</td>
      <td>{item.uom}</td>
      <td>{item.unitCost}</td>
      <td>{item.orderQty}</td>
      <td>
        <Button
          variant="contained"
          color="primary"
          // onClick={() => handleEdit(item)}
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
      <h3>Purchase Order Item List</h3>
      <button
        className="create-form-btn"
        onClick={() => setShowCreateForm((prev) => !prev)}
      >
        + Create PO Item
      </button>
      <br />

      {showCreateForm && (
        <PoItemCreateForm
          onPoItemCreated={handlePoItemCreated}
          closeForm={() => setShowCreateForm(false)}
        />
      )}

      {/* {showEditForm && (
        <PoItemEditForm
          poItem={editPoItem}
          onPoItemUpdated={handlePoItemUpdated}
          closeForm={() => setShowEditForm(false)}
        />
      )} */}

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                limit="10"
                headData={poItemTableHead}
                renderHead={renderHead}
                bodyData={poItems}
                renderBody={renderBody}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoItemList;
