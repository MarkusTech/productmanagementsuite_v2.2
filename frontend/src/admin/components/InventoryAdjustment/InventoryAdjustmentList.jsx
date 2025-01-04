import React, { useEffect, useState } from "react";
import Table from "../Table";
import {
  fetchInventoryAdjustments,
  approveInventoryAdjustment,
  declineInventoryAdjustment,
} from "../../../services/inventory/inventoryAdjustmentService";
import InventoryAdjustmentCreateForm from "./InventoryAdjustmentCreateForm";
import InventoryAdjustmentUpdateForm from "./InventoryAdjustmentUpdateForm";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const inventoryAdjustmentTableHead = [
  "ID",
  "Adjustment Reason",
  "Inventory Item",
  "Quantity Adjusted",
  "Status",
  "Action",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const InventoryAdjustmentList = () => {
  const userState = useSelector((state) => state.user.userInfo);

  const roleID = userState?.roleID;

  const [inventoryAdjustments, setInventoryAdjustments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editAdjustmentId, setEditAdjustmentId] = useState(null);

  const loadInventoryAdjustments = async () => {
    try {
      setLoading(true); // Optional: Show loading state
      const data = await fetchInventoryAdjustments();
      setInventoryAdjustments(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  useEffect(() => {
    loadInventoryAdjustments();
  }, []);

  const handleInventoryAdjustmentCreated = (newAdjustment) => {
    setInventoryAdjustments((prev) => [...prev, newAdjustment]); // Append new adjustment
    setShowCreateForm(false);
    Swal.fire({
      icon: "success",
      title: "Inventory Adjustment Created!",
      text: "The new inventory adjustment has been successfully created.",
      confirmButtonText: "Okay",
      customClass: {
        confirmButton: "swal-confirm-button",
      },
    });
    loadInventoryAdjustments();
  };

  const handleEdit = (adjustment) => {
    setEditAdjustmentId(adjustment.adjustmentID); // Set the adjustment ID for editing
    setShowEditForm(true);
  };

  const handleEditFormClose = () => {
    setShowEditForm(false);
    setEditAdjustmentId(null);
  };

  const handleAdjustmentUpdated = () => {
    loadInventoryAdjustments();
    setShowEditForm(false);
    Swal.fire({
      icon: "success",
      title: "Inventory Adjustment Updated!",
      text: "The inventory adjustment has been successfully updated.",
      confirmButtonText: "Okay",
      customClass: {
        confirmButton: "swal-confirm-button",
      },
    });
  };

  const handleApproval = async (inventoryID, adjustmentID) => {
    try {
      const result = await Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: `Do you want to approve Adjustment ID ${adjustmentID}?`,
        showCancelButton: true,
        confirmButtonText: "Yes, Approve",
        cancelButtonText: "Cancel",
        customClass: {
          confirmButton: "swal-confirm-button",
          cancelButton: "swal-cancel-button",
        },
      });

      if (result.isConfirmed) {
        await approveInventoryAdjustment(inventoryID, adjustmentID);
        Swal.fire({
          icon: "success",
          title: "Adjustment Approved",
          text: `Adjustment ID ${adjustmentID} has been approved.`,
          confirmButtonText: "Okay",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });

        // Reload inventory adjustments
        await loadInventoryAdjustments();
      } else {
        Swal.fire({
          icon: "info",
          title: "Approval Canceled",
          text: `Adjustment ID ${adjustmentID} was not approved.`,
          confirmButtonText: "Okay",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Approval Failed",
        text: `Failed to approve Adjustment ID ${adjustmentID}: ${error.message}`,
        confirmButtonText: "Okay",
        customClass: {
          confirmButton: "swal-confirm-button",
        },
      });
    }
  };

  const handleDecline = async (adjustmentID) => {
    try {
      const result = await Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: `Do you want to decline Adjustment ID ${adjustmentID}?`,
        showCancelButton: true,
        confirmButtonText: "Yes, Decline",
        cancelButtonText: "Cancel",
        customClass: {
          confirmButton: "swal-confirm-button",
          cancelButton: "swal-cancel-button",
        },
      });

      if (result.isConfirmed) {
        await declineInventoryAdjustment(adjustmentID);

        Swal.fire({
          icon: "success",
          title: "Adjustment Declined",
          text: `Adjustment ID ${adjustmentID} has been declined.`,
          confirmButtonText: "Okay",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });

        loadInventoryAdjustments();
      } else {
        Swal.fire({
          icon: "info",
          title: "Decline Canceled",
          text: `Adjustment ID ${adjustmentID} was not declined.`,
          confirmButtonText: "Okay",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Decline Failed",
        text: `Failed to decline Adjustment ID ${adjustmentID}: ${error.message}`,
        confirmButtonText: "Okay",
        customClass: {
          confirmButton: "swal-confirm-button",
        },
      });
    }
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.adjustmentID}</td>
      <td>{item.adjustmentReason.reasonName}</td>
      <td>{item.inventory.item.itemName}</td>
      <td>{item.quantityAdjusted}</td>
      <td
        style={{
          color:
            item.status === "Completed"
              ? "green"
              : item.status === "Pending"
              ? "orange"
              : item.status === "Rejected"
              ? "red"
              : item.status === "Declined"
              ? "purple"
              : "inherit",
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
              onClick={() =>
                handleApproval(item.inventoryID, item.adjustmentID)
              }
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
              onClick={() => handleDecline(item.adjustmentID)}
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
              onClick={() => handleEdit(item)}
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
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEdit(item)}
            startIcon={<EditIcon />}
          >
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
      <h3>INVENTORY ADJUSTMENT LIST</h3>
      <br />

      {showCreateForm && (
        <InventoryAdjustmentCreateForm
          onAdjustmentCreated={handleInventoryAdjustmentCreated}
          closeForm={() => setShowCreateForm(false)}
        />
      )}

      {showEditForm && (
        <InventoryAdjustmentUpdateForm
          adjustmentId={editAdjustmentId}
          onAdjustmentUpdated={handleAdjustmentUpdated}
          closeForm={handleEditFormClose}
        />
      )}

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                limit="10"
                headData={inventoryAdjustmentTableHead}
                renderHead={renderHead}
                bodyData={inventoryAdjustments}
                renderBody={renderBody}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryAdjustmentList;
