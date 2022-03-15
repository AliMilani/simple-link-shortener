require("dotenv").config("../.env");
const express = require("express");
const config = require("config");
const winston = require("winston");
const app = express();

require("./startup/loging")()
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")()

let PORT = process.env.PORT || config.get("port") || 3000;
app.listen(PORT, () => winston.info(`server started on port ${PORT}`));
