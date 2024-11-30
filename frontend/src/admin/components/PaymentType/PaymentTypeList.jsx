import React, { useEffect, useState } from "react";
import Table from "../Table"; // Assuming you have a reusable Table component
import PaymentTypeCreateForm from "./PaymentTypeCreateForm"; // Import the create form
import PaymentTypeEditForm from "./PaymentTypeEditForm"; // Import the edit form
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const paymentTypeTableHead = [
  "Payment Type ID",
  "Payment Name",
  "Description",
  "Created At",
  "Updated At",
  "Action",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const PaymentTypeList = () => {
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editPaymentTypeID, setEditPaymentTypeID] = useState(null);

  const loadPaymentTypes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v3/transaction/payment-types"
      );
      setPaymentTypes(response.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentTypes();
  }, []);

  const handlePaymentTypeCreated = () => {
    loadPaymentTypes(); // Reload payment types after creation
    setShowCreateForm(false); // Close the form after creation
  };

  const handleEdit = (paymentType) => {
    setEditPaymentTypeID(paymentType.paymentTypeID);
    setShowEditForm(true);
  };

  const handleEditFormClose = () => {
    setShowEditForm(false);
    setEditPaymentTypeID(null);
  };

  const handlePaymentTypeUpdated = () => {
    handleEditFormClose();
    loadPaymentTypes();
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.paymentTypeID}</td>
      <td>{item.paymentName}</td>
      <td>{item.description}</td>
      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
      <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
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
      <h3>Payment Type List</h3>
      <button
        className="create-form-btn"
        onClick={() => setShowCreateForm((prev) => !prev)}
      >
        + Create Payment Type
      </button>
      <br />

      {showCreateForm && (
        <PaymentTypeCreateForm
          onPaymentTypeCreated={handlePaymentTypeCreated}
          closeForm={() => setShowCreateForm(false)}
        />
      )}

      {showEditForm && (
        <PaymentTypeEditForm
          paymentTypeID={editPaymentTypeID}
          onClose={handleEditFormClose}
          onPaymentTypeUpdated={handlePaymentTypeUpdated}
        />
      )}

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                limit="10"
                headData={paymentTypeTableHead}
                renderHead={renderHead}
                bodyData={paymentTypes}
                renderBody={renderBody}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTypeList;
