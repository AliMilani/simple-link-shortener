require("dotenv").config("../.env");
require('express-async-errors');
const winston = require("winston");
require("winston-mongodb");
const errors = require("./middleware/error");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const app = express();
const home = require("./routes/home");
const links = require("./routes/links");
const users = require("./routes/users");
const auth = require("./routes/auth");

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.MongoDB({ db: config.get("mongoURI") }));

mongoose
    .connect(config.get("mongoURI"))
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

// in windows:  $ENV:shortner_jwtPrivateKey = 'key'
// or set in .env file
if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
}
// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/", home);
app.use("/api/links", links);
app.use("/api/users", users);
app.use("/api/auth", auth);

// handle errors
app.use(errors);

let PORT = process.env.PORT || config.get("port") || 3000;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));
