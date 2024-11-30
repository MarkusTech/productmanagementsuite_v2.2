import React, { useEffect, useState } from "react";
import Table from "../Table";
import { fetchAdjustmentTypes } from "../../../services/inventory/adjustmentTypeService";
import AdjustmentTypeCreateForm from "./AdjustmentTypeCreateForm";
import { Button } from "@mui/material";

const adjustmentTypeTableHead = ["ID", "Adjustment Type Name", "Description", "Action"];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const AdjustmentTypeList = () => {
  const [adjustmentTypes, setAdjustmentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const loadAdjustmentTypes = async () => {
    try {
      const data = await fetchAdjustmentTypes();
      setAdjustmentTypes(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdjustmentTypes();
  }, []);

  const handleAdjustmentTypeCreated = () => {
    loadAdjustmentTypes();
    setShowCreateForm(false);
  };

  const closeForm = () => {
    setShowCreateForm(false);
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.adjustmentTypeID}</td>
      <td>{item.typeName}</td>
      <td>{item.description}</td>
      <td>
        <Button variant="contained" color="primary">
          Edit
        </Button>
      </td>
    </tr>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="table-container">
      <h3>ADJUSTMENT TYPE</h3>
      <button
        className="create-form-btn"
        onClick={() => setShowCreateForm((prev) => !prev)}
      >
        + Create Adjustment Type
      </button>
      <br />

      {showCreateForm && (
        <AdjustmentTypeCreateForm
          onAdjustmentTypeCreated={handleAdjustmentTypeCreated}
          closeForm={closeForm}
        />
      )}

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                limit="10"
                headData={adjustmentTypeTableHead}
                renderHead={renderHead}
                bodyData={adjustmentTypes}
                renderBody={renderBody}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentTypeList;
