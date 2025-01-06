import React, { useEffect, useState } from "react";
import Table from "./Table";
import axios from "axios";

const customerTableHead = ["ID", "Name", "Phone", "Email", "Address", "Type"];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index) => (
  <tr key={index}>
    <td>{item.customerID}</td>
    <td>
      {`${item.firstName} ${item.middleName ? item.middleName + " " : ""}${
        item.lastName
      }`}
    </td>
    <td>{item.contactNo}</td>
    <td>{item.email}</td>
    <td>{item.address}</td>
    <td>{item.customerType?.TypeName || "N/A"}</td>
  </tr>
);

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  const loadCustomers = async () => {
    try {
      const response = await axios.get("/api/v2/customers");
      if (response.data && response.data.data) {
        setCustomers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <div className="customers">
      <h3 className="page-header">Customers</h3>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              {customers.length > 0 ? (
                <Table
                  limit="10"
                  headData={customerTableHead}
                  renderHead={renderHead}
                  bodyData={customers}
                  renderBody={renderBody}
                />
              ) : (
                <p>No customer data available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
