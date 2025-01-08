import React, { useState, useEffect } from "react";
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
  Box,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import axios from "axios";

const ViewSalesTransaction = ({ salesTransactionID, closeForm }) => {
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [totalPurchase, setTotalPurchase] = useState(0.0);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [customerReceipt, setCustomerReceipt] = useState("");
  const [error, setError] = useState(null);

  const removeTransactionID = salesTransactionID;
  const voidTransactionID = salesTransactionID;

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v3/transaction/${salesTransactionID}`
        );
        const result = await response.json();

        if (result.success) {
          setTransactionDetails(result.data);
          setTotalPurchase(result.data.totalPurchase);
          setCustomerReceipt(result.data.customer.lastName);
        } else {
          setError("Failed to fetch transaction details.");
        }
      } catch (err) {
        setError("An error occurred while fetching transaction details.");
      } finally {
      }
    };

    fetchTransactionDetails();
  }, [salesTransactionID]);

  console.log(`wmr: ${salesTransactionID}`);

  const handlePaymentAmountChange = (event) => {
    const value = event.target.value;
    if (!isNaN(value) && value >= 0) {
      setPaymentAmount(value);
    }
  };

  // Void Transaction
  const voidTransaction = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to void this transaction?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, void it!",
      cancelButtonText: "No, cancel",
      background: "#f4f4f9",
      color: "#dc3545",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#28a745",
      backdrop: "rgba(0, 0, 0, 0.4)",
    });

    if (!result.isConfirmed) {
      return Swal.fire({
        title: "Cancelled",
        text: "Transaction was not voided.",
        icon: "info",
        background: "#e7f3ff",
        color: "#0d6efd",
        confirmButtonText: "OK",
        confirmButtonColor: "#0d6efd",
        backdrop: "rgba(0, 0, 0, 0.3)",
      });
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/v3/transaction/void-transaction/${voidTransactionID}`
      );

      if (!response.data.success) {
        throw new Error("Failed to void transaction.");
      }

      // Success
      Swal.fire({
        title: "Success",
        text: "Transaction has been voided successfully.",
        icon: "success",
        background: "#f4f4f9",
        color: "#28a745", // Green color for success
        confirmButtonText: "Okay",
        confirmButtonColor: "#28a745", // Green for confirm button
        backdrop: "rgba(0, 0, 0, 0.4)",
      }).then(() => {
        // Optionally, redirect or perform any other actions after voiding the transaction
        window.location.href = "/sales"; // Example redirect
      });
    } catch (error) {
      console.error("Error voiding transaction:", error.message);
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        background: "#fff5f5",
        color: "#dc3545", // Red color for error
        confirmButtonColor: "#dc3545",
      });
    }
  };

  // completed
  const completeTransaction = async () => {
    // Validate Payment Amount
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

    if (!result.isConfirmed) {
      return Swal.fire({
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

    try {
      // Prepare Transaction Data
      const transactionData = {
        locationID: transactionDetails.locationID,
        customerID: transactionDetails.customerID,
        paymentTypeID: transactionDetails.paymentTypeID,
        transactionTypeID: transactionDetails.transactionTypeID,
        transactionNumber: transactionDetails.transactionNumber,
        status: "Completed",
        totalItems: transactionDetails.totalItems,
        totalQuantity: transactionDetails.totalQuantity,
        totalPurchase: transactionDetails.totalPurchase,
      };

      const response = await axios.post(
        "http://localhost:5000/api/v3/transaction",
        transactionData
      );

      if (!response.data.success) {
        throw new Error("Failed to complete transaction.");
      }

      const salesTransactionID = response.data.data.salesTransactionID;

      // Map and Save Sales Items
      const salesItems = transactionDetails.salesTransactionItems.map(
        (item) => ({
          salesTransactionID,
          itemID: item.item.itemID,
          qty: item.qty,
          price: item.price,
          total: item.qty * item.price,
        })
      );

      const saveSalesItemsResponse = await axios.post(
        "http://localhost:5000/api/v3/transaction/saveSalesItems",
        { items: salesItems }
      );

      if (!saveSalesItemsResponse.data.success) {
        throw new Error("Failed to save sales items.");
      }

      // After successfully saving sales items, delete the old sales transaction
      const deleteTransactionResponse = await axios.delete(
        `http://localhost:5000/api/v3/transaction/delete-transaction/${removeTransactionID}`
      );

      if (!deleteTransactionResponse.data.success) {
        throw new Error("Failed to delete old sales transaction.");
      }

      // Success
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
        generateReceipt(
          Math.floor(transactionDetails.transactionNumber),
          transactionDetails.customer.lastName,
          transactionDetails.totalItems,
          transactionDetails.totalQuantity,
          transactionDetails.totalPurchase,
          paymentAmount
        );
        window.location.href = "/sales";
      });
    } catch (error) {
      console.error("Error completing transaction:", error.message);
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        background: "#fff5f5",
        color: "#dc3545",
        confirmButtonColor: "#dc3545",
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
                  {transactionDetails?.status === "Completed" ? (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={voidTransaction}
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
