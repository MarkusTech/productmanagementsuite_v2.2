import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import {
  fetchPurchaseOrders,
  cancelPurchaseOrder,
} from "../../../services/purchaseOrder/purchaseOrderService"; // Make sure you import the cancel function
import PurchaseOrderCreateForm from "./PurchaseOrderCreateForm";
import PurchaseOrderEditForm from "./PurchaseOrderUpdateForm";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

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
  "Action",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const PurchaseOrderList = () => {
  const userState = useSelector((state) => state.user.userInfo);
  const roleID = userState?.roleID;
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editPurchaseOrderID, setEditPurchaseOrderID] = useState(null);

  const loadPurchaseOrders = async () => {
    setLoading(true);
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

  const handleEditFormClose = () => {
    setShowEditForm(false);
    setEditPurchaseOrderID(null);
  };

  const handlePurchaseOrderUpdated = () => {
    loadPurchaseOrders();
    setShowEditForm(false);
  };

  // Function to handle cancellation of purchase orders
  const handleCancel = async (poID) => {
    try {
      await cancelPurchaseOrder(poID); // API call to update status to "Canceled"
      // Update the status in the local state after cancellation
      setPurchaseOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.poID === poID ? { ...order, status: "Canceled" } : order
        )
      );
    } catch (error) {
      setError(error.message);
    }
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
      <td>₱{item.totalCost.toLocaleString()}</td>
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
        {roleID === 1 ? (
          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <Button
              variant="contained"
              color="success"
              style={{
                borderRadius: "50%",
                minWidth: "50px",
                height: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0",
              }}
            >
              <CheckCircleIcon />
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleCancel(item.poID)} // Cancel button with onClick
              style={{
                borderRadius: "50%",
                minWidth: "50px",
                height: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0",
              }}
            >
              <CancelIcon />
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setEditPurchaseOrderID(item.poID);
                setShowEditForm(true);
              }}
              style={{
                borderRadius: "50%",
                minWidth: "50px",
                height: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0",
              }}
            >
              <EditIcon />
            </Button>
          </div>
        ) : (
          <Button variant="contained" color="primary" startIcon={<EditIcon />}>
            Edit
          </Button>
        )}
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
          purchaseOrderID={editPurchaseOrderID}
          onClose={handleEditFormClose}
          onPurchaseOrderUpdated={handlePurchaseOrderUpdated}
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
