const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});console.log("MONGODB_URL:", !!process.env.MONGODB_URL);
console.log("STRIPE_SECRET_KEY:", !!process.env.STRIPE_SECRET_KEY);
console.log("JWT_SECRET_KEY:", !!process.env.JWT_SECRET_KEY);

const port = process.env.PORT || 3001;
const connectDatabase = require("./config/dbConnection");
const router = require("./routes/midRoute");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDatabase();

app.use(cors({
  origin: process.env.FRONTEND_URL,  // https://movie-review-rating-site.onrender.com
  credentials: true,
}));


// API routes FIRST
app.use("/api", router);

if (process.env.NODE_ENV === "PRODUCTION") {
  const frontendPath = path.join(__dirname, "..", "client", "dist");
  app.use(express.static(frontendPath));

  // wildcard fallback using regex — required for Express 5
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}



app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});
