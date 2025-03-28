import React, { useState, useEffect } from "react";
import axios from "axios";

const SupplierDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [deliveryFormData, setDeliveryFormData] = useState({
    trackingNumber: "",
    carrier: "",
    expectedDeliveryDate: "",
    actualDeliveryDate: "",
    status: "",
    deliveryNotes: ""
  });

  useEffect(() => {
    // Fetch supplier deliveries when component mounts
    fetchDeliveries();
  }, [statusFilter]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      
      const url = statusFilter === "all" 
        ? "http://localhost:5000/api/deliveries/supplier" 
        : `http://localhost:5000/api/deliveries/supplier?status=${statusFilter}`;
      
      const response = await axios.get(url, {
        withCredentials: true,
      });
      
      if (response.data.success) {
        setDeliveries(response.data.deliveries);
      }
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setError("Failed to load deliveries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeliverySelect = async (deliveryId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/deliveries/${deliveryId}`, {
        withCredentials: true,
      });
      
      if (response.data.success) {
        setActiveDelivery(response.data.delivery);
      }
    } catch (error) {
      console.error("Error fetching delivery details:", error);
      setError("Failed to load delivery details. Please try again.");
    }
  };

  const handleUpdateClick = (delivery) => {
    setActiveDelivery(delivery);
    
    // Format dates for form inputs (YYYY-MM-DD format)
    const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };
    
    setDeliveryFormData({
      trackingNumber: delivery.trackingNumber || "",
      carrier: delivery.carrier || "",
      expectedDeliveryDate: formatDateForInput(delivery.expectedDeliveryDate),
      actualDeliveryDate: formatDateForInput(delivery.actualDeliveryDate),
      status: delivery.status || "",
      deliveryNotes: delivery.deliveryNotes || ""
    });
    
    setShowDeliveryForm(true);
  };

  const handleCreateDelivery = (orderId) => {
    setActiveDelivery({ orderId });
    setDeliveryFormData({
      trackingNumber: "",
      carrier: "",
      expectedDeliveryDate: "",
      actualDeliveryDate: "",
      status: "pending",
      deliveryNotes: ""
    });
    setShowDeliveryForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryFormData({
      ...deliveryFormData,
      [name]: value
    });
  };

  const handleSubmitDelivery = async (e) => {
    e.preventDefault();
    
    try {
      let url, method;
      
      if (activeDelivery._id) {
        // Updating existing delivery
        url = `http://localhost:5000/api/deliveries/${activeDelivery._id}`;
        method = "put";
      } else {
        // Creating new delivery
        url = "http://localhost:5000/api/deliveries";
        method = "post";
      }
      
      const data = {
        ...deliveryFormData
      };
      
      // Add orderId if creating a new delivery
      if (!activeDelivery._id && activeDelivery.orderId) {
        data.orderId = activeDelivery.orderId;
      }
      
      const response = await axios({
        method,
        url,
        data,
        withCredentials: true
      });
      
      if (response.data.success) {
        // Refresh the deliveries list
        await fetchDeliveries();
        
        // Close the form
        setShowDeliveryForm(false);
        setActiveDelivery(null);
        setError(null);
      }
    } catch (error) {
      console.error("Error saving delivery:", error);
      setError("Failed to save delivery. Please try again.");
    }
  };

  const handleCompleteDelivery = async (deliveryId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/deliveries/complete/${deliveryId}`,
        {
          actualDeliveryDate: new Date().toISOString()
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Refresh the deliveries list
        await fetchDeliveries();
        
        // Close any open delivery view
        setActiveDelivery(null);
      }
    } catch (error) {
      console.error("Error completing delivery:", error);
      setError("Failed to mark delivery as completed. Please try again.");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "in_transit":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOrderStatusClass = (status) => {
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

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "shipped":
        return "Shipped";
      case "in_transit":
        return "In Transit";
      case "delivered":
        return "Delivered";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getOrderStatusLabel = (status) => {
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

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
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
        <p>Loading deliveries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-amber-700 mb-4">Delivery Management</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Delivery Status Filter */}
        <div className="flex items-center mb-4">
          <label className="mr-2 text-sm font-medium text-gray-700">Filter by status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="all">All Deliveries</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
        
        {/* Delivery Form Modal */}
        {showDeliveryForm && activeDelivery && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
              <h3 className="text-lg font-bold text-amber-700 mb-2">
                {activeDelivery._id ? "Update Delivery" : "Create Delivery"}
              </h3>
              
              <form onSubmit={handleSubmitDelivery} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    name="trackingNumber"
                    value={deliveryFormData.trackingNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carrier
                  </label>
                  <input
                    type="text"
                    name="carrier"
                    value={deliveryFormData.carrier}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Delivery Date
                  </label>
                  <input
                    type="date"
                    name="expectedDeliveryDate"
                    value={deliveryFormData.expectedDeliveryDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={deliveryFormData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="">Select status</option>
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
                
                {deliveryFormData.status === "delivered" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actual Delivery Date
                    </label>
                    <input
                      type="date"
                      name="actualDeliveryDate"
                      value={deliveryFormData.actualDeliveryDate || new Date().toISOString().split('T')[0]}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Notes
                  </label>
                  <textarea
                    name="deliveryNotes"
                    value={deliveryFormData.deliveryNotes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Add any notes about this delivery..."
                  ></textarea>
                </div>
                
                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeliveryForm(false);
                      setActiveDelivery(null);
                    }}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                  >
                    {activeDelivery._id ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Deliveries List */}
        {deliveries.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No deliveries found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expected Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveries.map((delivery) => (
                  <tr key={delivery._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {delivery.orderId?.productId?.productName || "Unknown Product"}
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getOrderStatusClass(delivery.orderId?.status)}`}>
                          {getOrderStatusLabel(delivery.orderId?.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {delivery.trackingNumber ? (
                        <div>
                          <div>{delivery.trackingNumber}</div>
                          <div className="text-xs text-gray-400">{delivery.carrier || "No carrier"}</div>
                        </div>
                      ) : (
                        "Not set"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {delivery.expectedDeliveryDate ? formatDate(delivery.expectedDeliveryDate) : "Not set"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(delivery.status)}`}>
                        {getStatusLabel(delivery.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeliverySelect(delivery._id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      {delivery.status !== "delivered" && (
                        <button
                          onClick={() => handleUpdateClick(delivery)}
                          className="text-amber-600 hover:text-amber-900 mr-3"
                        >
                          Update
                        </button>
                      )}
                      {delivery.status === "in_transit" && (
                        <button
                          onClick={() => handleCompleteDelivery(delivery._id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Delivery Details Modal */}
        {activeDelivery && !showDeliveryForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-xl">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-amber-700 mb-4">
                  Delivery Details
                </h3>
                <button
                  onClick={() => setActiveDelivery(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Order Information</h4>
                  <p><span className="font-medium">Product:</span> {activeDelivery.orderId?.productId?.productName || "N/A"}</p>
                  <p><span className="font-medium">Quantity:</span> {activeDelivery.orderId?.quantity || "N/A"}</p>
                  <p><span className="font-medium">Order Status:</span> 
                    <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getOrderStatusClass(activeDelivery.orderId?.status)}`}>
                      {getOrderStatusLabel(activeDelivery.orderId?.status)}
                    </span>
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Delivery Information</h4>
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(activeDelivery.status)}`}>
                    {getStatusLabel(activeDelivery.status)}
                    </span>
                  </p>
                  <p><span className="font-medium">Tracking Number:</span> {activeDelivery.trackingNumber || "Not set"}</p>
                  <p><span className="font-medium">Carrier:</span> {activeDelivery.carrier || "Not set"}</p>
                  <p><span className="font-medium">Expected Delivery:</span> {formatDate(activeDelivery.expectedDeliveryDate)}</p>
                  {activeDelivery.status === "delivered" && (
                    <p><span className="font-medium">Actual Delivery:</span> {formatDate(activeDelivery.actualDeliveryDate)}</p>
                  )}
                </div>
              </div>
              
              {activeDelivery.deliveryNotes && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Delivery Notes</h4>
                  <p className="bg-gray-50 p-3 rounded">{activeDelivery.deliveryNotes}</p>
                </div>
              )}
              
              <div className="border-t pt-4 flex justify-end space-x-3">
                {activeDelivery.status !== "delivered" && (
                  <button
                    onClick={() => handleUpdateClick(activeDelivery)}
                    className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                  >
                    Update Delivery
                  </button>
                )}
                {activeDelivery.status === "in_transit" && (
                  <button
                    onClick={() => handleCompleteDelivery(activeDelivery._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Mark as Delivered
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

export default SupplierDeliveries;   