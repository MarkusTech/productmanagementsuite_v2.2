import React, { useState, useEffect, useCallback } from "react";
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
  List,
  ListItem,
  ListItemButton,
  Menu,
  CircularProgress,
  Box,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import {
  createPurchaseOrderAndItems,
  fetchLocations,
} from "../../../services/purchaseOrder/purchaseOrderService";
import axios from "axios";

const SalesTransaction = ({ closeForm }) => {
  const userState = useSelector((state) => state.user.userInfo);
  const roleID = userState?.roleID;

  const [formData, setFormData] = useState({
    transactionTypeID: "",
    locationID: "",
    customerID: "",
    paymentTypeID: "",
    transactionNumber: "",
    status: "Pending",
    totalItems: 0,
    totalQuantity: 0,
    totalPurchase: 0,
    purchaseOrderItems: [],
  });

  const [customerFormData, setCustomerFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    contactNo: "",
    address: "",
    customerTypeID: "",
    email: "",
  });

  const [salesItems, setSalesItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPurchase, setTotalPurchase] = useState(0.0);
  const [paymentAmount, setPaymentAmount] = useState("");

  const handlePaymentAmountChange = (e) => {
    const value = e.target.value;

    // Validate numeric input if needed
    if (!isNaN(value)) {
      setPaymentAmount(value);
    }
  };

  const calculateTotals = useCallback(() => {
    const itemsCount = formData.purchaseOrderItems.length;

    // Ensure that orderQty and price are treated as numbers
    const quantitySum = formData.purchaseOrderItems.reduce((sum, item) => {
      return sum + (Number(item.orderQty) || 0); // Convert orderQty to number and add to sum
    }, 0);

    const purchaseSum = formData.purchaseOrderItems.reduce((sum, item) => {
      return sum + (Number(item.orderQty) || 0) * (Number(item.price) || 0); // Convert orderQty and price to numbers
    }, 0);

    // Update individual state variables
    setTotalItems(itemsCount);
    setTotalQuantity(quantitySum);
    setTotalPurchase(purchaseSum.toFixed(2)); // Format to two decimal places
  }, [formData.purchaseOrderItems]); // Add formData.purchaseOrderItems as a dependency

  const generateTransactionNumber = () => {
    return Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
  };

  const transactionNumbersss = generateTransactionNumber();

  const currentDate = new Date().toLocaleDateString(); // Formats the current date

  useEffect(() => {
    setSalesItems(formData.purchaseOrderItems);
    calculateTotals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.purchaseOrderItems]);

  const [locations, setLocations] = useState([]);
  const [items, setItems] = useState([]);
  const [transactionType, setTransactionType] = useState([]);
  const [customerTypes, setCustomerTypes] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [error, setError] = useState(null);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDropdownData();
    fetchTransactionType();
    fetchCustomers();
    fetchCustomerTypes();
    fetchPaymentTypes();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const locationData = await fetchLocations();
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

  const fetchPaymentTypes = async () => {
    try {
      const response = await fetch("/api/v3/transaction/payment-types");
      const data = await response.json();
      if (data.success) {
        setPaymentTypes(data.data);
      }
    } catch (error) {
      console.error("Error fetching payment types:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerTypes = async () => {
    try {
      const response = await axios.get("/api/v2/customer-types");
      if (response.data.success) {
        setCustomerTypes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching customer types:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("/api/v2/customers");
      if (response.data.success) {
        setCustomers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      if (!formData.locationID) {
        setItems([]);
        return;
      }

      try {
        const response = await axios.get(
          `/api/v2/inventory-items/sellable/${formData.locationID}`
        );
        if (response.data.inventoryItems) {
          const items = response.data.inventoryItems.map((inventoryItem) => ({
            ...inventoryItem.item,
            quantity: inventoryItem.quantity,
          }));
          setItems(items);
        } else {
          setError("Failed to load inventory items data.");
        }
      } catch (err) {
        console.error("Error fetching inventory items:", err);
        setError("Failed to fetch inventory items.");
      }
    };

    fetchItems();
  }, [formData.locationID]);

  const [customerReceipt, setCustomerReceipt] = useState("");
  // Handle customer selection
  const handleCustomerSelect = (customerID) => {
    const selectedCustomer = customers.find(
      (customer) => customer.customerID === customerID
    );

    if (selectedCustomer) {
      setCustomerFormData({
        firstName: selectedCustomer.firstName,
        middleName: selectedCustomer.middleName,
        lastName: selectedCustomer.lastName,
        contactNo: selectedCustomer.contactNo,
        address: selectedCustomer.address,
        customerTypeID: selectedCustomer.customerType.customerTypeID,
        email: selectedCustomer.email,
      });

      setFormData((prevState) => ({
        ...prevState,
        customerID: customerID, // Update customerID in formData
      }));
      setCustomerReceipt(
        selectedCustomer.firstName +
          " " +
          selectedCustomer.middleName +
          " " +
          selectedCustomer.lastName
      );
      setAnchorEl(null); // Close the menu
    }
  };

  const handleClearCustomerData = () => {
    setCustomerFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      contactNo: "",
      address: "",
      customerTypeID: "",
      email: "",
    });
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle changes to order quantity
  const handleOrderQtyChange = (index, event) => {
    const newQty = event.target.value;
    const updatedItems = [...salesItems];
    updatedItems[index].orderQty = newQty;
    updatedItems[index].total =
      updatedItems[index].orderQty * updatedItems[index].price; // Recalculate total
    setSalesItems(updatedItems); // Update salesItems state
    updateFormData(updatedItems); // Also update formData with the new items
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      purchaseOrderItems: prev.purchaseOrderItems.filter((_, i) => i !== index),
    }));
  };

  // Helper function to update formData
  const updateFormData = (updatedItems) => {
    const totalItems = updatedItems.length;
    const totalQuantity = updatedItems.reduce(
      (sum, item) => sum + item.orderQty,
      0
    );
    const totalPurchase = updatedItems.reduce(
      (sum, item) => sum + item.total,
      0
    );

    setFormData({
      ...formData,
      purchaseOrderItems: updatedItems, // Update items list in formData
      totalItems: totalItems,
      totalQuantity: totalQuantity,
      totalPurchase: totalPurchase.toFixed(2), // Format totalPurchase to 2 decimal places
    });
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

  // save Transaction
  const saveTransaction = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save this transaction?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "No, cancel",
      background: "#f4f4f9",
      color: "#1d72b8",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#dc3545",
      backdrop: "rgba(0, 0, 0, 0.4)",
    });

    if (result.isConfirmed) {
      try {
        const transactionData = {
          locationID: formData.locationID,
          customerID: formData.customerID,
          paymentTypeID: formData.paymentTypeID,
          transactionTypeID: formData.transactionTypeID,
          transactionNumber: Math.floor(transactionNumbersss),
          status: "Pending",
          totalItems: totalItems,
          totalQuantity: totalQuantity,
          totalPurchase: Math.floor(totalPurchase),
        };

        const response = await axios.post(
          "http://localhost:5000/api/v3/transaction",
          transactionData
        );

        if (response.data.success) {
          const salesTransactionID = response.data.data.salesTransactionID;

          const salesItems = formData.purchaseOrderItems.map((item) => ({
            salesTransactionID: salesTransactionID,
            itemID: item.itemID,
            qty: Math.floor(item.orderQty),
            price: item.price,
            total: item.orderQty * item.price,
          }));

          const saveSalesItemsResponse = await axios.post(
            "http://localhost:5000/api/v3/transaction/saveSalesItems",
            { items: salesItems }
          );

          if (saveSalesItemsResponse.data.success) {
            Swal.fire({
              title: "Success",
              text: "Transaction has been saved successfully.",
              icon: "success",
              background: "#f4f4f9",
              color: "#28a745",
              confirmButtonText: "Okay",
              confirmButtonColor: "#28a745",
              backdrop: "rgba(0, 0, 0, 0.4)",
            }).then(() => {
              // Reload the page after success
              window.location.reload();
            });
          } else {
            Swal.fire({
              title: "Error",
              text: "Failed to save sales items.",
              icon: "error",
              background: "#fff5f5",
              color: "#dc3545",
              confirmButtonColor: "#dc3545",
            });
          }
        } else {
          Swal.fire({
            title: "Error",
            text: "Failed to save transaction.",
            icon: "error",
            background: "#fff5f5",
            color: "#dc3545",
            confirmButtonColor: "#dc3545",
          });
        }
      } catch (error) {
        console.error("Error saving transaction:", error);
        Swal.fire({
          title: "Error",
          text: "An error occurred while saving the transaction.",
          icon: "error",
          background: "#fff5f5",
          color: "#dc3545",
          confirmButtonColor: "#dc3545",
        });
      }
    } else {
      Swal.fire({
        title: "Cancelled",
        text: "Transaction was not saved.",
        icon: "info",
        background: "#f0f8ff",
        color: "#007bff",
        confirmButtonText: "OK",
        confirmButtonColor: "#007bff",
        backdrop: "rgba(0, 0, 0, 0.4)",
      });
    }
  };

  // Canceled
  const canceledTransaction = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this transaction?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
      background: "#f4f4f9",
      color: "#dc3545",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#28a745",
      backdrop: "rgba(0, 0, 0, 0.4)",
    });

    if (result.isConfirmed) {
      try {
        const transactionData = {
          locationID: formData.locationID,
          customerID: formData.customerID,
          paymentTypeID: formData.paymentTypeID,
          transactionTypeID: formData.transactionTypeID,
          transactionNumber: Math.floor(transactionNumbersss),
          status: "Canceled",
          totalItems: totalItems,
          totalQuantity: totalQuantity,
          totalPurchase: Math.floor(totalPurchase),
        };

        const response = await axios.post(
          "http://localhost:5000/api/v3/transaction",
          transactionData
        );

        if (response.data.success) {
          const salesTransactionID = response.data.data.salesTransactionID;

          const salesItems = formData.purchaseOrderItems.map((item) => ({
            salesTransactionID: salesTransactionID,
            itemID: item.itemID,
            qty: Math.floor(item.orderQty),
            price: item.price,
            total: item.orderQty * item.price,
          }));

          const saveSalesItemsResponse = await axios.post(
            "http://localhost:5000/api/v3/transaction/saveSalesItems",
            { items: salesItems }
          );

          if (saveSalesItemsResponse.data.success) {
            Swal.fire({
              title: "Canceled",
              text: "Transaction Canceled Successfully.",
              background: "#f4f4f9",
              color: "#28a745",
              confirmButtonText: "OK",
              confirmButtonColor: "#28a745",
              backdrop: "rgba(0, 0, 0, 0.4)",
            }).then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire("Error", "Failed to save sales items.", "error");
          }
        } else {
          Swal.fire("Error", "Failed to save transaction.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Error saving transaction.", "error");
      }
    } else {
      Swal.fire({
        title: "Cancelled",
        text: "Your transaction was not cancelled.",
        icon: "info",
        background: "#e7f3ff",
        color: "#0d6efd",
        confirmButtonText: "OK",
        confirmButtonColor: "#0d6efd",
        backdrop: "rgba(0, 0, 0, 0.3)",
      });
    }
  };

  // completed
  const completeTransaction = async () => {
    // Check if paymentAmount is valid
    if (!paymentAmount || Number(paymentAmount) !== Math.floor(totalPurchase)) {
      return Swal.fire({
        title: "Payment Mismatch",
        text: "Payment Amount is either empty or does not match the Total Purchase amount.",
        icon: "warning",
        background: "#fff5f5",
        color: "#dc3545",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc3545",
        backdrop: "rgba(0, 0, 0, 0.4)",
      });
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to complete this transaction?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, complete it!",
      cancelButtonText: "No, cancel",
      background: "#f4f4f9",
      color: "#1d72b8",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#dc3545",
      backdrop: "rgba(0, 0, 0, 0.4)",
    });

    if (result.isConfirmed) {
      try {
        const transactionData = {
          locationID: formData.locationID,
          customerID: formData.customerID,
          paymentTypeID: formData.paymentTypeID,
          transactionTypeID: formData.transactionTypeID,
          transactionNumber: Math.floor(transactionNumbersss),
          status: "Completed",
          totalItems: totalItems,
          totalQuantity: totalQuantity,
          totalPurchase: Math.floor(totalPurchase),
        };

        const response = await axios.post(
          "http://localhost:5000/api/v3/transaction",
          transactionData
        );

        if (response.data.success) {
          const salesTransactionID = response.data.data.salesTransactionID;

          const salesItems = formData.purchaseOrderItems.map((item) => ({
            salesTransactionID: salesTransactionID,
            itemID: item.itemID,
            qty: Math.floor(item.orderQty),
            price: item.price,
            total: item.orderQty * item.price,
          }));

          const saveSalesItemsResponse = await axios.post(
            "http://localhost:5000/api/v3/transaction/saveSalesItems",
            { items: salesItems }
          );

          if (saveSalesItemsResponse.data.success) {
            // Display Success Message
            Swal.fire({
              title: "Success",
              text: "Transaction has been completed successfully.",
              icon: "success",
              background: "#f4f4f9",
              color: "#28a745",
              confirmButtonText: "Okay",
              confirmButtonColor: "#28a745",
              backdrop: "rgba(0, 0, 0, 0.4)",
            }).then(() => {
              // Generate and Print Receipt
              generateReceipt(
                Math.floor(transactionNumbersss),
                formData.customerName, // Assuming you have the customer name in formData
                totalItems,
                totalQuantity,
                totalPurchase,
                paymentAmount
              );
              window.location.href = "/sales";
            });
          } else {
            Swal.fire({
              title: "Error",
              text: "Failed to save sales items.",
              icon: "error",
              background: "#fff5f5",
              color: "#dc3545",
              confirmButtonColor: "#dc3545",
            });
          }
        } else {
          Swal.fire({
            title: "Error",
            text: "Failed to complete transaction.",
            icon: "error",
            background: "#fff5f5",
            color: "#dc3545",
            confirmButtonColor: "#dc3545",
          });
        }
      } catch (error) {
        console.error("Error completing transaction:", error);
        Swal.fire({
          title: "Error",
          text: "An error occurred while completing the transaction.",
          icon: "error",
          background: "#fff5f5",
          color: "#dc3545",
          confirmButtonColor: "#dc3545",
        });
      }
    } else {
      Swal.fire({
        title: "Cancelled",
        text: "Transaction was not completed.",
        icon: "info",
        background: "#f0f8ff",
        color: "#007bff",
        confirmButtonText: "OK",
        confirmButtonColor: "#007bff",
        backdrop: "rgba(0, 0, 0, 0.4)",
      });
    }
  };

  // Function to generate and print the receipt
  function generateReceipt(
    transactionNumber,
    customerName,
    totalItems,
    totalQuantity,
    totalPurchase,
    paymentAmount
  ) {
    const receiptHTML = `
    <html>
      <head>
        <title>Receipt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f4f4f9;
          }
          .receipt {
            width: 300px;
            margin: 0;
            border: 1px solid #ddd;
            padding: 20px;
            text-align: center;
          }
          .receipt-header {
            font-weight: bold;
            margin-bottom: 10px;
          }
          .receipt-details {
            margin-top: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: center; /* Center content horizontally */
          }
          .receipt-details div {
            width: 100%;
            display: flex;
            justify-content: space-between;
            text-align: left;
          }
          .receipt-footer {
            margin-top: 20px;
            font-size: 14px;
          }
          .total {
            font-weight: bold;
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .receipt {
              border: none;
              width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="receipt-header">
            <h3>Receipt</h3>
            <p>Transaction Number: ${transactionNumber}</p>
          </div>
          <div class="receipt-details">
            <div><strong>Customer Name:</strong><span>${customerReceipt}</span></div>
            <div><strong>Total Items:</strong><span>${totalItems}</span></div>
            <div><strong>Total Quantity:</strong><span>${totalQuantity}</span></div>
            <div><strong>Total Purchase:</strong><span>₱${totalPurchase.toLocaleString()}</span></div>
            <div><strong>Payment Amount:</strong><span>₱${paymentAmount.toLocaleString()}</span></div>
          </div>
          <div class="receipt-footer">
            <p>Thank you for your purchase!</p>
          </div>
        </div>
        <script>
          window.print();
        </script>
      </body>
    </html>
  `;

    const printWindow = window.open("", "", "height=400,width=600");
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  }

  return (
    <div style={styles.formContainer}>
      <IconButton
        style={styles.closeButton}
        onClick={closeForm}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>

      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        Create Sales Transaction
      </Typography>

      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <div style={styles.salesTransactionTable}>
        <div style={styles.divContainer}>
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
                    <MenuItem
                      key={location.locationID}
                      value={location.locationID}
                    >
                      {location.locationName}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* Trasaction Types */}
              <Grid item xs={6}>
                <Select
                  name="transactionTypeID" // Name must match the key in formData
                  value={formData.transactionTypeID} // Value should reflect the state for the selected transaction type
                  onChange={handleChange} // Ensure that this triggers handleChange to update state
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

              <Grid item xs={12}>
                <p sx={{ fontWeight: "bold" }}>Customers Information</p>
              </Grid>

              {/* button */}
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  Select Customer
                </Button>

                {/* task */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                  PaperProps={{
                    style: { maxHeight: 400, width: 500 }, // Adjusted width to 500px
                  }}
                >
                  {/* Search Input */}
                  <MenuItem>
                    <input
                      type="text"
                      placeholder="Search Customers"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      style={{
                        width: "100%",
                        border: "none",
                        outline: "none",
                        padding: "5px",
                      }}
                    />
                  </MenuItem>

                  {/* Header */}
                  <MenuItem
                    disabled
                    style={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}
                  >
                    <div style={{ display: "flex", width: "100%" }}>
                      <span style={{ flex: 1 }}>Name</span>
                      <span style={{ flex: 1 }}>Contact No</span>
                      <span style={{ flex: 1 }}>Type</span>
                    </div>
                  </MenuItem>

                  {/* Customer List */}
                  {customers.length > 0 ? (
                    <List>
                      {customers.map((customer) => (
                        <ListItem key={customer.customerID} disablePadding>
                          <ListItemButton
                            onClick={() =>
                              handleCustomerSelect(customer.customerID)
                            }
                          >
                            <div style={{ display: "flex", width: "500px" }}>
                              <span style={{ flex: 1 }}>
                                {`${customer.firstName} ${customer.middleName} ${customer.lastName}`}
                              </span>
                              <span style={{ flex: 1 }}>
                                {customer.contactNo}
                              </span>
                              <span style={{ flex: 1 }}>
                                {customer.customerType.TypeName}
                              </span>
                            </div>
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <MenuItem disabled>No Customers Found</MenuItem>
                  )}
                </Menu>
              </Grid>

              {/* Names */}
              <Grid item xs={4}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={customerFormData.firstName}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Middle Name"
                  name="middleName"
                  value={customerFormData.middleName}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={customerFormData.lastName}
                  fullWidth
                  required
                />
              </Grid>

              {/* Second Row */}
              <Grid item xs={4}>
                <TextField
                  label="Contact No"
                  name="contactNo"
                  value={customerFormData.contactNo}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  label="Address"
                  name="address"
                  value={customerFormData.address}
                  fullWidth
                  required
                />
              </Grid>

              {/* Third Row */}
              <Grid item xs={4}>
                <Select
                  name="customerTypeID"
                  value={customerFormData.customerTypeID}
                  displayEmpty
                  fullWidth
                  required
                >
                  <MenuItem value="" disabled>
                    Select Customer Type
                  </MenuItem>
                  {customerTypes.map((type) => (
                    <MenuItem
                      key={type.customerTypeID}
                      value={type.customerTypeID}
                    >
                      {type.TypeName}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* Email Field */}
              <Grid item xs={8}>
                <TextField
                  label="Email"
                  name="email"
                  value={customerFormData.email}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleClearCustomerData} // Add this handler
                  fullWidth
                >
                  Clear Customer Information
                </Button>
              </Grid>

              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: "bold" }}>
                          ITEM ID
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          ITEM NAME
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          QTY
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          PRICE
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          TOTAL
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.purchaseOrderItems.length > 0 ? (
                        formData.purchaseOrderItems.map((item, index) => {
                          const total = item.orderQty * item.price;
                          return (
                            <TableRow key={index} sx={{ height: "40px" }}>
                              {" "}
                              {/* Set height for row */}
                              <TableCell sx={{ padding: "4px" }}>
                                {item.itemID}
                              </TableCell>{" "}
                              {/* Reduce padding */}
                              <TableCell sx={{ padding: "4px" }}>
                                {item.itemName}
                              </TableCell>{" "}
                              {/* Reduce padding */}
                              <TableCell sx={{ padding: "4px" }}>
                                <TextField
                                  type="text"
                                  value={item.orderQty}
                                  onChange={(e) =>
                                    handleOrderQtyChange(index, e)
                                  }
                                  fullWidth
                                  inputProps={{
                                    inputMode: "numeric",
                                    pattern: "[0-9]*",
                                  }}
                                  sx={{ width: "80px", padding: "4px" }} // Reduce padding for textfield
                                />
                              </TableCell>
                              <TableCell sx={{ padding: "4px" }}>
                                {item.price}
                              </TableCell>
                              <TableCell sx={{ padding: "4px" }}>
                                {total.toFixed(2)}
                              </TableCell>
                              <TableCell sx={{ padding: "4px" }}>
                                <IconButton
                                  onClick={() => removeItem(index)}
                                  aria-label="delete"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            No items added
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              {/* Add Item Button */}
              <Grid item xs={3}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setIsItemDialogOpen(true)}
                  fullWidth
                >
                  Add Item
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
                      <TableCell style={{ fontWeight: "bold" }}>
                        Available QTY
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>
                        Price
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.itemID}>
                        <TableCell>{item.itemCode}</TableCell>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
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
              <Button
                onClick={() => setIsItemDialogOpen(false)}
                color="secondary"
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        {/* ------------------------------------------------------------------------------------- */}
        <div style={styles.divContainer}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <p>Payment Information</p>
              </Grid>
              {/* Payment Type */}
              <Grid item xs={6}>
                <Select
                  name="paymentTypeID"
                  value={formData.paymentTypeID}
                  onChange={handleChange}
                  required
                  fullWidth
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Payment Type
                  </MenuItem>
                  {loading ? (
                    <MenuItem disabled>
                      <CircularProgress size={24} />
                    </MenuItem>
                  ) : (
                    paymentTypes.map((paymentType) => (
                      <MenuItem
                        key={paymentType.paymentTypeID}
                        value={paymentType.paymentTypeID}
                      >
                        {paymentType.paymentName}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </Grid>

              {/* Payment Amount */}
              <Grid item xs={6}>
                <TextField
                  name="paymentAmount"
                  label="Payment Amount"
                  value={paymentAmount} // Bind input to paymentAmount state
                  onChange={handlePaymentAmountChange} // Handle input change
                  required
                  fullWidth
                  InputProps={{
                    inputMode: "numeric", // Ensure numeric input
                  }}
                />
              </Grid>

              {/* Transaction */}
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: "bold" }}>
                  Trasaction Summary
                </Typography>
              </Grid>

              {/* Transaction Number */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Transaction Number:</Typography>
                  <Typography variant="body1">
                    {transactionNumbersss}
                  </Typography>
                </Box>
              </Grid>

              {/* Transaction Date */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Transaction Date:</Typography>
                  <Typography variant="body1">{currentDate}</Typography>
                </Box>
              </Grid>

              {/* Status */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Status:</Typography>
                  <Typography variant="body1">{formData.status}</Typography>
                </Box>
              </Grid>

              {/* Location */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Location:</Typography>
                  <Typography variant="body1">
                    {locations.find(
                      (location) => location.locationID === formData.locationID
                    )?.locationName || "No Location Selected"}
                  </Typography>
                </Box>
              </Grid>

              {/* Transaction Type */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Transaction Type:</Typography>
                  <Typography variant="body1">
                    {transactionType.find(
                      (type) =>
                        type.transactionTypeID === formData.transactionTypeID
                    )?.transactionName || "No Type Selected"}
                  </Typography>
                </Box>
              </Grid>

              {/* Payment Type */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Payment Type:</Typography>
                  <Typography variant="body1">
                    {paymentTypes.find(
                      (payment) =>
                        payment.paymentTypeID === formData.paymentTypeID
                    )?.paymentName || "No Payment Type Selected"}
                  </Typography>
                </Box>
              </Grid>

              {/* Total Items */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Total Items:</Typography>
                  <Typography variant="body1">{totalItems}</Typography>
                </Box>
              </Grid>

              {/* Total Quantity */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Total Quantity:</Typography>
                  <Typography variant="body1">{totalQuantity}</Typography>
                </Box>
              </Grid>

              {/* Total Purchase */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Total Purchase:</Typography>
                  <Typography variant="body1">
                    ₱{new Intl.NumberFormat("en-US").format(totalPurchase)}
                  </Typography>
                </Box>
              </Grid>

              {/* Divider for visual separation */}
              <Grid item xs={12}>
                <Divider sx={{ marginY: 2 }} />
              </Grid>

              {/* Buttons Container */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={canceledTransaction}
                  >
                    Cancel Transaction
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={saveTransaction}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={completeTransaction}
                  >
                    Complete Transaction
                  </Button>
                </Box>
              </Grid>
            </Grid>

            <br />
            <br />
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  formContainer: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "1350px",
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
  salesTransactionTable: {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
  },
  divContainer: {
    borderRadius: "10px",
    padding: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Added shadow
  },
};

export default SalesTransaction;
