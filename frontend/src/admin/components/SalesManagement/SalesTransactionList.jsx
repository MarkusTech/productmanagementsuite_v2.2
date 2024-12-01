import React, { useState } from "react";
import Table from "../Table";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
// import TransactionTypeList from "./TransactionTypeList";
import SalesTransaction from "./SalesTransaction";

// Table headers for Sales Transaction
const categoryTableHead = [
  "Sales Transaction ID",
  "Transaction Number",
  "Location",
  "Transaction Type",
  "Payment Type",
  "Total Items",
  "Total Quantity",
  "Total Purchase",
  "Transaction Date",
  "Status",
  "Action",
];

// Rendering table header
const renderHead = (item, index) => <th key={index}>{item}</th>;

const SalesTransactionList = () => {
  // const [showTransactionTypeList, setShowTransactionTypeList] = useState(false);
  const [showSalesTransaction, setShowSalesTransaction] = useState(false);

  // const toggleTransactionTypeList = () => {
  //   setShowTransactionTypeList((prev) => !prev);
  // };

  const showSalesTransactionbutton = () => {
    setShowSalesTransaction(!showSalesTransaction);
  };

  const dummyData = [
    {
      salesTransactionID: 1,
      transactionNumber: 1001,
      location: "New York Store",
      transactionType: "Sale",
      paymentType: "Credit Card",
      totalItems: 3,
      totalQuantity: 5,
      totalPurchase: 149.99,
      transactionDate: "2024-11-28T12:30:00",
      status: "Completed",
    },
    {
      salesTransactionID: 2,
      transactionNumber: 1002,
      location: "Los Angeles Store",
      transactionType: "Sale",
      paymentType: "Cash",
      totalItems: 2,
      totalQuantity: 3,
      totalPurchase: 99.97,
      transactionDate: "2024-11-29T14:45:00",
      status: "Pending",
    },
    {
      salesTransactionID: 3,
      transactionNumber: 1003,
      location: "Chicago Store",
      transactionType: "Return",
      paymentType: "Credit Card",
      totalItems: 1,
      totalQuantity: 1,
      totalPurchase: 29.99,
      transactionDate: "2024-11-30T09:00:00",
      status: "Completed",
    },
    {
      salesTransactionID: 4,
      transactionNumber: 1004,
      location: "Miami Store",
      transactionType: "Sale",
      paymentType: "Debit Card",
      totalItems: 4,
      totalQuantity: 6,
      totalPurchase: 219.96,
      transactionDate: "2024-12-01T11:00:00",
      status: "Completed",
    },
    {
      salesTransactionID: 5,
      transactionNumber: 1005,
      location: "Dallas Store",
      transactionType: "Sale",
      paymentType: "Cash",
      totalItems: 2,
      totalQuantity: 4,
      totalPurchase: 129.98,
      transactionDate: "2024-12-02T15:30:00",
      status: "Pending",
    },
  ];

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.salesTransactionID}</td>
      <td>{item.transactionNumber}</td>
      <td>{item.location}</td>
      <td>{item.transactionType}</td>
      <td>{item.paymentType}</td>
      <td>{item.totalItems}</td>
      <td>{item.totalQuantity}</td>
      <td>{item.totalPurchase.toFixed(2)}</td>
      <td>{new Date(item.transactionDate).toLocaleString()}</td>
      <td
        style={{
          color: item.status === "Completed" ? "blue" : "orange",
          fontWeight: "bold",
        }}
      >
        {item.status}
      </td>
      <td>
        <Button variant="contained" color="primary" startIcon={<EditIcon />}>
          Edit
        </Button>
      </td>
    </tr>
  );

  return (
    <div>
      <h3>SALES TRANSACTION LIST</h3>
      <div className="button-container">
        {/* <button className="create-form-btn" onClick={toggleTransactionTypeList}>
          Transaction Type
        </button>
        <button className="create-form-btn">Payment Type</button> */}
        <button
          className="create-form-btn"
          onClick={showSalesTransactionbutton}
        >
          + Create Sales Transaction
        </button>
      </div>

      <div className="table-container">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card__body">
                <Table
                  limit="10"
                  headData={categoryTableHead}
                  renderHead={renderHead}
                  bodyData={dummyData}
                  renderBody={renderBody}
                  tableClass="table"
                />
              </div>
            </div>
          </div>
          {/* {showTransactionTypeList && <TransactionTypeList />} */}
          {showSalesTransaction && <SalesTransaction />}
        </div>
      </div>

      <style jsx>{`
        .button-container {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 10px;
          margin-bottom: 10px;
        }

        .create-form-btn {
          padding: 10px 20px;
          font-size: 14px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .create-form-btn:hover {
          background-color: #0056b3;
        }

        h3 {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default SalesTransactionList;
