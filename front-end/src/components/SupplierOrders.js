import React, { useState, useEffect } from "react";
import axios from "axios";

const SupplierOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeOrder, setActiveOrder] = useState(null);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [statusFormData, setStatusFormData] = useState({
    status: "",
    notes: ""
  });

  useEffect(() => {
    // Fetch supplier orders when component mounts
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const url = statusFilter === "all" 
        ? "http://localhost:5000/api/orderdelivers/supplier" 
        : `http://localhost:5000/api/orderdelivers/supplier?status=${statusFilter}`;
      
        const response = await axios.get(url, {
          withCredentials: true,
        });
        
        if (response.data.success) {
          setOrders(response.data.orders || []);
          if (response.data.orders.length === 0) {
            setError("No orders found");
          }
        } else {
          throw new Error(response.data.message || "Failed to load orders");
        }
      } catch (error) {
        console.error("Detailed error:", error);
        setError(
          error.response?.data?.message || 
          error.message || 
          "Failed to load orders. Please try again."
        );
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

  const handleOrderSelect = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orderdelivers/${orderId}`, {
        withCredentials: true,
      });
      
      if (response.data.success) {
        setActiveOrder(response.data.order);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Failed to load order details. Please try again.");
    }
  };

  const handleStatusClick = (order) => {
    setActiveOrder(order);
    setStatusFormData({
      status: "",
      notes: ""
    });
    setShowStatusForm(true);
  };

  const handleStatusChange = (e) => {
    setStatusFormData({
      ...statusFormData,
      status: e.target.value
    });
  };

  const handleNotesChange = (e) => {
    setStatusFormData({
      ...statusFormData,
      notes: e.target.value
    });
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    
    if (!activeOrder || !statusFormData.status) {
      setError("Please select a valid status");
      return;
    }
    
    try {
      const response = await axios.put(
        `http://localhost:5000/api/orderdelivers/status/${activeOrder._id}`,
        statusFormData,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Update the order in the list
        setOrders(orders.map(order => 
          order._id === activeOrder._id ? response.data.order : order
        ));
        
        // Close the form
        setShowStatusForm(false);
        setActiveOrder(null);
        setError(null);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status. Please try again.");
    }
  };

  const getNextAllowedStatuses = (currentStatus) => {
    switch (currentStatus) {
      case "approved":
        return ["ready_for_shipment", "cancelled"];
      case "ready_for_shipment":
        return ["shipped", "cancelled"];
      case "shipped":
        return ["in_transit", "delivered"];
      case "in_transit":
        return ["delivered"];
      case "delivered":
        return ["completed"];
      default:
        return [];
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "ready_for_shipment":
        return "Ready for Shipment";
      case "shipped":
        return "Shipped";
      case "in_transit":
        return "In Transit";
      case "delivered":
        return "Delivered";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "ready_for_shipment":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "in_transit":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-amber-700 mb-4">Order Management</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Order Status Filter */}
        <div className="flex items-center mb-4">
          <label className="mr-2 text-sm font-medium text-gray-700">Filter by status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="all">All Orders</option>
            <option value="approved">Approved</option>
            <option value="ready_for_shipment">Ready for Shipment</option>
            <option value="shipped">Shipped</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        {/* Status Update Form */}
        {showStatusForm && activeOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
              <h3 className="text-lg font-bold text-amber-700 mb-2">
                Update Order Status
              </h3>
              
              <div className="mb-4">
                <p className="font-medium">{activeOrder.productId?.productName}</p>
                <p className="text-sm text-gray-600">
                  Current Status: <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(activeOrder.status)}`}>
                    {getStatusLabel(activeOrder.status)}
                  </span>
                </p>
              </div>
              
              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Status *
                  </label>
                  <select
                    value={statusFormData.status}
                    onChange={handleStatusChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="">Select new status</option>
                    {getNextAllowedStatuses(activeOrder.status).map((status) => (
                      <option key={status} value={status}>
                        {getStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={statusFormData.notes}
                    onChange={handleNotesChange}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Add any notes about this status change..."
                  ></textarea>
                </div>
                
                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowStatusForm(false);
                      setActiveOrder(null);
                    }}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                  >
                    Update Status
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.productId?.productName || "Unknown Product"}</div>
                      <div className="text-sm text-gray-500">{order.productId?.productCategory || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rs{order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleOrderSelect(order._id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      {getNextAllowedStatuses(order.status).length > 0 && (
                        <button
                          onClick={() => handleStatusClick(order)}
                          className="text-amber-600 hover:text-amber-900"
                        >
                          Update Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Order Details Modal */}
        {activeOrder && !showStatusForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-xl">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-amber-700 mb-4">
                  Order Details
                </h3>
                <button
                  onClick={() => setActiveOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Product Information</h4>
                  <p><span className="font-medium">Name:</span> {activeOrder.productId?.productName || "N/A"}</p>
                  <p><span className="font-medium">Category:</span> {activeOrder.productId?.productCategory || "N/A"}</p>
                  <p><span className="font-medium">Quantity:</span> {activeOrder.quantity}</p>
                  <p><span className="font-medium">Price Per Unit:</span> Rs{activeOrder.pricePerUnit?.toFixed(2) || "N/A"}</p>
                  <p><span className="font-medium">Total Price:</span> Rs{activeOrder.totalPrice?.toFixed(2) || "N/A"}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Order Information</h4>
                  <p><span className="font-medium">Order ID:</span> {activeOrder._id}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(activeOrder.status)}`}>
                      {getStatusLabel(activeOrder.status)}
                    </span>
                  </p>
                  <p><span className="font-medium">Created:</span> {formatDate(activeOrder.createdAt)}</p>
                  <p><span className="font-medium">Updated:</span> {formatDate(activeOrder.updatedAt)}</p>
                  {activeOrder.notes && (
                    <p><span className="font-medium">Notes:</span> {activeOrder.notes}</p>
                  )}
                </div>
              </div>
              
              <div className="border-t pt-4 flex justify-end">
                {getNextAllowedStatuses(activeOrder.status).length > 0 && (
                  <button
                    onClick={() => setShowStatusForm(true)}
                    className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                  >
                    Update Status
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierOrders;