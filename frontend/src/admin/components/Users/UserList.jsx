import React, { useEffect, useState } from "react";
import Table from "../Table";
import { fetchUsers } from "../../../services/auth/userService";
import UserCreateForm from "./userCreateForm";
import UserEditForm from "./UserEditForm";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const userTableHead = [
  "",
  "ID",
  "First Name",
  "Middle Name",
  "Last Name",
  "Role",
  "Email",
  "Phone Number",
  "Address",
  "Birthday",
  "Status",
  "Action",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false); // State for showing edit form
  const [selectedUserID, setSelectedUserID] = useState(null); // State for selected user ID

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUserCreated = () => {
    loadUsers();
    setShowCreateForm(false);
  };

  const handleUserUpdated = () => {
    loadUsers();
    setShowEditForm(false); // Close the edit form after updating
  };

  const closeCreateForm = () => {
    setShowCreateForm(false);
  };

  const closeEditForm = () => {
    setShowEditForm(false);
    setSelectedUserID(null); // Reset the selected user ID
  };

  const handleEdit = (user) => {
    setSelectedUserID(user.userID); // Set the selected user ID
    setShowEditForm(true); // Show the edit form
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>
        {item.image_url && (
          <img
            src={`/${item.image_url.replace(/\\/g, "/")}`}
            alt="User"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        )}
      </td>
      <td>{item.userID}</td>
      <td>{item.firstName}</td>
      <td>{item.middleName}</td>
      <td>{item.lastName}</td>
      <td>{item.roleName}</td>
      <td>{item.email}</td>
      <td>{item.phoneNumber}</td>
      <td>{item.address}</td>
      <td>{item.birthday}</td>
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

  return (
    <div className="table-container">
      <h3>USER LIST</h3>
      <button
        className="create-form-btn"
        onClick={() => setShowCreateForm((prev) => !prev)}
      >
        + Create User
      </button>
      <br />

      {showCreateForm && (
        <UserCreateForm
          onUserCreated={handleUserCreated}
          closeForm={closeCreateForm}
        />
      )}

      {showEditForm && selectedUserID && (
        <UserEditForm
          userID={selectedUserID} // Pass the selected user ID
          onUserUpdated={handleUserUpdated} // Handle user update
          closeForm={closeEditForm}
        />
      )}

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              {loading && <div>Loading...</div>}
              {error && <div>Error: {error}</div>}
              {!loading && !error && (
                <Table
                  limit="10"
                  headData={userTableHead}
                  renderHead={renderHead}
                  bodyData={users}
                  renderBody={renderBody}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
