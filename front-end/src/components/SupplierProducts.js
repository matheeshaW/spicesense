import React, { useState, useEffect } from "react";
import axios from "axios";


const SupplierProducts = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    productCategory: "",
    price: "",
    stockQuantity: "",
    minimumOrderQuantity: ""
  });
  const [showEditForm, setShowEditForm] = useState(false);
  const [formErrors, setFormErrors] = useState({}); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const productsResponse = await axios.get("http://localhost:5000/api/products/all", {
          withCredentials: true,
        });

        const suppliersResponse = await axios.get("http://localhost:5000/api/user/role/supplier", {
          withCredentials: true,
        });

        if (productsResponse.data.success && suppliersResponse.data.success) {
          const productsWithSupplierNames = productsResponse.data.products.map(product => {
            const supplier = suppliersResponse.data.users.find(
              supplier => supplier._id === product.supplierId
            );
            return {
              ...product,
              supplierName: supplier ? supplier.name : "Unknown Supplier",
              companyName: supplier ? supplier.companyName : "Unknown Company"
            };
          });

          setProducts(productsWithSupplierNames);
          setSuppliers(suppliersResponse.data.users);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load supplier products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.productName.trim()) errors.productName = "Product name is required.";
    if (!formData.productCategory) errors.productCategory = "Please select a category.";
    if (!formData.price || formData.price <= 0) errors.price = "Price must be a positive number.";
    if (!formData.stockQuantity || formData.stockQuantity < 0) errors.stockQuantity = "Stock quantity cannot be negative.";
    if (!formData.minimumOrderQuantity || formData.minimumOrderQuantity < 1) errors.minimumOrderQuantity = "Minimum order must be at least 1.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      productCategory: product.productCategory,
      price: product.price,
      stockQuantity: product.stockQuantity,
      minimumOrderQuantity: product.minimumOrderQuantity
    });
    setShowEditForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop if validation fails

    try {
      const response = await axios.put(
        `http://localhost:5000/api/products/${editingProduct._id}`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setProducts(products.map(product =>
          product._id === editingProduct._id
            ? {
                ...response.data.product,
                supplierName: product.supplierName,
                companyName: product.companyName
              }
            : product
        ));

        setShowEditForm(false);
        setEditingProduct(null);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product. Please try again.");
    }
  };

  return (
    <div className="supplier-container">
      {showEditForm && (
        <div className="supplier-edit-form">
          <h3 className="supplier-edit-title">Edit Product</h3>
          <form onSubmit={handleUpdate} className="supplier-form-grid">
            <div className="supplier-form-group">
              <label className="supplier-label">
                Product Name *
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                className="supplier-input"
              />
              {formErrors.productName && <p className="supplier-error">{formErrors.productName}</p>}
            </div>

            <div className="supplier-form-group">
              <label className="supplier-label">
                Product Category *
              </label>
              <select
                name="productCategory"
                value={formData.productCategory}
                onChange={handleInputChange}
                className="supplier-select"
              >
                <option value="">Select</option>
                <option value="Whole Spices">Whole Spices</option>
                <option value="Ground Spices">Ground Spices</option>
                <option value="Blended Spices">Blended Spices</option>
                <option value="Herbs">Herbs</option>
                <option value="Seasoning Mixes">Seasoning Mixes</option>
                <option value="Exotic Spices">Exotic Spices</option>
                <option value="Organic Spices">Organic Spices</option>
              </select>
              {formErrors.productCategory && <p className="supplier-error">{formErrors.productCategory}</p>}
            </div>

            <div className="supplier-form-group">
              <label className="supplier-label">
                Price (Rs) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                className="supplier-input"
              />
              {formErrors.price && <p className="supplier-error">{formErrors.price}</p>}
            </div>

            <div className="supplier-form-group">
              <label className="supplier-label">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                min="0"
                className="supplier-input"
              />
              {formErrors.stockQuantity && <p className="supplier-error">{formErrors.stockQuantity}</p>}
            </div>

            <div className="supplier-form-group">
              <label className="supplier-label">
                Minimum Order Quantity *
              </label>
              <input
                type="number"
                name="minimumOrderQuantity"
                value={formData.minimumOrderQuantity}
                onChange={handleInputChange}
                min="1"
                className="supplier-input"
              />
              {formErrors.minimumOrderQuantity && <p className="supplier-error">{formErrors.minimumOrderQuantity}</p>}
            </div>

            <div className="supplier-form-actions">
              <button type="submit" className="supplier-update-button">Update Product</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SupplierProducts;