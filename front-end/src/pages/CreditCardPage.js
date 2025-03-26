// pages/CreditCardPage.js
import React, { useState, useEffect } from "react";
import "../Styles/CreditCardPage.css"; // Import CSS from Styles folder
import NavigationBar from "../components/NavigationBar";

const CreditCardPage = () => {
    const userId = sessionStorage.getItem("userId");

    const [cards, setCards] = useState([]);
    const [formData, setFormData] = useState({ 
        cardNumber: "", 
        cardHolder: "", 
        expiryDate: "", 
        cvv: "" 
    });
    const [errors, setErrors] = useState({
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        cvv: ""
    });
    const [editingCardId, setEditingCardId] = useState(null);

    const API_BASE_URL = "http://localhost:5000/api/credit-cards";

    useEffect(() => {
        if (!userId) return;

        fetch(`${API_BASE_URL}/${userId}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => setCards(data))
            .catch(err => console.error("Error fetching credit cards:", err));
    }, [userId]);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            cardNumber: "",
            cardHolder: "",
            expiryDate: "",
            cvv: ""
        };

        const cleanNumber = formData.cardNumber.replace(/\s/g, '');
        if (!cleanNumber) {
            newErrors.cardNumber = "Card number is required";
            isValid = false;
        } else if (!/^\d+$/.test(cleanNumber)) {
            newErrors.cardNumber = "Card number must contain only digits";
            isValid = false;
        } else if (cleanNumber.length < 13 || cleanNumber.length > 19) {
            newErrors.cardNumber = "Card number must be between 13 and 19 digits";
            isValid = false;
        }

        if (!formData.cardHolder.trim()) {
            newErrors.cardHolder = "Card holder name is required";
            isValid = false;
        }

        if (!formData.expiryDate) {
            newErrors.expiryDate = "Expiry date is required";
            isValid = false;
        } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
            newErrors.expiryDate = "Use MM/YY format";
            isValid = false;
        }

        if (!formData.cvv) {
            newErrors.cvv = "CVV is required";
            isValid = false;
        } else if (!/^\d{3,4}$/.test(formData.cvv)) {
            newErrors.cvv = "CVV must be 3 or 4 digits";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const method = editingCardId ? "PUT" : "POST";
        const url = editingCardId ? `${API_BASE_URL}/${editingCardId}` : API_BASE_URL;

        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, ...formData }),
        })
            .then(res => res.json())
            .then(() => {
                setFormData({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "" });
                setEditingCardId(null);
                return fetch(`${API_BASE_URL}/${userId}`).then(res => res.json());
            })
            .then(data => setCards(data))
            .catch(err => console.error("Error saving credit card:", err));
    };

    const handleEdit = (card) => {
        setFormData({ 
            cardNumber: card.cardNumber, 
            cardHolder: card.cardHolder, 
            expiryDate: card.expiryDate, 
            cvv: card.cvv 
        });
        setEditingCardId(card._id);
    };

    const handleDelete = (cardId) => {
        fetch(`${API_BASE_URL}/${cardId}`, { method: "DELETE" })
            .then(() => fetch(`${API_BASE_URL}/${userId}`).then(res => res.json()))
            .then(data => setCards(data))
            .catch(err => console.error("Error deleting credit card:", err));
    };

    return (
        <div>
            <NavigationBar />
        <div className="credit-card-container">
            <h2 className="credit-card-title">My Saved Credit Cards</h2>
            
            <table className="credit-card-table">
                <thead>
                    <tr>
                        <th className="credit-card-th">Card Number</th>
                        <th className="credit-card-th">Card Holder</th>
                        <th className="credit-card-th">Expiry Date</th>
                        <th className="credit-card-th">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cards.map(card => (
                        <tr key={card._id} className="credit-card-row">
                            <td className="credit-card-td">**** **** **** {card.cardNumber.slice(-4)}</td>
                            <td className="credit-card-td">{card.cardHolder}</td>
                            <td className="credit-card-td">{card.expiryDate}</td>
                            <td className="credit-card-td">
                                <button 
                                    onClick={() => handleEdit(card)}
                                    className="credit-card-edit-btn"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(card._id)}
                                    className="credit-card-delete-btn"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="credit-card-form-container">
                <h3 className="credit-card-form-title">
                    {editingCardId ? "Edit Credit Card" : "Add New Credit Card"}
                </h3>
                
                <form onSubmit={handleSubmit} className="credit-card-form">
                    <div className="credit-card-form-group">
                        <label className="credit-card-label">Card Number</label>
                        <input 
                            type="text" 
                            name="cardNumber" 
                            placeholder="Card Number" 
                            value={formData.cardNumber} 
                            onChange={handleChange} 
                            className={`credit-card-input ${errors.cardNumber ? "credit-card-input-error" : ""}`}
                        />
                        {errors.cardNumber && (
                            <p className="credit-card-error">{errors.cardNumber}</p>
                        )}
                    </div>
                    
                    <div className="credit-card-form-group">
                        <label className="credit-card-label">Card Holder Name</label>
                        <input 
                            type="text" 
                            name="cardHolder" 
                            placeholder="Card Holder Name" 
                            value={formData.cardHolder} 
                            onChange={handleChange} 
                            className={`credit-card-input ${errors.cardHolder ? "credit-card-input-error" : ""}`}
                        />
                        {errors.cardHolder && (
                            <p className="credit-card-error">{errors.cardHolder}</p>
                        )}
                    </div>
                    
                    <div className="credit-card-form-row">
                        <div className="credit-card-form-group">
                            <label className="credit-card-label">Expiry Date</label>
                            <input 
                                type="text" 
                                name="expiryDate" 
                                placeholder="MM/YY" 
                                value={formData.expiryDate} 
                                onChange={handleChange} 
                                className={`credit-card-input ${errors.expiryDate ? "credit-card-input-error" : ""}`}
                            />
                            {errors.expiryDate && (
                                <p className="credit-card-error">{errors.expiryDate}</p>
                            )}
                        </div>
                        
                        <div className="credit-card-form-group">
                            <label className="credit-card-label">CVV</label>
                            <input 
                                type="text" 
                                name="cvv" 
                                placeholder="CVV" 
                                value={formData.cvv} 
                                onChange={handleChange} 
                                className={`credit-card-input ${errors.cvv ? "credit-card-input-error" : ""}`}
                            />
                            {errors.cvv && (
                                <p className="credit-card-error">{errors.cvv}</p>
                            )}
                        </div>
                    </div>
                    
                    <div className="credit-card-form-buttons">
                        <button 
                            type="submit" 
                            className="credit-card-submit-btn"
                        >
                            {editingCardId ? "Update Card" : "Add Card"}
                        </button>
                        
                        {editingCardId && (
                            <button 
                                type="button"
                                onClick={() => {
                                    setFormData({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "" });
                                    setEditingCardId(null);
                                }}
                                className="credit-card-cancel-btn"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
};

export default CreditCardPage;