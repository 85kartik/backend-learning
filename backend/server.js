const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
dotenv.config();
const userRoute = require("./routes/userRoute");
const addressRoute = require("./routes/addressRoute")

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/address",addressRoute);


// Home Route
app.get("/", (req, res) => {
  res.send("🚀 MarketGo API Running...");
});

// Start Server
const PORT = process.env.PORT || 5252;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});