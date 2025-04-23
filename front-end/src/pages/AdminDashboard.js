import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import UserManagement from "../components/UserManagement";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../Styles/AdminNav.css";

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
          console.log("AdminDashboard: Loaded userData from location.state:", passedUserData);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/user/data", {
          withCredentials: true,
        });
        console.log("AdminDashboard: Fetch user data response:", response.data);

        if (response.data.success) {
          setUserData(response.data.userData);
        } else {
          setError(response.data.message);
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.response?.data?.message || error.message);
        setError("Failed to load dashboard. Please log in again.");
        navigate("/welcome");
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
    console.log("AdminDashboard: Switching to tab:", tab);
    setActiveTab(tab);
  };

  const generateUserSummaryReport = async () => {
    try {
      console.log("Fetching report data...");
      const response = await axios.get("http://localhost:5000/api/user/reports/summary", {
        withCredentials: true,
      });
      console.log("User Summary Report response:", response.data);

      if (response.data.success) {
        const { summary } = response.data;
        console.log("Summary data:", summary);

        // Initialize jsPDF
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        console.log("jsPDF instance created:", doc);

        // Verify autoTable
        if (!doc.autoTable) {
          autoTable(doc);
          console.log("autoTable applied to jsPDF instance");
        }

        // Add content
        doc.setFontSize(18);
        doc.text("User Summary Report", 14, 20);
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
        doc.text(`Admin: ${userData?.name || "Unknown"} (${userData?.email || "Unknown"})`, 14, 40);

        // Define table data with fallback values
        const tableData = [
          ["Total Users", summary?.total || 0],
          ["Admins", summary?.admins || 0],
          ["Suppliers", summary?.suppliers || 0],
          ["Customers", summary?.customers || 0],
          ["Employees", summary?.employees || 0],
          ["Active Users", summary?.active || 0],
          ["Deactivated Users", summary?.deactivated || 0],
        ];

        // Add table with minimal configuration
        doc.autoTable({
          startY: 50,
          head: [["Metric", "Count"]],
          body: tableData,
          theme: "grid",
        });

        console.log("Saving PDF...");
        doc.save(`User_Summary_Report_${new Date().toISOString().split("T")[0]}.pdf`);
      } else {
        setError(response.data.message || "Failed to fetch report data.");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      setError(error.message || "Failed to generate report. Please try again.");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement />;
      case "account-management":
        console.log("AdminDashboard: Navigating to /account-management");
        return navigate("/account-management");
      case "dashboard":
      default:
        return (
          <div className="spice-dashboard-content">
            <div className="spice-card">
              <h2 className="spice-card-title">Dashboard Overview</h2>
              <p className="spice-welcome-text">Welcome to your admin dashboard, {userData?.name}!</p>
              <p className="spice-info-text">From here you can manage users, view reports, and control system settings.</p>
              
              <div className="spice-grid">
                <div className="spice-grid-item">
                  <h3 className="spice-grid-title">User Management</h3>
                  <p className="spice-grid-desc">Manage users, roles, and permissions.</p>
                  <button 
                    onClick={() => switchTab("users")}
                    className="spice-action-btn"
                  >
                    Manage Users
                  </button>
                </div>
                
                <div className="spice-grid-item">
                  <h3 className="spice-grid-title">Account Management</h3>
                  <p className="spice-grid-desc">Activate or deactivate user accounts.</p>
                  <button 
                    onClick={() => switchTab("account-management")}
                    className="spice-action-btn"
                  >
                    Manage Accounts
                  </button>
                </div>
                
                <div className="spice-grid-item">
                  <h3 className="spice-grid-title">Inventory</h3>
                  <p className="spice-grid-desc">Manage product inventory and stock levels.</p>
                  <button 
                    onClick={() => navigate("/inventory-overview")}
                    className="spice-action-btn"
                  >
                    View Inventory
                  </button>
                </div>
                
                <div className="spice-grid-item">
                  <h3 className="spice-grid-title">Orders</h3>
                  <p className="spice-grid-desc">View and manage customer orders.</p>
                  <button className="spice-action-btn">
                    View Orders
                  </button>
                </div>
                
                <div className="spice-grid-item">
                  <h3 className="spice-grid-title">Reports</h3>
                  <p className="spice-grid-desc">Generate user summary report.</p>
                  <button 
                    onClick={generateUserSummaryReport}
                    className="spice-action-btn"
                  >
                    Generate User Summary Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="spice-dashboard-container">
      <nav className="spice-nav">
        <div className="spice-nav-logo">
          <div className="spice-logo-circle">
            <span className="spice-logo-text">AD</span>
          </div>
          <h1 className="spice-nav-title">Admin Dashboard</h1>
        </div>

        <div className="spice-nav-actions">
          <span className="spice-user-greeting">Hello, {userData?.name}</span>
          <button
            onClick={handleLogout}
            className="spice-logout-btn"
          >
            <span className="spice-logout-text">Logout</span>
            <span className="spice-logout-icon">→</span>
          </button>
        </div>
      </nav>

      <div className="spice-content-wrapper">
        {error ? (
          <div className="spice-error-message">
            {error}
          </div>
        ) : userData ? (
          <div className="spice-main-layout">
            <div className="spice-sidebar">
              <div className="spice-user-info">
                <p className="spice-user-label">Logged in as:</p>
                <p className="spice-user-name">{userData.name}</p>
                <p className="spice-user-email">{userData.email}</p>
              </div>
              
              <nav className="spice-sidebar-nav">
                <ul className="spice-nav-list">
                  <li>
                    <button
                      onClick={() => switchTab("dashboard")}
                      className={`spice-nav-item ${
                        activeTab === "dashboard" ? "spice-nav-active" : ""
                      }`}
                    >
                      Dashboard
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => switchTab("users")}
                      className={`spice-nav-item ${
                        activeTab === "users" ? "spice-nav-active" : ""
                      }`}
                    >
                      User Management
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => switchTab("account-management")}
                      className={`spice-nav-item ${
                        activeTab === "account-management" ? "spice-nav-active" : ""
                      }`}
                    >
                      Account Management
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/inventory-overview")}
                      className="spice-nav-item"
                    >
                      Inventory
                    </button>
                  </li>
                  <li>
                    <button className="spice-nav-item">
                      Orders
                    </button>
                  </li>
                  <li>
                    <button className="spice-nav-item">
                      Reports
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
            
            <div className="spice-content">
              {renderContent()}
            </div>
          </div>
        ) : (
          <div className="spice-loading">
            <p>Loading dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;