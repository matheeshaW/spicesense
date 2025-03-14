import React, { useState } from "react";
import "../Styles/stockLevels.css";

const StockLevels = () => {

    const [quantity, setQuantity] = useState(0);
    const [customValues, setCustomValues] = useState({});

    const [stocks, setStocks] = useState([
        { id: 1, name: "Cinnemon Powder", category: "Raw Material", quantity },
        { id: 2, name: "Black Pepper", category: "Raw Material", quantity: 10 },
        { id: 3, name: "Turmeric Powder", category: "Finished Product", quantity: 5 },
        
    ]);

    

    const handleCustomValueChange = (e) => {
        setCustomValues(e.target.value);
    };

    const addStock = (id, amount) => {
        setStocks(stocks.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + amount } : item
        ));
    };



    const handleCustomChange = (id, value) => {
        setCustomValues({ ...customValues, [id]: value });
    };

    return (
        <div className="stock-container">
            <h2>Stock Levels</h2>
            <table className="stock-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map(item => (
                        <tr key={item.id} className={item.quantity < 10 ? "low-stock" : ""}>
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>{item.quantity} Kg</td>
                            <td className="stock-buttons">
                                <button onClick={() => addStock(item.id, 5)}>+5kg</button>
                                <button onClick={() => addStock(item.id, 10)}>+10kg</button>
                                <button onClick={() => addStock(item.id, 20)}>+20kg</button>

                                <input
                                    type="number"
                                    placeholder="Custom"
                                    value={customValues[item.id] || ""}
                                    onChange={(e) => handleCustomChange(item.id, e.target.value)}
                                    className="custom-input"
                                />
                                <button
                                    onClick={() => addStock(item.id, Number(customValues[item.id] || 0))}
                                    disabled={!customValues[item.id] || customValues[item.id] <= 0}
                                >Add Custom</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

};

export default StockLevels;
