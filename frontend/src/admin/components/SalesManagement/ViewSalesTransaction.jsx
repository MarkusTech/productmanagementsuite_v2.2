import React, { useState, useEffect, useCallback } from "react";
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
import axios from "axios";

const ViewSalesTransaction = ({ salesTransactionID, closeForm }) => {
  const [transactionDetails, setTransactionDetails] = useState(null);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/v3/transaction/${salesTransactionID}`
        );
        const result = await response.json();

        if (result.success) {
          setTransactionDetails(result.data);
        } else {
          setError("Failed to fetch transaction details.");
        }
      } catch (err) {
        setError("An error occurred while fetching transaction details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [salesTransactionID]);

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
  const [customerReceipt, setCustomerReceipt] = useState("");

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
                formData.customerName,
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
        View Sales Transaction
      </Typography>

      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <div style={styles.salesTransactionTable}>
        <div style={styles.divContainer}>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="locationID"
                  value={transactionDetails?.location?.locationName || ""}
                  required
                  fullWidth
                  placeholder="Enter Location"
                  disabled={!transactionDetails?.location}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="transactionNumber"
                  value={
                    transactionDetails?.transactionType?.transactionName || ""
                  }
                  required
                  fullWidth
                  placeholder="Transaction Type"
                  InputProps={{
                    readOnly: true,
                  }}
                  disabled={!transactionDetails?.transactionType}
                />
              </Grid>

              <Grid item xs={12}>
                <p sx={{ fontWeight: "bold" }}>Customers Information</p>
              </Grid>

              {/* Names */}
              <Grid item xs={4}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={
                    transactionDetails && transactionDetails.customer
                      ? transactionDetails.customer.firstName
                      : ""
                  }
                  fullWidth
                  required
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  label="Middle Name"
                  name="middleName"
                  value={
                    transactionDetails && transactionDetails.customer
                      ? transactionDetails.customer.middleName
                      : ""
                  }
                  fullWidth
                  required
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={
                    transactionDetails && transactionDetails.customer
                      ? transactionDetails.customer.lastName
                      : ""
                  }
                  fullWidth
                  required
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              {/* Second Row */}
              <Grid item xs={4}>
                <TextField
                  label="Contact No"
                  name="contactNo"
                  value={
                    transactionDetails && transactionDetails.customer
                      ? transactionDetails.customer.contactNo
                      : ""
                  }
                  fullWidth
                  required
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  label="Address"
                  name="address"
                  value={
                    transactionDetails && transactionDetails.customer
                      ? transactionDetails.customer.address
                      : ""
                  }
                  fullWidth
                  required
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              {/* Third Row */}
              <Grid item xs={4}>
                <TextField
                  label="Customer Type"
                  name="customerType"
                  value="VIP"
                  fullWidth
                  required
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              {/* Email Field */}
              <Grid item xs={8}>
                <TextField
                  label="Email"
                  name="email"
                  value={
                    transactionDetails && transactionDetails.customer
                      ? transactionDetails.customer.email
                      : ""
                  }
                  fullWidth
                  required
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button variant="outlined" color="secondary" fullWidth>
                  Clear Customer Information
                </Button>
              </Grid>

              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactionDetails?.salesTransactionItems?.length > 0 ? (
                        transactionDetails.salesTransactionItems.map(
                          (item, index) => {
                            const total = item.qty * item.price;
                            return (
                              <TableRow key={index} sx={{ height: "40px" }}>
                                <TableCell sx={{ padding: "4px" }}>
                                  {item.item?.itemName}
                                </TableCell>
                                <TableCell sx={{ padding: "4px" }}>
                                  {item.qty}
                                </TableCell>
                                <TableCell sx={{ padding: "4px" }}>
                                  ₱
                                  {item.price.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </TableCell>
                                <TableCell sx={{ padding: "4px" }}>
                                  ₱
                                  {total.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </TableCell>
                              </TableRow>
                            );
                          }
                        )
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            No items added
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
            <br />
            <br />
          </form>
        </div>
        {/* ------------------------------------------------------------------------------------- */}
        <div style={styles.divContainer}>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <p>Payment Information</p>
              </Grid>
              {/* Payment Type */}
              <Grid item xs={6}>
                <TextField
                  name="paymentTypeID"
                  value={transactionDetails?.paymentType?.paymentName || ""}
                  required
                  fullWidth
                  placeholder="Enter Payment Type"
                  disabled={!transactionDetails?.paymentType}
                />
              </Grid>

              {/* Payment Amount */}
              <Grid item xs={6}>
                <TextField
                  name="paymentAmount"
                  label="Payment Amount"
                  value={paymentAmount}
                  onChange={handlePaymentAmountChange}
                  required
                  fullWidth
                  InputProps={{
                    inputMode: "numeric",
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
                    {transactionDetails?.transactionNumber}
                  </Typography>
                </Box>
              </Grid>

              {/* Transaction Date */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Transaction Date:</Typography>
                  <Typography variant="body1">
                    {transactionDetails?.transactionDate}
                  </Typography>
                </Box>
              </Grid>

              {/* Status */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Status:</Typography>
                  <Typography variant="body1">
                    {transactionDetails?.status}
                  </Typography>
                </Box>
              </Grid>

              {/* Location */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Location:</Typography>
                  <Typography variant="body1">
                    {transactionDetails?.location?.locationName || "N/A"}
                  </Typography>
                </Box>
              </Grid>

              {/* Transaction Type */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Transaction Type:</Typography>
                  <Typography variant="body1">
                    {transactionDetails?.transactionType?.transactionName ||
                      "N/A"}
                  </Typography>
                </Box>
              </Grid>

              {/* Payment Type */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Payment Type:</Typography>
                  <Typography variant="body1">
                    {transactionDetails?.paymentType?.paymentName || "N/A"}
                  </Typography>
                </Box>
              </Grid>

              {/* Total Items */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Total Items:</Typography>
                  <Typography variant="body1">
                    {transactionDetails?.totalItems}
                  </Typography>
                </Box>
              </Grid>

              {/* Total Quantity */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Total Quantity:</Typography>
                  <Typography variant="body1">
                    {transactionDetails?.totalQuantity}
                  </Typography>
                </Box>
              </Grid>

              {/* Total Purchase */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Total Purchase:</Typography>
                  <Typography variant="body1">
                    ₱
                    {new Intl.NumberFormat("en-US").format(
                      transactionDetails?.totalPurchase
                    )}
                  </Typography>
                </Box>
              </Grid>

              {/* Divider for visual separation */}
              <Grid item xs={12}>
                <Divider sx={{ marginY: 2 }} />
              </Grid>

              {/* Buttons Container */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end">
                  {transactionDetails?.transactionStatus === "Completed" ? (
                    <Button
                      variant="outlined"
                      color="secondary"
                      // onClick={canceledTransaction}
                    >
                      Void Transaction
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={completeTransaction}
                    >
                      Complete Transaction
                    </Button>
                  )}
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
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
};

export default ViewSalesTransaction;
