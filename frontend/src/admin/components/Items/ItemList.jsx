import React, { useEffect, useState } from "react";
import Table from "../Table";
import { fetchItems } from "../../../services/inventory/itemService";
import ItemCreateForm from "./ItemCreateForm";
import ItemEditForm from "./ItemEditFrom";
import ItemAndImageViewForm from "./ItemAndImageViewForm";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Button } from "@mui/material";

const itemTableHead = [
  "",
  "ID",
  "Item Code",
  "Item Name",
  "Category",
  "Barcode",
  "Description",
  "Grams",
  "UOM",
  "Price",
  "Cost",
  "Status",
  "Action",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showViewItemAndImage, setShowViewItemAndImage] = useState(false);

  // Load items from the API
  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await fetchItems();
      setItems(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems(); // Initial load
  }, []);

  const handleItemCreated = () => {
    loadItems();
    setShowCreateForm(false);
  };

  const closeForm = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setSelectedItem(null);
  };

  const handleCloseViewItemImage = () => {
    setShowViewItemAndImage(!showViewItemAndImage);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowEditForm(!showEditForm);
  };

  const handleItemUpdated = () => {
    handleCloseEditForm();
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    loadItems(); // Reload after edit
  };

  const handleViewDetails = (itemID) => {
    setSelectedItem(itemID);
    setShowViewItemAndImage(!showViewItemAndImage);
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>
        {item.image_url && (
          <img
            src={`/${item.image_url.replace(/\\/g, "/")}`}
            alt="Item"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        )}
      </td>
      <td>{item.itemID}</td>
      <td>{item.itemCode}</td>
      <td>{item.itemName}</td>
      <td>{item.categoryName}</td>
      <td>{item.barcode}</td>
      <td>{item.description}</td>
      <td>{item.grams}</td>
      <td>{item.uom}</td>
      <td>₱{item.price.toLocaleString()}</td>
      <td>₱{item.cost.toLocaleString()}</td>

      <td
        style={{
          color: item.status ? "blue" : "red",
          fontWeight: "bold",
        }}
      >
        {item.status ? "Active" : "Inactive"}
      </td>
      <td>
        <div style={buttonContainerStyle}>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleViewDetails(item.itemID)}
            style={buttonStyle}
          >
            <VisibilityIcon />
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEdit(item)}
            style={buttonStyle}
          >
            <EditIcon />
          </Button>
        </div>
      </td>
    </tr>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="table-container">
      <h3>ITEM LIST</h3>
      <button
        className="create-form-btn"
        onClick={() => setShowCreateForm((prev) => !prev)}
      >
        + Create Item
      </button>
      <br />

      {showCreateForm && (
        <ItemCreateForm
          onItemCreated={handleItemCreated}
          closeForm={closeForm}
        />
      )}

      {showEditForm && selectedItem && (
        <ItemEditForm
          onItemUpdated={handleItemUpdated}
          onClose={handleCloseEditForm}
          itemID={selectedItem.itemID}
        />
      )}

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                limit="10"
                headData={itemTableHead}
                renderHead={renderHead}
                bodyData={items}
                renderBody={renderBody}
              />
            </div>
          </div>
        </div>
      </div>

      {showViewItemAndImage && (
        <ItemAndImageViewForm
          itemID={selectedItem}
          closeForm={handleCloseViewItemImage}
        />
      )}
    </div>
  );
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
};

const buttonStyle = {
  borderRadius: "50%",
  minWidth: "50px",
  height: "50px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "0",
};

export default ItemList;
