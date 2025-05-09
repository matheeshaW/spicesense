<<<<<<< Updated upstream

import React, { useState, useEffect } from 'react';
import axios from 'axios';
=======
import React, { useState, useEffect } from 'react';
import {
  fetchAllOrders,
  fetchOrder,
  updateOrder,
  fetchDeliveryByOrderId,
  createDelivery,
  updateDeliveryStatus
} from '../api';
>>>>>>> Stashed changes
import '../Styles/AdminOrdersManagement.css';

const AdminOrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentOrderDetail, setCurrentOrderDetail] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [showCreateDeliveryModal, setShowCreateDeliveryModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
<<<<<<< Updated upstream
=======
  const [showDirectStatusUpdate, setShowDirectStatusUpdate] = useState(false);
  const [newStatus, setNewStatus] = useState('');
>>>>>>> Stashed changes
  const [trackingInfo, setTrackingInfo] = useState({
    trackingNumber: '',
    carrier: '',
    estimatedDeliveryDate: '',
    notes: ''
  });
<<<<<<< Updated upstream
=======
  const [customerName, setCustomerName] = useState('');
>>>>>>> Stashed changes

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      filterOrders();
    }
  }, [statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
<<<<<<< Updated upstream
      // Modified to use an existing endpoint - the more generic one for fetching orders
      const response = await axios.get('http://localhost:5000/api/order');
      
      console.log('Orders response:', response.data);
      
      // Ensure we're handling the response correctly based on its structure
      const ordersData = Array.isArray(response.data) ? response.data : 
                         response.data.orders ? response.data.orders : [];
      
=======
      const response = await fetchAllOrders();
      console.log('Orders response:', response.data);

      const ordersData = Array.isArray(response.data)
        ? response.data
        : response.data.orders
        ? response.data.orders
        : [];

>>>>>>> Stashed changes
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
<<<<<<< Updated upstream
      // More detailed error message for debugging
=======
>>>>>>> Stashed changes
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Failed to load orders. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      setIsLoading(true);
<<<<<<< Updated upstream
      const orderResponse = await axios.get(`http://localhost:5000/api/order/${orderId}`);
      console.log('Order details response:', orderResponse.data);
      setCurrentOrderDetail(orderResponse.data);

      // Try to fetch delivery info if it exists
      try {
        const deliveryResponse = await axios.get(`http://localhost:5000/api/deliveries/order/${orderId}`);
        console.log('Delivery info response:', deliveryResponse.data);
        setDeliveryInfo(deliveryResponse.data);
      } catch (error) {
        console.log('No delivery found or error fetching delivery:', error.message);
        // If no delivery exists yet, that's fine
=======
      const orderResponse = await fetchOrder(orderId);
      console.log('Order details response:', orderResponse.data);

      const orderData = orderResponse.data.order || orderResponse.data;
      setCurrentOrderDetail(orderData);

      if (orderData.userId && typeof orderData.userId === 'object' && orderData.userId.name) {
        setCustomerName(orderData.userId.name);
      } else {
        setCustomerName('');
      }

      try {
        const deliveryResponse = await fetchDeliveryByOrderId(orderId);
        console.log('Delivery info response:', deliveryResponse.data);
        const deliveryData = deliveryResponse.data.delivery || deliveryResponse.data;
        setDeliveryInfo(deliveryData);
      } catch (error) {
        console.log('No delivery found or error fetching delivery:', error.message);
>>>>>>> Stashed changes
        setDeliveryInfo(null);
      }

      setShowDetailModal(true);
    } catch (err) {
      console.error('Error fetching order details:', err);
      alert('Failed to load order details: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< Updated upstream
  const createDelivery = () => {
=======
  const createDeliveryRecord = () => {
>>>>>>> Stashed changes
    setTrackingInfo({
      trackingNumber: '',
      carrier: '',
      estimatedDeliveryDate: '',
      notes: ''
    });
    setShowCreateDeliveryModal(true);
  };

  const handleCreateDelivery = async () => {
    try {
      const deliveryData = {
        orderId: currentOrderDetail._id,
        trackingNumber: trackingInfo.trackingNumber,
        carrier: trackingInfo.carrier,
        estimatedDeliveryDate: trackingInfo.estimatedDeliveryDate,
        deliveryNotes: trackingInfo.notes,
        status: 'ready for shipment'
      };

      console.log('Creating delivery with data:', deliveryData);
<<<<<<< Updated upstream
      const deliveryResponse = await axios.post('http://localhost:5000/api/deliveries/create', deliveryData);
      console.log('Delivery creation response:', deliveryResponse.data);
     
      // Update order status
      await axios.put(`http://localhost:5000/api/order/${currentOrderDetail._id}`, {
        status: 'ready for shipment'
      });

      // Refresh data
      fetchOrders();
      setShowCreateDeliveryModal(false);
     
      // Re-fetch the current order and delivery
      viewOrderDetails(currentOrderDetail._id);
     
=======
      const deliveryResponse = await createDelivery(deliveryData);
      console.log('Delivery creation response:', deliveryResponse.data);

      await updateOrder(currentOrderDetail._id, {
        status: 'ready for shipment'
      });

      fetchOrders();
      setShowCreateDeliveryModal(false);
      viewOrderDetails(currentOrderDetail._id);

>>>>>>> Stashed changes
      alert('Delivery created successfully!');
    } catch (err) {
      console.error('Error creating delivery:', err);
      alert('Failed to create delivery: ' + (err.response?.data?.message || err.message));
    }
  };

<<<<<<< Updated upstream
  const updateDeliveryStatus = () => {
    setShowUpdateStatusModal(true);
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      // Update delivery status
      await axios.put(`http://localhost:5000/api/deliveries/${deliveryInfo._id}/status`, {
        status: newStatus
      });
     
      // Update order status to match
      await axios.put(`http://localhost:5000/api/order/${currentOrderDetail._id}`, {
        status: newStatus
=======
  const updateDeliveryStatusRecord = () => {
    setShowUpdateStatusModal(true);
  };

  // Validate status transitions
  const isValidStatusTransition = (currentStatus, newStatus) => {
    const validTransitions = {
      pending: ['paid', 'cancelled'],
      paid: ['ready for shipment', 'cancelled'],
      'ready for shipment': ['shipped', 'cancelled'],
      shipped: ['in transit', 'cancelled'],
      'in transit': ['delivered', 'cancelled'],
      delivered: [],
      cancelled: []
    };
    return validTransitions[currentStatus]?.includes(newStatus) || false;
  };

  const handleStatusUpdate = async (statusToUpdate) => {
    try {
      console.log('Updating status to:', statusToUpdate);

      // Validate status transition
      if (!isValidStatusTransition(currentOrderDetail.status, statusToUpdate)) {
        alert(`Cannot transition from ${currentOrderDetail.status} to ${statusToUpdate}`);
        return;
      }

      // Update delivery status only for relevant statuses
      if (deliveryInfo && ['shipped', 'in transit', 'delivered'].includes(statusToUpdate)) {
        try {
          console.log('Updating delivery status:', { id: deliveryInfo._id, status: statusToUpdate });
          await updateDeliveryStatus(deliveryInfo._id, {
            status: statusToUpdate
          });
          console.log('Delivery status updated successfully');
        } catch (deliveryErr) {
          console.error('Failed to update delivery status:', deliveryErr);
          alert('Failed to update delivery status: ' + (deliveryErr.response?.data?.message || deliveryErr.message));
          return;
        }
      }

      // Update order status
      console.log('Updating order:', { id: currentOrderDetail._id, status: statusToUpdate });
      await updateOrder(currentOrderDetail._id, {
        status: statusToUpdate
>>>>>>> Stashed changes
      });

      // Refresh data
      fetchOrders();
      setShowUpdateStatusModal(false);
<<<<<<< Updated upstream
     
      // Re-fetch the current order and delivery
      viewOrderDetails(currentOrderDetail._id);
     
      alert(`Status updated to: ${newStatus}`);
    } catch (err) {
      console.error('Error updating status:', err);
=======
      setShowDirectStatusUpdate(false);
      viewOrderDetails(currentOrderDetail._id);

      alert(`Status updated to: ${statusToUpdate}`);
    } catch (err) {
      console.error('Error updating status:', err.response?.data, err.message);
>>>>>>> Stashed changes
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    }
  };

<<<<<<< Updated upstream
=======
  const openDirectStatusUpdate = () => {
    setNewStatus(currentOrderDetail.status || 'pending');
    setShowDirectStatusUpdate(true);
  };

  const handleDirectStatusUpdate = async () => {
    if (!newStatus) {
      alert('Please select a valid status');
      return;
    }
    console.log('Selected new status:', newStatus);
    await handleStatusUpdate(newStatus);
  };

>>>>>>> Stashed changes
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="admin-orders-container">
      <h2>Orders Management</h2>
<<<<<<< Updated upstream
     
=======

>>>>>>> Stashed changes
      {/* Status filter */}
      <div className="orders-filter-section">
        <label htmlFor="status-filter">Filter by Status:</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter-select"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="ready for shipment">Ready for Shipment</option>
          <option value="shipped">Shipped</option>
          <option value="in transit">In Transit</option>
          <option value="delivered">Delivered</option>
<<<<<<< Updated upstream
=======
          <option value="cancelled">Cancelled</option>
>>>>>>> Stashed changes
        </select>
      </div>

      {/* Orders table */}
      {isLoading ? (
        <div className="orders-loading">Loading orders...</div>
      ) : error ? (
        <div className="orders-error">{error}</div>
      ) : filteredOrders.length === 0 ? (
        <div className="no-orders">No orders found with the selected status.</div>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id} className={`order-row status-${order.status?.replace(/\s+/g, '-') || 'unknown'}`}>
                <td>{order._id.substring(0, 8)}...</td>
<<<<<<< Updated upstream
                <td>{order.userId ? order.userId.substring(0, 8) + '...' : 'Unknown'}</td>
                <td>${order.total?.toFixed(2) || '0.00'}</td>
                <td>
                  <span className={`status-badge status-${order.status?.replace(/\s+/g, '-') || 'unknown'}`}>
                    {order.status ? (order.status.charAt(0).toUpperCase() + order.status.slice(1)) : 'Unknown'}
=======
                <td>
                  {order.userId && typeof order.userId === 'object' && order.userId.name
                    ? order.userId.name
                    : typeof order.userId === 'string'
                    ? order.userId.substring(0, 8) + '...'
                    : 'Unknown'}
                </td>
                <td>${order.total?.toFixed(2) || '0.00'}</td>
                <td>
                  <span className={`status-badge status-${order.status?.replace(/\s+/g, '-') || 'unknown'}`}>
                    {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
>>>>>>> Stashed changes
                  </span>
                </td>
                <td>{order.createdAt ? formatDate(order.createdAt) : 'N/A'}</td>
                <td>
<<<<<<< Updated upstream
                  <button
                    className="view-btn"
                    onClick={() => viewOrderDetails(order._id)}
                  >
=======
                  <button className="view-btn" onClick={() => viewOrderDetails(order._id)}>
>>>>>>> Stashed changes
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Order Detail Modal */}
      {showDetailModal && currentOrderDetail && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
<<<<<<< Updated upstream
              <h3>Order Details (ID: {currentOrderDetail._id})</h3>
              <button className="close-btn" onClick={() => setShowDetailModal(false)}>×</button>
            </div>
           
            <div className="modal-body">
              <h4>Customer Information</h4>
              <p><strong>Customer ID:</strong> {currentOrderDetail.userId}</p>
              <p><strong>Shipping Address:</strong> {currentOrderDetail.shippingAddress}</p>
              <p><strong>Billing Address:</strong> {currentOrderDetail.billingAddress}</p>
             
              <h4>Items</h4>
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrderDetail.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.itemId?.name || `Item ${index + 1}`}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price?.toFixed(2) || '0.00'}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
             
              <div className="order-summary">
                <p><strong>Total:</strong> ${currentOrderDetail.total?.toFixed(2) || '0.00'}</p>
                <p><strong>Status:</strong> {currentOrderDetail.status}</p>
              </div>
             
              {/* Delivery Information (if exists) */}
=======
              <h3>Order Details (ID: {currentOrderDetail._id.substring(0, 8)}...)</h3>
              <button className="close-btn" onClick={() => setShowDetailModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="order-status-section">
                <div className="current-status">
                  <strong>Current Status:</strong>
                  <span className={`status-badge status-${currentOrderDetail.status?.replace(/\s+/g, '-') || 'unknown'}`}>
                    {currentOrderDetail.status
                      ? currentOrderDetail.status.charAt(0).toUpperCase() + currentOrderDetail.status.slice(1)
                      : 'Unknown'}
                  </span>
                </div>
                <button className="update-status-btn" onClick={openDirectStatusUpdate}>
                  Update Status
                </button>
              </div>

              <h4>Customer Information</h4>
              <p>
                <strong>Customer ID:</strong>{' '}
                {typeof currentOrderDetail.userId === 'string'
                  ? currentOrderDetail.userId.substring(0, 8) + '...'
                  : currentOrderDetail.userId?._id
                  ? currentOrderDetail.userId._id.substring(0, 8) + '...'
                  : 'Unknown'}
              </p>
              <p>
                <strong>Customer Name:</strong>{' '}
                {customerName ||
                  (typeof currentOrderDetail.userId === 'object' && currentOrderDetail.userId.name
                    ? currentOrderDetail.userId.name
                    : 'Not available')}
              </p>
              <p><strong>Shipping Address:</strong> {currentOrderDetail.shippingAddress || 'Not provided'}</p>
              <p><strong>Billing Address:</strong> {currentOrderDetail.billingAddress || 'Not provided'}</p>

              <h4>Items</h4>
              {currentOrderDetail.items && currentOrderDetail.items.length > 0 ? (
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrderDetail.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.itemId?.name || `Item ${index + 1}`}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price?.toFixed(2) || '0.00'}</td>
                        <td>${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No items found for this order.</p>
              )}

              <div className="order-summary">
                <p><strong>Total:</strong> ${currentOrderDetail.total?.toFixed(2) || '0.00'}</p>
                {currentOrderDetail.paymentMethod && (
                  <p><strong>Payment Method:</strong> {currentOrderDetail.paymentMethod}</p>
                )}
                {currentOrderDetail.createdAt && (
                  <p><strong>Order Date:</strong> {formatDate(currentOrderDetail.createdAt)}</p>
                )}
              </div>

>>>>>>> Stashed changes
              {deliveryInfo ? (
                <div className="delivery-info-section">
                  <h4>Delivery Information</h4>
                  <p><strong>Status:</strong> {deliveryInfo.status}</p>
                  <p><strong>Tracking Number:</strong> {deliveryInfo.trackingNumber || 'Not available'}</p>
                  <p><strong>Carrier:</strong> {deliveryInfo.carrier || 'Not specified'}</p>
                  <p>
<<<<<<< Updated upstream
                    <strong>Estimated Delivery:</strong>
                    {deliveryInfo.estimatedDeliveryDate ? formatDate(deliveryInfo.estimatedDeliveryDate) : 'Not set'}
                  </p>
                  {deliveryInfo.deliveryNotes && (
                    <p><strong>Notes:</strong> {deliveryInfo.deliveryNotes}</p>
                  )}
=======
                    <strong>Estimated Delivery:</strong>{' '}
                    {deliveryInfo.estimatedDeliveryDate ? formatDate(deliveryInfo.estimatedDeliveryDate) : 'Not set'}
                  </p>
                  {deliveryInfo.deliveryNotes && <p><strong>Notes:</strong> {deliveryInfo.deliveryNotes}</p>}
>>>>>>> Stashed changes
                </div>
              ) : (
                <div className="no-delivery-info">
                  <p>No delivery record created yet.</p>
                </div>
              )}
            </div>
<<<<<<< Updated upstream
           
            <div className="modal-footer">
              {currentOrderDetail.status === 'paid' && !deliveryInfo && (
                <button className="ready-shipment-btn" onClick={createDelivery}>
                  Mark Ready for Shipment
                </button>
              )}
             
              {deliveryInfo && (
                <button className="update-status-btn" onClick={updateDeliveryStatus}>
                  Update Status
                </button>
              )}
             
=======

            <div className="modal-footer">
              {currentOrderDetail.status === 'paid' && !deliveryInfo && (
                <button className="ready-shipment-btn" onClick={createDeliveryRecord}>
                  Mark Ready for Shipment
                </button>
              )}

              {deliveryInfo && (
                <button className="update-status-btn secondary" onClick={updateDeliveryStatusRecord}>
                  Update Delivery Status
                </button>
              )}

>>>>>>> Stashed changes
              <button className="close-modal-btn" onClick={() => setShowDetailModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

<<<<<<< Updated upstream
=======
      {/* Direct Status Update Modal */}
      {showDirectStatusUpdate && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Update Order Status</h3>
              <button className="close-btn" onClick={() => setShowDirectStatusUpdate(false)}>×</button>
            </div>

            <div className="modal-body">
              <p>
                Current Status: <strong>{currentOrderDetail.status || 'Unknown'}</strong>
              </p>
              <div className="form-group">
                <label htmlFor="new-status">Select New Status:</label>
                <select
                  id="new-status"
                  value={newStatus}
                  onChange={(e) => {
                    console.log('Selected status:', e.target.value);
                    setNewStatus(e.target.value);
                  }}
                  className="status-select"
                >
                  <option value="">Select a status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="ready for shipment">Ready for Shipment</option>
                  <option value="shipped">Shipped</option>
                  <option value="in transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="status-note">
                <p>
                  <strong>Note:</strong> Updating the status will also update any associated delivery records for
                  applicable statuses.
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="update-btn" onClick={handleDirectStatusUpdate} disabled={!newStatus}>
                Update Status
              </button>
              <button className="cancel-btn" onClick={() => setShowDirectStatusUpdate(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

>>>>>>> Stashed changes
      {/* Create Delivery Modal */}
      {showCreateDeliveryModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create Delivery Record</h3>
              <button className="close-btn" onClick={() => setShowCreateDeliveryModal(false)}>×</button>
            </div>
<<<<<<< Updated upstream
           
=======

>>>>>>> Stashed changes
            <div className="modal-body">
              <div className="form-group">
                <label>Tracking Number</label>
                <input
                  type="text"
                  value={trackingInfo.trackingNumber}
<<<<<<< Updated upstream
                  onChange={(e) => setTrackingInfo({...trackingInfo, trackingNumber: e.target.value})}
                />
              </div>
             
=======
                  onChange={(e) => setTrackingInfo({ ...trackingInfo, trackingNumber: e.target.value })}
                  placeholder="Enter tracking number"
                />
              </div>

>>>>>>> Stashed changes
              <div className="form-group">
                <label>Carrier</label>
                <select
                  value={trackingInfo.carrier}
<<<<<<< Updated upstream
                  onChange={(e) => setTrackingInfo({...trackingInfo, carrier: e.target.value})}
=======
                  onChange={(e) => setTrackingInfo({ ...trackingInfo, carrier: e.target.value })}
>>>>>>> Stashed changes
                >
                  <option value="">Select a carrier</option>
                  <option value="UPS">UPS</option>
                  <option value="FedEx">FedEx</option>
                  <option value="USPS">USPS</option>
                  <option value="DHL">DHL</option>
                </select>
              </div>
<<<<<<< Updated upstream
             
=======

>>>>>>> Stashed changes
              <div className="form-group">
                <label>Estimated Delivery Date</label>
                <input
                  type="date"
                  value={trackingInfo.estimatedDeliveryDate}
<<<<<<< Updated upstream
                  onChange={(e) => setTrackingInfo({...trackingInfo, estimatedDeliveryDate: e.target.value})}
                />
              </div>
             
=======
                  onChange={(e) => setTrackingInfo({ ...trackingInfo, estimatedDeliveryDate: e.target.value })}
                />
              </div>

>>>>>>> Stashed changes
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={trackingInfo.notes}
<<<<<<< Updated upstream
                  onChange={(e) => setTrackingInfo({...trackingInfo, notes: e.target.value})}
                />
              </div>
            </div>
           
            <div className="modal-footer">
              <button className="create-btn" onClick={handleCreateDelivery}>
=======
                  onChange={(e) => setTrackingInfo({ ...trackingInfo, notes: e.target.value })}
                  placeholder="Add any special delivery instructions or notes"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="create-btn"
                onClick={handleCreateDelivery}
                disabled={!trackingInfo.trackingNumber || !trackingInfo.carrier}
              >
>>>>>>> Stashed changes
                Create Delivery
              </button>
              <button className="cancel-btn" onClick={() => setShowCreateDeliveryModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showUpdateStatusModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Update Delivery Status</h3>
              <button className="close-btn" onClick={() => setShowUpdateStatusModal(false)}>×</button>
            </div>
<<<<<<< Updated upstream
           
            <div className="modal-body">
              <p>Current Status: <strong>{deliveryInfo?.status}</strong></p>
              <p>Select the new status:</p>
             
=======

            <div className="modal-body">
              <p>
                Current Status: <strong>{deliveryInfo?.status || 'Unknown'}</strong>
              </p>
              <p>Select the new status:</p>

>>>>>>> Stashed changes
              <div className="status-buttons">
                {deliveryInfo?.status !== 'ready for shipment' && (
                  <button
                    className="status-btn ready-btn"
                    onClick={() => handleStatusUpdate('ready for shipment')}
                  >
                    Ready for Shipment
                  </button>
                )}
<<<<<<< Updated upstream
               
                {deliveryInfo?.status !== 'shipped' && (
                  <button
                    className="status-btn shipped-btn"
                    onClick={() => handleStatusUpdate('shipped')}
                  >
                    Shipped
                  </button>
                )}
               
                {deliveryInfo?.status !== 'in transit' && (
                  <button
                    className="status-btn transit-btn"
                    onClick={() => handleStatusUpdate('in transit')}
                  >
                    In Transit
                  </button>
                )}
               
                {deliveryInfo?.status !== 'delivered' && (
                  <button
                    className="status-btn delivered-btn"
                    onClick={() => handleStatusUpdate('delivered')}
                  >
=======

                {deliveryInfo?.status !== 'shipped' && (
                  <button className="status-btn shipped-btn" onClick={() => handleStatusUpdate('shipped')}>
                    Shipped
                  </button>
                )}

                {deliveryInfo?.status !== 'in transit' && (
                  <button className="status-btn transit-btn" onClick={() => handleStatusUpdate('in transit')}>
                    In Transit
                  </button>
                )}

                {deliveryInfo?.status !== 'delivered' && (
                  <button className="status-btn delivered-btn" onClick={() => handleStatusUpdate('delivered')}>
>>>>>>> Stashed changes
                    Delivered
                  </button>
                )}
              </div>
            </div>
<<<<<<< Updated upstream
           
=======

>>>>>>> Stashed changes
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowUpdateStatusModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

<<<<<<< Updated upstream
export default AdminOrdersManagement;
=======
export default AdminOrdersManagement;
>>>>>>> Stashed changes
