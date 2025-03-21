import React, { useState, useEffect } from "react";
import "../Styles/inventoryOverview.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


const InventoryOverview = () => {
    const [stocks, setStocks] = useState([
        { id: 1, name: "Cinnamon Powder", category: "Raw Material", quantity: 50 },
        { id: 2, name: "Black Pepper", category: "Raw Material", quantity: 10 },
        { id: 3, name: "Turmeric Powder", category: "Raw Material", quantity: 5 },
    ]);

    const chartData = {
        labels: stocks.map(item => item.name),
        datasets: [
            {
                label: "Stock Levels",
                data: stocks.map(item => item.quantity),
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
            }
        ]
    };

    return (
        <div className="inventory-container">
            <h2>Inventory Overview</h2>
            <table className="stock-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity (Kg)</th>
                    </tr>
                </thead>

                <tbody>
                    {stocks.map(item => (
                        <tr key={item.id} className={item.quantity < 10 ? "low-stock" : ""}>
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>{ item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <div className="chart-container">
                <h3>Stock Levels Report</h3>
                <Bar data={ chartData} />
            </div>
        </div>
    );
};

export default InventoryOverview;
