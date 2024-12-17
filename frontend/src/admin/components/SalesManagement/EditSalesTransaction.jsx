import React from 'react'

const EditSalesTransaction = () => {
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

export default EditSalesTransaction