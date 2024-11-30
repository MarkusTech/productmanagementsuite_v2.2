import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import { fetchPurchaseOrders } from "../../../services/purchaseOrder/purchaseOrderService";
import PurchaseOrderCreateForm from "./PurchaseOrderCreateForm";
import PurchaseOrderEditForm from "./PurchaseOrderUpdateForm";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const tableHead = [
  "ID",
  "PO Number",
  "Supplier",
  "Location",
  "ReferenceNo",
  "Remarks",
  "Order Date",
  "Expected Delivery Date",
  "Total Cost",
  "Status",
  "Action", // Added action column for edit button
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const PurchaseOrderList = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editPurchaseOrder, setEditPurchaseOrder] = useState(null);

  const loadPurchaseOrders = async () => {
    try {
      const data = await fetchPurchaseOrders();
      setPurchaseOrders(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchaseOrders();
  }, []);

  const handlePurchaseOrderCreated = () => {
    loadPurchaseOrders();
    setShowCreateForm(false);
  };

  const handleEdit = (purchaseOrder) => {
    setEditPurchaseOrder(purchaseOrder);
    setShowEditForm(true);
  };

  const handleEditFormClose = () => {
    setShowEditForm(false);
    setEditPurchaseOrder(null);
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.poID}</td>
      <td>{item.poNumber}</td>
      <td>{item.supplier.supplierName}</td>
      <td>{item.location.locationName}</td>
      <td>{item.referenceNo}</td>
      <td>{item.remarks}</td>
      <td>{new Date(item.orderDate).toLocaleDateString()}</td>
      <td>{new Date(item.expectedDeliverDate).toLocaleDateString()}</td>
      <td>{item.totalCost}</td>
      <td
        style={{
          color:
            item.status === "Pending"
              ? "orange"
              : item.status === "Approved"
              ? "green"
              : item.status === "Canceled"
              ? "red"
              : "black",
        }}
      >
        {item.status}
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
      <h3>PURCHASE ORDER LIST</h3>
      <button
        className="create-form-btn"
        onClick={() => setShowCreateForm((prev) => !prev)}
      >
        + Create Purchase Order
      </button>
      <br />

      {showCreateForm && (
        <PurchaseOrderCreateForm
          onPurchaseOrderCreated={handlePurchaseOrderCreated}
          closeForm={() => setShowCreateForm(false)}
        />
      )}

      {showEditForm && (
        <PurchaseOrderEditForm
          purchaseOrder={editPurchaseOrder}
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
                bodyData={purchaseOrders}
                renderBody={renderBody}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderList;
