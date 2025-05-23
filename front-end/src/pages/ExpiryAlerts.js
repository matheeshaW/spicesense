import React, { useState, useEffect } from "react";
import "../Styles/expiryAlerts.css";
import NavBar from "../components/navBar";
import backgroundImage from "../assets/background.png";

const API_URL = "http://localhost:5000/api";

const ExpiryAlerts = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
                document.body.style.backgroundImage = `url(${backgroundImage})`;
                document.body.style.backgroundSize = "cover";
                document.body.style.backgroundPosition = "center";
                document.body.style.backgroundAttachment = "fixed";
                document.body.style.backgroundRepeat = "no-repeat";
        
                return () => {
                    document.body.style.backgroundImage = "";
                };
            }, []);

    useEffect(() => {
        fetch(`${API_URL}/stocks/expiry`)
            .then(response => response.json())
            .then(data => {
                
                setItems(data);
            })
            .catch(error => console.error("Error fetching expiry data:", error));
    }, []);

    return (
        <div>
             <NavBar />
        <div className="expiry-container">
            <h2>Expiry Date Alerts</h2>
            <table className="expiry-table">
                <thead>
                    <tr>
                        <th>Batch No</th>
                        <th>Product</th>
                        <th>Expiry Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.batchNo} className={item.status.replace(" ", "-").toLowerCase()}>
                            <td>{item.batchNo}</td>
                            <td>{item.name}</td>
                            <td>{new Date(item.expiryDate).toLocaleDateString()}</td>
                            <td>{item.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default ExpiryAlerts;
