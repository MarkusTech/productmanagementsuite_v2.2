import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import { fetchPoReceiving } from "../../../services/purchaseOrder/poReceiving";
import PoReceivingCreateForm from "./PoReceivingCreateForm"; // Create Form
// import PoReceivingEditForm from "./PoReceivingEditForm";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const tableHead = [
  "ID",
  "Purchase Order",
  "Reference Number",
  "Received Date",
  "Received By",
  "Total Quantity",
  "Total Cost",
  "Status",
  "Action",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const PoReceivingList = () => {
  const [poReceivingData, setPoReceivingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  // const [showEditForm, setShowEditForm] = useState(false);
  // const [editPoReceiving, setEditPoReceiving] = useState(null);

  // Fetch purchase order receiving data
  const loadPoReceiving = async () => {
    try {
      const data = await fetchPoReceiving();
      setPoReceivingData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPoReceiving();
  }, []);

  const handlePoReceivingCreated = () => {
    loadPoReceiving();
    setShowCreateForm(false);
  };

  // const handleEdit = (poReceiving) => {
  //   setEditPoReceiving(poReceiving);
  //   setShowEditForm(true);
  // };

  // const handleEditFormClose = () => {
  //   setShowEditForm(false);
  //   setEditPoReceiving(null);
  // };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.poReceivingID}</td>
      <td>{item.purchaseOrder.poNumber}</td>
      <td>{item.referenceNumber}</td>
      <td>{item.receivedDate}</td>
      <td>{item.receivedBy.username}</td>
      <td>{item.totalQty}</td>
      <td>{item.totalCost}</td>
      <td>{item.status}</td>
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
      <h3>PURCHASE ORDER RECEIVING LIST</h3>
      <button
        className="create-form-btn"
        onClick={() => setShowCreateForm((prev) => !prev)}
      >
        + Create Purchase Order Receiving
      </button>
      <br />

      {showCreateForm && (
        <PoReceivingCreateForm
          onPoReceivingCreated={handlePoReceivingCreated}
          closeForm={() => setShowCreateForm(false)}
        />
      )}
      {/* 
      {showEditForm && (
        <PoReceivingEditForm
          purchaseOrderReceiving={editPoReceiving}
          onClose={handleEditFormClose}
          onItemUpdated={loadPoReceiving}
        />
      )} */}

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                limit="10"
                headData={tableHead}
                renderHead={renderHead}
                bodyData={poReceivingData}
                renderBody={renderBody}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoReceivingList;
