const express = require("express");
const errors = require("../middleware/error");
const home = require("../routes/home");
const links = require("../routes/links");
const users = require("../routes/users");
const auth = require("../routes/auth");

module.exports = function (app) {
    app.use(express.json());
    app.use("/", home);
    app.use("/api/links", links);
    app.use("/api/users", users);
    app.use("/api/auth", auth);
    app.use(errors);
};
