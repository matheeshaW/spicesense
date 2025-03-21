import React, { useState } from "react";
import "../Styles/inventoryTransaction.css";

const InventoryTransactions = () => {
    const [transactions, setTransactions] = useState([
        { id: 1, name: "Cinnamon Powder", type: "Stock In", quantity: 50, date: "2024-03-01", batch: "B101" },
        { id: 2, name: "Black Powder", type: "Stock Out", quantity: 10, date: "2024-03-05", batch: "B102" },
        { id: 3, name: "Turmeric Powder", type: "Stock In", quantity: 30, date: "2024-03-10", batch: "B103" },
    ]);

    const [filterDate, setFilterDate] = useState("");

    const filteredTransactions = filterDate
        ? transactions.filter(item => item.date === filterDate)
        : transactions;
    
    return (
        <div className="transactions-container">
            <h2>Inventory Transactions</h2>
            <div className="filter-section">
                <label>Filter by Date:</label>
                <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
            </div>

            <table className="transactions-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Date</th>
                        <th>Batch</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredTransactions.map(item => (
                        <tr key={item.id} className={item.type === "Stock Out" ? "stock-out" : "stock-in"}>
                            <td>{item.name}</td>
                            <td>{item.type}</td>
                            <td>{item.quantity}</td>
                            <td>{item.date}</td>
                            
                            <td>{item.batch}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryTransactions;