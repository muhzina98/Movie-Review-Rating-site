const express = require('express');
const app = express();
require('dotenv').config()
const port = process.env.PORT  || 3001;
const connectDatabase = require('./config/dbConnection')
const router = require('./routes/midRoute')
const cookieParser =require('cookie-parser')
const cors= require('cors')

app.get('/', (req, res) => res.send('Hello World!'));

connectDatabase()

const allowedOrigins = [
  "http://localhost:5173",
  "https://movie-review-rating-site-1.onrender.com",
  "https://movie-review-rating-site.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for this origin: " + origin));
    }
  },
  credentials: true
}));




app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));




//http://localhost:3001/api
app.use('/api',router)


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    });
