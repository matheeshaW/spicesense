import React, { useEffect, useState } from "react";
import axios from "axios";  
import "../Styles/adminProducts.css";

const API_URL = "http://localhost:5000/api/products"; 
const API_NAMES = "http://localhost:5000/api/products/names";

const AdminProducts = () => {
    
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("Raw Material");
    const [quantity, setQuantity] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [batchNo, setBatchNo] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [productNames, setProductNames] = useState([]);  // List of product names
    const [products, setProducts] = useState([]); // List of products
    const [customProduct, setCustomProduct] = useState(false);

    // Fetch existing product names
    useEffect(() => {
        axios.get(API_NAMES)
            .then(response => setProductNames(response.data))
            .catch(error => console.error("Error fetching product names:", error));
    }, []);

    // Fetch all products
    useEffect(() => {
        axios.get(API_URL)
            .then(response => setProducts(response.data))
            .catch(error => console.error("Error fetching products:", error));
    }, []);

    // Handle product name selection
    const handleProductChange = (e) => {
        if (e.target.value === "custom") {
            setCustomProduct(true);
            setProductName("");
        } else {
            setCustomProduct(false);
            setProductName(e.target.value);
        }
    };

    // Handle image upload and preview
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("productName", productName || customProduct);
        formData.append("category", category);
        formData.append("quantity", quantity);
        formData.append("expiryDate", expiryDate);
        formData.append("batchNo", batchNo);
        if (image) formData.append("image", image);

        try {
            await axios.post(API_URL, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Product added successfully!");
            window.location.reload();
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Error adding product!");
        }
    };

    // Delete Product
    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            alert("Product deleted successfully!");
            window.location.reload();
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Error deleting product!");
        }
    };

    // Edit Product Name
    const handleEditProduct = async (id) => {
        const newName = prompt("Enter new product name:");
        if (!newName) return;

        try {
            await axios.put(`${API_URL}/${id}`, { productName: newName });
            alert("Product updated successfully!");
            window.location.reload();
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Error updating product!");
        }
    };

    return (
        <div className="admin-container">
            <h2>Manage Products</h2>
            <form onSubmit={handleSubmit} className="product-form">
                
                {/* Product Name Dropdown */}
                <label>Product Name:</label>
                <select onChange={handleProductChange} value={productName}>
                    <option value="">Select a Product</option>
                    {productNames.map((name, index) => (
                        <option key={index} value={name}>{name}</option>
                    ))}
                    <option value="custom">Add New Product</option>
                </select>

                {/* Custom Product Name Input */}
                {customProduct && (
                    <input
                        type="text"
                        placeholder="Enter new product name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                )}

                {/* Category Selection */}
                <label>Category:</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Raw Material">Raw Material</option>
                    <option value="Finished Product">Finished Product</option>
                </select>

                {/* Quantity */}
                <label>Quantity:</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />

                {/* Expiry Date */}
                <label>Expiry Date:</label>
                <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />

                {/* Batch No */}
                <label>Batch No:</label>
                <input type="text" value={batchNo} onChange={(e) => setBatchNo(e.target.value)} required />

                {/* Image Upload */}
                <label>Upload Product Image:</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />

                {/* Image Preview */}
                {preview && (
                    <div className="preview-container">
                        <img src={preview} alt="Product Preview" />
                    </div>
                )}

                <button type="submit">Add Product</button>
            </form>

            {/* Product List */}
            <h3>Product List</h3>
            <ul className="product-list">
                {products.map((product) => (
                    <li key={product._id}>
                        {product.productName} - {product.category}
                        <button onClick={() => handleEditProduct(product._id)}>Edit</button>
                        <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminProducts;
