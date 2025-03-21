import React, { useState } from "react";
import "../Styles/searchFilter.css";

const SearchFilter = () => {
    const today = new Date();

    const [stocks, setStocks] = useState([
        { id: 1, name: "Cinnemon Powder", batch: "B101", category: "Raw Material", expiryDate: "2025-04-05", quantity: 50 },
        { id: 2, name: "Black Pepper", batch: "B102", category: "Raw Material", expiryDate: "2024-03-20", quantity: 5 },
        { id: 3, name: "Turmeric Powder", batch: "B103", category: "Finished Product", expiryDate: "2024-04-15", quantity: 8 },
        { id: 4, name: "Cinnemon Powder", batch: "B104", category: "Raw Material", expiryDate: "2024-03-25", quantity: 20 },
        { id: 5, name: "Black Pepper", batch: "B105", category: "Raw Material", expiryDate: "2025-06-02", quantity: 100 },
        
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [batchSearch, setBatchSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [expiryFilter, setExpiryFilter] = useState("");
    const [stockFilter, setStockFilter] = useState("");

    const getExpiryStatus = (expiryDate) => {
        const expiry = new Date(expiryDate);
        const differentDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        if (differentDays < 0) return "Expired";
        if (differentDays <= 30) return "Nearing Expiry";
        return "Safe";
    };

    const filteredStocks = stocks.filter(stock => {
        const nameMatch = stock.name.toLowerCase().includes(searchTerm.toLowerCase());
        const batchMatch = stock.batch.toLowerCase().includes(batchSearch.toLowerCase());
        const categoryMatch = categoryFilter ? stock.category === categoryFilter : true;
        const expiryStatus = getExpiryStatus(stock.expiryDate);
        const expiryMatch = expiryFilter ? expiryStatus === expiryFilter : true;
        const stockMatch =
            stockFilter === "Low Stock" ? stock.quantity < 10 :
                stockFilter === "Sufficient Stock" ? stock.quantity >= 10 :
                    true;
        
        return nameMatch && batchMatch && categoryMatch && expiryMatch && stockMatch;
    });

    return (
        <div className="search-filter-container">
            <h2>Search & Filter</h2>

            <div className="search-inputs">
                <input type="text" placeholder="Search by Name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <input type="text" placeholder="Search by Batch No" value={batchSearch} onChange={(e) => setBatchSearch(e.target.value)} />
                <select onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter}>
                    <option value="">All Categories</option>
                    <option value="Raw Material">Raw Material</option>
                    <option value="Finished Product">Finished Product</option>
                </select>
            </div>

            <div className="filter-options">
                <select onChange={(e) => setExpiryFilter(e.target.value)} value={expiryFilter}>
                    <option value="">All Expiry Status</option>
                    <option value="Expired">Expired</option>
                    <option value="Nearing Expiry">Nearing Expiry</option>
                    <option value="Safe">Safe</option>
                </select>
                <select onChange={(e) => setStockFilter(e.target.value)} value={stockFilter}>
                    <option value="">All Stock Levels</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Sufficient Stock">Sufficient Stock</option>
                </select>
            </div>

            <table className="stock-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Batch No</th>
                        <th>Category</th>
                        <th>Expiry Date</th>
                        <th>Stock Levels</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredStocks.map(stock => (
                        <tr key={stock.id} className={getExpiryStatus(stock.expiryDate).toLowerCase().replace(" ", "-")}>
                            <td>{stock.name}</td>
                            <td>{stock.batch}</td>
                            <td>{stock.category}</td>
                            <td>{stock.expiryDate}</td>
                            <td>{stock.quantity}</td>
                            <td>{getExpiryStatus(stock.expiryDate)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SearchFilter;