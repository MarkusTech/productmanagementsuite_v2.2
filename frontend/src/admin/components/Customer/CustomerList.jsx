import React, { useEffect, useState } from "react";
import Table from "../Table";
import CustomerCreateForm from "./CustomerCreateForm";
import CustomerEditForm from "./CustomerEditForm"; // Import the edit form
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const customerTableHead = [
  "Customer ID",
  "Full Name",
  "Contact No",
  "Email",
  "Address",
  "Customer Type",
  "Action",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editCustomerID, setEditCustomerID] = useState(null);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/v2/customers");
      setCustomers(response.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleCustomerCreated = () => {
    loadCustomers();
    setShowCreateForm(false);
  };

  const handleEdit = (customer) => {
    setEditCustomerID(customer.customerID);
    setShowEditForm(true);
  };

  const handleEditFormClose = () => {
    setShowEditForm(false);
    setEditCustomerID(null);
  };

  const handleCustomerUpdated = () => {
    handleEditFormClose();
    loadCustomers();
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.customerID}</td>
      <td>{`${item.firstName} ${item.middleName ? item.middleName + " " : ""}${
        item.lastName
      }`}</td>
      <td>{item.contactNo}</td>
      <td>{item.email}</td>
      <td>{item.address}</td>
      <td>{item.customerType ? item.customerType.TypeName : "N/A"}</td>
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
      <h3>CUSTOMER LIST</h3>

      <button
        className="create-form-btn"
        onClick={() => setShowCreateForm((prev) => !prev)}
      >
        + Create Customer
      </button>
      <br />

      {showCreateForm && (
        <CustomerCreateForm
          onCustomerCreated={handleCustomerCreated}
          closeForm={() => setShowCreateForm(false)}
        />
      )}

      {showEditForm && (
        <CustomerEditForm
          customerID={editCustomerID}
          onClose={handleEditFormClose}
          onCustomerUpdated={handleCustomerUpdated}
        />
      )}

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                limit="10"
                headData={customerTableHead}
                renderHead={renderHead}
                bodyData={customers}
                renderBody={renderBody}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
