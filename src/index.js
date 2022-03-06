require("dotenv").config("../.env");
const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const app = express();
const home = require("./routes/home");
const links = require("./routes/links");

mongoose
    .connect(config.get("mongoURI"))
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

app.use(express.json());

app.use("/", home);
app.use("/api/links", links);

let PORT = process.env.PORT || config.get("port") || 3000;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));
