const cors = require("cors");

module.exports = function (app) {
    // cors middleware
    app.use(cors());
};
