import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

import "./App.css";
import HomePage from "./pages/home/HomePage";
import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/login/LoginPage";
import ProfilePage from "./pages/profile/ProfilePage";
import AboutPage from "./pages/about/About";
import ContactPage from "./pages/contact/Contact";

// admin
import Home from "./admin/pages/Home";

// Inventory
import Inventory from "./admin/pages/Inventory";
import Products from "./admin/pages/Products";
import Categories from "./admin/pages/Categories";
import CompanyProfile from "./admin/pages/CompanyProfile";
import Report from "./admin/pages/Report";
import SalesManagement from "./admin/pages/SalesManagement";
import Users from "./admin/pages/Users";
import Setting from "./admin/pages/Settings";
import InventoryAdjustment from "./admin/pages/InventoryAdjustment";
import InventoryType from "./admin/pages/InventoryType";
import Location from "./admin/pages/Location";
import AdjustmentTypeReason from "./admin/pages/AdjustmentTypeReason";
import AdjustmentType from "./admin/pages/AdjustmentType";
import Customer from "./admin/pages/Customer";
import CustomerType from "./admin/pages/CustomerType";

// Purchase Order
import PoItem from "./admin/pages/Po_Item";
import PoReceivingItem from "./admin/pages/Po_ReceivingItem";
import PoReceiving from "./admin/pages/Po_Receiving";
import PoSupplier from "./admin/pages/Po_Supplier";
import PoPurchaseOrder from "./admin/pages/Po_PurchaseOrder";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="App">
      <Routes>
        <Route index path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<HomePage />} />
        {/* admin routes */}
        <Route path="/dashboard" element={<Home />} />
        {/* Inventory */}
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/items" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/customer-type" element={<CustomerType />} />
        <Route path="/users" element={<Users />} />
        <Route path="/company-profile" element={<CompanyProfile />} />
        <Route path="/sales" element={<SalesManagement />} />
        <Route path="/report" element={<Report />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/inventory-type" element={<InventoryType />} />
        <Route path="/inventory-adjustment" element={<InventoryAdjustment />} />
        <Route path="/location" element={<Location />} />
        <Route path="/adjustment-type" element={<AdjustmentType />} />
        <Route
          path="/adjustment-type-reason"
          element={<AdjustmentTypeReason />}
        />
        {/* Purchase Order */}
        <Route path="/purchase-order" element={<PoPurchaseOrder />} />
        <Route path="/po-item" element={<PoItem />} />
        <Route path="/po-receiving-item" element={<PoReceivingItem />} />
        <Route path="/po-receiving" element={<PoReceiving />} />
        <Route path="/supplier" element={<PoSupplier />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
