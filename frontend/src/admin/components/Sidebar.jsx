import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isClosed }) => {
  const userState = useSelector((state) => state.user.userInfo);
  const roleID = userState?.roleID;

  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      title: "Dashboard",
      icon: "bx bxs-dashboard",
      link: "/dashboard",
      allowedRoles: [1, 2, 3],
    },
    {
      title: "Sales",
      icon: "bx bx-line-chart",
      link: "/sales",
      allowedRoles: [1, 2],
    },
    {
      title: "Reports",
      icon: "bx bxs-report",
      link: "/report",
      allowedRoles: [1, 2],
    },
    {
      title: "Items",
      icon: "bx bx-analyse",
      link: "/items",
      allowedRoles: [1, 2],
    },
    {
      title: "Inventory",
      icon: "bx bxs-inbox",
      link: "/inventory",
      allowedRoles: [1, 2, 3],
    },
    {
      title: "Inventory Adjustment",
      icon: "bx bxs-edit",
      link: "/inventory-adjustment",
      allowedRoles: [1, 2],
    },
    {
      title: "Inventory Type",
      icon: "bx bxs-box",
      link: "/inventory-type",
      allowedRoles: [1, 2],
    },
    {
      title: "Adjustment Reason",
      icon: "bx bxs-info-circle",
      link: "/adjustment-type-reason",
      allowedRoles: [1, 2],
    },
    {
      title: "Purchase Order",
      icon: "bx bxs-shopping-bag",
      link: "/purchase-order",
      allowedRoles: [1, 2],
    },
    {
      title: "Categories",
      icon: "bx bx-message-square-dots",
      link: "/categories",
      allowedRoles: [1, 2],
    },
    {
      title: "Supplier",
      icon: "bx bxs-user",
      link: "/supplier",
      allowedRoles: [1, 2],
    },
    {
      title: "Location",
      icon: "bx bxs-map",
      link: "/location",
      allowedRoles: [1, 2],
    },
    {
      title: "Payment Type",
      icon: "bx bxs-credit-card",
      link: "/payment-type",
      allowedRoles: [1, 2], // Define roles allowed for Payment Type
    },
    {
      title: "Transaction Type",
      icon: "bx bx-transfer", // New icon
      link: "/transaction-type",
      allowedRoles: [1, 2], // Define roles allowed for Transaction Type
    },
    {
      title: "Customer",
      icon: "bx bxs-user-check",
      link: "/customer",
      allowedRoles: [1, 2],
    },
    {
      title: "Customer Type",
      icon: "bx bx-list-ul",
      link: "/customer-type",
      allowedRoles: [1], // Only role 1 allowed
    },
    {
      title: "Company Profile",
      icon: "bx bxs-buildings",
      link: "/company-profile",
      allowedRoles: [1],
    },
    {
      title: "Users",
      icon: "bx bx-group",
      link: "/users",
      allowedRoles: [1],
    },
  ];

  return (
    <div className={`sidebar ${isClosed ? "close" : ""}`}>
      <Link to="/" className="logo">
        <i className="bx bx-code-alt"></i>
        <div className="logo-name">
          <span>PMS</span>
        </div>
      </Link>
      <ul className="side-menu">
        {menuItems.map((item, index) => {
          if (item.allowedRoles.includes(roleID)) {
            const isActive = currentPath === item.link;
            return (
              <li key={index} className={isActive ? "active" : ""}>
                <Link to={item.link}>
                  <i className={item.icon}></i>
                  {item.title}
                </Link>
              </li>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
