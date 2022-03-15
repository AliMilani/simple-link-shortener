const config = require("config");
module.exports = function () {
    // in windows:  $ENV:shortner_jwtPrivateKey = 'key'
    // or set in .env file
    if (!config.get("jwtPrivateKey")) {
        throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
    }
};
