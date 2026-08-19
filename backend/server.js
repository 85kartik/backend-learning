const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
dotenv.config();
const userRoute = require("./routes/userRoute");
const addressRoute = require("./routes/addressRoute")
const productRoute = require("./routes/productRoute")
const cartRouter = require("./routes/cartRouter")
const rateLimit = require("express-rate-limit");

const app = express();

// Connect Database
connectDB();


// Middlewares
app.use(cors());
app.use(express.json());

//limit
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 2,               // max 1 requests per IP
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

// Routes
app.use("/api",limiter)
app.use("/api/v1/users", userRoute);  
app.use("/api/v1/address",addressRoute);
app.use("/api/v1/product",productRoute);
app.use("/api/v1/cart",cartRouter);


// Home Route
app.get("/", (req, res) => {
  res.send("🚀 MarketGo API Running...");
});

// Start Server
const PORT = process.env.PORT || 5252;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});