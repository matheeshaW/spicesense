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
    const [productNames, setProductNames] = useState([]);  
    const [products, setProducts] = useState([]); 
    const [customProduct, setCustomProduct] = useState(false);

    const [editMode, setEditMode] = useState(false);
    const [editProductId, setEditProductId] = useState(null);

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

    useEffect(() => {
        if (!editMode) {  
            axios.get(`${API_URL}/latest-batch`)
                .then(response => setBatchNo(response.data.batchNo))
                .catch(error => console.error("Error fetching batch number:", error));
        }
    }, [editMode]); 

    // Handle product name selection
    const handleProductChange = (e) => {
        if (e.target.value === "custom") {
            setCustomProduct(true);
            setProductName(""); // Reset product name for new input
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
        formData.append("productName", productName || (customProduct ? "Custom Product" : ""));
        formData.append("category", category);
        formData.append("quantity", quantity);
        formData.append("expiryDate", expiryDate);
        formData.append("batchNo", batchNo);
        if (image) formData.append("image", image);

        try {
            const response = await axios.post(API_URL, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("Product added:", response.data);
            alert("Product added successfully!");
            window.location.reload();
        } catch (error) {
            console.error("Error adding product:", error.response?.data || error.message);
            alert("Error adding product! " + (error.response?.data?.error || "Check console for details."));
        }
    };

    // Delete Product
    const handleDeleteProduct = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            if (response.status === 200) {
                alert("Batch deleted successfully!");
                setProducts(products.filter(product => product._id !== id));
            }
        } catch (error) {
            console.error("Error deleting batch:", error);
            alert("Error deleting batch!");
        }
    };

    

    const handleEditProduct = (product) => {
        setEditMode(true);
        setEditProductId(product._id);
        setProductName(product.productName);
        setCategory(product.category);
        setQuantity(product.quantity);
        setExpiryDate(product.expiryDate);
        setBatchNo(product.batchNo);
        setPreview(product.image);
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("productName", productName);
        formData.append("category", category);
        formData.append("quantity", quantity);
        formData.append("expiryDate", expiryDate);
        formData.append("batchNo", batchNo);
        if (image) formData.append("image", image);

        try {
            await axios.put(`${API_URL}/${editProductId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
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
                <input type="text" value={batchNo} onChange={(e) => setBatchNo(e.target.value)} readOnly />

                {/* Image Upload */}
                <label>Upload Product Image:</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />

                {/* Image Preview */}
                {preview && (
                    <div className="preview-container">
                        <img src={preview} alt="Product Preview" />
                    </div>
                )}

                <button type="submit">{editMode ? "Update Product" : "Add Product" }</button>
            </form>

            {/* Product List */}
            <h3>Product List</h3>
            <table className="product-list">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Expiry date</th>
                        <th>Batch No</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>{product.productName}</td>
                            <td>{product.category}</td>
                            <td>{product.quantity}</td>
                            <td>{new Date(product.expiryDate).toLocaleDateString()}</td>
                            <td>{product.batchNo}</td>
                            <td>
                                {product.image && <img src={ `${API_URL}${product.image}`} alt="Product" width="50"/>}
                            </td>

                            <td>
                                <button onClick={() => handleEditProduct(product)}>Edit</button>
                                <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminProducts;
