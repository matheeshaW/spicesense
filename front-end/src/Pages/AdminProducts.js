import React, { useEffect, useState } from "react";
import axios from "axios";  // ✅ Import Axios for API requests
import "../Styles/adminProducts.css";

const API_URL = "http://localhost:5000/api/products"; // ✅ Update the correct backend URL

const AdminProducts = () => {
    
    const [products, setProducts] = useState([]);
    
    // New product state
    const [newProduct, setNewProduct] = useState({
        productName: "",
        category: "",
        quantity: "",
        expiryDate: "",
        batchNo: "",
    });

    // Editing product state
    const [editingProduct, setEditingProduct] = useState(null);

    // ✅ Fetch Products from Backend
    const fetchProducts = async () => {
        try {
            const response = await axios.get(API_URL);
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // ✅ Handle Input Change
    const handleChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    // ✅ Add Product to Database
    const handleAddProduct = async () => {
        if (!newProduct.productName || !newProduct.category || !newProduct.quantity || !newProduct.expiryDate || !newProduct.batchNo) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const response = await axios.post(API_URL, newProduct);
            setProducts([...products, response.data]); // Update state
            setNewProduct({ productName: "", category: "", quantity: "", expiryDate: "", batchNo: "" });
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    // ✅ Delete Product from Database
    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setProducts(products.filter(product => product._id !== id)); // Update state
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    // ✅ Edit Product
    const handleEditProduct = (product) => {
        setEditingProduct(product);
    };

    // ✅ Update Product in Database
    const handleUpdateProduct = async () => {
        try {
            const response = await axios.put(`${API_URL}/${editingProduct._id}`, editingProduct);
            setProducts(products.map(prod => (prod._id === editingProduct._id ? response.data : prod))); // Update state
            setEditingProduct(null);
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    return (
        <div className="admin-container">
            <h2>Admin - Manage Products</h2>

            {/* Add / Edit Form */}
            <div className="product-form">
                <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                <input type="text" name="productName" placeholder="Product Name" value={editingProduct ? editingProduct.productName : newProduct.productName} onChange={editingProduct ? (e) => setEditingProduct({ ...editingProduct, productName: e.target.value }) : handleChange} />
                <select name="category" value={editingProduct ? editingProduct.category : newProduct.category} onChange={editingProduct ? (e) => setEditingProduct({ ...editingProduct, category: e.target.value }) : handleChange}>
                    <option value="">Select Category</option>
                    <option value="Raw Material">Raw Material</option>
                    <option value="Finished Product">Finished Product</option>
                </select>
                <input type="number" name="quantity" placeholder="Quantity (Kg)" value={editingProduct ? editingProduct.quantity : newProduct.quantity} onChange={editingProduct ? (e) => setEditingProduct({ ...editingProduct, quantity: e.target.value }) : handleChange} />
                <input type="date" name="expiryDate" value={editingProduct ? editingProduct.expiryDate : newProduct.expiryDate} onChange={editingProduct ? (e) => setEditingProduct({ ...editingProduct, expiryDate: e.target.value }) : handleChange} />
                <input type="text" name="batchNo" placeholder="Batch Number" value={editingProduct ? editingProduct.batchNo : newProduct.batchNo} onChange={editingProduct ? (e) => setEditingProduct({ ...editingProduct, batchNo: e.target.value }) : handleChange} />

                {editingProduct ? (
                    <button onClick={handleUpdateProduct}>Update Product</button>
                ) : (
                    <button onClick={handleAddProduct}>Add Product</button>
                )}
            </div>

            {/* Products Table */}
            <h3>Product List</h3>
            <table className="product-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity (Kg)</th>
                        <th>Expiry Date</th>
                        <th>Batch No</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map(product => (
                            <tr key={product._id}>
                                <td>{product.productName}</td>
                                <td>{product.category}</td>
                                <td>{product.quantity}</td>
                                <td>{new Date(product.expiryDate).toLocaleDateString()}</td>
                                <td>{product.batchNo}</td>
                                <td>
                                    <button onClick={() => handleEditProduct(product)}>Edit</button>
                                    <button onClick={() => handleDeleteProduct(product._id)} className="delete-btn">Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="6">No products available.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminProducts;
