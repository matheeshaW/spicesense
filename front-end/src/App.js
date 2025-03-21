
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import CreditCardPage from "./pages/CreditCardPage";
import NavBar from "./Components/navBar.js";
import InventoryOverview from "./Pages/InventoryOverview.js";
import StockLevels from "./Pages/StockLevels.js";
import ExpiryAlerts from "./Pages/ExpiryAlerts.js";
import InventoryTransactions from "./Pages/InventoryTransactions.js";
import SearchFilter from "./Pages/SearchFilter.js";
import AdminProducts from "./Pages/AdminProducts.js";

function App() {

  const user = JSON.parse(localStorage.getItem("user")); // Get user from localStorage
  const userId = user ? user._id : null;

  return (
    <Router>
      <Routes>
        <NavBar />
        <Route path="/" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/credit-cards" element={<CreditCardPage />} />
         <Route path="/overview" element={<InventoryOverview />}></Route>
        <Route path="/stock-levels" element={<StockLevels />}></Route>
        <Route path="/expiry-alerts" element={<ExpiryAlerts />}></Route>
        <Route path="/inventory-transactions" element={<InventoryTransactions />}></Route>
        <Route path="/search-filter" element={<SearchFilter />}></Route>
        <Route path="/admin-products" element={<AdminProducts />}></Route>
      </Routes>
    </Router>

  );
}

export default App;
