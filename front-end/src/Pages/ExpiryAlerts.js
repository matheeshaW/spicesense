import React, { useState } from "react";
import "../Styles/expiryAlerts.css";


const ExpiryAlerts = () => {
    const [items, setItems] = useState([
        { id: 1, name: "Cinnemon Powder", batch:"B101", expiryDate: "2025-04-05" },
        { id: 2, name: "Black Pepper", batch:"B102", expiryDate: "2024-03-20" },
        { id: 3, name: "Turmeric Powder", batch: "B103", expiryDate: "2025-04-15" },
        { id: 3, name: "Turmeric Powder", batch: "B104", expiryDate: "2024-04-15" },
        { id: 3, name: "Turmeric Powder", batch: "B105", expiryDate: "2025-04-15" },
        { id: 3, name: "Black Pepper", batch: "B106", expiryDate: "2025-04-15" },
        { id: 3, name: "Turmeric Powder", batch: "B107", expiryDate: "2024-04-15" },
        { id: 3, name: "Cinnemon Powder",batch:"B108", expiryDate: "2025-04-15" },
    ]);


    const today = new Date();
    const getStatus = (expiryDate) => {
        const expiry = new Date(expiryDate);
        const differentDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        if (differentDays < 0) return "Expired";
        if (differentDays <= 30) return "Nearing-expiry";
        return "Safe";
    };

    return (
        <div className="expiry-container">
            <h2>Expiry Date Alerts</h2>
            <table className="expiry-table">
                <thead>
                    <tr>
                        <th>Batch No</th>
                        <th>Item</th>
                        <th>Expiry Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => {
                        const status = getStatus(item.expiryDate);
                        return (
                            <tr key={item.id} className={status}>
                                <td>{ item.batch}</td>
                                <td>{item.name}</td>
                                <td>{item.expiryDate}</td>
                                <td>{status === "Expired" ? "Expired" : status === "Nearing-expiry" ? "Nearing Expiry" : "Safe"}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

        </div>
    );

};

export default ExpiryAlerts;