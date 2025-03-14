import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

// get all products
export const getProducts = async () => {
    return await axios.get(API_URL);
};

// Add a product
export const addProduct = async (productData) => {
    return await axios.post(`${API_URL}/add`, productData);
};

// update a product
export const updateProduct = async (id, productData) => {
    return await axios.put(`${API_URL}/update/${id}`, productData);
};

// delete a product
export const deleteProduct = async (id) => {
    return await axios.delete(`${API_URL}/delete/${id}`);
};