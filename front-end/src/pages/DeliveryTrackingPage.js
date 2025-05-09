// pages/DeliveryTrackingPage.js
import React, { useEffect, useState } from 'react';
<<<<<<< Updated upstream
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from "../components/NavigationBar";
import "../Styles/DeliveryTracking.css"; // You'll need to create this CSS file

const DeliveryTrackingPage = () => {
  const { deliveryId } = useParams();
  const [delivery, setDelivery] = useState(null);
=======
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchOrder } from '../api'; // Use the existing API function
import NavigationBar from "../components/NavigationBar";
import "../Styles/DeliveryTracking.css";
import axios from "axios";

const DeliveryTrackingPage = () => {
  const { deliveryId } = useParams();
  const location = useLocation();
>>>>>>> Stashed changes
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
<<<<<<< Updated upstream


  
    
    


  useEffect(() => {   
    const fetchDeliveryAndOrder = async () => {
      try {
        setIsLoading(true);
        // Fetch delivery details
        const deliveryResponse = await axios.get(`http://localhost:5000/api/deliveries/${deliveryId}`);
        setDelivery(deliveryResponse.data);
        
        // Fetch associated order details
        const orderResponse = await axios.get(`http://localhost:5000/api/order/${deliveryResponse.data.orderId}`);
        setOrder(orderResponse.data);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching delivery details:', err);
        setError('Unable to load delivery tracking information. Please try again later.');
=======
  const userId = sessionStorage.getItem("userId");
  const [userData, setUserData] = useState(null);

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
        setError("Failed to load user data. Please log in again.");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate, location.state]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        
        // Get orderId from params or from query string
        let orderId = null;
        
        // Try to get orderId from URL params or query string
        if (deliveryId) {
          // Use deliveryId as orderId directly
          orderId = deliveryId;
        } else {
          // Check if orderId is in the query parameters
          const searchParams = new URLSearchParams(location.search);
          orderId = searchParams.get('orderId');
        }
        
        if (!orderId) {
          setError('No order ID provided');
          setIsLoading(false);
          return;
        }
        
        // Use the fetchOrder function from your API
        const response = await fetchOrder(orderId);
        
        if (response.data) {
          setOrder(response.data);
          setError(null);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Unable to load tracking information. Please try again later.');
>>>>>>> Stashed changes
      } finally {
        setIsLoading(false);
      }
    };

<<<<<<< Updated upstream
    if (deliveryId) {
      fetchDeliveryAndOrder();
    }
  }, [deliveryId]);

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
=======
    fetchOrderDetails();
  }, [deliveryId, location.search]);

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Pending';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid Date';
    }
>>>>>>> Stashed changes
  };

  // Function to determine the current step in the delivery process
  const getCurrentStep = (status) => {
<<<<<<< Updated upstream
    switch(status) {
=======
    if (!status) return 0;
    
    switch(status.toLowerCase()) {
>>>>>>> Stashed changes
      case 'ready for shipment':
        return 1;
      case 'shipped':
        return 2;
      case 'in transit':
        return 3;
      case 'delivered':
        return 4;
<<<<<<< Updated upstream
=======
      case 'paid':
        return 1; // If the order is paid but no delivery status, assume "ready for shipment"
>>>>>>> Stashed changes
      default:
        return 0;
    }
  };

<<<<<<< Updated upstream
  if (isLoading) {
    return (
      <div>
        <NavigationBar />
=======
  // Generate estimated dates based on order date
  const getEstimatedDates = () => {
    if (!order) return {};
    
    const orderDate = new Date(order.createdAt || Date.now());
    
    // Processing: 1-2 days
    const processingDate = new Date(orderDate);
    processingDate.setDate(orderDate.getDate() + 1);
    
    // Shipping: 3-5 days after processing
    const shippingDate = new Date(processingDate);
    shippingDate.setDate(processingDate.getDate() + 2);
    
    // Delivery: 2-7 days after shipping
    const deliveryDate = new Date(shippingDate);
    deliveryDate.setDate(shippingDate.getDate() + 5);
    
    return {
      orderDate,
      processingDate,
      shippingDate,
      deliveryDate
    };
  };

  if (isLoading) {
    return (
      <div>
        <NavigationBar userData={userData} />
>>>>>>> Stashed changes
        <div className="delivery-tracking-container">
          <div className="delivery-tracking-loading">Loading tracking information...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
<<<<<<< Updated upstream
        <NavigationBar />
        <div className="delivery-tracking-container">
          <div className="delivery-tracking-error">{error}</div>
          <button onClick={() => navigate('/deliveries')} className="back-button">
            Back to Deliveries
=======
        <NavigationBar userData={userData} />
        <div className="delivery-tracking-container">
          <div className="delivery-tracking-error">{error}</div>
          <button onClick={() => navigate('/home')} className="back-button">
            Back to Home
>>>>>>> Stashed changes
          </button>
        </div>
      </div>
    );
  }

<<<<<<< Updated upstream
  if (!delivery || !order) {
    return (
      <div>
        <NavigationBar />
        <div className="delivery-tracking-container">
          <div className="delivery-tracking-error">Delivery information not found.</div>
          <button onClick={() => navigate('/deliveries')} className="back-button">
            Back to Deliveries
=======
  if (!order) {
    return (
      <div>
        <NavigationBar userData={userData} />
        <div className="delivery-tracking-container">
          <div className="delivery-tracking-error">Order information not found.</div>
          <button onClick={() => navigate('/home')} className="back-button">
            Back to Home
>>>>>>> Stashed changes
          </button>
        </div>
      </div>
    );
  }

<<<<<<< Updated upstream
  const currentStep = getCurrentStep(delivery.status);

  return (
    <div>
      <NavigationBar />
      <div className="delivery-tracking-container">
        <h2 className="delivery-tracking-title">Delivery Tracking</h2>
=======
  const currentStep = getCurrentStep(order.status);
  const estimatedDates = getEstimatedDates();

  return (
    <div>
      <NavigationBar userData={userData}/>
      <div className="delivery-tracking-container">
        <h2 className="delivery-tracking-title">Order Tracking</h2>
>>>>>>> Stashed changes
        
        <div className="delivery-tracking-summary">
          <div className="delivery-tracking-info">
            <p><strong>Order Number:</strong> {order._id}</p>
<<<<<<< Updated upstream
            <p><strong>Status:</strong> <span className={`status-${delivery.status.replace(/\s+/g, '-')}`}>
              {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
            </span></p>
            {delivery.trackingNumber && (
              <p><strong>Tracking Number:</strong> {delivery.trackingNumber}</p>
            )}
            {delivery.carrier && (
              <p><strong>Carrier:</strong> {delivery.carrier}</p>
            )}
            {delivery.estimatedDeliveryDate && (
              <p><strong>Estimated Delivery:</strong> {formatDate(delivery.estimatedDeliveryDate)}</p>
            )}
            {delivery.actualDeliveryDate && (
              <p><strong>Delivered On:</strong> {formatDate(delivery.actualDeliveryDate)}</p>
            )}
=======
            <p><strong>Status:</strong> <span className={`status-${(order.status || '').replace(/\s+/g, '-')}`}>
              {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Processing'}
            </span></p>
            <p><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>
            <p><strong>Estimated Processing:</strong> {formatDate(estimatedDates.processingDate)}</p>
            <p><strong>Estimated Shipping:</strong> {formatDate(estimatedDates.shippingDate)}</p>
            <p><strong>Estimated Delivery:</strong> {formatDate(estimatedDates.deliveryDate)}</p>
>>>>>>> Stashed changes
          </div>
        </div>
        
        {/* Delivery Progress Tracker */}
        <div className="delivery-tracking-progress">
          <div className="progress-steps">
            <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <div className="step-icon">1</div>
              <div className="step-label">Order Processing</div>
<<<<<<< Updated upstream
              <div className="step-date">
                {delivery.statusHistory && delivery.statusHistory.find(h => h.status === 'ready for shipment') 
                  ? formatDate(delivery.statusHistory.find(h => h.status === 'ready for shipment').timestamp)
                  : 'Pending'}
              </div>
=======
              <div className="step-date">{formatDate(estimatedDates.processingDate)}</div>
>>>>>>> Stashed changes
            </div>
            
            <div className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <div className="step-icon">2</div>
              <div className="step-label">Shipped</div>
<<<<<<< Updated upstream
              <div className="step-date">
                {delivery.statusHistory && delivery.statusHistory.find(h => h.status === 'shipped') 
                  ? formatDate(delivery.statusHistory.find(h => h.status === 'shipped').timestamp)
                  : 'Pending'}
              </div>
=======
              <div className="step-date">Estimated: {formatDate(estimatedDates.shippingDate)}</div>
>>>>>>> Stashed changes
            </div>
            
            <div className={`progress-step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
              <div className="step-icon">3</div>
              <div className="step-label">In Transit</div>
<<<<<<< Updated upstream
              <div className="step-date">
                {delivery.statusHistory && delivery.statusHistory.find(h => h.status === 'in transit') 
                  ? formatDate(delivery.statusHistory.find(h => h.status === 'in transit').timestamp)
                  : 'Pending'}
              </div>
=======
              <div className="step-date">Pending</div>
>>>>>>> Stashed changes
            </div>
            
            <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
              <div className="step-icon">4</div>
              <div className="step-label">Delivered</div>
<<<<<<< Updated upstream
              <div className="step-date">
                {delivery.statusHistory && delivery.statusHistory.find(h => h.status === 'delivered') 
                  ? formatDate(delivery.statusHistory.find(h => h.status === 'delivered').timestamp)
                  : 'Pending'}
              </div>
=======
              <div className="step-date">Estimated: {formatDate(estimatedDates.deliveryDate)}</div>
>>>>>>> Stashed changes
            </div>
          </div>
          
          <div className="progress-bar">
            <div className="progress-indicator" style={{ width: `${(currentStep - 1) * 33.33}%` }}></div>
          </div>
        </div>
        
        {/* Order Details */}
        <div className="delivery-order-details">
          <h3>Order Details</h3>
          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <p><strong>Item:</strong> {item.itemId?.name || `Item ${index + 1}`}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Price:</strong> ${item.price?.toFixed(2) || '0.00'}</p>
              </div>
            ))}
          </div>
          <div className="order-total">
            <p><strong>Total:</strong> ${order.total?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
        
<<<<<<< Updated upstream
        {/* Delivery Notes */}
        {delivery.deliveryNotes && (
          <div className="delivery-notes">
            <h3>Delivery Notes</h3>
            <p>{delivery.deliveryNotes}</p>
          </div>
        )}
        
=======
>>>>>>> Stashed changes
        {/* Shipping Information */}
        <div className="shipping-information">
          <h3>Shipping Information</h3>
          <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
<<<<<<< Updated upstream
          {delivery.carrier && (
            <p><strong>Carrier:</strong> {delivery.carrier}</p>
          )}
          {delivery.trackingNumber && (
            <div className="tracking-link">
              <p><strong>Track your package:</strong></p>
              <p>Use your tracking number {delivery.trackingNumber} on the carrier's website.</p>
            </div>
          )}
        </div>
        
        <div className="delivery-tracking-actions">
          <button onClick={() => navigate('/delivery-tracking')} className="back-button">
            Back to Deliveries
          </button>
          {/* Could add additional actions here like "Contact Support" */}
=======
          <p className="info-message">Tracking information will be available once your order ships.</p>
        </div>
        
        <div className="delivery-tracking-actions">
          <button onClick={() => navigate('/home')} className="back-button">
            Back to Home
          </button>
          <button onClick={() => window.print()} className="action-button">
            Print Order Details
          </button>
>>>>>>> Stashed changes
        </div>
      </div>
    </div>
  );
};

export default DeliveryTrackingPage;