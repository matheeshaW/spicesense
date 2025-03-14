const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
    res.send("API is running...");
});
app.use("/api/products", productRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    dbName: "spice-inventory-cluster",
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
