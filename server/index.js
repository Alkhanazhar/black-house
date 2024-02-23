const express = require('express');
const app = express();
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
const userRoutes = require("./routes/userRoutes")
const cookieParser = require("cookie-parser")
const morgan = require("morgan")
const mongoDb = require('./db');
dotenv.config()

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

//routes
app.use(userRoutes)

//db calling
mongoDb()

//listeni port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT} 🎉🎉🎉`);
});