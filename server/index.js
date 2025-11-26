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

if (process.env.NODE_ENV === "production") {
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
