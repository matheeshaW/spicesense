import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ItemPage from './components/ItemPage';
import OrderProcessingPage from './components/OrderProcessingPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/item/:id" element={<ItemPage />} />
        <Route path="/order/:id" element={<OrderProcessingPage />} />
        <Route path="/confirm/:orderId" element={<OrderConfirmationPage />} />
      </Routes>
    </Router>
  );
};

export default App;

