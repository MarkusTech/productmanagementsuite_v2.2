import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import { fetchSuppliers } from "../../../services/purchaseOrder/poSupplier";
import SupplierCreateForm from "./SupplierCreateForm";
import SupplierEditForm from "./SupplierUpdateForm";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const supplierTableHead = [
  "Supplier ID",
  "Supplier Name",
  "Contact Details",
  "Address",
  "Email",
  "Status",
  "Action",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);

  const loadSuppliers = async () => {
    try {
      const data = await fetchSuppliers();
      setSuppliers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleSupplierCreated = () => {
    loadSuppliers();
    setShowCreateForm(false);
  };

  const handleEdit = (supplier) => {
    setEditSupplier(supplier);
    setShowEditForm(true);
  };

  const handleEditFormClose = () => {
    setShowEditForm(false);
    setEditSupplier(null);
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.supplierID}</td>
      <td>{item.supplierName}</td>
      <td>{item.contactDetails}</td>
      <td>{item.address}</td>
      <td>{item.email}</td>
      <td
        style={{
          color: item.status ? "blue" : "red",
          fontWeight: "bold",
        }}
      >
        {item.status ? "Active" : "Inactive"}
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
      <h3>SUPPLIER LIST</h3>
      <button
        className="create-form-btn"
        onClick={() => setShowCreateForm((prev) => !prev)}
      >
        + Create Supplier
      </button>
      <br />

      {showCreateForm && (
        <SupplierCreateForm
          onSupplierCreated={handleSupplierCreated}
          closeForm={() => setShowCreateForm(false)}
        />
      )}

      {showEditForm && (
        <SupplierEditForm
          supplier={editSupplier}
          onClose={handleEditFormClose}
        />
      )}

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                limit="10"
                headData={supplierTableHead}
                renderHead={renderHead}
                bodyData={suppliers}
                renderBody={renderBody}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierList;
