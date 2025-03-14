import React, { useEffect, useState } from "react";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../api/api";
import "../Styles/adminProducts.css"

const AdminProducts = () => {
    
    const [products, setProducts] = useState([]);
    
    
    const [newProduct, setNewProduct] = useState({
        name: "",
        category: "",
        quantity: "",
        expiryDate: "",
        batchNo: "",
    });

    
    const [editingProduct, setEditingProduct] = useState(null);

    // fetch all products from backend
    const fetchProducts = async () => {
        try {
            const response = await getProducts();
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [])

   
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (editingProduct) {
            setEditingProduct({ ...editingProduct, [name]: value });

        } else {
            setNewProduct({ ...newProduct, [name]: value });
        }
    };

    
    const handleAddProduct = async() => {
        if (!newProduct.name || !newProduct.category || !newProduct.quantity || !newProduct.expiryDate || !newProduct.batchNo) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            await addProduct(newProduct);
            fetchProducts();
            setNewProduct({ name: "", category: "", quantity: "", expiryDate: "", batchNo: "" });
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    const handleUpdateProduct = async () => {
        try {
            await updateProduct(editingProduct._id, editingProduct);
            fetchProducts();
            setEditingProduct(null);
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    
    const handleDeleteProduct = async (id) => {
        try {
            await deleteProduct(id);
            fetchProducts();
        } catch (error) {
            console.error("Error deleting products:", error);
        }
    };

    
   

    return (
        <div className="admin-container">
            <h2>Admin - Manage Products</h2>

           
            <div className="product-form">
                <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                <input type="text" name="name" placeholder="Product Name" value={editingProduct ? editingProduct.name : newProduct.name} onChange={handleChange} />
                <input type="text" name="category" placeholder="Category" value={editingProduct ? editingProduct.category : newProduct.category} onChange={ handleChange} />
                <input type="number" name="quantity" placeholder="Quantity (Kg)" value={editingProduct ? editingProduct.quantity : newProduct.quantity} onChange={handleChange} />
                <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date:</label>
                    <input 
                    type="date" 
                    id="expiryDate" 
                    name="expiryDate" 
                    value={editingProduct ? editingProduct.expiryDate : newProduct.expiryDate} 
                    onChange={handleChange} 
                    />
                </div>
 
                <input type="text" name="batchNo" placeholder="Batch Number" value={editingProduct ? editingProduct.batchNo : newProduct.batchNo} onChange={handleChange} />

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
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>{product.quantity}</td>
                                <td>{product.expiryDate}</td>
                                <td>{product.batchNo}</td>
                                <td>
                                    <button onClick={() => setEditingProduct(product)}>Edit</button>
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
