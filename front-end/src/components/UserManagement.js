import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from './Loading';
import ConfirmDialog from './ConfirmDialog';
import '../Styles/UserManagement.css'; // Import the CSS file

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState('all');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    companyName: '',
    contactPerson: '',
    jobTitle: '',
    department: '',
    shippingAddress: '',
    billingAddress: ''
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    userId: null
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        if (selectedRole === 'all') {
          response = await axios.get('http://localhost:5000/api/user/all', { withCredentials: true });
        } else {
          response = await axios.get(`http://localhost:5000/api/user/role/${selectedRole}`, { withCredentials: true });
        }
        
        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [selectedRole, updateSuccess, deleteSuccess]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleUpdateClick = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || '',
      password: '',
      companyName: user.companyName || '',
      contactPerson: user.contactPerson || '',
      jobTitle: user.jobTitle || '',
      department: user.department || '',
      shippingAddress: user.shippingAddress || '',
      billingAddress: user.billingAddress || ''
    });
    setShowUpdateForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updateData = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') {
          updateData[key] = formData[key];
        }
      });
      if (!updateData.password) {
        delete updateData.password;
      }
      
      const response = await axios.put(
        `http://localhost:5000/api/user/update/${currentUser._id}`,
        updateData,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
        setShowUpdateForm(false);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
      console.error('Error updating user:', err);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (userId) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      userId
    });
  };

  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `http://localhost:5000/api/user/delete/${confirmDialog.userId}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setDeleteSuccess(true);
        setTimeout(() => setDeleteSuccess(false), 3000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      console.error('Error deleting user:', err);
    } finally {
      setLoading(false);
      setConfirmDialog({ ...confirmDialog, isOpen: false });
    }
  };

  const handleCloseForm = () => {
    setShowUpdateForm(false);
  };

  const getRoleSpecificFields = () => {
    switch (formData.role) {
      case 'supplier':
        return (
          <>
            <div className="um-form-group">
              <label className="um-label">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="um-input"
              />
            </div>
            <div className="um-form-group">
              <label className="um-label">Warehouse location</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                className="um-input"
              />
            </div>
          </>
        );
      case 'employee':
        return (
          <>
            <div className="um-form-group">
              <label className="um-label">Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                className="um-input"
              />
            </div>
            <div className="um-form-group">
              <label className="um-label">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="um-input"
              />
            </div>
          </>
        );
      case 'customer':
        return (
          <>
            <div className="um-form-group">
              <label className="um-label">Shipping Address</label>
              <textarea
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleInputChange}
                className="um-textarea"
                rows="3"
              ></textarea>
            </div>
            <div className="um-form-group">
              <label className="um-label">Billing Address</label>
              <textarea
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleInputChange}
                className="um-textarea"
                rows="3"
              ></textarea>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="um-container">
      <h2 className="um-title">User Management</h2>
      
      {/* Role filter tabs */}
      <div className="um-tabs">
        <button
          onClick={() => handleRoleSelect('all')}
          className={`um-tab-btn ${selectedRole === 'all' ? 'um-tab-btn-active' : ''}`}
        >
          All Users
        </button>
        <button
          onClick={() => handleRoleSelect('admin')}
          className={`um-tab-btn ${selectedRole === 'admin' ? 'um-tab-btn-active' : ''}`}
        >
          Admins
        </button>
        <button
          onClick={() => handleRoleSelect('supplier')}
          className={`um-tab-btn ${selectedRole === 'supplier' ? 'um-tab-btn-active' : ''}`}
        >
          Suppliers
        </button>
        <button
          onClick={() => handleRoleSelect('customer')}
          className={`um-tab-btn ${selectedRole === 'customer' ? 'um-tab-btn-active' : ''}`}
        >
          Customers
        </button>
        {/* <button
          onClick={() => handleRoleSelect('employee')}
          className={`um-tab-btn ${selectedRole === 'employee' ? 'um-tab-btn-active' : ''}`}
        >
          Employees
        </button> */}
      </div>
      
      {/* Status messages */}
      {error && <div className="um-error">{error}</div>}
      {updateSuccess && <div className="um-success">User updated successfully!</div>}
      {deleteSuccess && <div className="um-success">User deleted successfully!</div>}
      
      {/* User Table */}
      {loading ? (
        <Loading message="Loading users..." />
      ) : (
        <div className="um-table-container">
          <table className="um-table">
            <thead>
              <tr>
                <th className="um-table th">Name</th>
                <th className="um-table th">Email</th>
                <th className="um-table th">Phone</th>
                <th className="um-table th">Role</th>
                <th className="um-table th">Role Details</th>
                <th className="um-table th text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="um-empty">No users found</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user._id}>
                    <td className="um-table td">{user.name}</td>
                    <td className="um-table td">{user.email}</td>
                    <td className="um-table td">{user.phone}</td>
                    <td className="um-table td capitalize">{user.role}</td>
                    <td className="um-table td">
                      {user.role === 'supplier' && (
                        <>
                          <p><strong>Company:</strong> {user.companyName}</p>
                          <p><strong>Warehouse loc:</strong> {user.contactPerson}</p>
                        </>
                      )}
                      {user.role === 'employee' && (
                        <>
                          <p><strong>Job:</strong> {user.jobTitle}</p>
                          <p><strong>Dept:</strong> {user.department}</p>
                        </>
                      )}
                      {user.role === 'customer' && (
                        <>
                          <p><strong>Shipping:</strong> {user.shippingAddress}</p>
                          <p><strong>Billing:</strong> {user.billingAddress}</p>
                        </>
                      )}
                    </td>
                    <td className="um-table-action">
                      <button
                        onClick={() => handleUpdateClick(user)}
                        className="um-update-btn"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => openDeleteDialog(user._id)}
                        className="um-delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Update User Form Modal */}
      {showUpdateForm && (
        <div className="um-modal">
          <div className="um-modal-content">
            <div className="um-modal-header">
              <h3 className="um-modal-title">Update User</h3>
              <button onClick={handleCloseForm} className="um-close-btn">×</button>
            </div>
            
            <form onSubmit={handleUpdateSubmit} className="um-form">
              <div className="um-form-group">
                <label className="um-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="um-input"
                  required
                />
              </div>
              
              <div className="um-form-group">
                <label className="um-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="um-input"
                  required
                />
              </div>
              
              <div className="um-form-group">
                <label className="um-label">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="um-input"
                  required
                />
              </div>
              
              <div className="um-form-group">
                <label className="um-label">Password (leave blank to keep unchanged)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="um-input"
                />
                <p className="um-form-note">
                  Only fill this if you want to change the user's password
                </p>
              </div>
              
              <div className="um-form-group">
                <label className="um-label">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="um-select"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="supplier">Supplier</option>
                  <option value="customer">Customer</option>
                  {/* <option value="employee">Employee</option> */}
                </select>
              </div>
              
              {/* Role-specific fields */}
              {getRoleSpecificFields()}
              
              <div className="um-form-actions">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="um-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="um-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={handleDeleteUser}
        onCancel={() => setConfirmDialog({...confirmDialog, isOpen: false})}
      />
    </div>
  );
};

export default UserManagement;