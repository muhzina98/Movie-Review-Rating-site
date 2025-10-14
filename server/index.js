const express = require('express');
const app = express();
require('dotenv').config()
const port = process.env.PORT;
const connectDatabase = require('./config/dbConnection')
const router = require('./routes/midRoute')

app.get('/', (req, res) => res.send('Hello World!'));

connectDatabase()

app.use(express.json())



//http://localhost:3001/api
app.use('/api',router)


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    });
