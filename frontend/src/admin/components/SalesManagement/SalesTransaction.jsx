import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  TextField,
  Button,
  Grid,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import {
  createPurchaseOrderAndItems,
  fetchSuppliers,
  fetchLocations,
} from "../../../services/purchaseOrder/purchaseOrderService";
import axios from "axios";

const SalesTransaction = () => {
  const userState = useSelector((state) => state.user.userInfo);
  const roleID = userState?.roleID;

  const [formData, setFormData] = useState({
    supplierID: "",
    locationID: "",
    transactionType: "",

    orderDate: "",
    expectedDeliverDate: "",
    status: "Pending",
    createdByID: roleID,
    modifiedByID: null,
    referenceNo: "",
    remarks: "",
    purchaseOrderItems: [],
  });

  const [suppliers, setSuppliers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [items, setItems] = useState([]);
  const [transactionType, setTransactionType] = useState([]);
  const [error, setError] = useState(null);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);

  // Fetch suppliers, locations, and items on component mount
  useEffect(() => {
    fetchDropdownData();
    fetchItems();
    fetchTransactionType();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const supplierData = await fetchSuppliers();
      const locationData = await fetchLocations();
      setSuppliers(supplierData);
      setLocations(locationData);
    } catch (err) {
      console.error("Error fetching suppliers or locations:", err);
      setError("Failed to load supplier or location data.");
    }
  };

  const fetchTransactionType = async () => {
    try {
      const response = await axios.get("/api/v3/transaction/transaction-types");
      if (response.data.success) {
        setTransactionType(response.data.data);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to Fetch Transaction Type");
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get("/api/v1/items");
      if (response.data.success) {
        setItems(response.data.data);
      } else {
        setError("Failed to load item data.");
      }
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Failed to fetch items.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOrderQtyChange = (index, e) => {
    const updatedItems = [...formData.purchaseOrderItems];
    const orderQty = parseInt(e.target.value, 10) || 0;
    updatedItems[index].orderQty = orderQty;
    setFormData((prev) => ({
      ...prev,
      purchaseOrderItems: updatedItems,
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      purchaseOrderItems: prev.purchaseOrderItems.filter((_, i) => i !== index),
    }));
  };

  const addItemToOrder = (item) => {
    const newItem = {
      ...item,
      orderQty: 1,
    };
    setFormData((prev) => ({
      ...prev,
      purchaseOrderItems: [...prev.purchaseOrderItems, newItem],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedOrderDate = new Date(formData.orderDate).toISOString();
    const formattedExpectedDeliverDate = new Date(
      formData.expectedDeliverDate
    ).toISOString();

    const purchaseOrderData = {
      ...formData,
      orderDate: formattedOrderDate,
      expectedDeliverDate: formattedExpectedDeliverDate,
      createdByID: roleID,
    };

    try {
      const response = await createPurchaseOrderAndItems(purchaseOrderData);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Purchase Order Created!",
          text: "The new purchase order and its items have been successfully created.",
          confirmButtonText: "Okay",
          customClass: {
            confirmButton: "swal-confirm-button",
          },
        });
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || "An unknown error occurred");
    }
  };

  return (
    <div style={styles.formContainer}>
      <IconButton
        style={styles.closeButton}
        // onClick={closeForm}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="h4" align="center" gutterBottom>
        Create New Purchase Order
      </Typography>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Location Dropdown */}
          <Grid item xs={6}>
            <Select
              name="locationID"
              value={formData.locationID}
              onChange={handleChange}
              required
              fullWidth
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Location
              </MenuItem>
              {locations.map((location) => (
                <MenuItem key={location.locationID} value={location.locationID}>
                  {location.locationName}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Trasaction Type */}
          <Grid item xs={6}>
            <Select
              name="transactionType"
              value={formData.transactionType}
              onChange={handleChange}
              required
              fullWidth
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Transaction
              </MenuItem>
              {transactionType.map((type) => (
                <MenuItem
                  key={type.transactionTypeID}
                  value={type.transactionTypeID}
                >
                  {type.transactionName}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Supplier Dropdown */}
          <Grid item xs={6}>
            <Select
              name="supplierID"
              value={formData.supplierID}
              onChange={handleChange}
              required
              fullWidth
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Supplier
              </MenuItem>
              {suppliers.map((supplier) => (
                <MenuItem key={supplier.supplierID} value={supplier.supplierID}>
                  {supplier.supplierName}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Dates */}
          <Grid item xs={6}>
            <TextField
              label="Order Date"
              name="orderDate"
              type="date"
              value={formData.orderDate}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Expected Delivery Date"
              name="expectedDeliverDate"
              type="date"
              value={formData.expectedDeliverDate}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/* Additional Information */}
          <Grid item xs={12}>
            <TextField
              label="Reference Number"
              name="referenceNo"
              value={formData.referenceNo}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Item ID
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Item Name
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>UOM</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Unit Cost
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Order Quantity
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.purchaseOrderItems.length > 0 ? (
                    formData.purchaseOrderItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.itemID}</TableCell>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.uom}</TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={item.orderQty}
                            onChange={(e) => handleOrderQtyChange(index, e)}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => removeItem(index)}
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No items added
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Add Item Button */}
          <Grid item xs={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsItemDialogOpen(true)}
              fullWidth
            >
              Add Item
            </Button>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create Purchase Order
            </Button>
          </Grid>
        </Grid>
        <br />
        <br />
      </form>

      {/* Add Item Dialog */}
      <Dialog
        open={isItemDialogOpen}
        onClose={() => setIsItemDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Select Item</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Item Code
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Description
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Price</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.itemID}>
                    <TableCell>{item.itemCode}</TableCell>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          addItemToOrder(item);
                          setIsItemDialogOpen(false);
                        }}
                      >
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsItemDialogOpen(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const styles = {
  formContainer: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "1000px",
    backgroundColor: "#fff",
    padding: "20px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    zIndex: 1000,
    overflow: "auto",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
  },
};

export default SalesTransaction;
