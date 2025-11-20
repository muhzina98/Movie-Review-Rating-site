const express = require('express');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 3001;
const connectDatabase = require('./config/dbConnection')
const router = require('./routes/midRoute')
const cookieParser = require('cookie-parser')
const cors = require('cors')


const allowedOrigins = [
  "http://localhost:5173",
  "https://movie-review-rating-site-1.onrender.com",
  "https://movie-review-rating-site.onrender.com"
];
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: "GET,POST,PUT,PATCH,DELETE",
  allowedHeaders: "Content-Type, Authorization"
}));

 


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Hello World!'));

connectDatabase();

app.use('/api', router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});
