import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import {
  fetchPurchaseOrders,
  cancelPurchaseOrder,
} from "../../../services/purchaseOrder/purchaseOrderService";
import PurchaseOrderCreateForm from "./PurchaseOrderCreateForm";
import PurchaseOrderEditForm from "./PurchaseOrderUpdateForm";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useSelector } from "react-redux";

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
    try {
      setLoading(true); // Optional: Show loading state
      const data = await fetchPurchaseOrders();
      setPurchaseOrders(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  useEffect(() => {
    loadPurchaseOrders();
  }, []);

  const handlePurchaseOrderCreated = (newPO) => {
    setPurchaseOrders((prev) => [...prev, newPO]); // Append new purchase order
    setShowCreateForm(false);
    Swal.fire({
      icon: "success",
      title: "Purchase Order Created!",
      text: "The new purchase order has been successfully created.",
      confirmButtonText: "Okay",
      customClass: {
        confirmButton: "swal-confirm-button",
      },
    });
    loadPurchaseOrders();
  };

  const handlePurchaseOrderUpdated = () => {
    loadPurchaseOrders();
    setShowEditForm(false);
    Swal.fire({
      icon: "success",
      title: "Purchase Order Updated!",
      text: "The purchase order has been successfully updated.",
      confirmButtonText: "Okay",
      customClass: {
        confirmButton: "swal-confirm-button",
      },
    });
  };

  const handleCancel = async (poID) => {
    try {
      const result = await Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: `Do you want to cancel Purchase Order ID ${poID}?`,
        showCancelButton: true,
        confirmButtonText: "Yes, Cancel it",
        cancelButtonText: "No, Keep it",
        customClass: {
          confirmButton: "swal-confirm-button",
          cancelButton: "swal-cancel-button",
        },
      });

      if (result.isConfirmed) {
        await cancelPurchaseOrder(poID); // Call API to cancel purchase order
        Swal.fire({
          icon: "success",
          title: "Purchase Order Canceled",
          text: `Purchase Order ID ${poID} has been canceled.`,
          confirmButtonText: "Okay",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });
        loadPurchaseOrders(); // Reload the table after successful cancellation
      } else {
        Swal.fire({
          icon: "info",
          title: "Cancellation Canceled",
          text: `Purchase Order ID ${poID} was not canceled.`,
          confirmButtonText: "Okay",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Cancellation Failed",
        text: `Failed to cancel Purchase Order ID ${poID}: ${error.message}`,
        confirmButtonText: "Okay",
        customClass: {
          confirmButton: "swal-confirm-button",
        },
      });
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
                setShowEditForm(true); // You can change this to a "view" functionality if needed
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
              <VisibilityIcon />
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
          onClose={() => setShowEditForm(false)}
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
