const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

const config = require("config");

const mongoURI = config.get("mongoURI");

module.exports = function () {

    winston.createLogger({
        exceptionHandlers: [
            new winston.transports.File({ filename: "exceptions.log" }),
            new winston.transports.MongoDB({
                db: mongoURI,
                collection: "log_exceptions",
            }),
        ],
    });

    winston.add(new winston.transports.File({ filename: "logfile.log" }));
    winston.add(new winston.transports.MongoDB({ db: mongoURI }));
};
