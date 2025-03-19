const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const router = express.Router();

dotenv.config(); // ✅ Load environment variables from .env

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ Routes
app.use("/api/products", productRoutes);
app.use("/uploads", express.static("uploads"));

// ✅ Connect to MongoDB (Fixed)
mongoose.connect(process.env.MONGO_URI, {
    dbName: "spice-inventory-cluster",
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Stop server if DB connection fails
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = router;
