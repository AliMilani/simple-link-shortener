const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const app = express();

mongoose
    .connect(config.get("mongoURI"))
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

let PORT = process.env.PORT || config.get("port") || 3000;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));
