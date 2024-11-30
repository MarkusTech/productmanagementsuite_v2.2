import React, { useEffect, useState } from "react";
import Table from "../Table";
import CustomerTypeCreateForm from "./CustomerTypeCreateForm"; // Import the create form
import CustomerTypeEditForm from "./CustomerTypeEditForm"; // Import the edit form
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const customerTypeTableHead = [
  "Customer Type ID",
  "Customer Type Name",
  "Description",
  "Created At",
  "Updated At",
  "Action",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const CustomerTypeList = () => {
  const [customerTypes, setCustomerTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editCustomerTypeID, setEditCustomerTypeID] = useState(null);

  const loadCustomerTypes = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/v2/customer-types");
      setCustomerTypes(response.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomerTypes();
  }, []);

  const handleCustomerTypeCreated = () => {
    loadCustomerTypes(); // Reload customer types after creation
    setShowCreateForm(false); // Close the form after creation
  };

  const handleEdit = (customerType) => {
    setEditCustomerTypeID(customerType.customerTypeID);
    setShowEditForm(true);
  };

  const handleEditFormClose = () => {
    setShowEditForm(false);
    setEditCustomerTypeID(null);
  };

  const handleCustomerTypeUpdated = () => {
    handleEditFormClose();
    loadCustomerTypes();
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.customerTypeID}</td>
      <td>{item.TypeName}</td>
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
      <h3>CUSTOMER TYPE LIST</h3>
      <button
        className="create-form-btn"
        onClick={() => setShowCreateForm((prev) => !prev)}
      >
        + Create Customer Type
      </button>
      <br />

      {showCreateForm && (
        <CustomerTypeCreateForm
          onCustomerTypeCreated={handleCustomerTypeCreated}
          closeForm={() => setShowCreateForm(false)}
        />
      )}

      {showEditForm && (
        <CustomerTypeEditForm
          customerTypeID={editCustomerTypeID}
          onClose={handleEditFormClose}
          onCustomerTypeUpdated={handleCustomerTypeUpdated}
        />
      )}

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                limit="10"
                headData={customerTypeTableHead}
                renderHead={renderHead}
                bodyData={customerTypes}
                renderBody={renderBody}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerTypeList;
