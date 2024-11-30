import React, { useEffect, useState } from "react";
import Table from "../Table";
import { fetchCategories } from "../../../services/inventory/categoryService";
import CategoryCreateForm from "./CategoryCreateForm";
import CategoryEditForm from "./CategoryEditForm";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const categoryTableHead = [
  "Category ID",
  "Category Code",
  "Category Name",
  "Description",
  "Status",
  "Action",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editCategoryID, setEditCategoryID] = useState(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCategoryCreated = () => {
    loadCategories();
    setShowCreateForm(false);
  };

  const handleEdit = (category) => {
    setEditCategoryID(category.categoryID);
    setShowEditForm(true);
  };

  const handleEditFormClose = () => {
    setShowEditForm(false);
    setEditCategoryID(null);
  };

  const handleCategoryUpdated = () => {
    handleEditFormClose();
    loadCategories();
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.categoryID}</td>
      <td>{item.categoryCode}</td>
      <td>{item.categoryName}</td>
      <td>{item.description}</td>
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
      <h3>CATEGORY LIST</h3>
      <button
        className="create-form-btn"
        onClick={() => setShowCreateForm((prev) => !prev)}
      >
        + Create Category
      </button>
      <br />

      {showCreateForm && (
        <CategoryCreateForm
          onCategoryCreated={handleCategoryCreated}
          closeForm={() => setShowCreateForm(false)}
        />
      )}

      {showEditForm && (
        <CategoryEditForm
          categoryID={editCategoryID}
          onClose={handleEditFormClose}
          onCategoryUpdated={handleCategoryUpdated}
        />
      )}

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                limit="10"
                headData={categoryTableHead}
                renderHead={renderHead}
                bodyData={categories}
                renderBody={renderBody}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
