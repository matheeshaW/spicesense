import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5001/api/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch(console.error);
  }, [orderId]);

  // 🛠 Handle Edit Mode
  const handleEdit = () => setIsEditing(true);

  // 🛠 Handle Save (Update Order)
  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5001/api/orders/update/${orderId}`, {
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress
      });
      setIsEditing(false);
      alert('Order updated successfully!');
    } catch (error) {
      console.error('❌ Error updating order:', error);
      alert('Error updating order.');
    }
  };

  // 🛠 Handle Delete (Delete Order)
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`http://localhost:5001/api/orders/delete/${orderId}`);
        alert('Order deleted successfully!');
        navigate('/home'); // Redirect after deletion
      } catch (error) {
        console.error('❌ Error deleting order:', error);
        alert('Error deleting order.');
      }
    }
  };

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h2>Order Confirmation</h2>
      {isEditing ? (
        <>
          <input
            type="text"
            value={order.shippingAddress}
            onChange={(e) => setOrder({ ...order, shippingAddress: e.target.value })}
          />
          <input
            type="text"
            value={order.billingAddress}
            onChange={(e) => setOrder({ ...order, billingAddress: e.target.value })}
          />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <p>Shipping Address: {order.shippingAddress}</p>
          <p>Billing Address: {order.billingAddress}</p>
          <p>Total: ${order.total}</p>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={() => navigate('/home')}>Confirm</button>
          <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px' }}>
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
