const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 3001;
const connectDatabase = require("./config/dbConnection");
const router = require("./routes/midRoute");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDatabase();

// API routes FIRST
app.use("/api", router);

//Serve React frontend build
const frontendPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(frontendPath));

// Fallback route (for all other paths)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});
