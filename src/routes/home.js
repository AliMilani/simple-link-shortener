const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Link } = require("../models/link");
const bcrypt = require("bcryptjs");

router.get("/:slugId", async (req, res) => {
    //find by slug
    const link = await Link.findOne({ slug: req.params.slugId }).select("url advancedSettings");
    if (!link) return res.status(404).send("The link with the given slug was not found.");
    //check if password is correct
    // if (link.advancedSettings.password) {
    //     if (req.query.password) {
    //         if (!bcrypt.compareSync(req.query.password, link.advancedSettings.password)) {
    //             res.status(401).send("Password is incorrect.");
    //         }
    //     } else {
    //         res.status(401).send("Password is required.");
    //     }
    // }

    //check if link is expired
    if (link.advancedSettings.dateEnd) {
        if (Date.now() > link.advancedSettings.dateEnd) {
            res.status(401).send("Link is expired.");
        }
    }

    //check if link is started
    if (link.advancedSettings.dateStart) {
        if (Date.now() < link.advancedSettings.dateStart) {
            res.status(401).send("Link is not started yet.");
        }
    }

    //redirect to new domain
    let redirectCode = link.advancedSettings.redirectCode || 302;
    if (link.url.startsWith("https://") || link.url.startsWith("http://")) {
        res.redirect(redirectCode, link.url);
    }
    else {
        res.redirect(redirectCode, "http://" + link.url);
    }

});


module.exports = router;
