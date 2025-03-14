import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./Components/navBar.js";
import InventoryOverview from "./Pages/InventoryOverview.js";
import StockLevels from "./Pages/StockLevels.js";
import ExpiryAlerts from "./Pages/ExpiryAlerts.js";
import InventoryTransactions from "./Pages/InventoryTransactions.js";
import SearchFilter from "./Pages/SearchFilter.js";
import AdminProducts from "./Pages/AdminProducts.js";

function App() {
  return (

    <Router>
      <NavBar />
      
      <Routes>
        <Route path="/" element={<InventoryOverview />}></Route>
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
