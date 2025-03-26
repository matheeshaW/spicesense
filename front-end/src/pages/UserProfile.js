// pages/UserProfile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import OrdersList from "../components/OrderList"; // Fixed typo in import
import NavigationBar from "../components/NavigationBar";
import "../Styles/UserProfile.css"; // Import CSS from Styles folder

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = sessionStorage.getItem("userId");

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
        setError("Failed to load profile. Please log in again.");
        navigate("/login");
      }
    };
    fetchUserData();
  }, [navigate, location.state]);

  const initializeFormData = (user) => {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      shippingAddress: user.shippingAddress || "",
      billingAddress: user.billingAddress || "",
      companyName: user.companyName || "",
      contactPerson: user.contactPerson || "",
      jobTitle: user.jobTitle || "",
      department: user.department || ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setUpdateSuccess(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    initializeFormData(userData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const updateData = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== "" && formData[key] !== userData[key]) {
          updateData[key] = formData[key];
        }
      });
      
      if (Object.keys(updateData).length === 0) {
        setIsEditing(false);
        setLoading(false);
        return;
      }
      
      const response = await axios.put(
        `http://localhost:5000/api/user/update-profile`,
        updateData,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setUserData({...userData, ...updateData});
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
        setIsEditing(false);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    if (!userData) return null;

    switch (userData.role) {
      case "customer":
        return (
          <>
            <p className="user-profile-detail"><strong>Shipping Address:</strong> {userData.shippingAddress}</p>
            <p className="user-profile-detail"><strong>Billing Address:</strong> {userData.billingAddress}</p>
          </>
        );
      case "supplier":
        return (
          <>
            <p className="user-profile-detail"><strong>Company Name:</strong> {userData.companyName}</p>
            <p className="user-profile-detail"><strong>Contact Person:</strong> {userData.contactPerson}</p>
          </>
        );
      case "employee":
        return (
          <>
            <p className="user-profile-detail"><strong>Job Title:</strong> {userData.jobTitle}</p>
            <p className="user-profile-detail"><strong>Department:</strong> {userData.department}</p>
          </>
        );
      default:
        return null;
    }
  };

  const renderRoleSpecificFormFields = () => {
    if (!userData) return null;

    switch (userData.role) {
      case "customer":
        return (
          <>
            <div className="user-profile-form-group">
              <label className="user-profile-label">Shipping Address</label>
              <textarea
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleInputChange}
                className="user-profile-textarea"
                rows="3"
              ></textarea>
            </div>
            <div className="user-profile-form-group">
              <label className="user-profile-label">Billing Address</label>
              <textarea
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleInputChange}
                className="user-profile-textarea"
                rows="3"
              ></textarea>
            </div>
          </>
        );
      case "supplier":
        return (
          <>
            <div className="user-profile-form-group">
              <label className="user-profile-label">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="user-profile-input"
              />
            </div>
            <div className="user-profile-form-group">
              <label className="user-profile-label">Contact Person</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                className="user-profile-input"
              />
            </div>
          </>
        );
      case "employee":
        return (
          <>
            <div className="user-profile-form-group">
              <label className="user-profile-label">Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                className="user-profile-input"
              />
            </div>
            <div className="user-profile-form-group">
              <label className="user-profile-label">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="user-profile-input"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="user-profile-container">
      <NavigationBar userData={userData} />
      <div className="user-profile-content">
        <div className="user-profile-card">
          {userData && <h1 className="user-profile-title">{userData.role} Profile</h1>}
          
          {error && <div className="user-profile-error">{error}</div>}
          {updateSuccess && <div className="user-profile-success">Profile updated successfully!</div>}
          
          {error && !userData ? (
            <p className="user-profile-error-text">{error}</p>
          ) : userData ? (
            <>
              {!isEditing ? (
                <div className="user-profile-details">
                  <p className="user-profile-detail"><strong>Name:</strong> {userData.name}</p>
                  <p className="user-profile-detail"><strong>Email:</strong> {userData.email}</p>
                  <p className="user-profile-detail"><strong>Phone:</strong> {userData.phone}</p>
                  <p className="user-profile-detail"><strong>Role:</strong> {userData.role}</p>
                  
                  {renderRoleSpecificFields()}
                  
                  <p className="user-profile-detail"><strong>Email Verified:</strong> {userData.isAccountVerified ? "Yes" : "No"}</p>
                  
                  <div className="user-profile-buttons">
                    <button
                      onClick={handleEditClick}
                      className="user-profile-edit-btn"
                    >
                      Edit Profile
                    </button>
                  </div>
                  <Link to="/credit-cards">
                    <button className="user-profile-credit-btn">
                      Manage My Credit Cards
                    </button>
                  </Link>
                  <OrdersList userId={userId} />
                  
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="user-profile-form">
                  <div className="user-profile-form-group">
                    <label className="user-profile-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="user-profile-input"
                      required
                    />
                  </div>
                  
                  <div className="user-profile-form-group">
                    <label className="user-profile-label">Email (cannot be changed)</label>
                    <input
                      type="email"
                      value={userData.email}
                      className="user-profile-input user-profile-disabled"
                      disabled
                    />
                  </div>
                  
                  <div className="user-profile-form-group">
                    <label className="user-profile-label">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="user-profile-input"
                      required
                    />
                  </div>
                  
                  {renderRoleSpecificFormFields()}
                  
                  <div className="user-profile-form-buttons">
                    <button
                      type="button"
                      onClick={handleCancelClick}
                      className="user-profile-cancel-btn"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="user-profile-save-btn"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div className="user-profile-loading">
              <div className="user-profile-spinner"></div>
              <p>Loading profile...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;