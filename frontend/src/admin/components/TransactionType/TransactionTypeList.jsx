import React, { useEffect, useState } from "react";
import Table from "../Table"; // Assuming you have a reusable Table component
import TransactionTypeCreateForm from "./TransactionTypeCreateForm"; // Import the create form
import TransactionTypeEditForm from "./TransactionTypeEditForm"; // Import the edit form
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const transactionTypeTableHead = [
  "Transaction Type ID",
  "Transaction Name",
  "Description", // Add description column
  "Created At",
  "Updated At",
  "Action",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const TransactionTypeList = () => {
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editTransactionTypeID, setEditTransactionTypeID] = useState(null);

  const loadTransactionTypes = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/v3/transaction/transaction-types");
      setTransactionTypes(response.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactionTypes();
  }, []);

  const handleTransactionTypeCreated = () => {
    loadTransactionTypes(); // Reload transaction types after creation
    setShowCreateForm(false); // Close the form after creation
  };

  const handleEdit = (transactionType) => {
    setEditTransactionTypeID(transactionType.transactionTypeID);
    setShowEditForm(true);
  };

  const handleEditFormClose = () => {
    setShowEditForm(false);
    setEditTransactionTypeID(null);
  };

  const handleTransactionTypeUpdated = () => {
    handleEditFormClose();
    loadTransactionTypes();
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.transactionTypeID}</td>
      <td>{item.transactionName}</td>
      <td>{item.description || "No description"}</td>{" "}
      {/* Display description */}
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
      <h3>TRANSACTION TYPE LIST</h3>
      <button
        className="create-form-btn"
        onClick={() => setShowCreateForm((prev) => !prev)}
      >
        + Create Transaction Type
      </button>
      <br />

      {showCreateForm && (
        <TransactionTypeCreateForm
          onTransactionTypeCreated={handleTransactionTypeCreated}
          closeForm={() => setShowCreateForm(false)}
        />
      )}

      {showEditForm && (
        <TransactionTypeEditForm
          transactionTypeID={editTransactionTypeID}
          onClose={handleEditFormClose}
          onTransactionTypeUpdated={handleTransactionTypeUpdated}
        />
      )}

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                limit="10"
                headData={transactionTypeTableHead}
                renderHead={renderHead}
                bodyData={transactionTypes}
                renderBody={renderBody}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTypeList;
