const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

module.exports = function () {
    mongoose
        .connect(config.get("mongoURI"))
        .then(db => winston.info(`MongoDB Connected to ${config.get("mongoURI")}... `));
};
