import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

const Navbar = ({
  onSidebarToggle,
  // onSearchToggle,
  onDarkModeToggle,
  isSearchFormVisible,
}) => {
  const userState = useSelector((state) => state.user.userInfo);
  const roleID = userState?.roleID;
  const [profileImage, setProfileImage] = useState(
    "https://robohash.org/default.png"
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          // `http://localhost:5000/api/v1/users/${roleID}`
          `http://localhost:5000/api/v1/users/5`
        );
        if (response.data.success) {
          const userImage = response.data.data.image_url;
          setProfileImage(userImage || "https://robohash.org/default.png");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [roleID]);

  return (
    <nav>
      <i className="bx bx-menu" onClick={onSidebarToggle}></i>
      <form className={isSearchFormVisible ? "show" : ""}>
        <div className="form-input">
          <input type="search" placeholder="Search..." />
          <button className="search-btn" type="submit">
            <i className="bx bx-search"></i>
          </button>
        </div>
      </form>
      <input
        type="checkbox"
        id="theme-toggle"
        hidden
        onChange={onDarkModeToggle}
      />
      <label htmlFor="theme-toggle" className="theme-toggle"></label>
      <Link to="/messages" className="notif">
        <i className="bx bx-bell"></i>
        <span className="count">12</span>
      </Link>
      <Link to="/" className="profile">
        <img src={profileImage} alt="Profile" />
      </Link>
    </nav>
  );
};

export default Navbar;
