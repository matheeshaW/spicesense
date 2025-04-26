import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import UserManagement from "../components/UserManagement";
import SupplierProducts from "../components/SupplierProducts";
import AdminMessages from "../components/AdminMessages";
import AdminDeliveries from "../components/AdminDeliveries";
import AdminTransactions from "../components/AdminTransactions"; // Added missing import
import "../Styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const passedUserData = location.state?.userData;
        if (passedUserData) {
          setUserData(passedUserData);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/user/data", {
          withCredentials: true,
        });

        if (response.data.success) {
          setUserData(response.data.userData);
        } else {
          setError(response.data.message);
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.response?.data?.message || error.message);
        setError("Failed to load dashboard. Please log in again.");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate, location.state]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      navigate("/welcome");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement />;
      case "suppliers":
        return <SupplierProducts />;
      case "messages":
        return <AdminMessages />;
      case "deliveries":
        return <AdminDeliveries />;
      case "transactions": 
        return <AdminTransactions />;
      case "dashboard":
      default:
        return (
          <div className="ad-content-space">
            <div className="ad-card">
              <h2 className="ad-card-title">Dashboard Overview</h2>
              <p className="ad-card-text">Welcome to your admin dashboard, {userData?.name}!</p>
              <p className="ad-card-subtext">From here you can manage users, view reports, and control system settings.</p>
              
              <div className="ad-grid">
                <div className="ad-grid-item">
                  <h3 className="ad-grid-item-title">User Management</h3>
                  <p className="ad-grid-item-text">Manage users, roles, and permissions.</p>
                  <button 
                    onClick={() => switchTab("users")}
                    className="ad-button ad-button-primary"
                  >
                    Manage Users
                  </button>
                </div>
                
               
                
                <div className="ad-grid-item">
                  <h3 className="ad-grid-item-title">Product Requests</h3>
                  <p className="ad-grid-item-text">Send and manage product requests to suppliers.</p>
                  <button 
                    onClick={() => switchTab("messages")}
                    className="ad-button ad-button-primary"
                  >
                    Manage Requests
                  </button>
                </div>
                
                <div className="ad-grid-item">
                  <h3 className="ad-grid-item-title">Delivery Tracking</h3>
                  <p className="ad-grid-item-text">Monitor shipments and deliveries from suppliers.</p>
                  <button 
                    onClick={() => switchTab("deliveries")}
                    className="ad-button ad-button-primary"
                  >
                    Track Deliveries
                  </button>
                </div>
                <div className="ad-grid-item">
                  <h3 className="ad-grid-item-title">Financial Transactions</h3>
                  <p className="ad-grid-item-text">Manage payments and invoices for suppliers.</p>
                  <button 
                    onClick={() => switchTab("transactions")}
                    className="ad-button ad-button-primary"
                  >
                    Manage Transactions
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="ad-container">
    
      <div className="ad-wrapper">
        {/* Header */}
        <div className="ad-header">
          <h1 className="ad-header-title">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="ad-button ad-button-logout"
          >
            Logout
          </button>
        </div>

        {error ? (
          <div className="ad-error">
            {error}
          </div>
        ) : userData ? (
          <div className="ad-main">
            {/* Sidebar */}
            <div className="ad-sidebar">
              <div className="ad-user-info">
                <p className="ad-user-label">Logged in as:</p>
                <p className="ad-user-name">{userData.name}</p>
                <p className="ad-user-email">{userData.email}</p>
              </div>
              
              <nav>
                <ul className="ad-nav-list">
                  <li>
                    <button
                      onClick={() => switchTab("dashboard")}
                      className={`ad-nav-button ${activeTab === "dashboard" ? "ad-nav-button-active" : ""}`}
                    >
                      Dashboard
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => switchTab("users")}
                      className={`ad-nav-button ${activeTab === "users" ? "ad-nav-button-active" : ""}`}
                    >
                      User Management
                    </button>
                  </li>

                  <li> 
                    <button
                      onClick={() => switchTab("messages")}
                      className={`ad-nav-button ${activeTab === "messages" ? "ad-nav-button-active" : ""}`}
                    >
                      Product Requests
                    </button>
                  </li>
                  <li>
                    <button
                      className="ad-nav-button"
                    >
                      Inventory
                    </button>
                  </li>
                  <li>
                    <button
                      className="ad-nav-button"
                    >
                      Orders
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => switchTab("deliveries")}
                      className={`ad-nav-button ${activeTab === "deliveries" ? "ad-nav-button-active" : ""}`}
                    >
                      Deliveries
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => switchTab("transactions")}
                      className={`ad-nav-button ${activeTab === "transactions" ? "ad-nav-button-active" : ""}`}
                    >
                      Transactions
                    </button>
                  </li>
                  <li>
                    <button
                      className="ad-nav-button"
                    >
                      Settings
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
            
            {/* Main Content */}
            <div className="ad-content">
              {renderContent()}
            </div>
          </div>
        ) : (
          <div className="ad-loading">
            <p>Loading dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;